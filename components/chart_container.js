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
    const chartInstance = ref(null);
    const chartElement = ref(null);
    const isLoading = ref(true);

    // Function to handle dataset loading and chart creation
    const createOrUpdateChart = async () => {
      isLoading.value = true;

      // Always destroy previous chart instance
      if (chartInstance.value) {
        chartInstance.value.destroy();
        chartInstance.value = null;
      }

      // Create new chart with explicit responsive options
      chartInstance.value = Highcharts.chart(
        chartElement.value,
        {
          ...props.chartData,
          chart: {
            ...(props.chartData.chart || {}),
            reflow: true,
            animation: false
          }
        }
      );

      isLoading.value = false;
    };

    // Function to handle window resize
    const handleResize = () => {
      // Always redraw chart on window resize
      nextTick(() => {
        createOrUpdateChart();
      });
    };

    // Load initial dataset
    onMounted(() => {
      createOrUpdateChart();
      // Add resize event listener
      window.addEventListener('resize', handleResize);
    });

    // Clean up when component is unmounted
    onUnmounted(() => {
      window.removeEventListener('resize', handleResize);
      if (chartInstance.value) {
        chartInstance.value.destroy();
      }
    });

    // Watch for changes in chart data
    watch(() => props.chartData, (newValue) => {
      nextTick(() => {
        createOrUpdateChart();
      });
    }, { deep: true });

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