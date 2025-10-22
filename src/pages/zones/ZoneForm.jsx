const ZoneForm = ({ onSubmit }) => {

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Zone Name
                </label>
                <input name="zoneName" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none" />
            </div>

            <button type="submit" className="w-full py-2 px-4 btn-sm">
                Add Zone
            </button>
        </form>
    )
}

export default ZoneForm