const ColumnBlock = () => {
    return (
        <section className="mt-5 bg-white rounded-xl border p-4 shadow-sm">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="font-semibold text-lg">Column 1</h3>
                    <p className="text-xs text-slate-500 mt-1">Click to edit this text...</p>
                </div>
                <button className="text-sm bg-slate-100 px-2 py-1 rounded border">⚙</button>
            </div>
        </section>
    )
}

export default ColumnBlock