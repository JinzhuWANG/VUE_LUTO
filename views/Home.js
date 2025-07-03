window.HomeView = {
  setup() {
    const { ref, onMounted } = Vue;

    const message = ref("Welcome to Home Dashboard");
    const mapElement = ref(null);
    const tooltip = ref(null);
    const selectedRegion = ref(null);

    const loadGeoJSONData = () => {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.id = "NRM_AUS_data";
        script.src = "data/geo/NRM_AUS.js";
        document.head.appendChild(script);

        script.onload = () => {
          resolve(NRM_AUS_data);
        };

        script.onerror = () => {
          reject(new Error("Failed to load GeoJSON data"));
        };
      });
    };

    onMounted(async () => {
      try {
        const geoJSONData = await loadGeoJSONData();

        const map = L.map(mapElement.value, {
          center: [-27, 133],
          zoom: 4,
          maxZoom: 6,
          minZoom: 4,
          zoomControl: false,
          attributionControl: false,
        });

        let hoverTooltip = null;
        let persistentTooltip = null;

        const highlightStyle = {
          color: "#ff0000",
          weight: 3,
          opacity: 0.8,
        };

        const persistentStyle = {
          color: "#0000ff",
          weight: 4,
          opacity: 0.9,
          fillOpacity: 0.3,
        };

        const defaultStyle = {
          color: "#ff7800",
          weight: 1,
          opacity: 0.65,
        };

        L.geoJSON(geoJSONData, {
          style: defaultStyle,
          onEachFeature: (feature, layer) => {
            layer.on({
              mouseover: (e) => {
                const layer = e.target;
                if (selectedRegion.value !== layer) {
                  layer.setStyle(highlightStyle);
                }

                // Remove existing hover tooltip
                if (hoverTooltip) {
                  map.removeLayer(hoverTooltip);
                }

                // Create new hover tooltip only if this isn't the selected region
                if (selectedRegion.value !== layer) {
                  hoverTooltip = L.tooltip({
                    permanent: false,
                    direction: "top",
                  });
                  hoverTooltip.setContent(feature.properties.NHT2NAME);
                  hoverTooltip.setLatLng(e.latlng);
                  hoverTooltip.addTo(map);
                }
              },
              mousemove: (e) => {
                const layer = e.target;
                if (selectedRegion.value !== layer && hoverTooltip) {
                  hoverTooltip.setLatLng(e.latlng);
                }
              },
              mouseout: (e) => {
                const layer = e.target;
                if (selectedRegion.value !== layer) {
                  layer.setStyle(defaultStyle);
                  if (hoverTooltip) {
                    map.removeLayer(hoverTooltip);
                    hoverTooltip = null;
                  }
                }

                // Ensure selected region maintains its persistent style
                if (selectedRegion.value) {
                  selectedRegion.value.setStyle(persistentStyle);
                }
              },
              click: (e) => {
                // Remove previous selection
                if (selectedRegion.value) {
                  selectedRegion.value.setStyle(defaultStyle);
                }

                // Remove previous persistent tooltip
                if (persistentTooltip) {
                  map.removeLayer(persistentTooltip);
                }

                // Remove hover tooltip if it exists
                if (hoverTooltip) {
                  map.removeLayer(hoverTooltip);
                  hoverTooltip = null;
                }

                // Set new selection
                selectedRegion.value = e.target;
                selectedRegion.value.setStyle(persistentStyle);

                // Create persistent tooltip
                persistentTooltip = L.tooltip({
                  permanent: true,
                  direction: "top",
                });
                persistentTooltip.setContent(feature.properties.NHT2NAME);
                persistentTooltip.setLatLng(e.latlng);
                persistentTooltip.addTo(map);
              },
            });
          },
        }).addTo(map);


      } catch (error) {
        console.error("Error initializing map:", error);
      }
    });

    return {
      message,
      mapElement,
    };
  },
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-6">Dashboard Home</h1>
      <div class="bg-blue-500 text-white p-4 rounded">
        {{ message }}
      </div>
      <div class="flex">
        <div ref="mapElement" class="flex-1" style="height: 500px; background: transparent;">
          <p class="text-xl">Select a region to view its details.</p>
        </div>
        <div class="flex-3">
          <p class="text-xl">Detail plots for the map can go here.</p>
        </div>
      </div>
    </div>
  `,
};