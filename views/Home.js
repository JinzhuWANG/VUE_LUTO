window.HomeView = {
  setup() {
    const { ref, onMounted, watch } = Vue;

    const mapElement = ref(null);
    const selectedRegion = ref(null);
    const isMapVisible = ref(window.innerWidth >= 1280);
    const windowWidth = ref(window.innerWidth);
    const hoverTooltip = ref(null);
    const persistentTooltip = ref(null);

    const australiaBounds = L.latLngBounds(
      [-43, 113], // Southwest corner
      [-12, 154]  // Northeast corner
    );

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

    const updateMapView = (map) => {
      const zoomLevel = map.getBoundsZoom(australiaBounds);
      const center = australiaBounds.getCenter();
      map.setView(center, zoomLevel, { animate: false });
    };

    onMounted(async () => {
      try {
        const geoJSONData = await loadGeoJSONData();

        const map = L.map(mapElement.value, {
          zoomControl: false,
          attributionControl: false,
          zoomSnap: 0.1,
          dragging: false, // Disable dragging
          scrollWheelZoom: false, // Disable scroll wheel zoom
          doubleClickZoom: false, // Disable double-click zoom
        });

        updateMapView(map);

        window.addEventListener('resize', () => {
          map.invalidateSize();
          updateMapView(map);
        });



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
          color: "#fefefe",
          fillColor: "#acb5bd",
          fillOpacity: 0.5,
          weight: 0.5,
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
                if (hoverTooltip.value) {
                  map.removeLayer(hoverTooltip.value);
                }

                // Create new hover tooltip only if this isn't the selected region
                if (selectedRegion.value !== layer) {
                  hoverTooltip.value = L.tooltip({
                    permanent: false,
                    direction: "top",
                  });
                  hoverTooltip.value.setContent(feature.properties.NHT2NAME);
                  hoverTooltip.value.setLatLng(e.latlng);
                  hoverTooltip.value.addTo(map);
                }
              },
              mousemove: (e) => {
                const layer = e.target;
                if (selectedRegion.value !== layer && hoverTooltip.value) {
                  hoverTooltip.value.setLatLng(e.latlng);
                }
              },
              mouseout: (e) => {
                const layer = e.target;
                if (selectedRegion.value !== layer) {
                  layer.setStyle(defaultStyle);
                  if (hoverTooltip.value) {
                    map.removeLayer(hoverTooltip.value);
                    hoverTooltip.value = null;
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
                if (persistentTooltip.value) {
                  map.removeLayer(persistentTooltip.value);
                }

                // Remove hover tooltip if it exists
                if (hoverTooltip.value) {
                  map.removeLayer(hoverTooltip.value);
                  hoverTooltip.value = null;
                }

                // Set new selection
                selectedRegion.value = e.target;
                selectedRegion.value.setStyle(persistentStyle);

                // Create persistent tooltip
                persistentTooltip.value = L.tooltip({
                  permanent: true,
                  direction: "top",
                });
                persistentTooltip.value.setContent(feature.properties.NHT2NAME);
                persistentTooltip.value.setLatLng(e.latlng);
                persistentTooltip.value.addTo(map);
              },
            });
          },
        }).addTo(map);

      } catch (error) {
        console.error("Error initializing map:", error);
      }
    });

    watch(windowWidth, (newWidth, oldWidth) => {
      isMapVisible.value = newWidth >= 1280;
    });

    window.addEventListener("resize", () => {
      windowWidth.value = window.innerWidth;
    });

    return {
      mapElement,
      isMapVisible,
    };
  },
  template: `
    <div class="p-6 bg-[#f8f9fe] h-full">
      <!-- Cards -->
      <div>
        <div>
          <p class="text-black text-xl font-bold p-2">Overall Ranking</p>
        </div>
        <div class="flex justify-start items-start ">
          <div class="flex flex-1 items-center mr-7 h-[150px] rounded-lg bg-gradient-to-r from-[#6074e4] to-[#825fe4]">
            <p class="text-white p-2 ">Card Content</p>
          </div>
          <div class="flex flex-1 items-center mr-7 h-[150px] rounded-lg bg-gradient-to-r from-[#0dcdef] to-[#1574ef]">
            <p class="text-white p-2 ">Card Content</p>
          </div>
          <div class="flex flex-1 items-center mr-7 h-[150px] rounded-lg bg-gradient-to-r from-[#f4355c] to-[#f66137]">
            <p class="text-white p-2 ">Card Content</p>
          </div>
          <div class="flex flex-1 items-center h-[150px] rounded-lg bg-gradient-to-r from-[#182a4e] to-[#1b174d]">
            <p class="text-white p-2 ">Card Content</p>
          </div>
        </div>
      </div>
      
      <!-- Map selection and statistics overview -->
      <div class="flex">
        <!-- Map selection -->
        <div v-show="isMapVisible" class="rounded-[20px]  bg-white shadow-md mt-10">
          <p class="text-sm h-[50px] p-4">Selected a region</p>
          <hr class="border-gray-300">
          <div class="h-[500px] w-[500px]" ref="mapElement" style="background: transparent;"></div>
        </div>
        <!-- Statistics overview -->
        <div class="flex-1 h-[550px] rounded-[20px] bg-white shadow-md mt-10 ml-10">
          <p class="h-[50px] text-sm p-4">Statistics overview</p>
          <hr class="border-gray-300">
        </div>
      </div>
    </div>
  `
};