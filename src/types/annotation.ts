export interface Annotation {
    id: string;
    task_id: string;
    annotator_id: string | null;
    annotation_data: AnnotationData;
    label_studio_annotation_id?: number;
    time_spent?: number;
    version: number;
    created_at: string;
    updated_at?: string;
}

export interface AnnotationData {
    result: AnnotationResult[];
    [key: string]: any;
}

export interface AnnotationResult {
    value: any;
    from_name: string;
    to_name: string;
    type: string;
    id?: string;
    origin?: string;
}

// Specific annotation types for different tasks
export interface ClassificationAnnotation extends AnnotationResult {
    type: 'choices';
    value: {
        choices: string[];
    };
}

export interface BoundingBoxAnnotation extends AnnotationResult {
    type: 'rectanglelabels';
    value: {
        x: number;
        y: number;
        width: number;
        height: number;
        rotation: number;
        rectanglelabels: string[];
    };
}

export interface PolygonAnnotation extends AnnotationResult {
    type: 'polygonlabels';
    value: {
        points: Array<[number, number]>;
        polygonlabels: string[];
    };
}

export interface TextLabelAnnotation extends AnnotationResult {
    type: 'labels';
    value: {
        start: number;
        end: number;
        text: string;
        labels: string[];
    };
}

export interface AnnotationCreate {
    task_id: string;
    annotation_data: AnnotationData;
    time_spent?: number;
}

export interface AnnotationUpdate {
    annotation_data?: AnnotationData;
    time_spent?: number;
}