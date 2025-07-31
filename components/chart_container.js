window.Highchart = {
  props: {
    chartData: {
      type: Object,
      required: true,
    }
  },
  setup(props) {
    const { ref, onMounted, onUnmounted, watch, nextTick } = Vue

    // Reactive state for loading status and datasets
    const chartElement = ref(null);
    const isLoading = ref(true);

    // Function to handle dataset loading and chart creation
    const createOrUpdateChart = () => {
      isLoading.value = true;

      // Create new chart with explicit responsive options
      Highcharts.chart(
        chartElement.value,
        {
          ...props.chartData,
          chart: {
            ...(props.chartData.chart || {}),
            reflow: false,
            animation: false
          }
        }
      );

      isLoading.value = false;
    };

    // Function to handle window resize
    const handleResize = () => { createOrUpdateChart(); };

    onMounted(() => {
      createOrUpdateChart();
      // Add resize event listener
      window.addEventListener('resize', handleResize);
    });

    onUnmounted(() => {
      window.removeEventListener('resize', handleResize);
    });

    // Watch for changes in chart data
    watch(() => props.chartData, (newValue) => { createOrUpdateChart(); }, { deep: true });

    return {
      chartElement,
      isLoading
    };
  },
  template: `
    <div class="m-2">
      <div v-if="isLoading" class="flex justify-center items-center text-lg">Loading data...</div>
      <div ref="chartElement" id="chart-container" style="width: 100%;"></div>
    </div>
  `
}