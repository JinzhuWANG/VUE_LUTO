window.Highchart = {
  props: {
    chartData: {
      type: Object,
      required: true,
    }
  },
  setup(props) {
    const { ref, onMounted, watch, nextTick } = Vue

    // Reactive state for loading status and datasets
    const chartInstance = ref(null);
    const chartElement = ref(null);
    const isLoading = ref(true);

    // Function to handle dataset loading and chart creation
    const createOrUpdateChart = async () => {

      isLoading.value = true;

      chartInstance.value = Highcharts.chart(
        chartElement.value,
        props.chartData
      );

      isLoading.value = false;

    };

    // Load initial dataset
    onMounted(() => { createOrUpdateChart(); });

    // Watch for changes in chart data
    watch(() => props.chartData, (newValue) => {
      createOrUpdateChart();
    }, { deep: true });

    return {
      chartElement,
      isLoading
    };
  },
  template: `
    <div>
      <div v-if="isLoading" class="flex justify-center items-center text-lg">Loading data...</div>
      <div ref="chartElement" id="chart-container"></div>
    </div>
  `
}