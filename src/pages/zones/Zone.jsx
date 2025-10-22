const Zone = ({name, totalSubZone}) => {
    return (
        <div className="border-2 px-4 py-2">
            <p>{name}</p>
            <p>Total Sub Zone: {totalSubZone}</p>
        </div>
    )
}

export default Zone