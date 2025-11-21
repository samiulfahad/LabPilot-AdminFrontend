import { useEffect } from "react";
import Lab from "./Lab";
import Modal from "../../components/modal";
import Popup from "../../components/popup/Popup";
import AddAdmin from "./AddAdmin";
import AddStaff from "./AddStaff";
import useLabManagementStore from "./store";
import LoadingScreen from "../../components/loadingPage";
import ViewAdmin from "./ViewAdmin";
import ViewLabDetails from "./ViewLabDetails";
import ViewStaff from "./ViewStaff";

const LabManagement = () => {
  const {
    loading,
    popup,
    modal,
    closePopup,
    labs,
    loadLabs,
    deactivateLab,
    activateLab,
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

      {popup && popup.type === "confirmation" && popup.action === "deleteAdmin" && (
        <Popup type="confirmation" message={popup.message} onConfirm={deleteAdmin} onClose={closePopup} />
      )}

      {popup && popup.type === "confirmation" && popup.action === "deleteStaff" && (
        <Popup type="confirmation" message={popup.message} onConfirm={deleteStaff} onClose={closePopup} />
      )}

      {popup && popup.type === "confirmation" && popup.action === "deactivateLab" && (
        <Popup type="confirmation" message={popup.message} onConfirm={deactivateLab} onClose={closePopup} />
      )}

      {popup && popup.type === "confirmation" && popup.action === "activateLab" && (
        <Popup type="confirmation" message={popup.message} onConfirm={activateLab} onClose={closePopup} />
      )}

      {popup && popup.type === "success" && <Popup type="success" message={popup.message} onClose={closePopup} />}
      {popup && popup.type === "error" && <Popup type="error" message={popup.message} onClose={closePopup} />}

      <Modal isOpen={modal.view === "admin"}>
        <ViewAdmin />
      </Modal>

      <Modal isOpen={modal.view === "staff"}>
        <ViewStaff />
      </Modal>

      <Modal isOpen={modal.view === "labDetails"} size="lg">
        <ViewLabDetails />
      </Modal>

      <Modal isOpen={modal.view === "addAdminForm"}>
        <AddAdmin />
      </Modal>

      <Modal isOpen={modal.view === "addStaffForm"}>
        <AddStaff />
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
