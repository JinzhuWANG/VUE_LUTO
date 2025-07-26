window.map_geojson = {
    props: {
        height: {
            type: String,
            default: '500px',
        },
        modelValue: {
            type: String,
        },
    },
    setup(props, { emit }) {
        const { ref, onMounted } = Vue;

        const mapElement = ref(null);
        const activeRegionName = ref(props.modelValue);
        const hoverTooltip = ref(null);
        const geoJSONLayer = ref(null);
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

        onMounted(async () => {
            try {

                // Load data
                await window.loadScript("./data/geo/NRM_AUS.js", 'NRM_AUS_data');
                const geoJSONData = window.NRM_AUS_data;

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
                geoJSONLayer.value = L.geoJSON(geoJSONData, {
                    style: defaultStyle,
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


                                // Highlight the hovered region
                                layer_e.setStyle(highlightStyle);
                            },
                            mouseout: (e) => {
                                const layer_e = e.target;

                                // Remove hover tooltip if it exists
                                if (hoverTooltip.value) {
                                    map.removeLayer(hoverTooltip.value);
                                    hoverTooltip.value = null;
                                }

                                // Ensure the selected region maintains its highlight style
                                if (layer_e.options.regionName === activeRegionName.value) {
                                    layer_e.setStyle(highlightStyle);
                                } else {
                                    layer_e.setStyle(defaultStyle);
                                }
                            },
                            click: (e) => {
                                const layer_e = e.target;

                                // Check if the clicked region is already the active region
                                if (layer_e.options.regionName === activeRegionName.value) {
                                    layer_e.setStyle(defaultStyle);
                                    updateRegionName('AUSTRALIA');
                                    return;
                                }

                                // Remove highlight style from all regions
                                geoJSONLayer.value.eachLayer(function (layer) {
                                    layer.setStyle(defaultStyle);
                                });

                                // Set new selection
                                updateRegionName(layer_e.options.regionName);
                                layer_e.setStyle(highlightStyle);

                            },
                        });
                    },
                }).addTo(map);
            } catch (error) {
                console.error("Error initializing map:", error);
            }
        });

        return {
            mapElement,
            activeRegionName,
            props
        };
    },
    template: `
      <div ref="mapElement" :style="{ background: 'transparent', height: props.height }"></div>
    `,
};


