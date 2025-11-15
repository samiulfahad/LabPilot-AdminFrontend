import { useEffect, useState } from "react";
import Lab from "./Lab";
import Modal from "../../components/modal";
import Popup from "../../components/popup/Popup";
import AdminForm from "./AdminForm";
import useLabManagementStore from "./store";
import LoadingScreen from "../../components/loadingPage";
import ViewAdmin from "./ViewAdmin";
import ViewLabDetails from "./ViewLabDetails";
import ViewStaff from "./ViewStaff";
import StaffForm from "./StaffForm";

const LabManagement = () => {
  const {
    loading,
    popup,
    popupMessage,
    closePopup,
    labs,
    loadLabs,
    activeModal,
    deleteStaff,
    deleteAdmin,
    clearState,
  } = useLabManagementStore();

  useEffect(() => {
    loadLabs();
    return () => {
      clearState();
    };
  }, []);

  return (
    <section className="min-h-screen">
      {loading && <LoadingScreen />}
      {popup === "error" && <Popup type="error" message={popupMessage} onClose={closePopup} />}
      {popup === "deleteStaff" && (
        <Popup type="deleteStaff" message={popupMessage} onConfirm={deleteStaff} onClose={closePopup} />
      )}

      {popup === "deleteAdmin" && (
        <Popup type="deleteAdmin" message={popupMessage} onConfirm={deleteAdmin} onClose={closePopup} />
      )}
      {popup === "success" && <Popup type="success" message={popupMessage} onClose={closePopup} />}
      <Modal isOpen={activeModal === "viewAdmin"}>
        <ViewAdmin />
      </Modal>

      <Modal isOpen={activeModal === "viewStaff"}>
        <ViewStaff />
      </Modal>

      <Modal isOpen={activeModal === "viewLabDetails"} size="lg">
        <ViewLabDetails />
      </Modal>

      <Modal isOpen={activeModal === "addAdmin"}>
        <AdminForm />
      </Modal>

      <Modal isOpen={activeModal === "addStaff"}>
        <StaffForm />
      </Modal>

      <div className="max-w-6xl mx-auto">
        <div className="grid gap-6">
          {labs.map((lab) => (
            <Lab key={lab._id} lab={lab} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LabManagement;
