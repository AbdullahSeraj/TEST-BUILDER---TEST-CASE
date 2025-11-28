import { RefObject, useRef } from 'react';
import { BuilderElement, CanvasSize, ElementType, GridConfig } from '@/Types';
import { snap } from '@/utils/helpers';

interface CanvasProps {
    canvasSize: CanvasSize;
    grid: GridConfig;
    elements: BuilderElement[];
    setElements: React.Dispatch<React.SetStateAction<BuilderElement[]>>;
    selectedId: string | null;
    setSelectedId: React.Dispatch<React.SetStateAction<string | null>>;
    canvasRef: RefObject<HTMLDivElement | null>;
    onCanvasDrop: (e: React.DragEvent<HTMLDivElement>) => void;
    onCanvasDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    previewPos: { x: number; y: number } | null;
    createElementFromTemplate(type: ElementType, x: number, y: number): BuilderElement
}

const Canvas = ({ canvasRef, previewPos, canvasSize, grid, elements, setElements, onCanvasDrop, selectedId, setSelectedId, onCanvasDragOver, createElementFromTemplate }: CanvasProps) => {
    const movingRef = useRef<{
        active: boolean;
        id: string | null;
        startX: number;
        startY: number;
        origX: number;
        origY: number;
    }>({ active: false, id: null, startX: 0, startY: 0, origX: 0, origY: 0 });

    function onElementMouseDown(e: React.MouseEvent<HTMLDivElement>, el: BuilderElement) {
        e.stopPropagation();
        if (e.button !== 0) return;

        setSelectedId(el.id);

        movingRef.current = {
            active: true,
            id: el.id,
            startX: e.clientX,
            startY: e.clientY,
            origX: el.position.x,
            origY: el.position.y
        };

        window.addEventListener("mousemove", onWindowMove);
        window.addEventListener("mouseup", onWindowUp);
    }

    function onWindowMove(e: MouseEvent | globalThis.MouseEvent) {
        if (!movingRef.current.active) return;

        const d = movingRef.current;
        const dx = e.clientX - d.startX;
        const dy = e.clientY - d.startY;

        setElements(prev =>
            prev.map(el =>
                el.id === d.id
                    ? {
                        ...el,
                        position: {
                            ...el.position,
                            x: snap(d.origX + dx, grid),
                            y: snap(d.origY + dy, grid)
                        }
                    }
                    : el
            )
        );
    }

    function onWindowUp() {
        movingRef.current.active = false;
        window.removeEventListener("mousemove", onWindowMove);
        window.removeEventListener("mouseup", onWindowUp);
    }

    const resizeRef = useRef<{
        active: boolean;
        id: string | null;
        startX: number;
        startY: number;
        origW: number;
        origH: number;
    }>({ active: false, id: null, startX: 0, startY: 0, origW: 0, origH: 0 });

    function onResizeStart(e: React.MouseEvent<HTMLDivElement>, el: BuilderElement) {
        e.stopPropagation();

        resizeRef.current = {
            active: true,
            id: el.id,
            startX: e.clientX,
            startY: e.clientY,
            origW: Number(el.position.width) || 100,
            origH: Number(el.position.height) || 50
        };

        window.addEventListener("mousemove", onResizeMove);
        window.addEventListener("mouseup", onResizeEnd);
    }

    function onResizeMove(e: MouseEvent | globalThis.MouseEvent) {
        if (!resizeRef.current.active) return;

        const d = resizeRef.current;
        const dx = e.clientX - d.startX;
        const dy = e.clientY - d.startY;

        setElements(prev =>
            prev.map(el => {
                if (el.id !== d.id) return el;
                const nw = Math.max(20, snap(d.origW + dx, grid));
                const nh = Math.max(20, snap(d.origH + dy, grid));
                return { ...el, position: { ...el.position, width: nw, height: nh } };
            })
        );
    }

    function onResizeEnd() {
        resizeRef.current.active = false;
        window.removeEventListener("mousemove", onResizeMove);
        window.removeEventListener("mouseup", onResizeEnd);
    }

    return (
        <div ref={canvasRef} onDragOver={onCanvasDragOver} onDrop={onCanvasDrop} onClick={() => setSelectedId(null)} style={{ width: canvasSize.width, height: canvasSize.height }} className="relative mt-6 mx-auto bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-sky-200/60 rounded-xl overflow-hidden">
            {grid.enabled && <div style={{ position: 'absolute', inset: 0, backgroundSize: `${grid.size}px ${grid.size}px`, backgroundImage: `linear-gradient(0deg, rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)` }} />}
            {previewPos && (
                <div style={{ position: 'absolute', left: previewPos.x, top: previewPos.y, pointerEvents: 'none' }}>
                    <div className="border-2 border-dashed border-blue-300 bg-blue-50/30 px-2 py-1 rounded text-sm">Drop here</div>
                </div>
            )}
            {elements.slice().sort((a, b) => (a.position.zIndex || 0) - (b.position.zIndex || 0)).map(el => (
                <div
                    key={el.id}
                    style={{
                        position: 'absolute',
                        left: el.position.x,
                        top: el.position.y,
                        width: typeof el.position.width === 'number' ? el.position.width : (el.position.width === '100%' ? canvasSize.width : el.position.width),
                        height: typeof el.position.height === 'number' ? el.position.height : (el.position.height === 'auto' ? 'auto' : el.position.height),
                        zIndex: el.position.zIndex
                    }}
                >
                    <div
                        onMouseDown={(ev) => onElementMouseDown(ev, el)}
                        onClick={(ev) => { ev.stopPropagation(); setSelectedId(el.id); }}
                        className={`relative ${selectedId === el.id ? 'ring-2 ring-indigo-300' : ''}`}
                    >
                        {el.type === 'header' && (<div className="w-full h-full bg-white border rounded-md flex items-center justify-center" style={{ height: el.position.height }}>{el.content.text}</div>)}
                        {el.type === 'footer' && (<div className="w-full h-full bg-white border rounded-md flex items-center justify-center" style={{ height: el.position.height }}>{el.content.copyright}</div>)}
                        {el.type === 'card' && (
                            <div className="bg-white rounded-xl shadow-sm p-4 w-full h-full box-border">
                                <div className="absolute right-2 top-2 flex gap-2">
                                    <button title="edit" className="w-7 h-7 rounded bg-white border">✎</button>
                                    <button title="delete" onClick={(e) => { e.stopPropagation(); setElements(prev => prev.filter(x => x.id !== el.id)); if (selectedId === el.id) setSelectedId(null); }} className="w-7 h-7 rounded bg-white border text-red-600">✖</button>
                                </div>
                                <div className="flex items-center justify-center mb-3"><div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">📌</div></div>
                                <h4 className="text-center font-semibold">{el.content.title}</h4>
                                <p className="text-center text-sm text-slate-500 mt-2">{el.content.description}</p>
                            </div>
                        )}
                        {el.type === 'text-content' && (
                            <div
                                className="bg-white rounded-md shadow-sm p-4"
                                dangerouslySetInnerHTML={{ __html: el.content.html ?? '' }}
                            />
                        )}
                        {el.type === 'slider' && (<div className="bg-gradient-to-r from-gray-200 to-gray-300 rounded-md p-4 text-center">Slider ({(el.content.slides || []).length} slides)</div>)}

                        {selectedId === el.id && (<div onMouseDown={(e) => onResizeStart(e, el)} style={{ position: 'absolute', right: -8, bottom: -8, width: 16, height: 16, cursor: 'nwse-resize' }}><div className="w-4 h-4 bg-indigo-600 rounded-sm shadow" /></div>)}
                    </div>
                </div>
            ))}

            <div className="absolute left-6 bottom-6">
                <div className="bg-white/80 backdrop-blur rounded-full px-4 py-2 shadow flex items-center gap-3">
                    <button onClick={() => { const tpl = createElementFromTemplate('card', 100, 100); setElements(prev => [...prev, tpl]); setSelectedId(tpl.id); }} className="px-3 py-1 rounded bg-indigo-600 text-white">+ Add Card</button>
                    <button onClick={() => { const tpl = createElementFromTemplate('text-content', 50, 50); setElements(prev => [...prev, tpl]); setSelectedId(tpl.id); }} className="px-3 py-1 rounded bg-slate-200">Add Text</button>
                </div>
            </div>
        </div>
    )
}

export default Canvas