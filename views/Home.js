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
            height: 490,
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
    <div class="p-6 bg-[#f8f9fe] h-full">

      <!-- Rank cards -->
      <div>
        <p class="text-black text-xl font-bold p-2">Overall Ranking</p>
        <div class="flex flex-wrap justify-start items-start gap-4">
          <div class="flex flex-1 items-center h-[150px] min-w-[250px] rounded-lg bg-gradient-to-r from-[#6074e4] to-[#825fe4]">
            <p class="text-white p-2 ">Economics</p>
          </div>
          <div class="flex flex-1 items-center h-[150px] min-w-[250px] rounded-lg bg-gradient-to-r from-[#0dcdef] to-[#1574ef]">
            <p class="text-white p-2 ">Area</p>
          </div>
          <div class="flex flex-1 items-center h-[150px] min-w-[250px] rounded-lg bg-gradient-to-r from-[#f4355c] to-[#f66137]">
            <p class="text-white p-2 ">GHG</p>
          </div>
          <div class="flex flex-1 items-center h-[150px] min-w-[250px] rounded-lg bg-gradient-to-r from-[#f4355c] to-[#f66137]">
            <p class="text-white p-2 ">Water</p>
          </div>
          <div class="flex flex-1 items-center h-[150px] min-w-[250px] rounded-lg bg-gradient-to-r from-[#182a4e] to-[#1b174d]">
            <p class="text-white p-2 ">Biodiversity</p>
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
            <div class="flex justify-end space-x-2 p-1 pr-4 mr-4">
              <button v-for="(label, datasetName) in activeDatasets" @click="selectDataset = datasetName; changeDataset(datasetName)" class="justify-end bg-[#5e72e4] text-white text-sm px-3 py-1 rounded" :class="{'bg-[#3a4db9]': selectDataset === datasetName}">
                {{ label }}
              </button>
            </div>
          </div>
          <hr class="border-gray-300">
          <!-- Chart component -->
          <chart-container :chartData="chartOverviewData"></chart-container>
        </div>

      </div>

      
      <div class="flex">

        <!-- Settings -->
        <div class="rounded-[10px] bg-white shadow-md mt-7 max-w-[800px]">
          <div class="flex flex-row items-center h-[40px]">
            <p class="flex-1 text-sm font-bold p-4">Scenarios and Settings</p>
            <div class="justify-end items-center sticky bg-white mr-4">
                <input v-model="filterText" type="text" placeholder="Filter parameters..." class="w-full text-sm px-1 py-1 border rounded" />
            </div>
          </div>
          <div class="h-[400px] overflow-y-auto">
            <div>
              <table class="w-full text-sm text-left text-gray-500">
                <tbody>
                  <tr v-for="setting in filteredSettings" :key="setting.parameter" class="bg-white border-b border-gray-200 hover:bg-gray-100">
                    <td class="px-2 py-1 text-[0.75rem] text-gray-900 ">{{ setting.parameter }}</td>
                    <td class="px-2 py-1 text-[0.65rem] text-gray-500 max-w-[500px] truncate overflow-hidden">{{ setting.val }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Memory use logs -->
        <div class="flex-1 rounded-[10px] bg-white shadow-md mt-7 ml-7">
          <div class="flex flex-row items-center h-[40px]">
            <p class="flex-1 text-sm font-bold p-4">Memory Use Logs</p>
          </div>
          <hr class="border-gray-300">
          <div class="justify-end items-center bg-white mr-4">
            <chart-container :chartData="chartMemLogData"></chart-container>
          </div>
        </div>

      </div>
    </div>
  `,
};
