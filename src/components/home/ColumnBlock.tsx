import { useLanguage } from "@/content/LanguageContext"
import Dialog from "@/packages/Dialog"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { FaChevronDown } from "react-icons/fa"
import { IoSettingsOutline } from "react-icons/io5"

const languages = [
    {
        name: "English (EN)",
        value: "en",
        flag: "https://flagcdn.com/w20/us.png"
    },
    {
        name: "Türkçe (TR)",
        value: "tr",
        flag: "https://flagcdn.com/w20/tr.png"
    },
]

const ColumnBlock = () => {
    const { t } = useTranslation()
    const { selectLang, setSelectLang } = useLanguage()
    const [open, setOpen] = useState(false)
    return (
        <>
            <section className="mt-5 bg-white rounded-xl border p-4 shadow-sm">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="font-semibold text-lg">{t("ColumnTitle")}</h3>
                        <p className="text-xs text-slate-500 mt-1">{t("ColumnDes")}</p>
                    </div>
                    <button className="text-sm bg-slate-100 px-2 py-1 rounded border hover:shadow-sm transition" onClick={() => setOpen(true)}>
                        <IoSettingsOutline size={18} />
                    </button>
                </div>
            </section>
            <Dialog open={open} setOpen={setOpen}>
                <div className="flex items-center justify-center h-full">
                    <div className="relative flex items-center gap-5">
                        <select
                            name="lang"
                            id="lang"
                            className="appearance-none rounded-lg border bg-white py-2 pl-10 pr-6 text-sm shadow-sm cursor-pointer w-[200px]"
                            style={{
                                backgroundImage: `url(${languages.find(l => l.value === selectLang)?.flag})`,
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "8px center"
                            }}
                            value={selectLang}
                            onChange={(e) => setSelectLang(e.target.value)}
                        >
                            {languages.map((lang) => (
                                <option key={lang.value} value={lang.value}>
                                    {lang.name}
                                </option>
                            ))}
                        </select>
                        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-600">
                            <FaChevronDown size={12} />
                        </span>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

export default ColumnBlock