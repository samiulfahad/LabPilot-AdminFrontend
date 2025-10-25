const ZoneForm = ({ onSubmit, type }) => {
  let name = null;
  let label = null;
  let btn = null;
  if (type === "addZone" || type === "renameZone") {
    name = "zoneName";
    label = "Zone Name";
    btn = "Add Zone";
    if (type === "renameZone") btn = "Rename Zone";
  }
  if (type === "addSubZone" || type === "renameSubZone") {
    name = "subZoneName";
    label = "Sub Zone Name";
    btn = "Add Sub Zone";
    if (type === "renameSubZone") btn = "Rename Sub Zone";
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input name={name} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none" />
      </div>

      <button type="submit" className="w-full btn-sm !mb-6">
        {btn}
      </button>
    </form>
  );
};

export default ZoneForm;











// const ZoneForm = ({ onSubmit }) => {

//     return (
//         <form onSubmit={onSubmit} className="space-y-4">
//             <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Zone Name
//                 </label>
//                 <input name="zoneName" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none" />
//             </div>

//             <button type="submit" className="w-full py-2 px-4 btn-sm">
//                 Add Zone
//             </button>
//         </form>
//     )
// }

// export default ZoneForm