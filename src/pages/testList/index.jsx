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
    categoryList,
    loadCategoryList,
    deleteCategory,
    deleteTest,
    unsetSchema,
    modal,
    popup,
    closePopup,
    setModal,
  } = useStore();

  useEffect(() => {
    loadCategoryList();
  }, []);

  const totalTests = categoryList.reduce((acc, cat) => acc + cat.tests.length, 0);
  const liveTests = categoryList.reduce((acc, cat) => acc + cat.tests.filter((t) => t.schemaId).length, 0);
  const setupTests = categoryList.reduce((acc, cat) => acc + cat.tests.filter((t) => !t.schemaId).length, 0);

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
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="bg-blue-600 p-2 rounded-xl">
                <Icons.Details className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Lab Test Management</h1>
              </div>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <button
              onClick={() => setModal({ view: "addCategoryForm", data: {} })}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-3 transition-colors shadow-sm hover:shadow-md w-full lg:w-auto justify-center"
            >
              <Icons.Add className="w-5 h-5" />
              New Category
            </button>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-lg p-3 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase font-medium">Categories</p>
                <p className="text-lg font-bold text-slate-900">{categoryList.length}</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-lg">
                <Icons.Star className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase font-medium">Live</p>
                <p className="text-lg font-bold text-slate-900">{liveTests}</p>
              </div>
              <div className="bg-green-100 p-2 rounded-lg">
                <Icons.PowerOn className="w-4 h-4 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase font-medium">Setup</p>
                <p className="text-lg font-bold text-slate-900">{setupTests}</p>
              </div>
              <div className="bg-yellow-100 p-2 rounded-lg">
                <Icons.PowerOff className="w-4 h-4 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4">
        <CategoryCard categoryList={categoryList} />
      </div>

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
