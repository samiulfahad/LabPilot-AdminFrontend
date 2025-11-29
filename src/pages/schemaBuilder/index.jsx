import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import testSchemaService from "../../services/schemaService";
import testService from "../../services/testService";
import InputField from "../../components/html/InputField";
import SelectField from "../../components/html/SelectField";
import SchemaDisplay from "./SchemaDisplay";
import FormPreview from "./FormPreview"; // Add this import
import Popup from "../../components/popup/Popup";
import LoadingScreen from "../../components/loadingPage";
import { useSchemaBuilderStore } from "./store";

const SchemaBuilder = () => {
  const { schemaId } = useParams();
  const navigate = useNavigate();

  // Get state and actions from store
  const {
    // Schema state
    schema,
    useSections,
    useStandardRange,
    isEditMode,
    initialSchemaData,
    isActive,

    // UI state
    isLoading,
    isSaving,
    popup,
    testsLoading,
    editingSectionIndex,
    editingFieldId,
    isAddingRange,

    // Form state
    currentField,
    currentSection,
    testStandardRange,
    newOption,
    newTestStandardRangeKey,
    newTestStandardRangeValue,

    // Selection state
    testCategories,
    selectedCategory,
    selectedTest,
    availableTests,

    // Schema actions
    setSchema,
    updateSchema,
    setUseSections,
    setUseStandardRange,
    setIsEditMode,
    setInitialSchemaData,
    setIsActive,
    getFieldsCount,
    addFieldToSchema,
    updateFieldInSchema,
    removeFieldFromSchema,
    addSection,
    updateSection,
    removeSection,
    resetSchema,

    // UI actions
    setIsLoading,
    setIsSaving,
    setPopup,
    setTestsLoading,
    setEditingSectionIndex,
    setEditingFieldId,
    setIsAddingRange,
    resetUI,

    // Form actions
    setCurrentField,
    updateCurrentField,
    setCurrentSection,
    updateCurrentSection,
    setTestStandardRange,
    updateTestStandardRange,
    setNewOption,
    setNewTestStandardRangeKey,
    setNewTestStandardRangeValue,
    addFieldOption,
    removeFieldOption,
    addTestStandardRangeOption,
    removeTestStandardRangeOption,
    resetFieldForm,
    resetSectionForm,
    resetAllForms,

    // Selection actions
    setTestCategories,
    setSelectedCategory,
    setSelectedTest,
    setAvailableTests,
    updateAvailableTests,
    resetSelection,
  } = useSchemaBuilderStore();

  const fieldTypes = ["text", "textarea", "number", "select", "radio", "checkbox"];

  const standardRangeTypes = [
    { value: "none", label: "No Standard Range" },
    { value: "genderBased", label: "Gender Based Range" },
    { value: "ageBased", label: "Age Based Range" },
    { value: "genderWithAgeBased", label: "Gender and Age Based Range" },
    { value: "numberRange", label: "Number Range Only" },
    { value: "text", label: "Text Reference" },
  ];

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
  ];

  const commonUnits = [
    { value: "", label: "No Unit" },
    { value: "mg/L", label: "mg/L" },
    { value: "mg/dL", label: "mg/dL" },
    { value: "g/dL", label: "g/dL" },
    { value: "mmol/L", label: "mmol/L" },
    { value: "μmol/L", label: "μmol/L" },
    { value: "U/L", label: "U/L" },
    { value: "IU/L", label: "IU/L" },
    { value: "cells/μL", label: "cells/μL" },
    { value: "×10^9/L", label: "×10^9/L" },
    { value: "mmHg", label: "mmHg" },
    { value: "cm", label: "cm" },
    { value: "kg", label: "kg" },
    { value: "lb", label: "lb" },
    { value: "°C", label: "°C" },
    { value: "°F", label: "°F" },
  ];

  // Fetch existing schema when in edit mode
  useEffect(() => {
    const fetchExistingSchema = async () => {
      if (schemaId) {
        setIsLoading(true);
        try {
          const response = await testSchemaService.getById(schemaId);
          const existingSchema = response.data;

          // Store initial schema data for later use
          setInitialSchemaData({
            categoryId: existingSchema.categoryId || "",
            testId: existingSchema.testId || "",
          });

          // Clean fields by removing IDs if they exist
          const cleanFields = (fields) => {
            return fields.map((field) => {
              const { id, ...cleanField } = field;
              return cleanField;
            });
          };

          // Clean sections if they exist
          const cleanSections = (sections) => {
            return sections.map((section) => ({
              ...section,
              fields: cleanFields(section.fields || []),
            }));
          };

          // Populate form with existing schema data
          setSchema({
            name: existingSchema.name || "",
            description: existingSchema.description || "",
            fields: cleanFields(existingSchema.fields || []),
            sections: existingSchema.sections ? cleanSections(existingSchema.sections) : [],
          });

          setUseSections(!!(existingSchema.sections && existingSchema.sections.length > 0));
          setUseStandardRange(!!existingSchema.testStandardRange);
          setIsActive(existingSchema.isActive !== false);

          // Set test standard range if exists
          if (existingSchema.testStandardRange) {
            const testRange = existingSchema.testStandardRange;
            if (testRange.type === "options") {
              const optionsArray = Object.entries(testRange.options || {}).map(([key, value]) => ({
                key,
                value,
              }));
              setTestStandardRange({
                type: testRange.type,
                options: optionsArray,
                text: "",
              });
            } else if (testRange.type === "text") {
              setTestStandardRange({
                type: testRange.type,
                options: [],
                text: testRange.text || "",
              });
            }
          }

          setIsEditMode(true);
        } catch (error) {
          console.error("Error fetching schema:", error);
          setPopup({ type: "error", message: "Failed to load schema for editing" });
          navigate("/schema-list");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchExistingSchema();
  }, [schemaId, navigate]);

  // Fetch test categories and handle edit mode data synchronization
  useEffect(() => {
    const fetchTestCategories = async () => {
      try {
        setTestsLoading(true);
        const response = await testService.getAllTests();
        const categories = response.data || [];
        setTestCategories(categories);

        // If in edit mode and we have initial schema data, set the selected category and test
        if (isEditMode && initialSchemaData) {
          const { categoryId, testId } = initialSchemaData;

          if (categoryId && testId) {
            // Find the category that contains the test
            let targetCategory = null;
            let targetTest = null;

            for (const category of categories) {
              const test = category.tests?.find((t) => t._id === testId);
              if (test) {
                targetCategory = category;
                targetTest = test;
                break;
              }
            }

            if (targetCategory && targetTest) {
              setSelectedCategory(targetCategory._id);
              // Set available tests for the category first
              setAvailableTests(targetCategory.tests || []);
              // Then set the selected test after a brief delay to ensure state updates
              setTimeout(() => {
                setSelectedTest(targetTest._id);
              }, 100);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching test categories:", error);
        setPopup({ type: "error", message: "Failed to load test categories" });
      } finally {
        setTestsLoading(false);
      }
    };

    fetchTestCategories();
  }, [isEditMode, initialSchemaData]);

  // Update available tests when category selection changes
  useEffect(() => {
    updateAvailableTests();
  }, [selectedCategory, testCategories, isEditMode, selectedTest]);

  // Add this useEffect to SchemaBuilder component
  useEffect(() => {
    return () => {
      handleResetForm();
      console.log("remove this useEffect if bug is found");
    };
  }, []);
  // Standard Range Management Functions (keep these as they are complex)
  const initializeStandardRange = (type) => {
    let initialData = { type };

    if (type === "genderBased") {
      initialData.ranges = {
        male: { min: "", max: "" },
        female: { min: "", max: "" },
      };
    } else if (type === "ageBased") {
      initialData.ranges = [];
    } else if (type === "genderWithAgeBased") {
      initialData.ranges = {
        male: [],
        female: [],
      };
    } else if (type === "numberRange") {
      initialData.min = "";
      initialData.max = "";
    } else if (type === "text") {
      initialData.value = "";
    }

    updateCurrentField({ standardRange: initialData });
  };

  const handleStandardRangeChange = (path, value) => {
    const newStandardRange = { ...currentField.standardRange };

    if (path.includes(".")) {
      const [parent, child, subChild] = path.split(".");
      if (subChild) {
        newStandardRange[parent][child][subChild] = value;
      } else {
        newStandardRange[parent][child] = value;
      }
    } else {
      newStandardRange[path] = value;
    }

    updateCurrentField({ standardRange: newStandardRange });
  };

  const addAgeRange = () => {
    if (isAddingRange) return;

    setIsAddingRange(true);

    const newStandardRange = { ...currentField.standardRange };

    if (!newStandardRange.ranges) {
      newStandardRange.ranges = [];
    }

    const newRange = {
      ageMin: "",
      ageMax: "",
      min: "",
      max: "",
    };

    updateCurrentField({
      standardRange: {
        ...newStandardRange,
        ranges: [...newStandardRange.ranges, newRange],
      },
    });

    setTimeout(() => setIsAddingRange(false), 100);
  };

  const removeAgeRange = (index) => {
    const newStandardRange = { ...currentField.standardRange };
    if (newStandardRange.ranges && newStandardRange.ranges.length > index) {
      const newRanges = [...newStandardRange.ranges];
      newRanges.splice(index, 1);
      updateCurrentField({
        standardRange: {
          ...newStandardRange,
          ranges: newRanges,
        },
      });
    }
  };

  const handleAgeRangeChange = (index, field, value) => {
    const newStandardRange = { ...currentField.standardRange };
    if (newStandardRange.ranges && newStandardRange.ranges.length > index) {
      const newRanges = [...newStandardRange.ranges];
      newRanges[index] = {
        ...newRanges[index],
        [field]: value,
      };
      updateCurrentField({
        standardRange: {
          ...newStandardRange,
          ranges: newRanges,
        },
      });
    }
  };

  const addGenderAgeRange = (gender) => {
    if (isAddingRange) return;

    setIsAddingRange(true);

    const newStandardRange = { ...currentField.standardRange };

    if (!newStandardRange.ranges[gender]) {
      newStandardRange.ranges[gender] = [];
    }

    const newRange = {
      ageMin: "",
      ageMax: "",
      min: "",
      max: "",
    };

    updateCurrentField({
      standardRange: {
        ...newStandardRange,
        ranges: {
          ...newStandardRange.ranges,
          [gender]: [...newStandardRange.ranges[gender], newRange],
        },
      },
    });

    setTimeout(() => setIsAddingRange(false), 100);
  };

  const removeGenderAgeRange = (gender, index) => {
    const newStandardRange = { ...currentField.standardRange };
    if (newStandardRange.ranges[gender] && newStandardRange.ranges[gender].length > index) {
      const newGenderRanges = [...newStandardRange.ranges[gender]];
      newGenderRanges.splice(index, 1);
      updateCurrentField({
        standardRange: {
          ...newStandardRange,
          ranges: {
            ...newStandardRange.ranges,
            [gender]: newGenderRanges,
          },
        },
      });
    }
  };

  const handleGenderAgeRangeChange = (gender, index, field, value) => {
    const newStandardRange = { ...currentField.standardRange };
    if (newStandardRange.ranges[gender] && newStandardRange.ranges[gender].length > index) {
      const newGenderRanges = [...newStandardRange.ranges[gender]];
      newGenderRanges[index] = {
        ...newGenderRanges[index],
        [field]: value,
      };
      updateCurrentField({
        standardRange: {
          ...newStandardRange,
          ranges: {
            ...newStandardRange.ranges,
            [gender]: newGenderRanges,
          },
        },
      });
    }
  };

  // Section Management
  const startEditingSection = (sectionIndex) => {
    const section = schema.sections[sectionIndex];
    setCurrentSection({
      name: section.name,
      description: section.description || "",
    });
    setEditingSectionIndex(sectionIndex);
  };

  const handleAddSection = () => {
    if (!currentSection.name.trim()) {
      setPopup({ type: "error", message: "Section name is required" });
      return;
    }

    const newSection = {
      name: currentSection.name,
      description: currentSection.description,
      fields: [],
    };

    addSection(newSection);
    resetSectionForm();
  };

  const handleUpdateSection = () => {
    if (!currentSection.name.trim()) {
      setPopup({ type: "error", message: "Section name is required" });
      return;
    }

    updateSection(editingSectionIndex, {
      ...schema.sections[editingSectionIndex],
      name: currentSection.name,
      description: currentSection.description,
    });

    resetSectionForm();
    setEditingSectionIndex(null);
  };

  const cancelEditingSection = () => {
    resetSectionForm();
    setEditingSectionIndex(null);
  };

  // Field Management
  const startEditingField = (fieldIndex, sectionIndex = null) => {
    const field = sectionIndex !== null ? schema.sections[sectionIndex].fields[fieldIndex] : schema.fields[fieldIndex];

    const requiredString = field.required ? "yes" : "no";

    setCurrentField({
      label: field.label,
      type: field.type,
      required: requiredString,
      unit: field.unit || "",
      standardRange: field.standardRange || null,
      options: field.options || [],
      sectionId: sectionIndex !== null ? schema.sections[sectionIndex]?.name || "" : "",
      editingIndex: fieldIndex,
      editingSectionIndex: sectionIndex,
    });

    setEditingFieldId(sectionIndex !== null ? `section-${sectionIndex}-field-${fieldIndex}` : `field-${fieldIndex}`);
  };

  const createFieldData = () => {
    const isRequired = currentField.required === "yes";

    const fieldData = {
      label: currentField.label,
      type: currentField.type,
      required: isRequired,
    };

    if (["radio", "select", "checkbox"].includes(currentField.type) && currentField.options.length > 0) {
      fieldData.options = [...currentField.options];
    }

    if (currentField.unit && currentField.unit.trim()) {
      fieldData.unit = currentField.unit;
    }

    if (currentField.type === "number" && currentField.standardRange && currentField.standardRange.type !== "none") {
      const standardRangeData = { ...currentField.standardRange };

      if (standardRangeData.type === "ageBased" && standardRangeData.ranges) {
        standardRangeData.ranges = standardRangeData.ranges.filter((range) => range.min !== "" || range.max !== "");
      } else if (standardRangeData.type === "genderWithAgeBased") {
        Object.keys(standardRangeData.ranges).forEach((gender) => {
          standardRangeData.ranges[gender] = standardRangeData.ranges[gender].filter(
            (range) => range.min !== "" || range.max !== ""
          );
        });
      } else {
        Object.keys(standardRangeData).forEach((key) => {
          if (
            standardRangeData[key] === "" ||
            (Array.isArray(standardRangeData[key]) && standardRangeData[key].length === 0)
          ) {
            delete standardRangeData[key];
          }
        });

        if (standardRangeData.ranges) {
          Object.keys(standardRangeData.ranges).forEach((rangeKey) => {
            if (!standardRangeData.ranges[rangeKey].min && !standardRangeData.ranges[rangeKey].max) {
              delete standardRangeData.ranges[rangeKey];
            }
          });

          if (Object.keys(standardRangeData.ranges).length === 0) {
            delete standardRangeData.ranges;
          }
        }
      }

      if (Object.keys(standardRangeData).length > 0) {
        fieldData.standardRange = standardRangeData;
      }
    }

    return fieldData;
  };

  const handleAddField = () => {
    if (!currentField.label.trim()) {
      setPopup({ type: "error", message: "Field label is required" });
      return;
    }

    if (["radio", "select", "checkbox"].includes(currentField.type) && currentField.options.length === 0) {
      setPopup({
        type: "error",
        message: `${
          currentField.type.charAt(0).toUpperCase() + currentField.type.slice(1)
        } fields must have at least one option`,
      });
      return;
    }

    const fieldData = createFieldData();

    if (useSections && currentField.sectionId) {
      const sectionIndex = schema.sections.findIndex((section) => section.name === currentField.sectionId);
      if (sectionIndex !== -1) {
        addFieldToSchema(fieldData, sectionIndex);
      }
    } else {
      addFieldToSchema(fieldData);
    }

    resetFieldForm();
  };

  const handleUpdateField = () => {
    if (!currentField.label.trim()) {
      setPopup({ type: "error", message: "Field label is required" });
      return;
    }

    if (["radio", "select", "checkbox"].includes(currentField.type) && currentField.options.length === 0) {
      setPopup({
        type: "error",
        message: `${
          currentField.type.charAt(0).toUpperCase() + currentField.type.slice(1)
        } fields must have at least one option`,
      });
      return;
    }

    const fieldData = createFieldData();

    updateFieldInSchema(fieldData, currentField.editingIndex, currentField.editingSectionIndex);

    resetFieldForm();
    setEditingFieldId(null);
  };

  const cancelEditingField = () => {
    resetFieldForm();
    setEditingFieldId(null);
  };

  const handleRemoveField = (fieldIndex, sectionIndex = null) => {
    removeFieldFromSchema(fieldIndex, sectionIndex);

    if (editingFieldId === `section-${sectionIndex}-field-${fieldIndex}` || editingFieldId === `field-${fieldIndex}`) {
      cancelEditingField();
    }
  };

  // Schema Cleaning and Saving
  const cleanFieldData = (field) => {
    const cleanedField = { ...field };

    if (
      cleanedField.standardRange?.type === "none" ||
      (cleanedField.standardRange && Object.keys(cleanedField.standardRange).length === 0)
    ) {
      delete cleanedField.standardRange;
    }

    if (!cleanedField.unit || cleanedField.unit === "") {
      delete cleanedField.unit;
    }

    if (
      cleanedField.options &&
      (cleanedField.options.length === 0 || !["radio", "select", "checkbox"].includes(cleanedField.type))
    ) {
      delete cleanedField.options;
    }

    return cleanedField;
  };

  const prepareSchemaForSave = () => {
    const cleanedSchema = {
      name: schema.name.trim(),
      description: schema.description ? schema.description.trim() : "",
      testId: selectedTest,
      categoryId: selectedCategory,
      isActive: isActive,
    };

    if (schema.fields && schema.fields.length > 0) {
      cleanedSchema.fields = schema.fields.map(cleanFieldData);
    }

    if (useSections && schema.sections && schema.sections.length > 0) {
      cleanedSchema.sections = schema.sections.map((section) => ({
        ...section,
        fields: section.fields.map(cleanFieldData),
      }));
    }

    if (useStandardRange) {
      const testStandardRangeData = { ...testStandardRange };

      if (testStandardRangeData.type === "options" && testStandardRangeData.options.length > 0) {
        const optionsObj = {};
        testStandardRangeData.options.forEach((option) => {
          optionsObj[option.key] = option.value;
        });
        testStandardRangeData.options = optionsObj;
      } else if (
        testStandardRangeData.type === "text" &&
        (!testStandardRangeData.text || !testStandardRangeData.text.trim())
      ) {
        delete testStandardRangeData.text;
      }

      if (
        Object.keys(testStandardRangeData).length > 1 ||
        (testStandardRangeData.type === "text" && testStandardRangeData.text) ||
        (testStandardRangeData.type === "options" && testStandardRangeData.options)
      ) {
        cleanedSchema.testStandardRange = testStandardRangeData;
      }
    }

    return cleanedSchema;
  };

  const saveSchema = async () => {
    if (!schema.name.trim()) {
      setPopup({ type: "error", message: "Test name is required" });
      return;
    }

    if (!selectedCategory) {
      setPopup({ type: "error", message: "Please select a category" });
      return;
    }

    if (!selectedTest) {
      setPopup({ type: "error", message: "Please select a test" });
      return;
    }

    if (getFieldsCount() === 0) {
      setPopup({ type: "error", message: "At least one field is required" });
      return;
    }

    setIsSaving(true);

    try {
      const cleanedSchema = prepareSchemaForSave();

      console.log(isEditMode ? "Updating schema:" : "Saving schema:", cleanedSchema);

      let response;
      if (isEditMode) {
        response = await testSchemaService.update(schemaId, cleanedSchema);
      } else {
        response = await testSchemaService.addNew(cleanedSchema);
      }
      // Navigate immediately after successful API call
      setPopup({
        type: "success",
        message: `Test schema ${isEditMode ? "updated" : "saved"} successfully and navigating to schema list!`,
      });
      setTimeout(() => {
        navigate("/schema-list");
        handleResetForm();
      }, 1500);
    } catch (error) {
      console.error("Error saving schema:", error);
      setPopup({
        type: "error",
        message: `Error ${isEditMode ? "updating" : "saving"} test schema. Please try again.`,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetForm = () => {
    resetSchema();
    resetAllForms();
    resetSelection();
    resetUI();
    setInitialSchemaData(null);
  };

  const handleCancel = () => {
    if (isEditMode) {
      handleResetForm();
      navigate("/schema-list");
    } else {
      handleResetForm();
    }
  };

  if (testsLoading || isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 lg:p-6">
      {(isSaving || isLoading) && <LoadingScreen />}

      {popup && (
        <Popup
          type={popup.type}
          message={popup.message}
          onClose={() => setPopup(null)}
          onConfirm={popup.onConfirm}
          confirmText={popup.confirmText}
          cancelText={popup.cancelText}
        />
      )}

      <div className="max-w-7xl mx-auto space-y-3 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 text-center sm:text-left px-2 sm:px-0">
            {isEditMode ? "Edit Schema for Lab Test" : "Schema Builder for Lab Test"}
          </h2>
          {isEditMode && (
            <div className="bg-blue-100 border border-blue-300 rounded-lg px-3 py-2 mt-2 sm:mt-0">
              <span className="text-blue-800 text-sm font-medium">Editing Mode</span>
            </div>
          )}
        </div>

        {/* Test Category and Test Selection */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm overflow-hidden">
          <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700">Test Selection</h3>
          </div>
          <div className="p-3 sm:p-4 lg:p-6 space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <SelectField
                label="Test Category"
                name="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                options={testCategories.map((category) => ({
                  value: category._id,
                  label: category.categoryName,
                }))}
                placeholder="Select a category"
              />

              <SelectField
                label="Test"
                name="test"
                value={selectedTest}
                onChange={(e) => setSelectedTest(e.target.value)}
                disabled={!selectedCategory}
                options={availableTests.map((test) => ({
                  value: test._id,
                  label: `${test.name}`,
                }))}
                placeholder="Select a test"
              />
            </div>

            {selectedTest && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-blue-400">ℹ️</span>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Selected Test</h3>
                    <div className="mt-1 text-sm text-blue-700">
                      <p>
                        Schema will be attached to:{" "}
                        <strong>{availableTests.find((test) => test._id === selectedTest)?.name}</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Schema Builder Section */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm overflow-hidden">
          <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700">Test Configuration</h3>
          </div>

          <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
            {/* Test Configuration */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <InputField
                  label="Schema Name"
                  name="name"
                  value={schema.name}
                  onChange={(e) => updateSchema({ name: e.target.value })}
                />
                <InputField
                  label="Description"
                  name="description"
                  value={schema.description}
                  onChange={(e) => updateSchema({ description: e.target.value })}
                />
              </div>
            </div>

            {/* Active Status Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border border-gray-300 rounded-lg space-y-3 sm:space-y-0">
              <div className="flex-1">
                <h4 className="text-base sm:text-lg font-semibold text-gray-700">Active Status</h4>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  {isActive
                    ? "This schema is active and can be used for tests"
                    : "This schema is deactivated and won't be available for new tests"}
                </p>
              </div>
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                  />
                  <div
                    className={`block w-12 h-6 sm:w-14 sm:h-8 rounded-full transition-colors ${
                      isActive ? "bg-green-600" : "bg-gray-300"
                    }`}
                  ></div>
                  <div
                    className={`absolute left-1 top-1 bg-white w-4 h-4 sm:w-6 sm:h-6 rounded-full transition-transform ${
                      isActive ? "transform translate-x-6 sm:translate-x-8" : ""
                    }`}
                  ></div>
                </div>
                <div className="ml-2 sm:ml-3 text-gray-700 font-medium text-sm">
                  {isActive ? "Active" : "Deactivated"}
                </div>
              </label>
            </div>

            {/* Standard Range Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border border-gray-300 rounded-lg space-y-3 sm:space-y-0">
              <div className="flex-1">
                <h4 className="text-base sm:text-lg font-semibold text-gray-700">Test Standard Range Values</h4>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Add standard range values for the entire test (optional)
                </p>
              </div>
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={useStandardRange}
                    onChange={(e) => setUseStandardRange(e.target.checked)}
                  />
                  <div
                    className={`block w-12 h-6 sm:w-14 sm:h-8 rounded-full transition-colors ${
                      useStandardRange ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  ></div>
                  <div
                    className={`absolute left-1 top-1 bg-white w-4 h-4 sm:w-6 sm:h-6 rounded-full transition-transform ${
                      useStandardRange ? "transform translate-x-6 sm:translate-x-8" : ""
                    }`}
                  ></div>
                </div>
                <div className="ml-2 sm:ml-3 text-gray-700 font-medium text-sm">
                  {useStandardRange ? "Enabled" : "Disabled"}
                </div>
              </label>
            </div>

            {/* Standard Range Builder */}
            {useStandardRange && (
              <div className="space-y-3 p-3 sm:p-4 border border-gray-300 rounded-lg bg-gray-50">
                <h4 className="text-base sm:text-lg font-semibold text-gray-700">Test Standard Range Values</h4>

                <SelectField
                  label="Standard Range Type"
                  name="testStandardRangeType"
                  value={testStandardRange.type}
                  onChange={(e) => updateTestStandardRange({ type: e.target.value, options: [], text: "" })}
                  options={[
                    { value: "options", label: "Key-Value Options" },
                    { value: "text", label: "Text Standard Range" },
                  ]}
                />

                {testStandardRange.type === "options" && (
                  <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
                    <div className="flex flex-col sm:flex-row">
                      <label className="w-full sm:w-32 px-3 py-2 text-sm font-medium border-b sm:border-b-0 sm:border-r border-gray-300 bg-gray-50 flex items-center">
                        Standard Range Values
                      </label>
                      <div className="flex-1 p-3">
                        <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
                          {testStandardRange.options.map((option, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                              <div className="flex-1 min-w-0">
                                <span className="text-sm font-medium text-gray-700 block truncate">{option.key}: </span>
                                <span className="text-sm text-gray-600 block truncate">{option.value}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeTestStandardRangeOption(index)}
                                className="text-red-600 hover:text-red-800 text-lg font-bold ml-2 flex-shrink-0"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="space-y-2 sm:space-y-0 sm:flex sm:gap-2">
                          <InputField
                            label="Key"
                            name="testStandardRangeKey"
                            value={newTestStandardRangeKey}
                            onChange={(e) => setNewTestStandardRangeKey(e.target.value)}
                          />
                          <InputField
                            label="Value"
                            name="testStandardRangeValue"
                            value={newTestStandardRangeValue}
                            onChange={(e) => setNewTestStandardRangeValue(e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={addTestStandardRangeOption}
                            className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm font-medium"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {testStandardRange.type === "text" && (
                  <div className="flex flex-col sm:flex-row border border-gray-300 rounded-lg overflow-hidden bg-white">
                    <label className="w-full sm:w-32 px-3 py-2 text-sm font-medium border-b sm:border-b-0 sm:border-r border-gray-300 bg-gray-50 flex items-center">
                      Standard Range Text
                    </label>
                    <textarea
                      value={testStandardRange.text}
                      onChange={(e) => updateTestStandardRange({ text: e.target.value })}
                      rows={3}
                      className="flex-1 px-3 py-2 focus:outline-none resize-none text-sm bg-white"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Sections Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border border-gray-300 rounded-lg space-y-3 sm:space-y-0">
              <div className="flex-1">
                <h4 className="text-base sm:text-lg font-semibold text-gray-700">Test Sections</h4>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">Organize test fields into sections (optional)</p>
              </div>
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={useSections}
                    onChange={(e) => setUseSections(e.target.checked)}
                  />
                  <div
                    className={`block w-12 h-6 sm:w-14 sm:h-8 rounded-full transition-colors ${
                      useSections ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  ></div>
                  <div
                    className={`absolute left-1 top-1 bg-white w-4 h-4 sm:w-6 sm:h-6 rounded-full transition-transform ${
                      useSections ? "transform translate-x-6 sm:translate-x-8" : ""
                    }`}
                  ></div>
                </div>
                <div className="ml-2 sm:ml-3 text-gray-700 font-medium text-sm">
                  {useSections ? "Enabled" : "Disabled"}
                </div>
              </label>
            </div>

            {/* Section Builder */}
            {useSections && (
              <div className="space-y-3">
                <h4 className="text-base sm:text-lg font-semibold text-gray-700">Manage Test Sections</h4>
                <div className="space-y-3 p-3 sm:p-4 border border-gray-300 rounded-lg bg-gray-50">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    <InputField
                      label="Section Name"
                      name="sectionName"
                      value={currentSection.name}
                      onChange={(e) => updateCurrentSection({ name: e.target.value })}
                    />
                    <InputField
                      label="Description"
                      name="sectionDescription"
                      value={currentSection.description}
                      onChange={(e) => updateCurrentSection({ description: e.target.value })}
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={editingSectionIndex !== null ? handleUpdateSection : handleAddSection}
                      className={`flex-1 ${
                        editingSectionIndex !== null
                          ? "bg-yellow-600 hover:bg-yellow-700"
                          : "bg-green-600 hover:bg-green-700"
                      } text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 font-medium text-sm sm:text-base transition-colors`}
                    >
                      {editingSectionIndex !== null ? "Update Section" : "Add Section"}
                    </button>
                    {editingSectionIndex !== null && (
                      <button
                        type="button"
                        onClick={cancelEditingSection}
                        className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 font-medium text-sm sm:text-base transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-semibold text-gray-700 mb-2">Existing Sections</h5>
                  {!schema.sections || schema.sections.length === 0 ? (
                    <p className="text-gray-500 text-center py-4 text-sm bg-gray-50 rounded-lg">
                      No sections added yet
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {schema.sections.map((section, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-3 bg-white">
                          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-2 lg:space-y-0">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4 flex-1">
                              <div>
                                <h6 className="font-medium text-gray-800 text-sm sm:text-base">{section.name}</h6>
                              </div>
                              <div>
                                {section.description && (
                                  <p className="text-xs sm:text-sm text-gray-600">{section.description}</p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">{section.fields.length} field(s)</p>
                              </div>
                            </div>
                            <div className="flex space-x-2 self-start lg:self-center lg:ml-4">
                              <button
                                type="button"
                                onClick={() => startEditingSection(index)}
                                className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors px-2 py-1 rounded hover:bg-blue-50"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => removeSection(index)}
                                className="text-red-600 hover:text-red-800 font-medium text-sm transition-colors px-2 py-1 rounded hover:bg-red-50"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Field Builder */}
            <div className="space-y-3">
              <h4 className="text-base sm:text-lg font-semibold text-gray-700">
                {editingFieldId ? "Edit Test Field" : "Add Test Field"}
              </h4>
              <div className="space-y-3 p-3 sm:p-4 border border-gray-300 rounded-lg bg-gray-50">
                {useSections && schema.sections && schema.sections.length > 0 && (
                  <SelectField
                    label="Section"
                    name="section"
                    value={currentField.sectionId}
                    onChange={(e) => updateCurrentField({ sectionId: e.target.value })}
                    options={schema.sections.map((section) => ({
                      value: section.name,
                      label: section.name,
                    }))}
                    placeholder="Choose a section"
                  />
                )}

                <div className="space-y-3">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    <InputField
                      label="Field Name"
                      name="fieldLabel"
                      value={currentField.label}
                      onChange={(e) => updateCurrentField({ label: e.target.value })}
                    />

                    <SelectField
                      label="Type"
                      name="fieldType"
                      value={currentField.type}
                      onChange={(e) => {
                        const newType = e.target.value;
                        updateCurrentField({
                          type: newType,
                          standardRange: newType === "number" ? currentField.standardRange : null,
                          options: ["radio", "select", "checkbox"].includes(newType) ? currentField.options : [],
                        });
                      }}
                      options={fieldTypes.map((type) => ({
                        value: type,
                        label: type.charAt(0).toUpperCase() + type.slice(1),
                      }))}
                    />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    <SelectField
                      label="Required"
                      name="required"
                      value={currentField.required}
                      onChange={(e) => updateCurrentField({ required: e.target.value })}
                      options={[
                        { value: "no", label: "No" },
                        { value: "yes", label: "Yes" },
                      ]}
                    />

                    <SelectField
                      label="Unit"
                      name="unit"
                      value={currentField.unit}
                      onChange={(e) => updateCurrentField({ unit: e.target.value })}
                      options={commonUnits}
                    />
                  </div>
                </div>

                {["radio", "select", "checkbox"].includes(currentField.type) && (
                  <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
                    <div className="flex flex-col sm:flex-row">
                      <label className="w-full sm:w-32 px-3 py-2 text-sm font-medium border-b sm:border-b-0 sm:border-r border-gray-300 bg-gray-50 flex items-center">
                        Options
                      </label>
                      <div className="flex-1 p-3">
                        <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
                          {currentField.options.map((option, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                              <span className="text-sm text-gray-700 break-words flex-1">{option}</span>
                              <button
                                type="button"
                                onClick={() => removeFieldOption(index)}
                                className="text-red-600 hover:text-red-800 text-lg font-bold flex-shrink-0 ml-2 transition-colors"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <InputField
                            label="Option"
                            name="newOption"
                            value={newOption}
                            onChange={(e) => setNewOption(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && addFieldOption()}
                          />
                          <button
                            type="button"
                            onClick={addFieldOption}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm font-medium transition-colors"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentField.type === "number" && (
                  <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
                    <div className="flex flex-col sm:flex-row border-b border-gray-300">
                      <label className="w-full sm:w-32 px-3 py-2 text-sm font-medium border-b sm:border-b-0 sm:border-r border-gray-300 bg-gray-50 flex items-center">
                        Standard Range
                      </label>
                      <div className="flex-1 p-3 space-y-4">
                        <SelectField
                          label="Type"
                          name="standardRangeType"
                          value={currentField.standardRange?.type || "none"}
                          onChange={(e) => {
                            if (e.target.value === "none") {
                              updateCurrentField({ standardRange: null });
                            } else {
                              initializeStandardRange(e.target.value);
                            }
                          }}
                          options={standardRangeTypes}
                        />

                        {currentField.standardRange?.type === "genderBased" && (
                          <div className="space-y-3">
                            {genderOptions.map((gender) => (
                              <div key={gender.value} className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 capitalize block">
                                  {gender.label}:
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  <InputField
                                    label="Min value"
                                    name={`${gender.value}Min`}
                                    type="number"
                                    value={currentField.standardRange?.ranges?.[gender.value]?.min || ""}
                                    onChange={(e) =>
                                      handleStandardRangeChange(`ranges.${gender.value}.min`, e.target.value)
                                    }
                                  />
                                  <InputField
                                    label="Max value"
                                    name={`${gender.value}Max`}
                                    type="number"
                                    value={currentField.standardRange?.ranges?.[gender.value]?.max || ""}
                                    onChange={(e) =>
                                      handleStandardRangeChange(`ranges.${gender.value}.max`, e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {currentField.standardRange?.type === "ageBased" && (
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <h5 className="text-sm font-semibold text-gray-700">Age Ranges</h5>
                              <button
                                type="button"
                                onClick={addAgeRange}
                                disabled={isAddingRange}
                                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
                              >
                                {isAddingRange ? "Adding..." : "Add Age Range"}
                              </button>
                            </div>
                            <div className="space-y-4">
                              {currentField.standardRange?.ranges?.map((range, index) => (
                                <div key={index} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                                  <div className="flex justify-between items-center mb-3">
                                    <span className="text-sm font-medium text-gray-700">Age Range {index + 1}</span>
                                    <button
                                      type="button"
                                      onClick={() => removeAgeRange(index)}
                                      className="text-red-600 hover:text-red-800 text-lg font-bold"
                                    >
                                      ×
                                    </button>
                                  </div>
                                  <div className="space-y-3">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                      <InputField
                                        label="Min Age"
                                        type="number"
                                        value={range.ageMin || ""}
                                        onChange={(e) => handleAgeRangeChange(index, "ageMin", e.target.value)}
                                      />
                                      <InputField
                                        label="Max Age"
                                        type="number"
                                        value={range.ageMax || ""}
                                        onChange={(e) => handleAgeRangeChange(index, "ageMax", e.target.value)}
                                      />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                      <InputField
                                        label="Min Value"
                                        type="number"
                                        value={range.min || ""}
                                        onChange={(e) => handleAgeRangeChange(index, "min", e.target.value)}
                                      />
                                      <InputField
                                        label="Max Value"
                                        type="number"
                                        value={range.max || ""}
                                        onChange={(e) => handleAgeRangeChange(index, "max", e.target.value)}
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                              {(!currentField.standardRange?.ranges ||
                                currentField.standardRange.ranges.length === 0) && (
                                <div className="text-center py-4 text-gray-500 text-sm">
                                  No age ranges added yet. Click "Add Age Range" to create one.
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {currentField.standardRange?.type === "genderWithAgeBased" && (
                          <div className="space-y-6">
                            {genderOptions.map((gender) => (
                              <div key={gender.value} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                <div className="flex justify-between items-center mb-4">
                                  <h5 className="text-sm font-semibold text-gray-700 capitalize">
                                    {gender.label} Ranges
                                  </h5>
                                  <button
                                    type="button"
                                    onClick={() => addGenderAgeRange(gender.value)}
                                    disabled={isAddingRange}
                                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
                                  >
                                    {isAddingRange ? "Adding..." : "Add Age Range"}
                                  </button>
                                </div>
                                <div className="space-y-4">
                                  {currentField.standardRange?.ranges[gender.value]?.map((range, index) => (
                                    <div key={index} className="border border-gray-300 rounded-lg p-4 bg-white">
                                      <div className="flex justify-between items-center mb-3">
                                        <span className="text-sm font-medium text-gray-700">Age Range {index + 1}</span>
                                        <button
                                          type="button"
                                          onClick={() => removeGenderAgeRange(gender.value, index)}
                                          className="text-red-600 hover:text-red-800 text-lg font-bold"
                                        >
                                          ×
                                        </button>
                                      </div>
                                      <div className="space-y-3">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                          <InputField
                                            label="Min Age"
                                            type="number"
                                            value={range.ageMin || ""}
                                            onChange={(e) =>
                                              handleGenderAgeRangeChange(gender.value, index, "ageMin", e.target.value)
                                            }
                                          />
                                          <InputField
                                            label="Max Age"
                                            type="number"
                                            value={range.ageMax || ""}
                                            onChange={(e) =>
                                              handleGenderAgeRangeChange(gender.value, index, "ageMax", e.target.value)
                                            }
                                          />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                          <InputField
                                            label="Min Value"
                                            type="number"
                                            value={range.min || ""}
                                            onChange={(e) =>
                                              handleGenderAgeRangeChange(gender.value, index, "min", e.target.value)
                                            }
                                          />
                                          <InputField
                                            label="Max Value"
                                            type="number"
                                            value={range.max || ""}
                                            onChange={(e) =>
                                              handleGenderAgeRangeChange(gender.value, index, "max", e.target.value)
                                            }
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                  {(!currentField.standardRange?.ranges[gender.value] ||
                                    currentField.standardRange.ranges[gender.value].length === 0) && (
                                    <div className="text-center py-4 text-gray-500 text-sm">
                                      No age ranges added for {gender.label}. Click "Add Age Range" to create one.
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {currentField.standardRange?.type === "numberRange" && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <InputField
                              label="Min value"
                              name="rangeMin"
                              type="number"
                              value={currentField.standardRange?.min || ""}
                              onChange={(e) => handleStandardRangeChange("min", e.target.value)}
                            />
                            <InputField
                              label="Max value"
                              name="rangeMax"
                              type="number"
                              value={currentField.standardRange?.max || ""}
                              onChange={(e) => handleStandardRangeChange("max", e.target.value)}
                            />
                          </div>
                        )}

                        {currentField.standardRange?.type === "text" && (
                          <div className="flex flex-col sm:flex-row border border-gray-300 rounded-lg overflow-hidden">
                            <label className="w-full sm:w-32 px-3 py-2 text-sm font-medium border-b sm:border-b-0 sm:border-r border-gray-300 bg-gray-50 flex items-center">
                              Standard Range Text
                            </label>
                            <textarea
                              value={currentField.standardRange.value || ""}
                              onChange={(e) => handleStandardRangeChange("value", e.target.value)}
                              rows={3}
                              className="flex-1 px-3 py-2 focus:outline-none resize-none text-sm bg-white"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={editingFieldId ? handleUpdateField : handleAddField}
                    disabled={useSections && !currentField.sectionId}
                    className={`flex-1 ${
                      editingFieldId ? "bg-yellow-600 hover:bg-yellow-700" : "bg-blue-600 hover:bg-blue-700"
                    } text-white py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 font-medium text-sm sm:text-base disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors`}
                  >
                    {editingFieldId ? "Update Field" : `Add Field ${useSections ? "to Section" : "to Test"}`}
                  </button>
                  {editingFieldId && (
                    <button
                      type="button"
                      onClick={cancelEditingField}
                      className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 font-medium text-sm sm:text-base transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Save/Cancel Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSaving}
                className="w-full sm:w-32 bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 font-medium text-sm sm:text-base disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isEditMode ? "Back" : "Reset"}
              </button>
              <button
                type="button"
                onClick={saveSchema}
                disabled={
                  isSaving || !schema.name.trim() || !selectedCategory || !selectedTest || getFieldsCount() === 0
                }
                className="w-full sm:w-64 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 font-medium text-sm sm:text-base disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isSaving ? "Saving..." : isEditMode ? "Update Schema" : "Save Schema"}
              </button>
            </div>
          </div>
        </div>

        {/* Form Preview */}
        <FormPreview
          schema={schema}
          useSections={useSections}
          useStandardRange={useStandardRange}
          testStandardRange={testStandardRange}
          removeField={handleRemoveField}
          getFieldsCount={getFieldsCount}
          startEditingField={startEditingField}
        />

        {/* JSON Schema Display */}
        <SchemaDisplay
          schema={schema}
          useSections={useSections}
          useStandardRange={useStandardRange}
          testStandardRange={testStandardRange}
        />
      </div>
    </div>
  );
};

export default SchemaBuilder;
