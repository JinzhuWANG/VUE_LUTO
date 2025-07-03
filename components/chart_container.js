const { ref, reactive, onMounted, watch, nextTick } = Vue;

window.Highchart = {
  props: {
    datasetName: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    // Reactive state for loading status and datasets
    const isLoading = ref(true);
    const datasets = reactive({});
    const chartInstance = ref(null);
    const chartElement = ref(null);

    // Helper function to load a single script to index.html
    const loadScript = (src, id) => {
      return new Promise((resolve, reject) => {
        const existingScript = document.getElementById(id);
        if (existingScript) {
          resolve(); // Script already exists
          return;
        }

        const script = document.createElement("script");
        script.id = id;
        script.src = src;
        script.onload = () => resolve();
        script.onerror = () =>
          reject(new Error(`Failed to load script: ${src}`));
        document.head.appendChild(script);
      });
    };

    // Load a specific dataset by name
    const loadDataset = async (datasetName) => {
      // If already loaded, use from cache
      if (datasets[datasetName]) {
        return Promise.resolve(datasets[datasetName]);
      }

      // If script exists in window, use it directly
      if (window[`${datasetName}_option`] && window[`${datasetName}_data`]) {
        datasets[datasetName] = {
          options: window[`${datasetName}_option`],
          data: window[`${datasetName}_data`],
        };
        return Promise.resolve(datasets[datasetName]);
      }

      // Load both scripts concurrently
      try {
        await Promise.all([
          loadScript(`./data/${datasetName}_data.js`, `${datasetName}_data`),
          loadScript(
            `./data/${datasetName}_options.js`,
            `${datasetName}_options`
          ),
        ]);
        // Store data once both scripts are loaded
        datasets[datasetName] = {
          options: window[`${datasetName}_option`],
          data: window[`${datasetName}_data`],
        };
        return datasets[datasetName];
      } catch (error) {
        console.error(`Error loading dataset ${datasetName}:`, error);
        throw error;
      }
    };

    // Function to handle dataset loading and chart creation
    const createOrUpdataChart = (datasetName) => {
      isLoading.value = true;
      loadDataset(datasetName)
        .then((dataset) => {
          if (!dataset) return;

          // First set loading to false to ensure the div is rendered
          isLoading.value = false;

          // Then wait for the DOM to update before creating the chart
          nextTick(() => {
            if (chartInstance.value) {
              chartInstance.value.destroy();
              chartInstance.value = null;
            }

            if (chartElement.value) {
              try {
                chartInstance.value = Highcharts.chart(chartElement.value, {
                  ...dataset.options,
                  series: dataset.data,
                });
              } catch (error) {
                console.error("Error creating chart:", error);
              }
            } else {
              console.error("Chart element not found in DOM");
            }
          });
        })
        .catch((error) => {
          console.error(`Error loading dataset ${datasetName}:`, error);
          isLoading.value = false;
        });
    };

    // Load initial dataset
    onMounted(() => {
      createOrUpdataChart(props.datasetName);
    });

    // Watch for dataset name changes and handle chart updates
    watch(
      () => props.datasetName,
      (newDatasetName) => {
        createOrUpdataChart(newDatasetName);
      }
    );

    return {
      isLoading,
      chartElement,
    };
  },
  template: `
  <div>
    <div v-if="isLoading" class="flex justify-center items-center h-[400px]">
      <div class="text-lg">Loading data...</div>
    </div>
    
    <div v-else ref="chartElement"></div>
  </div>
`,
};
