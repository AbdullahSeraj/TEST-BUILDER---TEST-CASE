import { TEMPLATES } from '@/utils/helpers';
import { BuilderElement, ElementType, ExportedLayout } from '@/Types';
import { IoChevronBackOutline } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';
import { toast } from "react-toastify";

interface SidebarProps {
    onTemplateDragStart: (e: React.DragEvent<HTMLDivElement>, type: string) => void;
    onTemplateDragEnd: () => void;
    onExport: () => void;
    onLoadJSON: (json: ExportedLayout) => void;
    setElements: React.Dispatch<React.SetStateAction<BuilderElement[]>>
}

export default function Sidebar({ onTemplateDragStart, onTemplateDragEnd, onExport, onLoadJSON, setElements }: SidebarProps) {
    const { t } = useTranslation()

    const handleNewPage = () => {
        setElements([])
    }

    return (
        <aside className="w-72 fixed top-6 left-6 h-[calc(100vh-3rem)] bg-slate-900 rounded-xl p-4 shadow-xl flex flex-col text-slate-200">
            <div className="text-xs text-slate-400 mb-3 flex items-end gap-1 hover:border-gray-600 border-b w-fit border-transparent cursor-pointer">
                <IoChevronBackOutline />
                <span>{t("BackToHome")}</span>
            </div>
            <h2 className="text-lg font-bold mb-4">{t("Builder")}</h2>

            <button className="w-full text-left bg-slate-700/40 px-3 py-2 rounded-md text-sm mb-4 hover:bg-slate-700/60" onClick={handleNewPage}>{t("NewPage")}</button>

            <div className="text-xs text-slate-400 uppercase tracking-wide mb-2">{t("Components")}</div>

            <div className="space-y-2 flex-1 overflow-auto">
                {Object.keys(TEMPLATES).map(key => (
                    <div key={key}
                        draggable
                        onDragStart={(e) => onTemplateDragStart(e, key)}
                        onDragEnd={onTemplateDragEnd}
                        className="flex items-center gap-3 p-3 rounded-lg cursor-grab transition hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-600 hover:text-white shadow-lg bg-slate-800/60 text-slate-200 border border-slate-700">
                        <div className="w-9 h-9 rounded bg-slate-700 flex items-center justify-center">{key[0].toUpperCase()}</div>
                        <div className="flex-1 text-sm">
                            <div className="font-medium">{key}</div>
                            <div className="text-xs text-slate-300 opacity-80">{t("Default")}: {JSON.stringify(TEMPLATES[key as ElementType].defaultSize)}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-3 text-xs text-slate-400">
                <div className="mb-1">{t("Shortcuts")}</div>
                <div className="flex gap-2">
                    <button onClick={onExport} className="flex-1 bg-indigo-600/90 text-white px-2 py-1 rounded text-sm">{t("Export")}</button>
                    <label className="flex-1 flex items-center gap-2 bg-slate-700/40 px-2 py-1 rounded text-sm cursor-pointer">
                        <input
                            type="file"
                            accept="application/json"
                            className="hidden"
                            onChange={(ev) => {
                                const file = ev.target.files?.[0];
                                if (!file) return;

                                const reader = new FileReader();

                                reader.onload = (e: ProgressEvent<FileReader>) => {
                                    const result = e.target?.result;
                                    if (typeof result === 'string') {
                                        try {
                                            const json = JSON.parse(result);
                                            onLoadJSON(json);
                                        } catch {
                                            toast.error(t('InvalidJSON'));
                                        }
                                    } else {
                                        toast.error(t('UnableToReadFileAsText'));
                                    }
                                };

                                reader.readAsText(file);
                            }}
                        />
                        {t("Load")}
                    </label>
                </div>
            </div>
        </aside>
    );
}
