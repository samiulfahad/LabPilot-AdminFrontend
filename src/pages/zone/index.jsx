import { useState, useEffect } from "react";

import zoneService from "../../services/zoneService";
import Modal from "../../components/modal";
import ZoneForm from "./ZoneForm";
import Zone from "./Zone";
import Popup from "../../components/popup/Popup";
import LoadingScreen from "../../components/loadingPage";

const Zones = () => {
  const [zones, setZones] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState(null);
  const [form, setForm] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (form.type === "addZone") {
        const response = await zoneService.addZone({ zoneName: form.input });
        // Push the new zone to zones array without reloading
        setZones((prevZones) => [...prevZones, response.data.zone]);
        setPopup({ type: "success", message: "Zone Added Successfully" });
      }

      if (form.type === "editZone") {
        const response = await zoneService.editZone({
          zoneId: form.zoneId,
          zoneName: form.input,
        });
        // console.log(response);
        // Update the edited zone in the DOM
        setZones((prevZones) =>
          prevZones.map((zone) => (zone._id === form.zoneId ? { ...zone, zoneName: form.input } : zone))
        );
        setPopup({ type: "success", message: "Zone renamed successfully" });
      }

      if (form.type === "addSubZone") {
        const data = { zoneId: form.zoneId, subZoneName: form.input };
        // console.log(data);
        const response = await zoneService.addSubZone(data);
        // console.log(response.data);
        setZones((prevZones) => prevZones.map((zone) => (zone._id === response.data._id ? response.data : zone)));
        setPopup({ type: "success", message: "Sub Zone added successfully" });
      }

      if (form.type === "editSubZone") {
        const data = { zoneId: form.zoneId, subZoneId: form.subZoneId, subZoneName: form.input };
        // console.log(data);
        const response = await zoneService.editSubZone(data);
        // console.log(response.data);
        setZones((prevZones) => prevZones.map((zone) => (zone._id === response.data._id ? response.data : zone)));
        setPopup({ type: "success", message: "Sub Zone added successfully" });
      }

      setForm(null);
      setIsModalOpen(false);
    } catch (e) {
      // console.log(e.response.data.duplicate);
      let message = "Could not complete operation";
      if (e.response?.data?.duplicate) message = "This name is already present";
      setPopup({ type: "error", message: message });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      if (popup.delete === "zone") {
        const response = await zoneService.deleteZone(popup.zoneId);
        // Remove the zone from the array without reloading
        setZones((prevZones) => prevZones.filter((zone) => zone._id !== popup.zoneId));
        setPopup({ type: "success", message: "Zone Deleted Successfully" });
      }

      if (popup.delete === "subZone") {
        const response = await zoneService.deleteSubZone(popup.zoneId, popup.subZoneId);
        // Remove the subzone from the array without reloading
        setZones((prevZones) =>
          prevZones.map((zone) =>
            zone._id === popup.zoneId
              ? {
                  ...zone,
                  subZones: zone.subZones.filter((subZone) => subZone._id !== popup.subZoneId),
                }
              : zone
          )
        );
        setPopup({ type: "success", message: "Sub Zone Deleted Successfully" });
      }
    } catch (e) {
      setPopup({
        type: "error",
        message: "Something went wrong. Item was not deleted",
      });
      // console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setForm(null);
  };

  const loadZones = async () => {
    try {
      setLoading(true);
      const response = await zoneService.getZones();
      setZones(response.data.zones);
      // console.log(response.data);
    } catch (err) {
      setPopup({ type: "error", message: "Could not load zones" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadZones();
  }, []);
  return (
    <section>
      {loading && <LoadingScreen />}
      {popup && (
        <Popup
          type={popup.type}
          message={popup.message}
          onClose={() => setPopup(null)}
          onConfirm={handleDelete}
          confirmText="Yes, Delete"
        />
      )}
      <div className="space-y-4 -mt-2">
        <div className="min-w-full flex justify-center items-center">
          <button
            onClick={() => {
              setIsModalOpen(true);
              setForm({ type: "addZone" });
            }}
            className="btn-sm flex"
          >
            Add New Zone
          </button>
        </div>
        {/* Modal */}
        <Modal isOpen={isModalOpen} size="sm">
          <ZoneForm
            onSubmit={handleSubmit}
            type={form?.type}
            input={form?.input || ""}
            handleInput={(e) => setForm((prev) => ({ ...prev, input: e.target.value }))}
            onClose={handleClose}
          />
        </Modal>
        {zones.map((zone) => (
          <Zone
            key={zone._id}
            name={zone.zoneName}
            subZones={zone.subZones}
            onEditZone={() => {
              setForm({
                input: zone.zoneName,
                type: "editZone",
                zoneId: zone._id,
              });
              setIsModalOpen(true);
            }}
            onEditSubZone={(subZoneId, subZoneName) => {
              setForm({
                input: subZoneName,
                type: "editSubZone",
                zoneId: zone._id,
                subZoneId: subZoneId,
              });
              setIsModalOpen(true);
            }}
            onAddSubZone={() => {
              setForm({ type: "addSubZone", zoneId: zone._id });
              setIsModalOpen(true);
            }}
            onDeleteZone={() => {
              setPopup({
                type: "confirmation",
                message: `You are going to delete ${zone.zoneName} zone`,
                zoneId: zone._id,
                delete: "zone",
              });
            }}
            onDeleteSubZone={(subZoneId, subZoneName) => {
              setPopup({
                type: "confirmation",
                message: `You are going to delete sub zone ${subZoneName} under zone ${zone.zoneName}`,
                zoneId: zone._id,
                subZoneId: subZoneId,
                delete: "subZone",
              });
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default Zones;
