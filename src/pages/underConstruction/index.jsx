import useStore from "./store";
import Popup from "../../components/popup/Popup";
import LoadingScreen from "../../components/loadingPage";
import SchemaInfo from "./SchemaInfo";
import SelectTest from "./SelectTest";
import Status from "./Status";
import Section from "./Section";
import SchemaPreview from "./SchemaPreview";
import StaticStandardRange from "./StaticStandardRange";
import AddField from "./AddField"; // Updated component
import FormPreview from "./FormPreview";
import FormRenderer from "./FormRenderer";

const UnderConstruction = () => {
  const { deleteSection, popup, closePopup, loading, modal } = useStore();

  return (
    <div className="min-h-screen bg-gray-50 pb-4 pt-2 md:p-6">
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

      {/* No more modal for addField; handled inline now */}

      <div className="max-w-4xl mx-auto space-y-6 -mt-3">
        {/* Header */}
        <div className="text-center mb-2">
          <h1 className="text-lg md:text-xl font-bold text-gray-800">Schema Engine</h1>
        </div>
        {/* Row 1: Schema Name and Test Name */}
        <SchemaInfo />

        {/* Row 2: Test Category & Test Selection */}
        <SelectTest />

        {/* Row 3: Status Toggle */}
        <Status />
        {/* Row 4: Sections */}
        <Section />

        {/* Row 4.5: Add Field (now with inline form) */}
        <AddField />

        {/* Row 5: Standard Range */}
        <StaticStandardRange />

        {/* Row 6: Preview Form */}
        <FormPreview />

        {/* Row 7: Preview Form */}
        <FormRenderer />

        {/* Row 8: Schema Preview */}
        <SchemaPreview />
      </div>
    </div>
  );
};

export default UnderConstruction;
