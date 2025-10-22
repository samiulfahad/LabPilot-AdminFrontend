import { useState, useEffect } from 'react';

import zoneService from '../../services/zoneService';
import Modal from '../../components/modal';
import ZoneForm from './ZoneForm';
import Zone from './Zone';
import Popup from '../../components/Popup';

const Zones = () => {
    const [zones, setZones] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false)
    const [popup, setPopup] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        console.log('Zone data:', data);
        setIsModalOpen(false);
        try {
            setLoading(true)
            const response = await zoneService.addZone(data)
            loadZones()
            setPopup({ type: 'success', message: "Zone Added Successfully" })
            // console.log(response.data);
        } catch {
            setPopup({ type: 'error', message: "Could not add zone" })
        }
    };

    const loadZones = async () => {
        try {
            setLoading(true)
            const response = await zoneService.getZones();
            setZones(response.data.zones)
            console.log(response.data.zones);
        } catch (err) {
            setPopup({ type: "error", message: "Could not load zones" })
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        loadZones()
    }, [])
    return (
        <div className="p-8 space-y-4">
            <div className="min-w-full flex justify-center items-center">
                <button onClick={() => setIsModalOpen(true)} className="btn-sm">Add New Zone</button>
            </div>

            {popup && <Popup type={popup.type} message={popup.message} onClose={() => setPopup(null)} />}
            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add New Zone"
                size="sm"
            >
                <ZoneForm onSubmit={handleSubmit} />
            </Modal>
            {
                zones.map(zone => <Zone key={zone._id} name={zone.zoneName} totalSubZone={zone.subZones.length} />)
            }
        </div>
    );
};

export default Zones;