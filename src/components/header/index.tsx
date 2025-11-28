const index = () => {
    return (
        <header className="bg-black text-white rounded-md px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center font-bold">🚀</div>
                <div className="font-semibold">MyWebsite</div>
            </div>
            <nav className="text-sm opacity-90 space-x-4">
                <a className="hover:underline cursor-pointer">Home</a>
                <a className="hover:underline cursor-pointer">About Us</a>
                <a className="hover:underline cursor-pointer">Contact</a>
            </nav>
        </header>
    )
}

export default index