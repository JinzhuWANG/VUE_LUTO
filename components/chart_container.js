window.Highchart = {
  props: {
    datasetName: {
      type: String,
      required: true,
    },
    options: {
      type: Object,
      required: false,
    },
  },
  setup(props) {
    const { ref, onMounted, watch, nextTick } = Vue

    // Reactive state for loading status and datasets
    const isLoading = ref(true);
    const chartInstance = ref(null);
    const chartElement = ref(null);
    const datasets = ref({});
    const loadDataset = window.loadDataset


    // Function to handle dataset loading and chart creation
    const createOrUpdataChart = async (datasetName) => {

      isLoading.value = false;

      // If the dataset is not already loaded, load it
      if (!datasets.value[datasetName]) {
        await loadDataset(datasetName);
        datasets.value[datasetName] = {
          data: window[`${datasetName}`],
          options: window['Chart_default_options']
        };
      }

      // Update options if provided
      if (props.options) {
        datasets.value[datasetName].options = {
          ...datasets.value[datasetName].options,
          ...props.options,
        };
      }

      // Then wait for the DOM to update before creating the chart
      if (chartInstance.value) {
        chartInstance.value.destroy();
        chartInstance.value = null;
      }

      if (chartElement.value) {
        try {
          chartInstance.value = Highcharts.chart(chartElement.value, {
            ...datasets.value[datasetName].options,
            series: datasets.value[datasetName].data,
          });
        } catch (error) {
          console.error("Error creating chart:", error);
        }
      } else {
        console.error("Chart element not found in DOM");
      }
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
      chartElement
    };
  },
  template: `
    <div>
      <div v-if="isLoading" class="flex justify-center items-center h-[400px]">
        <div class="text-lg">Loading data...</div>
      </div>
      <div v-else ref="chartElement"></div>
    </div>
  `
}