window.map_geojson = {
    props: {
        height: {
            type: String,
            default: '500px',
        },
        selectDataType: {
            type: String,
        },
        modelValue: {
            type: String,
        },
        selectYear: {
            type: [Number, String],
            default: 2020,
        },
        selectSubcategory: {
            type: String,
        },
        legendObj: {
            type: Object,
            default: () => ({}),
        },
    },
    setup(props, { emit }) {
        const { ref, onMounted, watch } = Vue;

        const mapElement = ref(null);
        const activeRegionName = ref(props.modelValue);
        const hoverTooltip = ref(null);
        const geoJSONLayer = ref(null);
        const featureStyles = ref({});
        const australiaBounds = L.latLngBounds([-43, 113], [-12, 154]);

        const defaultStyle = {
            color: "#fefefe",
            fillColor: "#d2d7dd",
            fillOpacity: 0.5,
            weight: 1.5,
        };

        const highlightStyle = {
            color: "#0b0b0b",
            fillColor: "#0b0b0b",
            fillOpacity: 0.5,
            weight: 0.1,
        };

        const updateRegionName = (newRegionName) => {
            activeRegionName.value = newRegionName;
            emit('update:modelValue', newRegionName);
        };

        // Function to update styles based on data type and year
        const updateMapStyles = () => {
            if (!geoJSONLayer.value) return;

            // Update styles for all layers
            geoJSONLayer.value.eachLayer(function (layer) {
                const regionName = layer.options.regionName;

                // Skip the currently selected region (which should keep highlight style)
                if (regionName === activeRegionName.value) return;

                try {
                    // Get data type from props (Area by default)
                    const dataType = props.selectDataType || 'Area';
                    // Get current year from props
                    const currentYear = props.selectYear;

                    // Create a new style object starting with default
                    let style = { ...defaultStyle };
                    // Get subcategory from props and map it to the actual data structure key
                    const subcategory = window.DataService.mapSubcategory(dataType, props.selectSubcategory);

                    // Access color from ranking data
                    // Special handling for Water data type
                    const rankingKey = `${dataType}_ranking`;

                    if (window[rankingKey]?.[regionName]?.[subcategory]?.color?.[currentYear]) {
                        style.fillColor = window[rankingKey][regionName][subcategory].color[currentYear];
                    }

                    // Store the style for later reference
                    featureStyles.value[regionName] = style;

                    // Apply the style
                    layer.setStyle(style);
                } catch (error) {
                    console.error(`Error updating style for region ${regionName}:`, error);
                }
            });
        };

        // Watch for changes in data type or year
        watch(() => props.selectDataType, (newValue) => {
            updateMapStyles();
        });

        watch(() => props.selectYear, (newValue) => {
            updateMapStyles();
        });

        watch(() => props.selectSubcategory, (newValue) => {
            updateMapStyles();
        });

        onMounted(async () => {

            // Load data
            await window.loadScript("./data/geo/NRM_AUS.js", 'NRM_AUS');

            // Initialize map
            const map = L.map(mapElement.value, {
                zoomControl: false,
                attributionControl: false,
                zoomSnap: 0.1,
                dragging: false,
                scrollWheelZoom: false,
                doubleClickZoom: false,
            });


            map.setView(
                australiaBounds.getCenter(),
                map.getBoundsZoom(australiaBounds),
                { animate: false }
            );

            // Store GeoJSON layer for later access
            // Create custom style function for each feature
            const getFeatureStyle = (feature) => {
                const regionName = feature.properties.NHT2NAME;
                // Default style if we can't find a color
                let style = { ...defaultStyle };

                try {
                    const dataType = props.selectDataType || 'Area';
                    const currentYear = props.selectYear;
                    const subcategory = window.DataService.mapSubcategory(dataType, props.selectSubcategory);
                    const rankingKey = `${dataType}_ranking`;

                    // Simple check if ranking data is available
                    if (window[rankingKey]?.[regionName]?.[subcategory]?.color?.[currentYear]) {
                        style.fillColor = window[rankingKey][regionName][subcategory].color[currentYear];
                    }
                } catch (error) {
                    console.error(`Error getting color for region ${regionName}:`, error);
                }

                // Store the style for later reference
                featureStyles.value[regionName] = style;

                return style;
            };

            geoJSONLayer.value = L.geoJSON(window['NRM_AUS'], {
                style: getFeatureStyle,
                onEachFeature: (feature, layer) => {
                    // Store region name in layer options for easier access later
                    layer.options.regionName = feature.properties.NHT2NAME;
                    layer.on({
                        mousemove: (e) => {
                            const layer_e = e.target;

                            if (layer_e._path) {
                                layer_e._path.style.cursor = 'default';
                            }

                            // Remove previous hover tooltip
                            if (hoverTooltip.value) {
                                map.removeLayer(hoverTooltip.value);
                                hoverTooltip.value = null;
                            }

                            // Create new hover tooltip
                            hoverTooltip.value = L.tooltip({
                                permanent: false,
                                direction: "top",
                            });
                            hoverTooltip.value.setContent(feature.properties.NHT2NAME);
                            hoverTooltip.value.setLatLng(e.latlng);
                            hoverTooltip.value.addTo(map);

                        },
                        mouseout: (e) => {
                            const layer_e = e.target;

                            // Remove hover tooltip if it exists
                            if (hoverTooltip.value) {
                                map.removeLayer(hoverTooltip.value);
                                hoverTooltip.value = null;
                            }

                            if (layer_e.options.regionName === activeRegionName.value) {
                                layer_e.setStyle(highlightStyle);
                            }

                        },
                        click: (e) => {
                            const layer_e = e.target;

                            // Check if the clicked region is already the active region
                            if (layer_e.options.regionName === activeRegionName.value) {
                                // Restore the custom style for this region when deselecting
                                const regionName = layer_e.options.regionName;
                                // Always use the region's color attributes (featureStyles) when deselecting
                                if (featureStyles.value[regionName]) {
                                    layer_e.setStyle(featureStyles.value[regionName]);
                                } else {
                                    // As a fallback, try to get color from current data
                                    try {
                                        const dataType = props.selectDataType || 'Area';
                                        const currentYear = props.selectYear;
                                        const subcategory = window.DataService.mapSubcategory(dataType, props.selectSubcategory);

                                        // Special handling for Water data type
                                        const rankingKey = `${dataType}_ranking`;


                                        // Create a new style object using the region's color
                                        const style = { ...defaultStyle };
                                        style.fillColor = window[rankingKey][regionName][subcategory]['color'][currentYear];
                                        layer_e.setStyle(style);

                                    } catch (error) {
                                        console.error(`Error getting color for region ${regionName}:`, error);
                                        layer_e.setStyle(defaultStyle);
                                    }
                                }
                                updateRegionName('AUSTRALIA');
                                return;
                            }

                            // Remove highlight style from all regions and restore their custom styles
                            geoJSONLayer.value.eachLayer(function (layer) {
                                const regionName = layer.options.regionName;
                                if (featureStyles.value[regionName]) {
                                    layer.setStyle(featureStyles.value[regionName]);
                                } else {
                                    layer.setStyle(defaultStyle);
                                }
                            });

                            // Set new selection
                            updateRegionName(layer_e.options.regionName);
                            layer_e.setStyle(highlightStyle);

                        },
                    });
                },
            }).addTo(map);

        });

        return {
            mapElement,
            activeRegionName,
            props
        };
    },
    template: `
      <div>
        <div ref="mapElement" :style="{ background: 'transparent', height: props.height }"></div>
        <div v-if="props.legendObj" class="absolute bottom-[30px] left-[35px]">
          <div class="font-bold text-sm mb-2 text-gray-600">Ranking</div>
          <div class="flex flex-row items-center">
            <div v-for="(color, label) in props.legendObj" :key="label" class="flex items-center mr-4 mb-1">
                <span class="inline-block w-[12px] h-[12px] mr-[3px]" :style="{ backgroundColor: color }"></span>
                <span class="text-sm text-gray-600">{{ label }}</span>
            </div>
          </div>
        </div>
      </div>
    `,
};


