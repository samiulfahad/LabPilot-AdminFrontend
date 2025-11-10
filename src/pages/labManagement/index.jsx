import { useEffect, useState } from "react";
import Lab from "./Lab";
import Modal from "../../components/modal";
import Popup from "../../components/popup/Popup";
import AdminForm from "./AdminForm";
import useLabManagement from "./store";
import LoadingScreen from "../../components/loadingPage";
import ViewAdmin from "./ViewAdmin";
import ViewLabDetails from "./ViewLabDetails";
import ViewStaff from "./ViewStaff";

const LabManagement = () => {
  const { loading, popup, setActiveModal, error, labs, loadLabs, activeModal, clearState } =
    useLabManagement();

  useEffect(() => {
    loadLabs();
    return () => {
      clearState();
    };
  }, []);

  return (
    <section className="min-h-screen">
      {loading && <LoadingScreen />}
      {popup === "error" && <Popup type="error" message={error} />}
      <Modal isOpen={activeModal === "viewAdmin"}>
        <ViewAdmin />
      </Modal>

      <Modal isOpen={activeModal === "viewStaff"}>
        <ViewStaff />
      </Modal>

      <Modal isOpen={activeModal === "viewLabDetails"} onClose={() => setActiveModal(null, null)}>
        <ViewLabDetails />
      </Modal>

      <Modal isOpen={activeModal === "addAdmin"}>
        <AdminForm />
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
