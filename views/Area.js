window.AreaView = {
    setup() {
        // Access the global variables defined in area_1_total_area_wide_data.js
        const area_1_total_area_wide_option = window.area_1_total_area_wide_option;
        const area_1_total_area_wide_data = window.area_1_total_area_wide_data;

        return {
            // Expose them as reactive properties
            area_1_total_area_wide_option,
            area_1_total_area_wide_data
        }
    },
    template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-6">Area Analysis</h1>
      <chart-container
        :chart-options="area_1_total_area_wide_option"
        :chart-data="area_1_total_area_wide_data">
      </chart-container>
    </div>
  `
}