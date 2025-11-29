import { useEffect } from "react";
import useStore from "./store";
import Modal from "../../components/modal";
import CategoryForm from "./FormCategory";
import LoadingScreen from "../../components/loadingPage";
import Popup from "../../components/popup/Popup";
import TestForm from "./FormTest";
import CategoryCard from "./CategoryCard";

const TestList = () => {
  const { loading, categoryList, loadCategoryList, deleteCategory, deleteTest, modal, popup, closePopup, setModal } = useStore();

  useEffect(() => {
    loadCategoryList();
  }, []);

  return (
    <div>
      {loading && <LoadingScreen />}
      {popup && popup.type === "success" && <Popup type="success" message={popup.message} onClose={closePopup} />}
      {popup && popup.type === "error" && <Popup type="error" message={popup.message} onClose={closePopup} />}
      {popup && popup.type === "confirmation" && popup.action === "deleteCategoy" && (
        <Popup type="confirmation" message={popup.message} onConfirm={deleteCategory} onClose={closePopup} />
      )}

      {popup && popup.type === "confirmation" && popup.action === "deleteTest" && (
        <Popup type="confirmation" message={popup.message} onConfirm={deleteTest} onClose={closePopup} />
      )}
      <div>
        <button onClick={() => setModal({ view: "addCategoryForm" })} className="add-brn">
          Add New Category
        </button>
      </div>
      <div className="max-w-md mx-auto">
        <CategoryCard categoryList={categoryList} />
      </div>

      <Modal isOpen={modal.view === "addCategoryForm"}>
        <CategoryForm />
      </Modal>
      <Modal isOpen={modal.view === "addTestForm"}>
        <TestForm />
      </Modal>
    </div>
  );
};

export default TestList;
