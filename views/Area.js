window.AreaView = {
  setup() {
    const { ref } = Vue;
    const isLoading = ref(true);
    const chartOptions = ref(null);
    const chartData = ref(null);

    // Dynamically load the script only if not already loaded
    const loadScript = () => {
      // Check if script is already loaded
      const scriptId = "area_1_total_area_wide";
      const existingScript = document.getElementById(scriptId);

      // If script exists and globals are available, use them immediately
      if (
        existingScript &&
        window.area_1_total_area_wide_option &&
        window.area_1_total_area_wide_data
      ) {
        chartOptions.value = window.area_1_total_area_wide_option;
        chartData.value = window.area_1_total_area_wide_data;
        isLoading.value = false;
        return Promise.resolve();
      }

      // Otherwise load the script
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.id = scriptId; // Add an ID to identify this script
        script.src = "./data/area_1_total_area_wide_data.js";
        script.onload = () => {
          chartOptions.value = window.area_1_total_area_wide_option;
          chartData.value = window.area_1_total_area_wide_data;
          isLoading.value = false;
          resolve();
        };
        script.onerror = () => {
          console.error("Failed to load area data");
          isLoading.value = false;
          reject();
        };
        document.head.appendChild(script);
      });
    };

    // Load the script immediately when setup runs
    loadScript();

    return {
      isLoading,
      area_1_total_area_wide_option: chartOptions,
      area_1_total_area_wide_data: chartData,
    };
  },
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-6">Area Analysis</h1>
      <div v-if="isLoading" class="flex justify-center items-center h-[400px]">
        <div class="text-lg">Loading data...</div>
      </div>
      <chart-container
        v-else
        :chart-options="area_1_total_area_wide_option"
        :chart-data="area_1_total_area_wide_data">
      </chart-container>
    </div>
  `,
};
