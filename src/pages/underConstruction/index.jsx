import { useEffect, useState } from "react";
import InputField from "../../components/html/InputField";
import SelectField from "../../components/html/SelectField";
import TextAreaField from "../../components/html/TextAreaField";
import useStore from "./store";
import Popup from "../../components/popup/Popup";
import LoadingScreen from "../../components/loadingPage";
import SchemaInfo from "./SchemaInfo";
import SelectTest from "./SelectTest";
import Status from "./Status";
import Section from "./Section";
import SchemaPreview from "./SchemaPreview";
import StandardRange from "./StandardRange";

const UnderConstruction = () => {
  const {
    schema,
    setSchema,
    addSection,
    deleteSection,
    updateSection,
    testList,
    loadTestList,
    popup,
    closePopup,
    loading,
    clearStandardRange,
    confirmRemoveStandardRange,
  } = useStore();

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {loading && <LoadingScreen />}

      {/* Popups */}
      {popup && popup.type === "success" && <Popup type="success" message={popup.message} onClose={closePopup} />}
      {popup && popup.type === "error" && <Popup type="error" message={popup.message} onClose={closePopup} />}
      {popup && popup.type === "confirmation" && (
        <Popup type="confirmation" message={popup.message} onClose={closePopup} onConfirm={popup.onConfirm} />
      )}
      {popup && popup.type === "confirmation" && popup.action === "deleteSection" && (
        <Popup
          type="confirmation"
          message={popup.message}
          onClose={closePopup}
          onConfirm={() => deleteSection(popup.data)}
        />
      )}

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-2">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Schema Builder</h1>
        </div>
        {/* Row 1: Schema Name and Test Name */}
        <SchemaInfo />

        {/* Row 2: Test Category & Test Selection */}
        <SelectTest />

        {/* Row 3: Status Toggle */}
        <Status />
        {/* Row 4: Sections */}
        <Section />

        {/* Row 5: Standard Range */}
        <StandardRange />

        {/* Row 6: Schema Preview */}
        <SchemaPreview />
      </div>
    </div>
  );
};

export default UnderConstruction;
