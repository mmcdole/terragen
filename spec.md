# Terragen: Web-Based ASCII Terrain Generator

## Overview

Terragen is a Vite-powered Vue application for generating visually appealing ASCII terrain maps. It uses Tailwind CSS for styling, is hostable on GitHub Pages, and is designed for ongoing extension. Each new algorithm contributor provides only the algorithm code and configuration schema—no additional HTML or UI code. The main application automatically generates UI controls from the algorithm's configuration schema, allowing users to select an algorithm, tweak parameters, and produce/download ASCII maps.

All algorithms must support user-defined map dimensions (`width` and `height`) as part of their configuration.

---

## High-Level Features

1. **Single-Page Application**  
   - Built with Vue and Vite.
   - Renders ASCII maps in-browser using a monospace font.
   - Users can download the generated ASCII map file (e.g., `map.txt`).

2. **Algorithm Library**  
   - A dropdown lists the available algorithms (e.g., terrain, cave, fortress).  
   - Each algorithm provides its own configuration schema with default values.  
   - New algorithms require no changes to the core UI—just provide the logic and schema.

3. **Dynamic Configuration UI**  
   - Automatically generates sliders, checkboxes, and other controls based on the configuration schema.
   - Parameters are initialized with the algorithm's default values.
   - Users can fine-tune parameters in real-time.
   - Configuration controls are organized into logical groups:
     - **Map Dimensions**: Width and height controls (required for all generators)
     - **Terrain Settings**: Algorithm-specific parameters for terrain generation
     - **Symbols**: ASCII character mappings for different terrain features
     - Additional groups can be defined by each generator

4. **ASCII Rendering & Color**  
   - Uses ASCII symbols to represent terrains or structures.
   - Optionally applies ANSI-style color coding.
   - Re-renders the map dynamically when parameters change or a new generation is triggered.

5. **Extendable & Open Source**  
   - Community contributions are welcomed via pull requests.
   - Algorithms follow a shared interface, specifying configuration, default values, and generation logic.
   - The app handles all UI and rendering logic.

6. **Tailwind CSS Integration**  
   - Provides a modern, responsive layout for configuration panels, dropdowns, and map previews.
   - Simplifies theming and styling.

---

## Core Modules & Architecture

### Generator Interface

Each generator must implement the following interface:
```typescript
interface ConfigField {
  type: 'number' | 'text' | 'select' | 'boolean';
  label: string;
  default: any;
  min?: number;
  max?: number;
  step?: number;
  options?: { value: string; label: string }[];
}

interface ConfigGroup {
  id: string;
  label: string;
  fields: Record<string, ConfigField>;
}

interface GeneratorConfig {
  dimensions: ConfigGroup;  // Required group for width/height
  [key: string]: ConfigGroup;  // Additional groups
}

interface Generator {
  id: string;
  name: string;
  description: string;
  author?: string;
  config: GeneratorConfig;
  generate(config: Record<string, any>): string[][];
}
```

### Folder Structure
```
src/
├── generators/
│   ├── types.ts           # Shared types and interfaces
│   ├── registry.ts        # Generator registration
│   ├── terrain/
│   │   ├── index.ts       # Default terrain generator
│   │   └── config.ts      # Terrain configuration
│   ├── caves/
│   │   ├── index.ts       # Cave system generator
│   │   └── config.ts      # Cave configuration
│   └── fortress/
│       ├── index.ts       # Fortress generator
│       └── config.ts      # Fortress configuration
├── components/
│   ├── AlgorithmSelector.vue
│   ├── ConfigForm.vue
│   ├── MapPreview.vue
│   └── DownloadButton.vue
└── App.vue
```

### Example Generator Implementation
```typescript
// src/generators/terrain/config.ts
export const config: GeneratorConfig = {
  dimensions: {
    id: 'dimensions',
    label: 'Map Dimensions',
    fields: {
      width: {
        type: 'number',
        label: 'Width',
        default: 80,
        min: 20,
        max: 200,
        step: 1
      },
      height: {
        type: 'number',
        label: 'Height',
        default: 40,
        min: 10,
        max: 100,
        step: 1
      }
    }
  },
  terrain: {
    id: 'terrain',
    label: 'Terrain Settings',
    fields: {
      roughness: {
        type: 'number',
        label: 'Roughness',
        default: 0.5,
        min: 0,
        max: 1,
        step: 0.1
      },
      waterLevel: {
        type: 'number',
        label: 'Water Level',
        default: 0.3,
        min: 0,
        max: 1,
        step: 0.1
      }
    }
  },
  symbols: {
    id: 'symbols',
    label: 'Map Symbols',
    fields: {
      water: {
        type: 'text',
        label: 'Water Symbol',
        default: '~'
      },
      land: {
        type: 'text',
        label: 'Land Symbol',
        default: '^'
      }
    }
  }
};
```

### GitHub Pages Deployment

1. **Build**
   - Run `npm run build` to generate the `dist` folder.

2. **Publish**  
   - Push the `dist` folder to the `gh-pages` branch or configure GitHub Actions to do so automatically.

3. **Live Link**  
   - Access `https://<username>.github.io/terragen/`.
