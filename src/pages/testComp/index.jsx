import { useState, useEffect } from "react";
import testSchemaService from "../../services/testSchemaService";
import testService from "../../services/testService";
import InputField from "./InputField";
import SchemaDisplay from "./SchemaDisplay";
import FormPreview from "./FormPreview";
import Popup from "../../components/popup/Popup";
import LoadingScreen from "../../components/loadingPage";

const SchemaBuilderForLabTest = () => {
  const [schema, setSchema] = useState({
    testName: "",
    testDescription: "",
    fields: [],
  });

  const [useSections, setUseSections] = useState(false);
  const [useStandardRange, setUseStandardRange] = useState(false);
  const [currentSection, setCurrentSection] = useState({
    name: "",
    description: "",
  });

  const [currentField, setCurrentField] = useState({
    id: "",
    label: "",
    type: "text",
    required: "no",
    unit: "",
    standardRange: null,
    options: [],
    sectionId: "",
  });

  const [testStandardRange, setTestStandardRange] = useState({
    type: "options",
    options: [],
    text: "",
  });

  const [newOption, setNewOption] = useState("");
  const [newTestStandardRangeKey, setNewTestStandardRangeKey] = useState("");
  const [newTestStandardRangeValue, setNewTestStandardRangeValue] = useState("");

  // Add a ref to track if we're currently adding a range
  const [isAddingRange, setIsAddingRange] = useState(false);

  // Editing states
  const [editingSectionIndex, setEditingSectionIndex] = useState(null);
  const [editingFieldId, setEditingFieldId] = useState(null);

  // Loading and success states for save operation
  const [isSaving, setIsSaving] = useState(false);
  const [popup, setPopup] = useState(null);

  // NEW: Test category and test selection states
  const [testCategories, setTestCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTest, setSelectedTest] = useState("");
  const [testsLoading, setTestsLoading] = useState(true);
  const [availableTests, setAvailableTests] = useState([]);

  // Updated field types
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
    "",
    "mg/L",
    "mg/dL",
    "g/dL",
    "mmol/L",
    "μmol/L",
    "U/L",
    "IU/L",
    "cells/μL",
    "×10^9/L",
    "mmHg",
    "cm",
    "kg",
    "lb",
    "°C",
    "°F",
  ];

  // ========== NEW: FETCH TEST CATEGORIES AND TESTS ==========

  useEffect(() => {
    const fetchTestCategories = async () => {
      try {
        setTestsLoading(true);
        const response = await testService.getAllTests();
        setTestCategories(response.data || []);
      } catch (error) {
        console.error("Error fetching test categories:", error);
        setPopup({ type: "error", message: "Failed to load test categories" });
      } finally {
        setTestsLoading(false);
      }
    };

    fetchTestCategories();
  }, []);

  // Update available tests when category selection changes
  useEffect(() => {
    if (selectedCategory) {
      const category = testCategories.find((cat) => cat._id === selectedCategory);
      setAvailableTests(category?.tests || []);
    } else {
      setAvailableTests([]);
    }
    setSelectedTest(""); // Reset test selection when category changes
  }, [selectedCategory, testCategories]);

  // ========== HELPER FUNCTIONS ==========

  const getFieldsCount = () => {
    if (useSections && schema.sections) {
      return schema.sections.reduce((total, section) => total + section.fields.length, 0);
    }
    return schema.fields.length;
  };

  const isEditing = () => {
    return editingSectionIndex !== null || editingFieldId !== null;
  };

  // ========== FIELD OPTIONS MANAGEMENT ==========

  const addFieldOption = () => {
    if (!newOption.trim()) return;

    setCurrentField((prev) => ({
      ...prev,
      options: [...prev.options, newOption.trim()],
    }));
    setNewOption("");
  };

  const removeFieldOption = (index) => {
    setCurrentField((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  // ========== STANDARD RANGE MANAGEMENT ==========

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

    setCurrentField((prev) => ({
      ...prev,
      standardRange: initialData,
    }));
  };

  const handleStandardRangeChange = (path, value) => {
    setCurrentField((prev) => {
      const newStandardRange = { ...prev.standardRange };

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

      return {
        ...prev,
        standardRange: newStandardRange,
      };
    });
  };

  const addAgeRange = () => {
    if (isAddingRange) return;

    setIsAddingRange(true);

    setCurrentField((prev) => {
      const newStandardRange = { ...prev.standardRange };

      if (!newStandardRange.ranges) {
        newStandardRange.ranges = [];
      }

      const newRange = {
        ageMin: "",
        ageMax: "",
        min: "",
        max: "",
      };

      return {
        ...prev,
        standardRange: {
          ...newStandardRange,
          ranges: [...newStandardRange.ranges, newRange],
        },
      };
    });

    setTimeout(() => setIsAddingRange(false), 100);
  };

  const removeAgeRange = (index) => {
    setCurrentField((prev) => {
      const newStandardRange = { ...prev.standardRange };
      if (newStandardRange.ranges && newStandardRange.ranges.length > index) {
        const newRanges = [...newStandardRange.ranges];
        newRanges.splice(index, 1);
        return {
          ...prev,
          standardRange: {
            ...newStandardRange,
            ranges: newRanges,
          },
        };
      }
      return prev;
    });
  };

  const handleAgeRangeChange = (index, field, value) => {
    setCurrentField((prev) => {
      const newStandardRange = { ...prev.standardRange };
      if (newStandardRange.ranges && newStandardRange.ranges.length > index) {
        const newRanges = [...newStandardRange.ranges];
        newRanges[index] = {
          ...newRanges[index],
          [field]: value,
        };
        return {
          ...prev,
          standardRange: {
            ...newStandardRange,
            ranges: newRanges,
          },
        };
      }
      return prev;
    });
  };

  const addGenderAgeRange = (gender) => {
    if (isAddingRange) return;

    setIsAddingRange(true);

    setCurrentField((prev) => {
      const newStandardRange = { ...prev.standardRange };

      if (!newStandardRange.ranges[gender]) {
        newStandardRange.ranges[gender] = [];
      }

      const newRange = {
        ageMin: "",
        ageMax: "",
        min: "",
        max: "",
      };

      return {
        ...prev,
        standardRange: {
          ...newStandardRange,
          ranges: {
            ...newStandardRange.ranges,
            [gender]: [...newStandardRange.ranges[gender], newRange],
          },
        },
      };
    });

    setTimeout(() => setIsAddingRange(false), 100);
  };

  const removeGenderAgeRange = (gender, index) => {
    setCurrentField((prev) => {
      const newStandardRange = { ...prev.standardRange };
      if (newStandardRange.ranges[gender] && newStandardRange.ranges[gender].length > index) {
        const newGenderRanges = [...newStandardRange.ranges[gender]];
        newGenderRanges.splice(index, 1);
        return {
          ...prev,
          standardRange: {
            ...newStandardRange,
            ranges: {
              ...newStandardRange.ranges,
              [gender]: newGenderRanges,
            },
          },
        };
      }
      return prev;
    });
  };

  const handleGenderAgeRangeChange = (gender, index, field, value) => {
    setCurrentField((prev) => {
      const newStandardRange = { ...prev.standardRange };
      if (newStandardRange.ranges[gender] && newStandardRange.ranges[gender].length > index) {
        const newGenderRanges = [...newStandardRange.ranges[gender]];
        newGenderRanges[index] = {
          ...newGenderRanges[index],
          [field]: value,
        };
        return {
          ...prev,
          standardRange: {
            ...newStandardRange,
            ranges: {
              ...newStandardRange.ranges,
              [gender]: newGenderRanges,
            },
          },
        };
      }
      return prev;
    });
  };

  // ========== TEST STANDARD RANGE MANAGEMENT ==========

  const addTestStandardRangeOption = () => {
    if (!newTestStandardRangeKey.trim() || !newTestStandardRangeValue.trim()) return;

    setTestStandardRange((prev) => ({
      ...prev,
      options: [...prev.options, { key: newTestStandardRangeKey.trim(), value: newTestStandardRangeValue.trim() }],
    }));

    setNewTestStandardRangeKey("");
    setNewTestStandardRangeValue("");
  };

  const removeTestStandardRangeOption = (index) => {
    setTestStandardRange((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  // ========== SECTION MANAGEMENT ==========

  const addSection = () => {
    if (!currentSection.name.trim()) {
      alert("Section name is required");
      return;
    }

    // Generate unique section ID automatically
    const sectionId = currentSection.name.toLowerCase().replace(/\s+/g, "_") + "_" + Date.now();

    const newSection = {
      id: sectionId,
      name: currentSection.name,
      description: currentSection.description,
      fields: [],
    };

    setSchema((prev) => ({
      ...prev,
      sections: [...(prev.sections || []), newSection],
    }));

    setCurrentSection({
      name: "",
      description: "",
    });
  };

  const removeSection = (index) => {
    setSchema((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index),
    }));
    // If we're editing this section, cancel editing
    if (editingSectionIndex === index) {
      cancelEditingSection();
    }
  };

  // ========== EDITING FUNCTIONS ==========

  const startEditingSection = (sectionIndex) => {
    const section = schema.sections[sectionIndex];
    setCurrentSection({
      name: section.name,
      description: section.description || "",
    });
    setEditingSectionIndex(sectionIndex);
  };

  const updateSection = () => {
    if (!currentSection.name.trim()) {
      alert("Section name is required");
      return;
    }

    setSchema((prev) => ({
      ...prev,
      sections: prev.sections.map((section, index) =>
        index === editingSectionIndex
          ? {
              ...section,
              name: currentSection.name,
              description: currentSection.description,
            }
          : section
      ),
    }));

    setCurrentSection({
      name: "",
      description: "",
    });
    setEditingSectionIndex(null);
  };

  const cancelEditingSection = () => {
    setCurrentSection({
      name: "",
      description: "",
    });
    setEditingSectionIndex(null);
  };

  const startEditingField = (field, sectionIndex = null) => {
    // Convert required from boolean back to string for the form
    const requiredString = field.required ? "yes" : "no";

    setCurrentField({
      id: field.id,
      label: field.label,
      type: field.type,
      required: requiredString,
      unit: field.unit || "",
      standardRange: field.standardRange || null,
      options: field.options || [],
      sectionId: sectionIndex !== null ? schema.sections[sectionIndex]?.id || "" : "",
    });

    setEditingFieldId(field.id);
  };

  // ========== FIELD MANAGEMENT ==========

  const createFieldData = () => {
    // Convert required from string to boolean for schema
    const isRequired = currentField.required === "yes";

    const fieldData = {
      id: currentField.id || currentField.label.toLowerCase().replace(/\s+/g, "_") + "_" + Date.now(),
      label: currentField.label,
      type: currentField.type,
      required: isRequired,
    };

    // Only include options for field types that actually use them
    if (["radio", "select", "checkbox"].includes(currentField.type) && currentField.options.length > 0) {
      fieldData.options = [...currentField.options];
    }

    // Only include unit if provided
    if (currentField.unit && currentField.unit.trim()) {
      fieldData.unit = currentField.unit;
    }

    // Only include standard range for number fields
    if (currentField.type === "number" && currentField.standardRange && currentField.standardRange.type !== "none") {
      const standardRangeData = { ...currentField.standardRange };

      // Clean up empty values for age and genderAge types
      if (standardRangeData.type === "ageBased" && standardRangeData.ranges) {
        standardRangeData.ranges = standardRangeData.ranges.filter((range) => range.min !== "" || range.max !== "");
      } else if (standardRangeData.type === "genderWithAgeBased") {
        Object.keys(standardRangeData.ranges).forEach((gender) => {
          standardRangeData.ranges[gender] = standardRangeData.ranges[gender].filter(
            (range) => range.min !== "" || range.max !== ""
          );
        });
      } else {
        // Cleanup logic for other types
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

  const addField = () => {
    if (!currentField.label.trim()) {
      alert("Field label is required");
      return;
    }

    // Check for options for radio, select, and checkbox fields
    if (["radio", "select", "checkbox"].includes(currentField.type) && currentField.options.length === 0) {
      alert(
        `${currentField.type.charAt(0).toUpperCase() + currentField.type.slice(1)} fields must have at least one option`
      );
      return;
    }

    const fieldData = createFieldData();

    if (useSections && currentField.sectionId) {
      setSchema((prev) => ({
        ...prev,
        sections: prev.sections.map((section) =>
          section.id === currentField.sectionId ? { ...section, fields: [...section.fields, fieldData] } : section
        ),
      }));
    } else {
      setSchema((prev) => ({
        ...prev,
        fields: [...prev.fields, fieldData],
      }));
    }

    resetFieldForm();
  };

  const updateField = () => {
    if (!currentField.label.trim()) {
      alert("Field label is required");
      return;
    }

    // Check for options for radio, select, and checkbox fields
    if (["radio", "select", "checkbox"].includes(currentField.type) && currentField.options.length === 0) {
      alert(
        `${currentField.type.charAt(0).toUpperCase() + currentField.type.slice(1)} fields must have at least one option`
      );
      return;
    }

    const fieldData = createFieldData();

    setSchema((prev) => {
      if (useSections && currentField.sectionId) {
        // Update field in section
        return {
          ...prev,
          sections: prev.sections.map((section) =>
            section.id === currentField.sectionId
              ? {
                  ...section,
                  fields: section.fields.map((field) => (field.id === editingFieldId ? fieldData : field)),
                }
              : section
          ),
        };
      } else {
        // Update field in root fields
        return {
          ...prev,
          fields: prev.fields.map((field) => (field.id === editingFieldId ? fieldData : field)),
        };
      }
    });

    resetFieldForm();
    setEditingFieldId(null);
  };

  const resetFieldForm = () => {
    setCurrentField({
      id: "",
      label: "",
      type: "text",
      required: "no",
      unit: "",
      standardRange: null,
      options: [],
      sectionId: useSections ? currentField.sectionId : "",
    });
    setNewOption("");
  };

  const cancelEditingField = () => {
    resetFieldForm();
    setEditingFieldId(null);
  };

  const removeField = (sectionIndex, fieldIndex) => {
    if (useSections) {
      const fieldId = schema.sections[sectionIndex].fields[fieldIndex].id;

      setSchema((prev) => ({
        ...prev,
        sections: prev.sections.map((section, sIndex) =>
          sIndex === sectionIndex
            ? { ...section, fields: section.fields.filter((_, fIndex) => fIndex !== fieldIndex) }
            : section
        ),
      }));

      // If we're editing this field, cancel editing
      if (editingFieldId === fieldId) {
        cancelEditingField();
      }
    } else {
      const fieldId = schema.fields[fieldIndex].id;

      setSchema((prev) => ({
        ...prev,
        fields: prev.fields.filter((_, fIndex) => fIndex !== fieldIndex),
      }));

      // If we're editing this field, cancel editing
      if (editingFieldId === fieldId) {
        cancelEditingField();
      }
    }
  };

  // ========== SCHEMA CLEANING AND SAVING ==========

  const cleanFieldData = (field) => {
    const cleanedField = { ...field };

    // Remove standardRange if type is "none" or if it's empty
    if (
      cleanedField.standardRange?.type === "none" ||
      (cleanedField.standardRange && Object.keys(cleanedField.standardRange).length === 0)
    ) {
      delete cleanedField.standardRange;
    }

    // Remove unit if empty
    if (!cleanedField.unit || cleanedField.unit === "") {
      delete cleanedField.unit;
    }

    // Remove options if empty or if field type doesn't use options
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
      testName: schema.testName.trim(),
      testDescription: schema.testDescription ? schema.testDescription.trim() : "",
      testId: selectedTest, // NEW: Add the selected test ID
      categoryId: selectedCategory, // NEW: Add the selected category ID
    };

    // Clean and add fields
    if (schema.fields && schema.fields.length > 0) {
      cleanedSchema.fields = schema.fields.map(cleanFieldData);
    }

    // Clean and add sections if using sections
    if (useSections && schema.sections && schema.sections.length > 0) {
      cleanedSchema.sections = schema.sections.map((section) => ({
        ...section,
        fields: section.fields.map(cleanFieldData),
      }));
    }

    // Add test standard range if enabled and valid
    if (useStandardRange) {
      const testStandardRangeData = { ...testStandardRange };

      // Convert options array to object for "options" type
      if (testStandardRangeData.type === "options" && testStandardRangeData.options.length > 0) {
        const optionsObj = {};
        testStandardRangeData.options.forEach((option) => {
          optionsObj[option.key] = option.value;
        });
        testStandardRangeData.options = optionsObj;
      }
      // Remove empty text for "text" type
      else if (
        testStandardRangeData.type === "text" &&
        (!testStandardRangeData.text || !testStandardRangeData.text.trim())
      ) {
        delete testStandardRangeData.text;
      }

      // Only include testStandardRange if it has valid data
      if (
        Object.keys(testStandardRangeData).length > 1 || // More than just "type"
        (testStandardRangeData.type === "text" && testStandardRangeData.text) ||
        (testStandardRangeData.type === "options" && testStandardRangeData.options)
      ) {
        cleanedSchema.testStandardRange = testStandardRangeData;
      }
    }

    return cleanedSchema;
  };

  const saveSchema = async () => {
    if (!schema.testName.trim()) {
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

      console.log("Saving schema:", cleanedSchema);

      // Call the backend service to save the schema
      await testSchemaService.addNew(cleanedSchema);
      setPopup({ type: "success", message: "Test schema saved successfully!" });
      // Optional: Reset the form after successful save
      resetForm();
    } catch (error) {
      console.error("Error saving schema:", error);
      setPopup({
        type: "error",
        message: "Error saving test schema. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Updated: Reset form function to clear category and test selection
  const resetForm = () => {
    setSchema({
      testName: "",
      testDescription: "",
      fields: [],
    });
    setUseSections(false);
    setUseStandardRange(false);
    setTestStandardRange({
      type: "options",
      options: [],
      text: "",
    });
    resetFieldForm();
    setCurrentSection({
      name: "",
      description: "",
    });
    setEditingSectionIndex(null);
    setEditingFieldId(null);
    // NEW: Reset category and test selection
    setSelectedCategory("");
    setSelectedTest("");
  };

  // Show loading screen while tests are loading
  if (testsLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 lg:p-6">
      {/* Loading Screen */}
      {isSaving && <LoadingScreen />}

      {/* Popup Component */}
      {popup && (
        <Popup
          type={popup.type}
          message={popup.message}
          onClose={() => setPopup(null)}
          onConfirm={popup.type === "confirmation" ? handleDelete : null}
        />
      )}

      <div className="max-w-7xl mx-auto space-y-3 sm:space-y-6">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 text-center sm:text-left px-2 sm:px-0">
          Lab Test Builder
        </h2>

        {/* NEW: Test Category and Test Selection */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm overflow-hidden">
          <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700">Test Selection</h3>
          </div>
          <div className="p-3 sm:p-4 lg:p-6 space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Test Category Selection */}
              <div className="flex flex-col sm:flex-row border border-gray-300 rounded-lg overflow-hidden bg-white">
                <label className="w-full sm:w-40 px-3 py-2 text-sm font-medium border-b sm:border-b-0 sm:border-r border-gray-300 bg-gray-50 flex items-center">
                  Test Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="flex-1 px-3 py-2 focus:outline-none bg-white"
                >
                  <option value="">Select a category</option>
                  {testCategories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Test Selection */}
              <div className="flex flex-col sm:flex-row border border-gray-300 rounded-lg overflow-hidden bg-white">
                <label className="w-full sm:w-40 px-3 py-2 text-sm font-medium border-b sm:border-b-0 sm:border-r border-gray-300 bg-gray-50 flex items-center">
                  Test
                </label>
                <select
                  value={selectedTest}
                  onChange={(e) => setSelectedTest(e.target.value)}
                  disabled={!selectedCategory}
                  className="flex-1 px-3 py-2 focus:outline-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select a test</option>
                  {availableTests.map((test) => (
                    <option key={test._id} value={test._id}>
                      {test.testName} {test.isOnline && "(Online)"}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Selected Test Info */}
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
                        <strong>{availableTests.find((test) => test._id === selectedTest)?.testName}</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Editing Banner */}
        {isEditing() && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-yellow-400">⚠️</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  {editingSectionIndex !== null ? "Editing Section" : "Editing Field"}
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    You are currently in edit mode.{" "}
                    {editingSectionIndex !== null
                      ? "Make your changes to the section and click 'Update Section' to save."
                      : "Make your changes to the field and click 'Update Field' to save."}
                  </p>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={editingSectionIndex !== null ? cancelEditingSection : cancelEditingField}
                    className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                  >
                    Cancel Editing
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

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
                  label="Test Name"
                  name="testName"
                  value={schema.testName}
                  onChange={(e) => setSchema((prev) => ({ ...prev, testName: e.target.value }))}
                />
                <InputField
                  label="Test Description"
                  name="testDescription"
                  value={schema.testDescription}
                  onChange={(e) => setSchema((prev) => ({ ...prev, testDescription: e.target.value }))}
                />
              </div>
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

                <div className="flex flex-col sm:flex-row border border-gray-300 rounded-lg overflow-hidden bg-white">
                  <label className="w-full sm:w-32 px-3 py-2 text-sm font-medium border-b sm:border-b-0 sm:border-r border-gray-300 bg-gray-50 flex items-center">
                    Standard Range Type
                  </label>
                  <select
                    value={testStandardRange.type}
                    onChange={(e) =>
                      setTestStandardRange((prev) => ({ ...prev, type: e.target.value, options: [], text: "" }))
                    }
                    className="flex-1 px-3 py-2 focus:outline-none bg-white"
                  >
                    <option value="options">Key-Value Options</option>
                    <option value="text">Text Standard Range</option>
                  </select>
                </div>

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
                      onChange={(e) => setTestStandardRange((prev) => ({ ...prev, text: e.target.value }))}
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
                  {/* Section Inputs in a row for desktop */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    <InputField
                      label="Section Name"
                      name="sectionName"
                      value={currentSection.name}
                      onChange={(e) => setCurrentSection((prev) => ({ ...prev, name: e.target.value }))}
                    />
                    <InputField
                      label="Description"
                      name="sectionDescription"
                      value={currentSection.description}
                      onChange={(e) => setCurrentSection((prev) => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={editingSectionIndex !== null ? updateSection : addSection}
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

                {/* Existing Sections - Updated layout */}
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
                            {/* Section Name and Description in a row for desktop */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4 flex-1">
                              <div>
                                <h6 className="font-medium text-gray-800 text-sm sm:text-base">{section.name}</h6>
                                <p className="text-xs text-gray-500 mt-1">ID: {section.id}</p>
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
                  <div className="flex flex-col sm:flex-row border border-gray-300 rounded-lg overflow-hidden bg-white">
                    <label className="w-full sm:w-32 px-3 py-2 text-sm font-medium border-b sm:border-b-0 sm:border-r border-gray-300 bg-gray-50 flex items-center">
                      Section
                    </label>
                    <select
                      value={currentField.sectionId}
                      onChange={(e) => setCurrentField((prev) => ({ ...prev, sectionId: e.target.value }))}
                      className="flex-1 px-3 py-2 focus:outline-none text-sm bg-white"
                    >
                      <option value="">Choose a section</option>
                      {schema.sections.map((section, index) => (
                        <option key={section.id} value={section.id}>
                          {section.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Redesigned layout: Field Name and Type in first row, Required and Unit in second row */}
                <div className="space-y-3">
                  {/* First Row: Field Name and Type */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    <InputField
                      label="Field Name"
                      name="fieldLabel"
                      value={currentField.label}
                      onChange={(e) => setCurrentField((prev) => ({ ...prev, label: e.target.value }))}
                    />

                    <div className="flex flex-col sm:flex-row border border-gray-300 rounded-lg overflow-hidden bg-white">
                      <label className="w-full sm:w-32 px-3 py-2 text-sm font-medium border-b sm:border-b-0 sm:border-r border-gray-300 bg-gray-50 flex items-center">
                        Type
                      </label>
                      <select
                        value={currentField.type}
                        onChange={(e) => {
                          const newType = e.target.value;
                          setCurrentField((prev) => ({
                            ...prev,
                            type: newType,
                            // Reset standard range when switching to non-number type
                            standardRange: newType === "number" ? prev.standardRange : null,
                            // Reset options when switching to non-option types
                            options: ["radio", "select", "checkbox"].includes(newType) ? prev.options : [],
                          }));
                        }}
                        className="flex-1 px-3 py-2 focus:outline-none text-sm bg-white"
                      >
                        {fieldTypes.map((type) => (
                          <option key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Second Row: Required and Unit */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {/* Changed Required from checkbox to Yes/No select */}
                    <div className="flex flex-col sm:flex-row border border-gray-300 rounded-lg overflow-hidden bg-white">
                      <label className="w-full sm:w-32 px-3 py-2 text-sm font-medium border-b sm:border-b-0 sm:border-r border-gray-300 bg-gray-50 flex items-center">
                        Required
                      </label>
                      <select
                        value={currentField.required}
                        onChange={(e) => setCurrentField((prev) => ({ ...prev, required: e.target.value }))}
                        className="flex-1 px-3 py-2 focus:outline-none text-sm bg-white"
                      >
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </select>
                    </div>

                    <div className="flex flex-col sm:flex-row border border-gray-300 rounded-lg overflow-hidden bg-white">
                      <label className="w-full sm:w-32 px-3 py-2 text-sm font-medium border-b sm:border-b-0 sm:border-r border-gray-300 bg-gray-50 flex items-center">
                        Unit
                      </label>
                      <select
                        value={currentField.unit}
                        onChange={(e) => setCurrentField((prev) => ({ ...prev, unit: e.target.value }))}
                        className="flex-1 px-3 py-2 focus:outline-none text-sm bg-white"
                      >
                        {commonUnits.map((unit) => (
                          <option key={unit} value={unit}>
                            {unit || "No Unit"}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Field Options for Radio/Select/Checkbox */}
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

                {/* Field Standard Range Values Section - Only show for number fields */}
                {currentField.type === "number" && (
                  <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
                    <div className="flex flex-col sm:flex-row border-b border-gray-300">
                      <label className="w-full sm:w-32 px-3 py-2 text-sm font-medium border-b sm:border-b-0 sm:border-r border-gray-300 bg-gray-50 flex items-center">
                        Standard Range
                      </label>
                      <div className="flex-1 p-3 space-y-4">
                        <div className="flex flex-col sm:flex-row border border-gray-300 rounded-lg overflow-hidden">
                          <label className="w-full sm:w-32 px-3 py-2 text-sm font-medium border-b sm:border-b-0 sm:border-r border-gray-300 bg-gray-50 flex items-center">
                            Type
                          </label>
                          <select
                            value={currentField.standardRange?.type || "none"}
                            onChange={(e) => {
                              if (e.target.value === "none") {
                                setCurrentField((prev) => ({ ...prev, standardRange: null }));
                              } else {
                                initializeStandardRange(e.target.value);
                              }
                            }}
                            className="flex-1 px-3 py-2 focus:outline-none text-sm bg-white"
                          >
                            {standardRangeTypes.map((ref) => (
                              <option key={ref.value} value={ref.value}>
                                {ref.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Gender Based Standard Range */}
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

                        {/* Age Based Standard Range - Improved design */}
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

                        {/* Gender and Age Based Standard Range - Improved design */}
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

                        {/* Number Range Only */}
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

                        {/* Textarea Standard Range */}
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
                    onClick={editingFieldId ? updateField : addField}
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

            {/* Save Schema Button */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={saveSchema}
                disabled={
                  isSaving || !schema.testName.trim() || !selectedCategory || !selectedTest || getFieldsCount() === 0
                }
                className="w-full sm:w-64 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 font-medium text-sm sm:text-base disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isSaving ? "Saving..." : "Save Schema"}
              </button>
            </div>
          </div>
        </div>

        {/* Form Preview Section - Updated to pass editing functions */}
        <FormPreview
          schema={schema}
          useSections={useSections}
          useStandardRange={useStandardRange}
          testStandardRange={testStandardRange}
          removeField={removeField}
          getFieldsCount={getFieldsCount}
          startEditingField={startEditingField}
        />

        {/* Schema Display Section */}
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

export default SchemaBuilderForLabTest;
