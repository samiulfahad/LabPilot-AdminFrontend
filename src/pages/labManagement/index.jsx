import { useEffect, useState } from "react";
import labService from "../../services/labSevice";
import Lab from "./Lab";
import Modal from "../../components/modal";
import View from "./View";
import AdminForm from "./AdminForm";
import labAdminService from "../../services/labAdminService";
import useLabManagementStore from "../../store/local/labManagementStore";
import LoadingScreen from "../../components/loadingPage";

const LabManagement = () => {
  const { loading, labs, loadLabs, activeModal, clearState } = useLabManagementStore();

  useEffect(() => {
    loadLabs();
    return () => {
      clearState();
    };
  }, []);

  return (
    <section className="min-h-screen">
      {loading && <LoadingScreen />}
      <Modal isOpen={activeModal === "view"}>
        <View />
      </Modal>

      <Modal isOpen={activeModal === "addAdmin"}>
        <AdminForm  />
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
