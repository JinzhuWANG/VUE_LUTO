window.map_geojson = {
    setup() {
        const { ref, onMounted } = Vue;

        const mapElement = ref(null);
        const activeRegionName = ref('Australia');
        const hoverTooltip = ref(null);
        const geoJSONLayer = ref(null);

        const defaultStyle = {
            color: "#fefefe",
            fillColor: "#d2d7dd",
            fillOpacity: 0.5,
            weight: 0.5,
        };

        const highlightStyle = {
            color: "#0b0b0b",
            fillColor: "#0b0b0b",
            fillOpacity: 0.5,
            weight: 0.1,
        };

        const australiaBounds = L.latLngBounds(
            [-43, 113], // Southwest corner
            [-12, 154] // Northeast corner
        );

        onMounted(async () => {
            try {
                // Add a longer delay to ensure the DOM is fully rendered and ready
                await new Promise(resolve => setTimeout(resolve, 500));

                if (!mapElement.value) {
                    console.error("Map element reference is null or undefined");
                    return;
                }

                // Log the element to see if it's properly accessible
                console.log("Map container element:", mapElement.value);
                console.log("Map container dimensions:", mapElement.value.offsetWidth, "x", mapElement.value.offsetHeight);

                // Load data
                await window.loadScript("./data/geo/NRM_AUS.js");
                if (!window.NRM_AUS_data) {
                    console.error("NRM_AUS_data not loaded correctly");
                    return;
                }
                const geoJSONData = window.NRM_AUS_data;

                // Make sure Leaflet is loaded
                if (!window.L) {
                    console.error("Leaflet not loaded properly");
                    return;
                }

                // Initialize map with explicit container size check
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
                                    activeRegionName.value = 'Australia';
                                    return;
                                }

                                // Remove highlight style from all regions
                                geoJSONLayer.value.eachLayer(function (layer) {
                                    layer.setStyle(defaultStyle);
                                });

                                // Set new selection
                                activeRegionName.value = layer_e.options.regionName;
                                layer_e.setStyle(highlightStyle);

                                // Emit event to parent component
                                const event = new CustomEvent('region-selected', {
                                    detail: { region: activeRegionName.value }
                                });
                                window.dispatchEvent(event);
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
        };
    },
    template: `
      <div ref="mapElement" style="background: transparent; height: 500px; width: 100%; position: relative; display: block; min-height: 500px;"></div>
    `,
};


