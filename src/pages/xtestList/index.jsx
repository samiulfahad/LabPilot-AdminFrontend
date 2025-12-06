import { useEffect } from "react";
import useStore from "./store";
import Modal from "../../components/modal";
import CategoryForm from "./FormCategory";
import LoadingScreen from "../../components/loadingPage";
import Popup from "../../components/popup/Popup";
import TestForm from "./FormTest";
import CategoryCard from "./CategoryCard";
import SetSchemaForm from "./FormSetSchema";
import Icons from "../../components/icons";

const TestList = () => {
  const {
    loading,
    populateCategory,
    populatedList,
    loadTestList,
    deleteCategory,
    deleteTest,
    unsetSchema,
    modal,
    popup,
    closePopup,
    setModal,
  } = useStore();

  useEffect(() => {
    populateCategory();
  }, []);

  // const totalTests = list.reduce((acc, cat) => acc + cat.tests.length, 0);
  // const liveTests = list.reduce((acc, cat) => acc + cat.tests.filter((t) => t.schemaId).length, 0);
  // const setupTests = list.reduce((acc, cat) => acc + cat.tests.filter((t) => !t.schemaId).length, 0);

  return (
    <div className="min-h-screen bg-slate-50 py-6">
      {loading && <LoadingScreen />}

      {/* Popups */}
      {popup && popup.type === "success" && <Popup type="success" message={popup.message} onClose={closePopup} />}
      {popup && popup.type === "error" && <Popup type="error" message={popup.message} onClose={closePopup} />}
      {popup && popup.type === "confirmation" && popup.action === "deleteCategoy" && (
        <Popup type="confirmation" message={popup.message} onConfirm={deleteCategory} onClose={closePopup} />
      )}
      {popup && popup.type === "confirmation" && popup.action === "unsetSchema" && (
        <Popup type="confirmation" message={popup.message} onConfirm={unsetSchema} onClose={closePopup} />
      )}
      {popup && popup.type === "confirmation" && popup.action === "deleteTest" && (
        <Popup type="confirmation" message={popup.message} onConfirm={deleteTest} onClose={closePopup} />
      )}

      {/* Header */}
      <div>
        <button>Get All Test</button>
      </div>

      <CategoryCard categoryList={populatedList} />

      {/* Modals */}
      <Modal isOpen={modal.view === "addCategoryForm" || modal.view === "editCategoryForm"}>
        <CategoryForm />
      </Modal>

      <Modal isOpen={modal.view === "addTestForm" || modal.view === "editTestForm"}>
        <TestForm />
      </Modal>

      <Modal isOpen={modal.view === "setSchemaForm"}>
        <SetSchemaForm />
      </Modal>
    </div>
  );
};

export default TestList;
