window.HomeView = {
  setup() {
    const { ref, onMounted, watch } = Vue;

    windowWidth = ref(window.innerWidth);
    loadScript = window.loadScript;

    // Map variables
    const mapElement = ref(null);
    const activeRegionName = ref('Australia');
    const isMapVisible = ref(window.innerWidth >= 1280);
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

    //  Chart variables
    const chartOptions = ref({
      chart: {
        height: 490
      },
      title: {
        text: null
      }
    });
    const activeDataset = ref("area_1_total_area_wide")
    const activeDatatype = ref('Area');
    const datasetNames = [
      "area_0_grouped_lu_area_wide.js",
      "economics_0_rev_cost_all_wide.js",
      "production_5_6_demand_Production_commodity_from_LUTO.js",
    ];

    // Functions
    const changeDataset = (datasetName) => {
      activeDataset.value = datasetName;
    };




    onMounted(async () => {
      try {

        await loadScript("./data/geo/NRM_AUS.js");
        const geoJSONData = window.NRM_AUS_data;

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

        window.addEventListener("resize", () => {
          windowWidth.value = window.innerWidth;
        });

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



              },
            });
          },
        }).addTo(map);
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    });

    // Watch for window width changes to control map visibility
    watch(
      windowWidth,
      (newWindowWidth) => {
        isMapVisible.value = newWindowWidth >= 1280;
      }
    );

    // Function to toggle map visibility manually
    const toggleMapVisibility = () => {
      isMapVisible.value = !isMapVisible.value;
    };

    // Watch to change Chart 
    watch(
      [activeRegionName, activeDataset, activeDatatype],
      (newValues) => {
        // logic to handle changes in activeRegionName or activeDataset
      }
    );

    return {
      mapElement,
      isMapVisible,
      activeRegionName,
      activeDataset,
      activeDatatype,
      chartOptions,
      windowWidth,
      toggleMapVisibility,
      changeDataset,
    };
  },

  template: `
    <div class="p-6 bg-[#f8f9fe] h-full">

      <!-- Rank cards -->
      <div>
        <div>
          <p class="text-black text-xl font-bold p-2">Overall Ranking</p>
        </div>
        <div class="flex flex-col md:flex-row justify-start items-start space-y-4 md:space-y-0">
          <div class="flex flex-1 mr-7 items-center h-[150px] rounded-lg bg-gradient-to-r from-[#6074e4] to-[#825fe4] w-[1/4]">
            <p class="text-white p-2 ">Card Content</p>
          </div>
          <div class="flex flex-1 mr-7 items-center h-[150px] rounded-lg bg-gradient-to-r from-[#0dcdef] to-[#1574ef] w-[1/4]">
            <p class="text-white p-2 ">Card Content</p>
          </div>
          <div class="flex flex-1 mr-7 items-center h-[150px] rounded-lg bg-gradient-to-r from-[#f4355c] to-[#f66137] w-[1/4]">
            <p class="text-white p-2 ">Card Content</p>
          </div>
          <div class="flex flex-1 items-center h-[150px] rounded-lg bg-gradient-to-r from-[#182a4e] to-[#1b174d] w-[1/4]">
            <p class="text-white p-2 ">Card Content</p>
          </div>
        </div>
      </div>
      
      
      <div class="flex">

        <!-- Map selection -->
        <div v-show="isMapVisible" class="rounded-[10px] bg-white shadow-md mt-7 mr-7 w-[500px]">
          <p class="text-sm h-[50px] p-4">Selected Region: <strong>{{ activeRegionName }}</strong></p>
          <hr class="border-gray-300">
          <div class="h-[500px]" ref="mapElement" style="background: transparent;"></div>
        </div>

        <!-- Statistics overview -->
        <div class="flex-1 h-[550px] rounded-[10px] bg-white shadow-md mt-7 w-min-[500px]">
          <div class="h-[50px] flex items-center">
            <p class="flex-1 text-sm p-4">Statistics overview for <strong>{{ activeRegionName }}</strong></p>
            <!-- Button container -->
            <div class="flex justify-end space-x-2 p-1 pr-4">
              <button @click="changeDataset('area_1_total_area_wide')" class="justify-end bg-[#5e72e4] text-white text-sm px-3 py-1 rounded">
                Profit
              </button>
              <button @click="changeDataset('economics_0_rev_cost_all_wide')" class="justify-end bg-[#5e72e4] text-white text-sm px-3 py-1 rounded">
                Revenue
              </button>
              <button @click="changeDataset('production_5_6_demand_Production_commodity_from_LUTO')" class="justify-end bg-[#5e72e4] text-white text-sm px-3 py-1 rounded">
                Water
              </button>
            </div>
          </div>
          <hr class="border-gray-300">
          <!-- Chart component -->
          <chart-container :dataset-name="activeDataset" :options="chartOptions"></chart-container>
        </div>

      </div>

      <!-- Running logs -->
      <div class="rounded-[10px] bg-white shadow-md mt-7 mr-7 w-[500px]">
        <div class="mt-4">
          <p class="text-sm font-bold h-[50px] p-4">Scenarios and Settings</p>
          <div class="max-h-[200px] overflow-y-auto border border-gray-300 p-2">
            <p class="text-xs">Log entry 1</p>
            <p class="text-xs">Log entry 2</p>
            <p class="text-xs">Log entry 3</p>
          </div>
        </div>
      </div>
      

    </div>
  `,
};
