import { useEffect, useState } from "react";
import LoadingScreen from "../../components/loadingPage";
import Popup from "../../components/popup/Popup";
import Modal from "../../components/modal";
import useStore from "./store";
import Icons from "../../components/icons"; // Import the icons

import TestCard from "./TestCard";
import TestForm from "./FormTest";
import CategoryForm from "./FormCategory";
import CategoryCard from "./CategoryCard";
import Container from "./Container";

const TestList = () => {
  const [activeView, setActiveView] = useState("container"); // container, testList, categoryList
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

  const {
    populatedList,
    populateCategory,
    testList,
    loadTestList,
    deleteTest,
    categoryList,
    loadCategoryList,
    deleteCategory,
    loading,
    modal,
    setModal,
    popup,
    closePopup,
  } = useStore();

  useEffect(() => {
    populateCategory();
  }, []);

  // Handle view changes
  const switchView = (view) => {
    setActiveView(view);
    if (view === "testList") {
      loadTestList();
    } else if (view === "categoryList") {
      loadCategoryList();
    }
    setIsAddMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      {loading && <LoadingScreen />}

      {/* Popups */}
      {popup && popup.type === "confirmation" && popup.action === "deleteTest" && (
        <Popup type="confirmation" message={popup.message} onConfirm={deleteTest} onClose={closePopup} />
      )}
      {popup && popup.type === "confirmation" && popup.action === "deleteCategory" && (
        <Popup type="confirmation" message={popup.message} onConfirm={deleteCategory} onClose={closePopup} />
      )}
      {popup && popup.type === "success" && <Popup type="success" message={popup.message} onClose={closePopup} />}
      {popup && popup.type === "error" && <Popup type="error" message={popup.message} onClose={closePopup} />}

      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Management</h1>
            </div>

            {/* Add Menu */}
            <div className="relative">
              <button
                onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
              >
                <Icons.Add className="w-5 h-5" />
                Add New
              </button>

              {isAddMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                  <button
                    onClick={() => {
                      setModal({ view: "addTest" });
                      setIsAddMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-blue-50 text-gray-700 hover:text-blue-700 transition-colors flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Icons.Add className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">Add New Test</div>
                      <div className="text-xs text-gray-500">Create a new diagnostic test</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setModal({ view: "addCategory" });
                      setIsAddMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-purple-50 text-gray-700 hover:text-purple-700 transition-colors flex items-center gap-3 border-t border-gray-100"
                  >
                    <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                      <Icons.Folder className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium">Add New Category</div>
                      <div className="text-xs text-gray-500">Create a test category</div>
                    </div>
                  </button>

                  <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 text-xs text-gray-500">
                    Quick add options
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-2">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => switchView("container")}
                className={`px-5 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  activeView === "container" ? "bg-blue-100 text-blue-700 shadow-sm" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${activeView === "container" ? "bg-blue-500" : "bg-gray-300"}`}
                ></div>
                Category View
                {activeView === "container" && (
                  <span className="px-2 py-0.5 bg-blue-200 text-blue-800 text-xs rounded-full">
                    {populatedList?.length || 0}
                  </span>
                )}
              </button>

              <button
                onClick={() => switchView("testList")}
                className={`px-5 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  activeView === "testList"
                    ? "bg-green-100 text-green-700 shadow-sm"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${activeView === "testList" ? "bg-green-500" : "bg-gray-300"}`}
                ></div>
                All Tests
                {activeView === "testList" && (
                  <span className="px-2 py-0.5 bg-green-200 text-green-800 text-xs rounded-full">
                    {testList?.length || 0}
                  </span>
                )}
              </button>

              <button
                onClick={() => switchView("categoryList")}
                className={`px-5 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  activeView === "categoryList"
                    ? "bg-purple-100 text-purple-700 shadow-sm"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${activeView === "categoryList" ? "bg-purple-500" : "bg-gray-300"}`}
                ></div>
                Categories
                {activeView === "categoryList" && (
                  <span className="px-2 py-0.5 bg-purple-200 text-purple-800 text-xs rounded-full">
                    {categoryList?.length || 0}
                  </span>
                )}
              </button>

              <div className="flex-1 flex justify-end gap-2">
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <Icons.Refresh className="w-4 h-4" />
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{categoryList?.length || 0}</div>
                <div className="text-sm text-gray-500">Total Categories</div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                <span className="text-2xl">📁</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{testList?.length || 0}</div>
                <div className="text-sm text-gray-500">Total Tests</div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                <span className="text-2xl">🧪</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {testList?.filter((t) => t.schemaId)?.length || 0}
                </div>
                <div className="text-sm text-gray-500">Active Tests</div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Content Header */}
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {activeView === "container" && "Category-wise Tests"}
                  {activeView === "testList" && "All Tests"}
                  {activeView === "categoryList" && "Categories"}
                </h2>
              </div>

              <div className="flex items-center gap-3">
                {activeView !== "container" && (
                  <div className="text-sm text-gray-500">
                    Showing {(activeView === "testList" ? testList : categoryList)?.length || 0} items
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-6">
            {activeView === "container" && <Container list={populatedList} />}

            {activeView === "testList" && (
              <div>
                {testList.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icons.EmptyState className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No tests found</h3>
                    <p className="text-gray-500 mb-4">Add your first test to get started</p>
                    <button
                      onClick={() => setModal({ view: "addTest" })}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add New Test
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {testList.map((test) => (
                      <TestCard key={test._id} test={test} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeView === "categoryList" && (
              <div>
                {categoryList.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icons.EmptyState className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No categories found</h3>
                    <p className="text-gray-500 mb-4">Add your first category to get started</p>
                    <button
                      onClick={() => setModal({ view: "addCategory" })}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add New Category
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryList.map((category) => (
                      <CategoryCard key={category._id} category={category} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal isOpen={modal.view === "addTest" || modal.view === "editTest"}>
        <TestForm />
      </Modal>

      <Modal isOpen={modal.view === "addCategory" || modal.view === "editCategory"}>
        <CategoryForm />
      </Modal>
    </div>
  );
};

export default TestList;
