const Zone = ({name, totalSubZone, onAddSubZone, onEdit, onDelete}) => {
    return (
        <div className="border-2 px-4 py-2 flex justify-between items-center">
           <div>
            <p>{name}</p>
            <p>Total Sub Zone: {totalSubZone}</p>
           </div>
           <div>
            <button onClick={onAddSubZone} className="btn-sm mx-4">Add Sub Zone</button>
            <button onClick={onEdit} className="btn-sm mx-4">Rename Zone</button>
            <button onClick={onDelete} className="delete-btn mx-4">Delete Zone</button>
           </div>
        </div>
    )
}

export default Zone