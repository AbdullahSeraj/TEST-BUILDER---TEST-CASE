import { useRef, useState } from 'react';
import Sidebar from '../sidebar';
import { BuilderElement, CanvasSize, ElementType, GridConfig } from '@/Types';
import { snap, TEMPLATES, uidFor } from '@/utils/helpers';
import Header from "@/components/header/Header"
import ColumnBlock from '../home/ColumnBlock';
import Canvas from '../home/Canvas';
import Inspector from '../home/Inspector';

export default function Layout() {
    const canvasRef = useRef<HTMLDivElement | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [, setDraggingTemplate] = useState<string | null>(null);
    const [previewPos, setPreviewPos] = useState<{ x: number; y: number } | null>(null);

    const [canvasSize, setCanvasSize] = useState<CanvasSize>({
        width: 1200,
        height: 800
    });

    const [grid,] = useState<GridConfig>({
        enabled: true,
        size: 10,
        snap: true
    });

    const [elements, setElements] = useState<BuilderElement[]>(() => {
        const header: BuilderElement = {
            id: uidFor("header"),
            type: "header",
            content: { text: "Site Title" },
            position: {
                x: 0,
                y: 0,
                width: "100%",
                height: 80,
                zIndex: 1
            },
            responsive: {
                mobile: { width: "100%", height: 60 },
                tablet: { width: "100%", height: 70 }
            }
        };

        const card1: BuilderElement = {
            id: uidFor("card"),
            type: "card",
            content: {
                title: "Card Title",
                description: "Card Description..."
            },
            position: { x: 50, y: 120, width: 300, height: 200, zIndex: 2 }
        };

        const card2: BuilderElement = {
            id: uidFor("card"),
            type: "card",
            content: {
                title: "Card Title",
                description: "Card Description..."
            },
            position: { x: 380, y: 120, width: 300, height: 200, zIndex: 3 }
        };

        const text: BuilderElement = {
            id: uidFor("text-content"),
            type: "text-content",
            content: { html: "<p>Text content will go here</p>" },
            position: {
                x: 50,
                y: 340,
                width: 650,
                height: "auto",
                minHeight: 100,
                zIndex: 4
            }
        };

        const footer: BuilderElement = {
            id: uidFor("footer"),
            type: "footer",
            content: { copyright: "© Test Builder | Test Case" },
            position: {
                x: 0,
                y: 740,
                width: "100%",
                height: 60,
                zIndex: 5,
                fixed: true
            }
        };

        return [header, card1, card2, text, footer];
    });

    function onTemplateDragStart(e: React.DragEvent<HTMLDivElement>, type: string) {
        e.dataTransfer.setData("text/plain", type);
        e.dataTransfer.effectAllowed = "copy";
        setDraggingTemplate(type);

        const ghost = document.createElement("div");
        ghost.style.padding = "6px 8px";
        ghost.style.background = "#111827";
        ghost.style.color = "white";
        ghost.style.borderRadius = "6px";
        ghost.innerText = type;
        document.body.appendChild(ghost);

        e.dataTransfer.setDragImage(ghost, 10, 10);
        setTimeout(() => document.body.removeChild(ghost), 0);
    }

    function onTemplateDragEnd() {
        setDraggingTemplate(null);
        setPreviewPos(null);
    }

    function buildExport() {
        return {
            project: {
                name: "Test Builder Layout",
                version: "1.0",
                created: new Date().toISOString(),
                lastModified: new Date().toISOString()
            },
            canvas: { width: canvasSize.width, height: canvasSize.height, grid },
            elements: elements.map(e => ({
                id: e.id,
                type: e.type,
                content: e.content,
                position: e.position,
                responsive: e.responsive || {}
            })),
            metadata: {
                totalElements: elements.length,
                exportFormat: "json",
                exportVersion: "2.0"
            }
        };
    }

    function onExport() {
        const data = buildExport();

        const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: "application/json"
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "test.json";
        a.click();
        URL.revokeObjectURL(url);
    }

    function onLoadJSON(json: { elements: BuilderElement[]; canvas: { width: number; height: number; }; }) {
        if (!json?.elements) return;

        setElements(json.elements.map((e: BuilderElement) => ({ ...e })));

        if (json.canvas?.width && json.canvas?.height) {
            setCanvasSize({
                width: json.canvas.width,
                height: json.canvas.height
            });
        }
    }

    function createElementFromTemplate(type: ElementType, x: number, y: number): BuilderElement {
        const tpl = TEMPLATES[type];
        const id = uidFor(type);

        const width =
            typeof tpl.defaultSize.width === "number"
                ? tpl.defaultSize.width
                : tpl.defaultSize.width === "100%"
                    ? canvasSize.width
                    : 300;

        const height =
            typeof tpl.defaultSize.height === "number"
                ? tpl.defaultSize.height
                : tpl.defaultSize.height === "auto"
                    ? 100
                    : tpl.defaultSize.height;

        const maxZ = elements.length
            ? Math.max(...elements.map(e => Number(e.position.zIndex || 0)))
            : 0;

        return {
            id,
            type,
            content: JSON.parse(JSON.stringify(tpl.content)),
            position: { x, y, width, height, zIndex: maxZ + 1 }
        };
    }

    function onCanvasDrop(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        if (!canvasRef.current) return;

        const type = e.dataTransfer.getData("text/plain") as ElementType;
        if (!type || !TEMPLATES[type]) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = snap(Math.round(e.clientX - rect.left), grid);
        const y = snap(Math.round(e.clientY - rect.top), grid);

        const el = createElementFromTemplate(type, x, y);
        setElements(prev => [...prev, el]);
        setSelectedId(el.id);
        setPreviewPos(null);
        setDraggingTemplate(null);
    }

    function onCanvasDragOver(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        if (!canvasRef.current) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = Math.round(e.clientX - rect.left);
        const y = Math.round(e.clientY - rect.top);

        setPreviewPos({ x: snap(x, grid), y: snap(y, grid) });
        e.dataTransfer.dropEffect = "copy";
    }

    return (
        <div className="min-h-screen bg-slate-100 p-6">
            <div className="mx-auto flex gap-6">
                <Sidebar
                    onTemplateDragStart={onTemplateDragStart}
                    onTemplateDragEnd={onTemplateDragEnd}
                    onExport={onExport}
                    onLoadJSON={onLoadJSON}
                    setElements={setElements}
                />

                <main className="ml-[20rem] flex-1 bg-white rounded-xl p-4 shadow-lg">
                    <Header />

                    <ColumnBlock />

                    <Canvas
                        canvasSize={canvasSize}
                        grid={grid}
                        previewPos={previewPos}
                        elements={elements}
                        setElements={setElements}
                        selectedId={selectedId}
                        setSelectedId={setSelectedId}
                        canvasRef={canvasRef}
                        onCanvasDrop={onCanvasDrop}
                        onCanvasDragOver={onCanvasDragOver}
                    />

                    <Inspector
                        selectedId={selectedId}
                        elements={elements}
                        setElements={setElements}
                        canvasSize={canvasSize}
                        grid={grid}
                        onExport={onExport}
                        setSelectedId={setSelectedId}
                        buildExport={buildExport}
                    />
                </main>
            </div>
        </div>
    );
}
