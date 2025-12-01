import { BuilderElement, ElementType, GridInfo, Template, TemplateType } from "@/Types";

export interface ProjectExport {
    project: { name: string; version: string; created: string; lastModified: string };
    canvas: { width: number; height: number; grid: GridInfo };
    elements: BuilderElement[];
    metadata: { totalElements: number; exportFormat: string; exportVersion: string };
}

export const TEMPLATES: Record<TemplateType, Template> = {
    header: { type: 'header', defaultSize: { width: '100%', height: 80 }, content: { text: 'Site Title' } },
    footer: { type: 'footer', defaultSize: { width: '100%', height: 60 }, content: { copyright: '© Test Builder | Test Case' } },
    card: { type: 'card', defaultSize: { width: 300, height: 200 }, content: { title: 'Card', description: 'Card description...' } },
    'text-content': { type: 'text-content', defaultSize: { width: 650, height: 'auto' }, content: { html: '<p>Text content will go here</p>' } },
    slider: { type: 'slider', defaultSize: { width: '100%', height: 400 }, content: { slides: [] } }
};

const idCounters = { header: 1, footer: 1, card: 1, 'text-content': 1, slider: 1 };
export function uidFor(type: ElementType) {
    const idx = idCounters[type] || 1;
    idCounters[type] = idx + 1;
    return `elem_${type.replace(/\s+/g, '_')}_${String(idx).padStart(3, '0')}`;
}

export function snap(val: number, grid: GridInfo) {
    return (grid.enabled && grid.snap ? Math.round(val / grid.size) * grid.size : val);
}

export function rectsOverlap(a: { x: number; y: number; width: number; height: number }, b: { x: number; y: number; width: number; height: number }) {
    return !(a.x + a.width <= b.x || b.x + b.width <= a.x || a.y + a.height <= b.y || b.y + b.height <= a.y);
}

export function validateExport(project: ProjectExport) {
    const errors = [];
    const ids = project.elements.map(e => e.id);
    const dup = ids.filter((v, i, a) => a.indexOf(v) !== i);
    if (dup.length) errors.push(`Duplicate IDs: ${[...new Set(dup)].join(', ')}`);
    const idRegex = /^elem_[a-zA-Z0-9_-]+_[0-9]{3}$/;
    const bad = ids.filter(id => !idRegex.test(id));
    if (bad.length) errors.push(`IDs not matching pattern: ${bad.join(', ')}`);

    project.elements.forEach(el => {
        const p = el.position;
        if (typeof p.x === 'number' && (p.x < 0 || p.x > project.canvas.width)) errors.push(`${el.id}: x out of range`);
        if (typeof p.y === 'number' && (p.y < 0 || p.y > project.canvas.height)) errors.push(`${el.id}: y out of range`);
        const checkDim = (v: string | number) => (typeof v === 'number' && v >= 0) || (typeof v === 'string' && /%$/.test(v) || v === 'auto');
        if (!checkDim(p.width)) errors.push(`${el.id}: invalid`);
        if (!checkDim(p.height)) errors.push(`${el.id}: invalid`);
    });

    const zs = project.elements.map(e => Number(e.position.zIndex || 0)).sort((a, b) => a - b);
    if (zs.length) {
        if (zs[0] !== 1) errors.push('z-index should start from 1');
        const max = zs[zs.length - 1];
        for (let i = 1; i <= max; i++) if (!zs.includes(i)) { errors.push(`z-index missing value ${i}`); break; }
    }

    const allowed = ['header', 'footer', 'card', 'text-content', 'slider'];
    const badTypes = project.elements.filter(e => !allowed.includes(e.type)).map(e => e.id);
    if (badTypes.length) errors.push(`Unsupported types: ${badTypes.join(', ')}`);

    project.elements.forEach(e => { if (!e.id || !e.type || !e.position) errors.push(`${e.id || '<missing id>'}: missing required fields`); });
    return errors;
}