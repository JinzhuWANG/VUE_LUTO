window.HomeView = {

  setup() {

    const { ref, onMounted, watch, computed } = Vue;
    const loadScript = window.loadScript;

    // Define reactive variables
    const settingsFilterTxt = ref("");
    const selectRegion = ref("AUSTRALIA");
    const selectYear = ref(2020);
    const yearIndex = ref(0);
    const availableYears = ref([]);
    const filteredSettings = ref([]);

    //  Reactive data 
    const chartMemLogData = ref({});
    const chartOverview = ref({});
    const colorsRanking = ref({});
    const availableDatasets = ref({
      'Economics_overview': { 'type': 'Economics', 'unit': 'AUD' },
      'Area_overview_2_Category': { 'type': 'Area', 'unit': 'Hectares' },
      'GHG_overview': { 'type': 'GHG', 'unit': 'Mt CO2e' },
      'Water_overview_MRN_region_2_Type': { 'type': 'Water', 'unit': 'ML' },
      'BIO_quality_overview_1_Type': { 'type': 'Biodiversity', 'unit': 'Weighted score (ha)' },
    });
    const selectDataset = ref('Area_overview_2_Category');
    const selectDataType = computed(() => {
      return availableDatasets.value[selectDataset.value].type;
    });
    const DtypeSubCategories = computed(() => {
      return window.DataService.getSubcategories(selectDataType.value);
    });
    const selectSubcategory = ref('');


    // Functions
    const changeDataset = async (datasetName) => {
      try {
        // Load the selected dataset script
        await loadScript(`./data/${datasetName}.js`, datasetName);

        // Directly update the chartOverview with the new dataset
        chartOverview.value = {
          ...window['Chart_default_options'],
          chart: {
            height: 480,
          },
          title: null,
          yAxis: {
            title: {
              text: availableDatasets.value[datasetName]['unit']
            }
          },
          series: window[datasetName][selectRegion.value],
          colors: window['Supporting_info'].colors,
        };
      } catch (error) {
        console.error(`Error loading dataset ${datasetName}:`, error);
      }
    };


    // Load scripts and data when the component is mounted
    onMounted(async () => {
      try {

        // Load required data
        await loadScript("./data/Supporting_info.js", 'Supporting_info');
        await loadScript("./data/chart_option/Chart_default_options.js", 'Chart_default_options');
        await loadScript("./data/chart_option/chartMemLogOptions.js", 'chartMemLogOptions');

        await loadScript("./data/Biodiversity_ranking.js", 'Biodiversity_ranking');
        await loadScript("./data/GHG_ranking.js", 'GHG_ranking');
        await loadScript("./data/Water_ranking.js", 'Water_ranking');
        await loadScript("./data/Area_ranking.js", 'Area_ranking');
        await loadScript("./data/Economics_ranking.js", 'Economics_ranking');

        await loadScript("./services/DataService.js", 'DataService');

        // Set initial year to first available year
        availableYears.value = window.Supporting_info.years;
        selectYear.value = availableYears.value[0];
        selectSubcategory.value = DtypeSubCategories.value[0];
        colorsRanking.value = window.Supporting_info.colors_ranking;


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
      yearIndex,
      (newIndex) => {
        selectYear.value = availableYears.value[newIndex];
      }
    );
    watch(
      selectDataType,
      (newValues) => {
        selectSubcategory.value = DtypeSubCategories.value[0];
      }
    );

    return {
      availableYears,
      availableDatasets,
      DtypeSubCategories,
      yearIndex,
      settingsFilterTxt,

      selectRegion,
      selectDataset,
      selectDataType,
      selectYear,
      selectSubcategory,

      chartMemLogData,
      chartOverview,
      filteredSettings,
      colorsRanking,
      changeDataset,
    };
  },

  // This template is a fallback that will be replaced by the loaded template
  template: `
    <div>

      <!-- Empty span that acts as the minimum width of the content -->
      <span class="min-w-[1650px]"></span>


      <div class="flex flex-col">

        <!-- Rank cards -->
        <p class="text-black text font-bold p-1 pt-4">Metric Overview</p>
        <div class="mb-4 mr-4">
          <ranking-cards :selectRegion="selectRegion" :selectYear="selectYear"></ranking-cards>
        </div>

        <!-- Title for map and chart -->
        <div class="flex items-center justify-between">
          <p class="text-black w-[500px] text font-bold p-1 pt-4">Map and Statistics</p>
          <p class="flex-1 text font-bold ml-4 p-1 pt-4">{{ selectDataType }} overview for {{ selectRegion }}</p>
        </div>

        <div class="flex mr-4 gap-4 mb-4">

          <div class="flex flex-col rounded-[10px] bg-white shadow-md w-[500px]">

            <!-- Buttons -->
            <div class="flex items-center justify-between w-full">
              <div class="text-[0.8rem] ml-2">
                <p>Region: <strong>{{ selectRegion }}</strong></p>
              </div>
              <div class="flex items-center justify-end p-2">
                <div class="flex space-x-1">
                  <button v-for="(data, key) in availableDatasets" :key="key"
                    @click="selectDataset = key; changeDataset(key)"
                    class="bg-[#e8eaed] text-[#1f1f1f] text-[0.8rem] px-1 py-1 rounded"
                    :class="{'bg-sky-500 text-white': selectDataset === key}">
                    {{ data.type }}
                  </button>
                </div>
              </div>
            </div>

            <hr class="border-gray-300">

            <!-- Map -->
            <div class="relative">
              <div class="absolute flex-col w-full top-1 left-2 right-2 pr-4 justify-between items-center z-10">
                
              <div class="flex flex-col">
                <div class="flex items-center justify-between">
                  <p class="text-[0.8rem]">Year: <strong>{{ selectYear }}</strong></p>
                  <div class="flex space-x-1 mr-4">
                    <button v-for="cat in DtypeSubCategories" :key="cat"
                      @click="selectSubcategory = cat"
                      class="bg-[#e8eaed] text-[#1f1f1f] text-[0.6rem] px-1 rounded"
                      :class="{'bg-sky-500 text-white': selectSubcategory === cat}">
                      {{ cat }}
                    </button>
                  </div>
                </div>

                <el-slider 
                  v-if="availableYears.length > 0"
                  class="flex-1 max-w-[150px] pt-2 pl-2" 
                  v-model="yearIndex"
                  size="small"
                  :show-tooltip="false"
                  :min="0" 
                  :max="availableYears.length - 1"
                  :step="1"
                  :format-tooltip="index => availableYears[index]"
                  :marks="availableYears.reduce((acc, year, index) => ({ ...acc, [index]: year }), {})"
                  @input="(index) => { yearIndex = index; }"
                />
        
                </div>
              </div>
              <map-geojson 
                :height="'470px'" 
                :selectDataType="selectDataType" 
                :selectYear="selectYear" 
                :selectSubcategory="selectSubcategory"
                :legendObj="colorsRanking"
                v-model="selectRegion" 
              />
            </div>

          </div>

          <!-- Statistics Chart -->
          <div class="flex-1 rounded-[10px] bg-white shadow-md w-vw">
            <chart-container :chartData="chartOverview"></chart-container>
          </div>

        </div>
        
        <div class="flex gap-4 mb-16">
          <!-- Settings -->
          <div class="flex-1 flex-col rounded-[10px] bg-white shadow-md">
            <div class="flex items-center h-[auto] min-h-[40px]">
              <p class="flex-1 text-sm font-bold ml-2 p-1 items-center z-10">Scenarios and Settings</p>
              <input v-model="settingsFilterTxt" type="text" placeholder="Filter parameters..." class="sticky bg-white mr-4 justify-end text-sm border rounded" />
            </div>
            <div class="h-[440px] overflow-y-auto mb-2">
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
          <div class="flex flex-col rounded-[10px] bg-white shadow-md flex-1  mr-4">
            <div class="flex items-center justify-start ml-2 h-[40px]">
              <p class="text-sm font-bold">Memory Use Logs</p>
            </div>
            <hr class="border-gray-300">
            <chart-container class="flex-1 rounded-[10px]" :chartData="chartMemLogData"/>
          </div>
        </div>
      </div>
    </div>
  `,
};
