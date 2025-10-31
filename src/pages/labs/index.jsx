import { useEffect, useState } from "react";
import labService from "../../services/labSevice";
import Modal from "../../components/modal";
import Popup from "../../components/Popup";
import Lab from "./Lab";
import LabForm from "./LabForm";
import zoneService from "../../services/zoneService";

const initialData = {
  labName: "",
  labId: "",
  address: "",
  contact1: "",
  contact2: "",
  email: "",
  zoneId: "",
  subZoneId: "",
  isActive: true,
};
const Labs = () => {
  const [labs, setLabs] = useState([]);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(initialData);

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let req = "addLab";
    if (formData.type === "editLab") req = "editLab";
    delete formData.type;
    setLoading(true);
    try {
      if (req === "addLab") {
        const response = await labService.addLab(formData);
        // Add the new lab to the state without reloading
        if (response.data.success && response.data.lab) {
          setLabs((prev) => [...prev, response.data.lab]);
        }
      }

      if (req === "editLab") {
        console.log(formData);
        await labService.editLab(formData);
        // Update the edited document without reload
        setLabs((prev) => {
          return prev.map((item) => (item._id === formData._id ? { ...item, ...formData } : item));
        });
      }
      setIsModalOpen(false);
      setFormData(initialData);
      // setPopup({type: 'success', message: "Operation Done Successfully"})
    } catch (e) {
      console.log(e);
      let message = "Could not add lab";
      if (req === "editLab") message = "Could not edit lab";
      if (e.response?.data?.duplicate) {
        message = "Lab ID is not unique";
      }
      setPopup({ type: "error", message: message });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setFormData(initialData);
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await labService.deleteLab(popup._id);
      // Remove lab dynamically without reload
      setLabs((prev) => prev.filter((lab) => lab._id !== popup._id));
      setPopup({ type: "success", message: "Lab deleted successfully" });
    } catch (e) {
      setPopup({ type: "error", message: "Could not delete lab" });
    } finally {
      setLoading(false);
    }
  };

  const loadLabs = async () => {
    try {
      setLoading(true);
      const response = await labService.getLabs();
      setLabs(response.data.labs);
    } catch (e) {
      setPopup({ type: "error", message: "Could not load labs" });
    } finally {
      setLoading(false);
    }
  };

  const loadZones = async () => {
    try {
      setLoading(true);
      const response = await zoneService.getZones();
      setZones(response.data.zones);
    } catch (e) {
      setPopup({ type: "error", message: "Could not load zones" });
      setIsModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLabs();
  }, []);

  return (
    <section>
      {popup && (
        <Popup
          type={popup.type}
          message={popup.message}
          onClose={() => setPopup(null)}
          onConfirm={popup.type === "confirmation" ? handleDelete : null}
        />
      )}

      <div className="flex items-center justify-center -mt-4 my-2">
        <button
          onClick={() => {
            setFormData((prev) => ({ ...prev, type: "addLab" }));
            setIsModalOpen(true);
            loadZones();
          }}
          className="btn-md w-60 mx-auto"
        >
          Add new Lab
        </button>
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} size="lg">
        <LabForm
          formData={formData}
          onChange={handleFormChange}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          type={formData.type}
          zones={zones}
        />
      </Modal>

      {labs.map((item, index) => (
        <Lab
          key={item._id}
          input={item}
          index={index}
          onEdit={() => {
            loadZones();
            setFormData({ ...item, type: "editLab", _id: item._id });
            setIsModalOpen(true);
          }}
          onDelete={() =>
            setPopup({
              type: "confirmation",
              message: `Do you want to delete the following lab ${item.labName}`,
              _id: item._id,
            })
          }
        />
      ))}
    </section>
  );
};

export default Labs;
