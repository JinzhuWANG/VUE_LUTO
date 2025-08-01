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
    const ChartInstance = ref(null);

    // Function to handle dataset loading and chart creation
    const createChart = () => {
      isLoading.value = true;

      // Create new chart with explicit responsive options
      ChartInstance.value = Highcharts.chart(
        chartElement.value,
        {
          ...props.chartData,
          chart: (props.chartData.chart || {}),
        }
      );

      isLoading.value = false;
    };

    // Function to handle window resize
    const handleResize = () => { createChart(); };


    // Function to update the chart with new series data
    const updateChart = (chart, newChartData) => {
      try {
        // Make a deep copy of the new chart data to avoid reference issues
        const newData = JSON.parse(JSON.stringify(newChartData));

        // Update the chart configuration options first (except series)
        for (const key in newData) {
          if (key !== 'series') {
            chart.update({ [key]: newData[key] }, false);
          }
        }

        // Handle series data updates safely
        if (newData.series && Array.isArray(newData.series)) {
          // Step 1: Remove excess series if there are more in the chart than in new data
          while (chart.series.length > newData.series.length) {
            if (chart.series[chart.series.length - 1]) {
              chart.series[chart.series.length - 1].remove(false);
            }
          }

          // Step 2: Update existing series or add new ones
          newData.series.forEach((seriesConfig, index) => {
            if (index < chart.series.length) {
              // Series exists, update it safely
              if (chart.series[index]) {
                // Simple setData approach to avoid removePoint errors
                chart.series[index].setData(seriesConfig.data || [], false);

                // Update other properties but not the data (already updated)
                const { data, ...otherProps } = seriesConfig;
                chart.series[index].update(otherProps, false);
              }
            } else {
              // Series doesn't exist, add it
              chart.addSeries(seriesConfig, false);
            }
          });
        }

        // Final redraw to apply all changes with animation
        chart.redraw();
      } catch (error) {
        console.error("Error updating chart:", error);
        // Fallback to complete recreation if update fails
        createChart();
      }
    }

    onMounted(() => {
      createChart();
      window.addEventListener('resize', handleResize);
    });

    onUnmounted(() => {
      window.removeEventListener('resize', handleResize);
    });

    // Watch for changes in chart data
    watch(() => props.chartData, (newValue) => { updateChart(ChartInstance.value, newValue); }, { deep: true });

    return {
      chartElement,
      isLoading,
      ChartInstance,
    };
  },
  template: `
    <div class="m-2">
      <div v-if="isLoading" class="flex justify-center items-center text-lg">Loading data...</div>
      <div ref="chartElement" id="chart-container" style="width: 100%;"></div>
    </div>
  `
}