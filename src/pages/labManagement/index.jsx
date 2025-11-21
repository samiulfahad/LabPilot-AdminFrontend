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
import AddSupportAdminForm from "./AddSupportAdmin";

const LabManagement = () => {
  const {
    modal,
    loading,
    popup,
    closePopup,
    labs,
    loadLabs,

    activateLab,
    deactivateLab,

    activateAdmin,
    deactivateAdmin,
    deleteAdmin,

    activateStaff,
    deactivateStaff,
    deleteStaff,

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
      {/* Deactivate Admin */}
      {popup && popup.type === "confirmation" && popup.action === "deactivateAdmin" && (
        <Popup type="confirmation" message={popup.message} onConfirm={deactivateAdmin} onClose={closePopup} />
      )}
      {/* Activate Admin */}
      {popup && popup.type === "confirmation" && popup.action === "activateAdmin" && (
        <Popup type="confirmation" message={popup.message} onConfirm={activateAdmin} onClose={closePopup} />
      )}
      {/* Delete Admin */}
      {popup && popup.type === "confirmation" && popup.action === "deleteAdmin" && (
        <Popup type="confirmation" message={popup.message} onConfirm={deleteAdmin} onClose={closePopup} />
      )}

      {/* Deactivate Staff */}
      {popup && popup.type === "confirmation" && popup.action === "deactivateStaff" && (
        <Popup type="confirmation" message={popup.message} onConfirm={deactivateStaff} onClose={closePopup} />
      )}
      {/* Activate Staff */}
      {popup && popup.type === "confirmation" && popup.action === "activateStaff" && (
        <Popup type="confirmation" message={popup.message} onConfirm={activateStaff} onClose={closePopup} />
      )}
      {/* Delete Staff */}
      {popup && popup.type === "confirmation" && popup.action === "deleteStaff" && (
        <Popup type="confirmation" message={popup.message} onConfirm={deleteStaff} onClose={closePopup} />
      )}

      {popup && popup.type === "confirmation" && popup.action === "activateLab" && (
        <Popup type="confirmation" message={popup.message} onConfirm={activateLab} onClose={closePopup} />
      )}

      {popup && popup.type === "confirmation" && popup.action === "deactivateLab" && (
        <Popup type="confirmation" message={popup.message} onConfirm={deactivateLab} onClose={closePopup} />
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

      <Modal isOpen={modal.view === "addSupportAdminForm"}>
        <AddSupportAdminForm />
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
