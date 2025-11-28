interface HeaderTemplate {
    type: 'header';
    defaultSize: { width: string; height: number };
    content: { text: string };
}

interface FooterTemplate {
    type: 'footer';
    defaultSize: { width: string; height: number };
    content: { copyright: string };
}

interface CardTemplate {
    type: 'card';
    defaultSize: { width: number; height: number };
    content: { title: string; description: string };
}

interface TextContentTemplate {
    type: 'text-content';
    defaultSize: { width: number; height: string };
    content: { html: string };
}

interface SliderTemplate {
    type: 'slider';
    defaultSize: { width: string; height: number };
    content: { slides: unknown[] }; // أو يمكنك تحديد شكل كل slide إذا معروف
}

export type Template =
    | HeaderTemplate
    | FooterTemplate
    | CardTemplate
    | TextContentTemplate
    | SliderTemplate;

export type TemplateType = Template['type'];

export type ElementType = 'header' | 'footer' | 'card' | 'text-content' | 'slider';

export interface ElementContent {
    text?: string;
    html?: string;
    title?: string;
    description?: string;
    copyright?: string;
    slides?: unknown[];
}

export interface ElementPosition {
    x: number;
    y: number;
    width: number | string;
    height: number | string;
    zIndex: number;
    fixed?: boolean;
    minHeight?: number;
}

export interface BuilderElement {
    id: string;
    type: string;
    content: ElementContent;
    position: Position;
    responsive?: ResponsiveConfig;
}

export interface GridInfo {
    enabled: boolean;
    size: number;
    snap: boolean;
}


export interface Position {
    x: number;
    y: number;
    width: number | string;
    height: number | string;
    zIndex: number;
    minHeight?: number;
    fixed?: boolean;
}

export interface ResponsiveConfig {
    mobile?: { width: string | number; height: string | number };
    tablet?: { width: string | number; height: string | number };
}

export interface GridConfig {
    enabled: boolean;
    size: number;
    snap: boolean;
}

export interface CanvasSize {
    width: number;
    height: number;
}

interface ProjectMeta {
    name: string;
    version: string;
    created: string;
    lastModified: string;
}

interface CanvasData {
    width: number;
    height: number;
    grid: {
        enabled: boolean;
        size: number;
        snap: boolean;
    };
}

interface BuilderElementJSON {
    id: string;
    type: string;
    content: object;
    position: ElementPosition;
    responsive?: ResponsiveConfig;
}

export interface ExportedLayout {
    project: ProjectMeta;
    canvas: CanvasData;
    elements: BuilderElementJSON[];
    metadata: {
        totalElements: number;
        exportFormat: string;
        exportVersion: string;
    };
}

export interface ValidationState {
    json: ExportedLayout;
    errors: string[];
}
