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

      // Clean up previous chart instance if it exists
      if (chartInstance.value) {
        chartInstance.value.destroy();
        chartInstance.value = null;
      }

      try {
        // Make sure chartElement.value exists before trying to render the chart
        if (chartElement.value && props.chartData) {
          chartInstance.value = Highcharts.chart(
            chartElement.value,
            props.chartData
          );
          // Only set loading to false after successful chart creation
          isLoading.value = false;
        } else {
          console.error("Chart container element is null or chart data is empty", {
            element: chartElement.value,
            data: props.chartData
          });
        }
      } catch (error) {
        console.error("Error creating chart:", error);
      }
    };

    // Load initial dataset
    onMounted(() => {
      // Make sure DOM is fully rendered before creating chart
      nextTick(() => {
        // Check that chartElement is defined
        if (chartElement.value) {
          createOrUpdateChart();
        } else {
          console.error("Chart element does not exist during mount");
        }
      });
    });

    // Watch for changes in chart data
    watch(() => props.chartData, (newValue) => {
      if (newValue) {
        nextTick(() => {
          createOrUpdateChart();
        });
      }
    }, { deep: true });

    return {
      chartElement,
      isLoading
    };
  },
  template: `
    <div>
      <div v-if="isLoading" class="flex justify-center items-center h-[400px]">
        <div class="text-lg">Loading data...</div>
      </div>
      <div ref="chartElement" id="chart-container" style="min-height: 400px;"></div>
    </div>
  `
}