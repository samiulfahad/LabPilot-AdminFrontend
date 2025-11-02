import { useEffect, useState } from "react";
import Modal from "../../components/modal";
import Category from "./Category";
import categoryService from "../../services/categoryService";
import Popup from "../../components/popup/Popup";
import Form from "./Form";
import LoadingScreen from "../../components/loadingPage";

const Tests = () => {
  const [activeModal, setActiveModal] = useState(null); // 'category', 'form', or null
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState(null);
  const [categories, setCategories] = useState([]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await categoryService.addCategory(formData);
      const newCategory = response.data;
      setCategories((prev) => [...prev, newCategory]);
      setActiveModal("category"); // Go back to category modal
      setPopup({ type: "success", message: "Category added successfully" });
    } catch (e) {
      console.error(e);
      setPopup({ type: "error", message: "Failed to add category" });
    }
  };


  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getCategories();
      setCategories(response.data);
    } catch (e) {
      console.log(e.response);
      setPopup({ type: "error", message: "Could not load categories" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <section>
      {loading && <LoadingScreen />}
      {popup && <Popup type={popup.type} message={popup.message} onClose={() => setPopup(null)} />}

      {categories.map(item => (<Category key={item._id} item={item}/>))}
    </section>
  );
};

export default Tests;
