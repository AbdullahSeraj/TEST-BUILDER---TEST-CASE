import { useTranslation } from "react-i18next"
import { IoLogoCodepen } from "react-icons/io"

const Header = () => {
    const { t } = useTranslation()
    return (
        <header className="bg-black text-white rounded-md px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center font-bold">
                    <IoLogoCodepen color="white" size={24} />
                </div>
                <div className="font-semibold">{t("MainTitle")}</div>
            </div>
            <nav className="text-sm opacity-90 space-x-4">
                <a className="hover:underline cursor-pointer">{t("Home")}</a>
                <a className="hover:underline cursor-pointer">{t("AboutUs")}</a>
                <a className="hover:underline cursor-pointer">{t("Contact")}</a>
            </nav>
        </header>
    )
}

export default Header