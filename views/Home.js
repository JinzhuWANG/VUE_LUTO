window.HomeView = {

  setup() {
    const { ref, onMounted, watch } = Vue;
    const windowWidth = ref(window.innerWidth);
    const loadScript = window.loadScript;

    // Map variables
    const mapGeojsonLoaded = ref(false);
    const selectRegion = ref("Australia");
    const isMapVisible = ref(window.innerWidth >= 1280);

    //  Chart variables
    const activeDataset = ref("area_1_total_area_wide");
    const chartOptions = ref({
      chart: {
        height: 490
      },
      title: {
        text: null
      }
    });

    // Functions
    const changeDataset = (datasetName) => {
      activeDataset.value = datasetName;
    };


    onMounted(async () => {
      try {

        // Load required data
        await loadScript("./data/run_logs/model_run_settings.js", 'model_run_settings');
        mapGeojsonLoaded.value = true;

      } catch (error) {
        console.error("Error loading dependencies:", error);
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
      [selectRegion, activeDataset],
      (newValues) => {
        // logic to handle changes in selectRegion or activeDataset
      }
    );

    return {
      isMapVisible,
      selectRegion,
      activeDataset,
      chartOptions,
      windowWidth,
      toggleMapVisibility,
      changeDataset,
      mapGeojsonLoaded
    };
  },

  // This template is a fallback that will be replaced by the loaded template
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
        <div v-show="isMapVisible" class="rounded-[10px] bg-white shadow-md mt-7 mr-7 w-[500px]" style="min-height: 550px;">
          <p class="text-sm h-[50px] p-4">Selected Region: <strong>{{ selectRegion }}</strong></p>
          <hr class="border-gray-300">
          <div class="h-[500px] w-full">
            <map-geojson v-if="mapGeojsonLoaded" :height="'500px'" v-model="selectRegion"></map-geojson>
            <div v-else class="h-[500px] flex items-center justify-center">
              <p>Loading map...</p>
            </div>
          </div>
        </div>

        <!-- Statistics overview -->
        <div class="flex-1 h-[550px] rounded-[10px] bg-white shadow-md mt-7 w-min-[500px]">
          <div class="h-[50px] flex items-center">
            <p class="flex-1 text-sm p-4">Statistics overview for <strong>{{ selectRegion }}</strong></p>
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
