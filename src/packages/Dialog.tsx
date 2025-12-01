import { IoMdCloseCircleOutline } from "react-icons/io"

type Props = {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    children: React.ReactNode
}

const Dialog = ({ open, setOpen, children }: Props) => {
    if (open)
        return (
            <div className="fixed top-0 left-0 right-0 bottom-0" style={{ zIndex: 1000000 }}>
                <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/40" onClick={() => setOpen(false)}></div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl min-w-[600px] h-[80vh] shadow-sm">
                    <button className="absolute top-3 right-3 text-red-600" onClick={() => setOpen(false)}><IoMdCloseCircleOutline size={34} /></button>
                    {children}
                </div>
            </div>
        )
}

export default Dialog