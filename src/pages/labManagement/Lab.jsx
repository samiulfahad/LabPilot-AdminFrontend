import LabDetails from "./SectionLabDetails";
import AdminSection from "./SectionAdmin";
import StaffSection from "./SectionStaff";

const Lab = ({ lab, onAddSupportAdmin }) => {
  // Check if there's a support admin
  const hasSupportAdmin = lab.admins?.some((admin) => admin.username === "supportAdmin");

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 text-gray-900 shadow-lg">
      {/* Lab Details Section */}
      <LabDetails lab={lab} />

      {/* Admins and Staff Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Admin Section */}
        <AdminSection lab={lab} hasSupportAdmin={hasSupportAdmin} onAddSupportAdmin={onAddSupportAdmin} />

        {/* Staff Section */}
        <StaffSection lab={lab} />
      </div>
    </div>
  );
};

export default Lab;
