export type LabelConfigCategory =
    | 'classification'
    | 'object_detection'
    | 'segmentation'
    | 'text_classification'
    | 'ner'
    | 'audio'
    | 'custom';

export interface LabelConfigTemplate {
    id: string;
    name: string;
    category: LabelConfigCategory;
    description: string;
    icon: string;
    config: string;
    preview?: string;
    labels?: string[];
}

export const LABEL_CONFIG_TEMPLATES: LabelConfigTemplate[] = [
    // Image Classification
    {
        id: 'image-classification-binary',
        name: 'Image Classification (Binary)',
        category: 'classification',
        description: 'Classify images into two categories (e.g., Cat vs Dog)',
        icon: '🖼️',
        labels: ['Class A', 'Class B'],
        config: `<View>
  <Image name="image" value="$image"/>
  <Choices name="choice" toName="image" choice="single">
    <Choice value="Class A"/>
    <Choice value="Class B"/>
  </Choices>
</View>`,
    },
    {
        id: 'image-classification-multi',
        name: 'Image Classification (Multi-class)',
        category: 'classification',
        description: 'Classify images into multiple categories',
        icon: '🖼️',
        labels: ['Category 1', 'Category 2', 'Category 3', 'Category 4'],
        config: `<View>
  <Image name="image" value="$image"/>
  <Choices name="choice" toName="image" choice="single">
    <Choice value="Category 1"/>
    <Choice value="Category 2"/>
    <Choice value="Category 3"/>
    <Choice value="Category 4"/>
  </Choices>
</View>`,
    },

    // Object Detection
    {
        id: 'object-detection-basic',
        name: 'Object Detection',
        category: 'object_detection',
        description: 'Draw bounding boxes around objects in images',
        icon: '⬜',
        labels: ['Person', 'Car', 'Tree'],
        config: `<View>
  <Image name="image" value="$image" zoom="true" zoomControl="true"/>
  <RectangleLabels name="label" toName="image">
    <Label value="Person" background="#FF5722"/>
    <Label value="Car" background="#2196F3"/>
    <Label value="Tree" background="#4CAF50"/>
  </RectangleLabels>
</View>`,
    },
    {
        id: 'object-detection-advanced',
        name: 'Object Detection + Attributes',
        category: 'object_detection',
        description: 'Bounding boxes with additional attributes',
        icon: '⬜',
        labels: ['Object'],
        config: `<View>
  <Image name="image" value="$image" zoom="true"/>
  <RectangleLabels name="label" toName="image">
    <Label value="Object" background="#FF5722"/>
  </RectangleLabels>
  <Choices name="attributes" toName="image" perRegion="true">
    <Choice value="Occluded"/>
    <Choice value="Truncated"/>
    <Choice value="Difficult"/>
  </Choices>
</View>`,
    },

    // Segmentation
    {
        id: 'semantic-segmentation',
        name: 'Semantic Segmentation',
        category: 'segmentation',
        description: 'Pixel-level segmentation with polygon/brush tools',
        icon: '🎨',
        labels: ['Background', 'Object', 'Person'],
        config: `<View>
  <Image name="image" value="$image" zoom="true"/>
  <PolygonLabels name="label" toName="image" strokeWidth="3">
    <Label value="Background" background="#9E9E9E"/>
    <Label value="Object" background="#FF5722"/>
    <Label value="Person" background="#2196F3"/>
  </PolygonLabels>
  <BrushLabels name="brush" toName="image">
    <Label value="Background" background="#9E9E9E"/>
    <Label value="Object" background="#FF5722"/>
    <Label value="Person" background="#2196F3"/>
  </BrushLabels>
</View>`,
    },

    // Text Classification
    {
        id: 'text-classification-sentiment',
        name: 'Text Classification (Sentiment)',
        category: 'text_classification',
        description: 'Classify text sentiment (Positive/Negative/Neutral)',
        icon: '📝',
        labels: ['Positive', 'Negative', 'Neutral'],
        config: `<View>
  <Text name="text" value="$text"/>
  <Choices name="sentiment" toName="text" choice="single" showInline="true">
    <Choice value="Positive"/>
    <Choice value="Negative"/>
    <Choice value="Neutral"/>
  </Choices>
</View>`,
    },
    {
        id: 'text-classification-multi-label',
        name: 'Text Classification (Multi-label)',
        category: 'text_classification',
        description: 'Assign multiple tags/categories to text',
        icon: '📝',
        labels: ['Urgent', 'Important', 'Question', 'Bug', 'Feature'],
        config: `<View>
  <Text name="text" value="$text"/>
  <Choices name="tags" toName="text" choice="multiple">
    <Choice value="Urgent"/>
    <Choice value="Important"/>
    <Choice value="Question"/>
    <Choice value="Bug"/>
    <Choice value="Feature"/>
  </Choices>
</View>`,
    },

    // Named Entity Recognition (NER)
    {
        id: 'ner-basic',
        name: 'Named Entity Recognition',
        category: 'ner',
        description: 'Highlight and label entities in text',
        icon: '🏷️',
        labels: ['Person', 'Organization', 'Location', 'Date'],
        config: `<View>
  <Text name="text" value="$text"/>
  <Labels name="label" toName="text">
    <Label value="Person" background="#FF5722"/>
    <Label value="Organization" background="#2196F3"/>
    <Label value="Location" background="#4CAF50"/>
    <Label value="Date" background="#FFC107"/>
  </Labels>
</View>`,
    },

    // Audio
    {
        id: 'audio-classification',
        name: 'Audio Classification',
        category: 'audio',
        description: 'Classify audio files into categories',
        icon: '🎵',
        labels: ['Speech', 'Music', 'Noise'],
        config: `<View>
  <Audio name="audio" value="$audio"/>
  <Choices name="choice" toName="audio" choice="single">
    <Choice value="Speech"/>
    <Choice value="Music"/>
    <Choice value="Noise"/>
  </Choices>
</View>`,
    },
];

export function getCategorizedTemplates() {
    const categorized: Record<LabelConfigCategory, LabelConfigTemplate[]> = {
        classification: [],
        object_detection: [],
        segmentation: [],
        text_classification: [],
        ner: [],
        audio: [],
        custom: [],
    };

    LABEL_CONFIG_TEMPLATES.forEach((template) => {
        categorized[template.category].push(template);
    });

    return categorized;
}

export function getTemplateById(id: string): LabelConfigTemplate | undefined {
    return LABEL_CONFIG_TEMPLATES.find((t) => t.id === id);
}