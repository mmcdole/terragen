export interface ConfigField {
  type: 'number' | 'text' | 'select' | 'boolean';
  label: string;
  default: any;
  min?: number;
  max?: number;
  step?: number;
  options?: { value: string; label: string }[];
}

export interface ConfigGroup {
  id: string;
  label: string;
  fields: Record<string, ConfigField>;
}

export interface GeneratorConfig {
  dimensions: ConfigGroup;  // Required group for width/height
  [key: string]: ConfigGroup;  // Additional groups
}

export interface Generator {
  id: string;
  name: string;
  description: string;
  author?: string;
  config: GeneratorConfig;
  generate(config: Record<string, any>): string[][];
}
