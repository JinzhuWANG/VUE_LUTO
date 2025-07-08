# VUE_LUTO - Land Use Trade-Offs (LUTO) 2.0 Dashboard

![LUTO Dashboard](https://github.com/user-attachments/assets/0b55344e-bf35-4c79-99e5-d7bb54bd4ece)

## Overview

VUE_LUTO is a web-based dashboard application for visualizing and analyzing results from the Land Use Trade-Offs (LUTO) 2.0 model. It provides interactive charts, maps, and data exploration tools for understanding the environmental, economic, and social impacts of different land use scenarios in Australia.

## Purpose

The LUTO model is designed to analyze trade-offs between different land uses in Australia, considering factors such as:
- **Economics**: Revenue, costs, and economic indicators
- **Area Analysis**: Land use distribution and changes
- **Greenhouse Gas (GHG) Emissions**: Carbon footprint and climate impacts
- **Water Usage**: Water consumption and management
- **Biodiversity**: Environmental conservation metrics

This dashboard provides an intuitive interface to explore model outputs and understand the implications of different policy scenarios.

## Technology Stack

- **Frontend Framework**: Vue.js 3 with Composition API
- **Routing**: Vue Router 4
- **Styling**: Tailwind CSS (via CDN)
- **Charts**: Highcharts with accessibility features
- **Maps**: Leaflet for interactive Australian region mapping
- **Architecture**: Single Page Application (SPA) with no build process

## Project Structure

```
VUE_LUTO/
├── components/           # Reusable Vue components
│   ├── chart_container.js   # Highcharts wrapper component
│   ├── helpers.js          # Utility functions for script/data loading
│   ├── map_geojson.js      # Interactive map component
│   └── sidebar.js          # Navigation sidebar
├── views/               # Page components (routes)
│   ├── Home.js            # Main dashboard with overview
│   ├── Area.js            # Area analysis view
│   └── NotFound.js        # 404 error page
├── routes/              # Routing configuration
│   └── route.js           # Vue Router setup
├── data/                # Data files and model outputs
│   ├── chart_option/      # Chart configuration templates
│   ├── geo/              # Geographic data (Australian regions)
│   └── run_logs/         # Model run parameters and settings
├── resources/           # Static assets
│   ├── icons.js          # SVG icons
│   ├── LUTO.png          # Logo
│   └── Roboto-Light.ttf  # Custom font
├── index.html           # Main HTML entry point
└── index.js             # Application bootstrap
```

## Key Features

### 1. Interactive Dashboard (Home View)
- **Overview Charts**: Displays key metrics for different domains (economics, area, GHG, water, biodiversity)
- **Memory Usage Monitoring**: Real-time visualization of model execution memory consumption
- **Parameter Summary**: Searchable list of model run settings and parameters
- **Regional Selection**: Interactive map for selecting Australian regions

### 2. Area Analysis
- Detailed land use area breakdowns
- Temporal analysis of land use changes
- Multiple dataset visualization options

### 3. Interactive Map
- **Australian Regions**: Based on Natural Resource Management (NRM) regions
- **Hover Effects**: Region highlighting and tooltips
- **Region Selection**: Click to select regions for detailed analysis
- **Responsive Design**: Adapts to different screen sizes

### 4. Chart System
- **Highcharts Integration**: Professional-grade interactive charts
- **Export Capabilities**: PNG, JPEG, PDF, and CSV export options
- **Accessibility**: Screen reader support and keyboard navigation
- **Responsive Design**: Charts adapt to container sizes

## Data Architecture

### Dynamic Data Loading
The application uses a custom script loading system (`helpers.js`) that:
- Loads data files on-demand to optimize performance
- Manages script dependencies and loading order
- Provides error handling for failed data loads
- Supports timeout mechanisms for reliable loading

### Data Types
1. **Model Run Settings** (`model_run_settings.js`): Configuration parameters for LUTO model runs
2. **Chart Data**: Time-series and categorical data for various metrics
3. **Geographic Data** (`NRM_AUS.js`): GeoJSON data for Australian regions
4. **Chart Options** (`Chart_default_options.js`): Default styling and configuration for charts

## Component Architecture

### Chart Container (`chart_container.js`)
- Wraps Highcharts functionality in a Vue component
- Manages chart lifecycle (creation, updates, destruction)
- Handles loading states and error conditions
- Supports reactive data updates

### Map Component (`map_geojson.js`)
- Integrates Leaflet maps with Vue reactivity
- Manages Australian region visualization
- Emits region selection events
- Handles map interactions and styling

### Sidebar Navigation (`sidebar.js`)
- Provides application navigation
- Displays LUTO branding
- Routes to different analysis views
- Responsive design for different screen sizes

## Setup and Usage

### Prerequisites
- A modern web browser with JavaScript enabled
- Python 3 (for local development server)

### Running Locally
1. Clone the repository:
   ```bash
   git clone https://github.com/JinzhuWANG/VUE_LUTO.git
   cd VUE_LUTO
   ```

2. Start a local web server:
   ```bash
   python3 -m http.server 8000
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:8000
   ```

### Production Deployment
The application is a static web application that can be deployed to any web server:
- Upload all files to your web server
- Ensure the web server can serve `.js` files with the correct MIME type
- No build process or server-side rendering required

## Model Integration

The dashboard is designed to work with LUTO 2.0 model outputs. Key integration points:

### Model Run Parameters
- **Version**: Model version tracking
- **Scenarios**: SSP (Shared Socioeconomic Pathways) and RCP (Representative Concentration Pathways)
- **Policy Settings**: Carbon pricing, biodiversity targets, agricultural management
- **Constraints**: Water usage, GHG emission limits, land use restrictions

### Data Outputs
The model generates datasets for:
- Economic indicators (revenue, costs)
- Land use areas by category
- GHG emissions by source
- Water usage by sector
- Biodiversity quality scores

## Development Notes

### Code Style
- Uses Vue 3 Composition API for component logic
- ES6+ JavaScript features
- No TypeScript (pure JavaScript implementation)
- Consistent naming conventions (camelCase for variables, kebab-case for components)

### Performance Considerations
- Lazy loading of data files to reduce initial load time
- Chart reuse and proper cleanup to prevent memory leaks
- Efficient map rendering with minimal DOM manipulation
- Responsive design principles for various screen sizes

### Browser Support
- Modern browsers supporting ES6+
- Vue 3 compatibility requirements
- WebGL support recommended for optimal map performance

## Contributing

When contributing to this project:
1. Maintain the existing code style and architecture
2. Test across different browsers and screen sizes
3. Ensure new data files follow the existing naming conventions
4. Update documentation for any new features or changes

## License

This project is part of the LUTO (Land Use Trade-Offs) model system. Please refer to the main LUTO project for licensing information.