window.HomeView = {

  setup() {

    const { ref, onMounted, watch, computed } = Vue;
    const windowWidth = ref(window.innerWidth);
    const loadScript = window.loadScript;
    const chartDefaultOptions = ref({})

    // Logging variables
    const filterText = ref("");
    const modelRunSettings = ref([]);

    // Map variables
    const mapGeojsonLoaded = ref(false);
    const selectRegion = ref("Australia");
    const isMapVisible = ref(window.innerWidth >= 1280);

    //  Overview charts
    const chartOverviewData = ref({});
    const selectDataset = ref('economics_0_rev_cost_all_wide');
    const activeDatasets = ref({
      'economics_0_rev_cost_all_wide': 'Economics',
      'area_0_grouped_lu_area_wide': 'Area',
      'GHG_2_individual_emission_Mt': 'GHG',
      'water_1_water_net_use_by_broader_category': 'Water',
      'biodiversity_GBF2_1_total_score_by_type': 'Biodiversity',
    });
    const activeUnits = ref({
      'economics_0_rev_cost_all_wide': 'billion AUD',
      'area_0_grouped_lu_area_wide': 'million km2',
      'GHG_2_individual_emission_Mt': 'Mt CO2e',
      'water_1_water_net_use_by_broader_category': 'ML',
      'biodiversity_GBF2_1_total_score_by_type': 'quality weighted score',
    });


    // Memory use logs
    const chartMemLogData = ref({});
    const chartMemLogOptions = ref({
      chart: {
        type: "area",
        height: 420,
      },
      title: {
        text: null,
      },
      xAxis: {
        type: 'datetime'
      },
      yAxis: {
        title: {
          text: 'Memory Use (GB)',
        }
      },
      legend: {
        enabled: false
      },
      tooltip: {},
      plotOptions: {
        area: {
          marker: {
            radius: 2
          },
          lineWidth: 1,
          color: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1
            },
            stops: [
              [0, 'rgb(199, 113, 243)'],
              [0.7, 'rgb(76, 175, 254)']
            ]
          },
          states: {
            hover: {
              lineWidth: 1
            }
          },
          threshold: null
        }
      },
    });

    // Functions
    const trackResize = () => {
      windowWidth.value = window.innerWidth;
    };

    const filteredSettings = computed(() => {
      return modelRunSettings.value.filter(setting =>
        setting.parameter.toLowerCase().includes(filterText.value.toLowerCase())
      );
    });

    watch(
      windowWidth,
      (newWindowWidth) => {
        isMapVisible.value = newWindowWidth >= 1280;
      }
    );

    watch(
      [selectRegion, chartOverviewData],
      (newValues) => {
        // logic to handle changes in selectRegion or chartOverviewData
      }
    );


    const changeDataset = async (datasetName) => {
      try {
        await loadScript(`./data/${datasetName}.js`, datasetName);
        // Directly update the chartOverviewData with the new dataset
        chartOverviewData.value = {
          ...chartDefaultOptions.value,
          chart: {
            height: 480,
          },
          title: {
            text: `${activeDatasets.value[datasetName]} overview for ${selectRegion.value}`
          },
          yAxis: {
            title: {
              text: activeUnits.value[datasetName]
            }
          },
          series: window[datasetName]
        };
        return chartOverviewData.value;
      } catch (error) {
        console.error(`Error loading dataset ${datasetName}:`, error);
      }
    };


    onMounted(async () => {
      try {
        mapGeojsonLoaded.value = true;

        // Add resize event listener
        window.addEventListener('resize', trackResize);

        // Load required data
        await loadScript("./data/mem_log.js", 'mem_log');
        await loadScript("./data/run_logs/model_run_settings.js", 'model_run_settings');
        await loadScript("./data/chart_option/Chart_default_options.js", 'Chart_default_options');

        modelRunSettings.value = window.model_run_settings;
        chartDefaultOptions.value = window['Chart_default_options'];

        // Update chart options with the loaded data
        chartMemLogData.value = {
          ...chartDefaultOptions.value,
          ...chartMemLogOptions.value,
          series: window.mem_log
        };

        // Initialize the overview chart with the selected dataset
        await changeDataset(selectDataset.value);

      } catch (error) {
        console.error("Error loading dependencies:", error);
      }
    });


    return {
      isMapVisible,
      selectRegion,
      windowWidth,
      modelRunSettings,
      mapGeojsonLoaded,
      filterText,
      filteredSettings,
      activeDatasets,
      chartMemLogData,
      chartOverviewData,
      changeDataset,
    };
  },

  // This template is a fallback that will be replaced by the loaded template
  template: `
    <div class="bg-[#f8f9fe]">
      <div class="flex flex-col">

        <!-- Rank cards -->
        <div class="mb-6 flex flex-col">
          <p class="text-black text-xl font-bold p-2">Overall Ranking</p>
          <div class="flex flex-wrap justify-start items-start gap-4">
            <div class="flex flex-1 min-w-[200px] items-center h-[120px] rounded-lg bg-gradient-to-r from-[#6074e4] to-[#825fe4]">
              <p class="text-white p-2 ">Economics</p>
            </div>
            <div class="flex flex-1 min-w-[200px] items-center h-[120px] rounded-lg bg-gradient-to-r from-[#0dcdef] to-[#1574ef]">
              <p class="text-white p-2 ">Area</p>
            </div>
            <div class="flex flex-1 min-w-[200px] items-center h-[120px] rounded-lg bg-gradient-to-r from-[#f4355c] to-[#f66137]">
              <p class="text-white p-2 ">GHG</p>
            </div>
            <div class="flex flex-1 min-w-[200px] items-center h-[120px] rounded-lg bg-gradient-to-r from-[#edde54] to-[#78cc7a]">
              <p class="text-white p-2 ">Water</p>
            </div>
            <div class="flex flex-1 min-w-[200px] items-center h-[120px] rounded-lg bg-gradient-to-r from-[#182a4e] to-[#1b174d]">
              <p class="text-white p-2 ">Biodiversity</p>
            </div>
          </div>
        </div>
        
        
        <div class="flex flex-wrap gap-6 mb-6">

          <!-- Map selection -->
          <div v-show="isMapVisible" class="rounded-[10px] bg-white shadow-md w-[500px] shrink">
            <p class="text-sm h-[50px] p-4">Selected Region: <strong>{{ selectRegion }}</strong></p>
            <hr class="border-gray-300">
            <map-geojson v-if="mapGeojsonLoaded" :height="'500px'" v-model="selectRegion"></map-geojson>
          </div>

          <!-- Statistics overview -->
          <div class="flex-1 rounded-[10px] bg-white shadow-md min-w-[300px]">
            <div class="h-[50px] flex items-center flex-wrap">
              <p class="flex-1 text-sm p-4">Statistics overview for <strong>{{ selectRegion }}</strong></p>
              <!-- Button container -->
              <div class="flex flex-wrap justify-end space-x-3 mr-4">
                <button v-for="(label, datasetName) in activeDatasets"
                 @click="selectDataset = datasetName; changeDataset(datasetName)" 
                 class="justify-end bg-[#5e72e4] text-white text-sm px-3 py-1 rounded mb-2" 
                 :class="{'bg-[#3a4db9]': selectDataset === datasetName}">
                  {{ label }}
                </button>
              </div>
            </div>
            <hr class="border-gray-300">
            <!-- Chart component -->
            <chart-container :chartData="chartOverviewData"></chart-container>
          </div>

        </div>

        
        <div class="flex flex-wrap gap-6 mb-16 ">

          <!-- Settings -->
          <div class="flex flex-1 flex-col rounded-[10px] bg-white shadow-md min-w-[300px]">
            <div class="flex flex-wrap items-center h-auto min-h-[40px]">
              <p class="flex-1 text-sm font-bold p-4">Scenarios and Settings</p>
              <input v-model="filterText" type="text" placeholder="Filter parameters..." class="sticky bg-white mr-4 justify-end text-sm border rounded mb-2" />
            </div>
            <div class="h-[400px] overflow-y-auto">
              <table class="text-left min-w-[300px] ">
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
            <chart-container class="flex-1 rounded-[10px]" :chartData="chartMemLogData"></chart-container>
          </div>

        </div>

      </div>
    </div>
  `,
};
