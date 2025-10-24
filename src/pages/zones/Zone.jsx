const Zone = ({name, totalSubZone, onDelete}) => {
    return (
        <div className="border-2 px-4 py-2 flex justify-between items-center">
           <div>
            <p>{name}</p>
            <p>Total Sub Zone: {totalSubZone}</p>
           </div>
           <div>
            <button onClick={onDelete} className="delete-btn">Delete Zone</button>
           </div>
        </div>
    )
}

export default Zone