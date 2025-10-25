import { useState, useEffect } from "react";

import zoneService from "../../services/zoneService";
import Modal from "../../components/modal";
import ZoneForm from "./ZoneForm";
import Zone from "./Zone";
import Popup from "../../components/Popup";

const Zones = () => {
  const [zones, setZones] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState(null);
  const [form, setForm] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    console.log("Zone data:", data);
    setIsModalOpen(false);
    try {
      setLoading(true);
      if (form.type === "addZone") {
        const response = await zoneService.addZone(data);
        // Push the new zone to zones array without reloading
        setZones((prevZones) => [...prevZones, response.data.zone]);
        //   console.log(response.data.zone);
        setPopup({ type: "success", message: "Zone Added Successfully" });
        // console.log(response.data);
      }

      if (form.type === "renameZone") {
        const response = await zoneService.editZone({
          zoneId: form.zoneId,
          zoneName: data.zoneName,
        });
        setForm(null);
        setPopup({ type: "success", message: "Zone renamed successfully" });
        // Update the renamed zone in the DOM
        setZones((prevZones) =>
          prevZones.map((zone) =>
            zone._id === form.zoneId
              ? { ...zone, zoneName: data.zoneName }
              : zone
          )
        );
      }
    } catch {
      setPopup({ type: "error", message: "Could not add zone" });
    } finally {
      setForm(null)
    }
  };

  const handleDeleteZone = async () => {
    try {
      setLoading(true);
      const response = await zoneService.deleteZone(popup.zoneId);
      // Remove the zone from the array without reloading
      setZones((prevZones) =>
        prevZones.filter((zone) => zone._id !== popup.zoneId)
      );
      setPopup({ type: "success", message: "Zone Deleted Successfully" });
    } catch (e) {
      setPopup({
        type: "error",
        message: "Something went wrong. Zone was not deleted",
      });
      console.log(e);
    }
  };

  const loadZones = async () => {
    try {
      setLoading(true);
      const response = await zoneService.getZones();
      setZones(response.data.zones);
      console.log(response.data);
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
    <div className="p-8 space-y-4">
      <div className="min-w-full flex justify-center items-center">
        <button
          onClick={() => {
            setIsModalOpen(true);
            setForm({ type: "addZone" });
          }}
          className="btn-sm"
        >
          Add New Zone
        </button>
      </div>

      {popup && (
        <Popup
          type={popup.type}
          message={popup.message}
          onClose={() => setPopup(null)}
          onConfirm={handleDeleteZone}
          confirmText="Yes, Delete"
        />
      )}
      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Zone Management"
        size="sm"
      >
        <ZoneForm onSubmit={handleSubmit} type={form?.type} />
      </Modal>
      {zones.map((zone) => (
        <Zone
          key={zone._id}
          name={zone.zoneName}
          totalSubZone={zone.subZones.length}
          onEdit={() => {
            setForm({ type: "renameZone", zoneId: zone._id });
            setIsModalOpen(true);
          }}
          onAddSubZone={() => {
            setForm({ type: "addSubZone" });
            setIsModalOpen(true);
          }}
          onDelete={() => {
            setPopup({
              type: "confirmation",
              message: `You are going to delete ${zone.zoneName} zone`,
              zoneId: zone._id,
            });
          }}
        />
      ))}
    </div>
  );
};

export default Zones;
