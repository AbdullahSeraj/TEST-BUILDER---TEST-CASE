import { BuilderElement, CanvasSize, ElementContent, GridConfig, ValidationState, Position, ResponsiveConfig } from '@/Types';
import { rectsOverlap } from '@/utils/helpers';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdDeleteForever } from 'react-icons/md';
import { toast } from 'react-toastify';

interface InspectorProps {
    selectedId: string | null;
    elements: BuilderElement[];
    setElements: React.Dispatch<React.SetStateAction<BuilderElement[]>>;
    canvasSize: CanvasSize;
    grid: GridConfig
    onExport(): void
    setSelectedId: React.Dispatch<React.SetStateAction<string | null>>
    buildExport(): {
        project: {
            name: string;
            version: string;
            created: string;
            lastModified: string;
        };
        canvas: {
            width: number;
            height: number;
            grid: GridConfig;
        };
        elements: {
            id: string;
            type: string;
            content: ElementContent;
            position: Position;
            responsive: ResponsiveConfig;
        }[];
        metadata: {
            totalElements: number;
            exportFormat: string;
            exportVersion: string;
        };
    }

}

const Inspector = ({ selectedId, elements, setElements, canvasSize, grid, onExport, setSelectedId, buildExport }: InspectorProps) => {
    const { t } = useTranslation()
    const [showValidation] = useState<ValidationState | null>(null);

    function checkCollision(id: string) {
        const target = elements.find(e => e.id === id);
        if (!target) return false;

        const rectA = {
            x: target.position.x,
            y: target.position.y,
            width: Number(target.position.width) || 0,
            height: Number(target.position.height) || 0
        };

        for (const e of elements) {
            if (e.id === id) continue;

            const rectB = {
                x: e.position.x,
                y: e.position.y,
                width: Number(e.position.width) || 0,
                height: Number(e.position.height) || 0
            };

            if (rectsOverlap(rectA, rectB)) return true;
        }

        return false;
    }

    return (
        <div className="mt-5 flex gap-4">
            <div className="flex-1 bg-white rounded-md p-4 border">
                <div className="font-semibold">{t("Inspector")}</div>
                {selectedId ? (
                    (() => {
                        const sel = elements.find(e => e.id === selectedId); if (!sel) return <div className="mt-2 text-sm text-slate-500">{t("SelectedRemoved")}</div>; const collision = checkCollision(sel.id);
                        return (<div className="mt-3 space-y-3">
                            <div className="text-xs">{t("ID")}: {sel.id}</div>
                            <div className="text-xs">{t("Type")}: {sel.type}</div>
                            <div className="text-xs">X: <input type="number" value={sel.position.x} onChange={(ev) => setElements(prev => prev.map(el => el.id === sel.id ? { ...el, position: { ...el.position, x: Number(ev.target.value) } } : el))} className="border px-1 w-28" /></div>
                            <div className="text-xs">Y: <input type="number" value={sel.position.y} onChange={(ev) => setElements(prev => prev.map(el => el.id === sel.id ? { ...el, position: { ...el.position, y: Number(ev.target.value) } } : el))} className="border px-1 w-28" /></div>
                            <div className="text-xs">W: <input value={sel.position.width} onChange={(ev) => setElements(prev => prev.map(el => el.id === sel.id ? { ...el, position: { ...el.position, width: isNaN(Number(ev.target.value)) ? ev.target.value : Number(ev.target.value) } } : el))} className="border px-1 w-28" /></div>
                            <div className="text-xs">H: <input value={sel.position.height} onChange={(ev) => setElements(prev => prev.map(el => el.id === sel.id ? { ...el, position: { ...el.position, height: isNaN(Number(ev.target.value)) ? ev.target.value : Number(ev.target.value) } } : el))} className="border px-1 w-28" /></div>
                            {sel.type == "header" && <div className="text-xs">{t("Text")}: <input value={sel.content.text} onChange={(ev) => setElements(prev => prev.map(el => el.id === sel.id ? { ...el, content: { ...el.content, text: ev.target.value } } : el))} className="border px-1 w-28" /></div>}
                            {sel.type == "footer" && <div className="text-xs">{t("Content")}: <input value={sel.content.copyright} onChange={(ev) => setElements(prev => prev.map(el => el.id === sel.id ? { ...el, content: { ...el.content, copyright: ev.target.value } } : el))} className="border px-1 w-28" /></div>}
                            {sel.type == "text-content" && <div className="text-xs">{t("Content")}: <textarea value={sel.content.html} rows={5} onChange={(ev) => setElements(prev => prev.map(el => el.id === sel.id ? { ...el, content: { ...el.content, html: ev.target.value } } : el))} className="border px-1 w-28" /></div>}
                            {sel.type == "card" &&
                                <>
                                    <div className="text-xs">{t("Title")}: <input value={sel.content.title} onChange={(ev) => setElements(prev => prev.map(el => el.id === sel.id ? { ...el, content: { ...el.content, title: ev.target.value } } : el))} className="border px-1 w-28" /></div>
                                    <div className="text-xs">{t("Description")}: <textarea value={sel.content.description} rows={5} onChange={(ev) => setElements(prev => prev.map(el => el.id === sel.id ? { ...el, content: { ...el.content, description: ev.target.value } } : el))} className="border px-1 w-28" /></div>
                                </>
                            }
                            <div className="flex gap-2 mt-4">
                                <button className="px-3 py-2 border rounded text-xs bg-rose-50 text-red-600" onClick={() => { setElements(prev => prev.filter(e => e.id !== sel.id)); setSelectedId(null); }}>
                                    <MdDeleteForever size={20} />
                                </button>
                            </div>
                            {collision && <div className="text-sm text-red-600 mt-2">{t("Warning")}</div>}
                        </div>);
                    })()
                ) : (<div className="mt-3 text-slate-500 text-sm">{t("NoSelection")}</div>)}
            </div>

            <div className="w-80 bg-white rounded-md p-4 border">
                <div className="font-semibold">Canvas</div>
                <div className="mt-2 text-xs text-slate-600">{canvasSize.width} x {canvasSize.height} — {t("Grid")}: {grid.size}px</div>
                <div className="mt-3 flex gap-2">
                    <button className="px-2 py-1 border rounded text-xs" onClick={onExport}>{t("ValidateExport")}</button>
                    <button className="px-2 py-1 border rounded text-xs" onClick={() => { navigator.clipboard?.writeText(JSON.stringify(buildExport(), null, 2)); toast.success(t('CopiedJSONSuccessfully')); }}>{t("CopyJSON")}</button>
                </div>

                {showValidation && (
                    <div className="mt-3">
                        <div className="font-medium">{t("Validation")}</div>
                        {showValidation.errors.length === 0 ? <div className="text-green-600">{t("NoErrorsOK")}</div> : (
                            <ul className="text-red-600 list-disc list-inside text-xs mt-1">
                                {showValidation.errors.map((err, i) => (<li key={i}>{err}</li>))}
                            </ul>
                        )}
                    </div>
                )}

            </div>
        </div>
    )
}

export default Inspector