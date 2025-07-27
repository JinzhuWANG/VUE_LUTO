window.HomeView = {

  setup() {

    const { ref, onMounted, watch } = Vue;
    const windowWidth = ref(window.innerWidth);
    const loadScript = window.loadScript;

    // Define reactive variables
    const settingsFilterTxt = ref("");
    const selectRegion = ref("AUSTRALIA");
    const selectYear = ref(2020);
    const yearIndex = ref(0);
    const availableYears = ref([]);
    const isMapVisible = ref(window.innerWidth >= 1280);
    const filteredSettings = ref([]);

    //  Overview charts
    const chartOverview = ref({});
    const availableDatasets = ref({
      'Economics_overview': { 'type': 'Economics', 'unit': 'AUD' },
      'Area_overview_2_Category': { 'type': 'Area', 'unit': 'Hectares' },
      'GHG_overview': { 'type': 'GHG', 'unit': 'Mt CO2e' },
      'Water_overview_MRN_region_2_Type': { 'type': 'Water', 'unit': 'ML' },
      'BIO_quality_overview_1_Type': { 'type': 'Biodiversity', 'unit': 'Weighted score (ha)' },
    });
    const selectDataset = ref('Area_overview_2_Category');

    // Define data object with reactive properties
    const chartMemLogData = ref({});

    // Reference to ranking data service
    const DataService = window.DataService;

    // Functions
    const trackResize = () => {
      windowWidth.value = window.innerWidth;
    };


    const changeDataset = async (datasetName) => {
      try {
        // Load the selected dataset script
        await loadScript(`./data/${datasetName}.js`, datasetName);

        // Directly update the chartOverview with the new dataset
        chartOverview.value = {
          ...window['Chart_default_options'],
          chart: {
            height: 510,
          },
          title: {
            text: `${availableDatasets.value[datasetName]['type']} overview for ${selectRegion.value}`
          },
          yAxis: {
            title: {
              text: availableDatasets.value[datasetName]['unit']
            }
          },
          series: window[datasetName][selectRegion.value],
        };
      } catch (error) {
        console.error(`Error loading dataset ${datasetName}:`, error);
      }
    };


    // Load scripts and data when the component is mounted
    onMounted(async () => {
      try {

        // Add resize event listener
        window.addEventListener('resize', trackResize);

        // Load required data
        await loadScript("./data/Supporting_info.js", 'Supporting_info');
        await loadScript("./data/chart_option/Chart_default_options.js", 'Chart_default_options');
        await loadScript("./data/chart_option/chartMemLogOptions.js", 'chartMemLogOptions');
        await loadScript("./data/Biodiversity_ranking.js", 'Biodiversity_ranking');
        await loadScript("./data/GHG_ranking.js", 'GHG_ranking');
        await loadScript("./data/Water_yield_ranking.js", 'Water_yield_ranking');
        await loadScript("./data/Area_ranking.js", 'Area_ranking');
        await loadScript("./data/Economics_ranking.js", 'Economics_ranking');

        // Set initial year to first available year
        availableYears.value = window.Supporting_info.years;
        selectYear.value = availableYears.value[0];
        yearIndex.value = 0;

        // RankingData component is now included in index.html
        chartMemLogData.value = {
          ...window['Chart_default_options'],
          ...window['chartMemLogOptions'],
          series: window['Supporting_info'].mem_logs,
        };

        // Initialize the overview chart with the selected dataset
        await changeDataset(selectDataset.value);

        // Update filteredSettings now that supporting info is loaded
        filteredSettings.value = window['Supporting_info']['model_run_settings'].filter(setting =>
          setting.parameter.toLowerCase().includes(settingsFilterTxt.value.toLowerCase())
        );

      } catch (error) {
        console.error("Error loading dependencies:", error);
      }
    });


    // Watch for changes in window width to toggle map visibility
    watch(
      windowWidth,
      (newWindowWidth) => {
        isMapVisible.value = newWindowWidth >= 1280;
      }
    );

    // Watch for changes and then make reactive updates
    watch(
      settingsFilterTxt,
      (newFilterText) => {
        filteredSettings.value = window['Supporting_info']['model_run_settings'].filter(setting =>
          setting.parameter.toLowerCase().includes(newFilterText.toLowerCase())
        );
      }
    );

    watch(
      selectRegion,
      (newValues) => {
        changeDataset(selectDataset.value);
      }
    );
    watch(
      selectYear,
      (newYear) => {
        selectYear.value = newYear;
      }
    );

    return {
      isMapVisible,
      selectRegion,
      selectDataset,
      selectYear,
      yearIndex,
      DataService,
      windowWidth,
      settingsFilterTxt,
      filteredSettings,
      availableDatasets,
      chartMemLogData,
      chartOverview,
      changeDataset,
      availableYears,
    };
  },

  // This template is a fallback that will be replaced by the loaded template
  template: `
    <div class="bg-[#f8f9fe]">
      <div class="flex flex-col">

        <!-- Rank cards -->
        <div class="mb-6 mr-4">
          <ranking-cards :selectRegion="selectRegion" :selectYear="selectYear"></ranking-cards>
        </div>


        <div class="flex flex-wrap mr-4 gap-4 mb-4">

          <div class="flex flex-col rounded-[10px] bg-white shadow-md w-[500px]">

            <!-- Buttons -->
            <div class="flex items-center justify-between w-full">
              <div class="text-[0.7rem] ml-2">
                <p>Region: <strong>{{ selectRegion }}</strong></p>
              </div>
              <div class="flex items-center justify-end p-2">
                <div class="flex flex-wrap space-x-1">
                  <button v-for="(data, key) in availableDatasets" :key="key"
                    @click="selectDataset = key; changeDataset(key)"
                    class="bg-[#e8eaed] text-[#1f1f1f] text-[0.7rem] px-1 py-1 rounded"
                    :class="{'bg-sky-500 text-white': selectDataset === key}">
                    {{ data.type }}
                  </button>
                </div>
              </div>
            </div>

            <hr class="border-gray-300">

            <!-- Map -->
            <div v-show="isMapVisible" class="relative">
              <div class="absolute flex w-full top-1 left-2 right-2 pr-4 justify-between items-center">
                <p class="text-[0.7rem]">Year: <strong>{{ selectYear }}</strong></p>
                <el-slider 
                  v-if="availableYears.length > 0"
                  class="justify-end flex-1 max-w-[240px] custom-slider" 
                  v-model="yearIndex"
                  size="small"
                  :min="0" 
                  :max="availableYears.length - 1"
                  :step="1"
                  :format-tooltip="index => availableYears[index]"
                  :marks="availableYears.reduce((acc, year, index) => ({ ...acc, [index]: year }), {})"
                  @change="(index) => { selectYear = availableYears[index]; }"
                />
              </div>
              <map-geojson :height="'470px'" v-model="selectRegion" />
            </div>

          </div>

          <!-- Statistics Chart -->
          <div class="flex-1 rounded-[10px] bg-white shadow-md">
            <chart-container :chartData="chartOverview"></chart-container>
          </div>

        </div>
        
        <div class="flex flex-wrap gap-6 mb-16">
          <!-- Settings -->
          <div class="flex-1 flex-col rounded-[10px] bg-white shadow-md min-w-[300px]">
            <div class="flex flex-wrap items-center h-auto min-h-[40px]">
              <p class="flex-1 text-sm font-bold p-4">Scenarios and Settings</p>
              <input v-model="settingsFilterTxt" type="text" placeholder="Filter parameters..." class="sticky bg-white mr-4 justify-end text-sm border rounded mb-2" />
            </div>
            <div class="h-[400px] overflow-y-auto">
              <table class="text-left min-w-[300px]">
                <tbody>
                  <tr v-for="setting in filteredSettings" :key="setting.parameter" class="bg-white border-b border-gray-200 hover:bg-gray-100">
                    <td class="px-2 py-1 text-[0.55rem] text-gray-900 whitespace-wrap break-words">{{ setting.parameter }}</td>
                    <td class="px-2 py-1 text-[0.55rem] text-gray-500 whitespace-wrap break-words">{{ setting.val }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Memory use logs -->
          <div class="flex flex-col rounded-[10px] bg-white shadow-md flex-1 min-w-[300px]">
            <p class="h-[40px] text-sm font-bold p-4">Memory Use Logs</p>
            <hr class="border-gray-300">
            <chart-container class="flex-1 rounded-[10px]" :chartData="chartMemLogData"/>
          </div>
        </div>
      </div>
    </div>
  `,
};
