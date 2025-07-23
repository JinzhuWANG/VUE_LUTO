window.AreaView = {
  setup() {
    const { ref, onMounted } = Vue;

    const selectDataset = ref({});
    const chartOptions = ref({});
    const datasetNames = [
      "area_0_grouped_lu_area_wide",
      "area_1_total_area_wide",
      "area_2_forest_coverage",
      "area_3_agricultural_land",
    ];



    onMounted(async () => {

      await loadScript("./data/chart_option/Chart_default_options.js", 'Chart_default_options');
      await loadScript("./data/Area_overview_2_Category.js", 'Area_overview_2_Category');

      selectDataset.value = {
        ...window.Chart_default_options,
        series: window['Area_overview_2_Category']['AUSTRALIA'],
      };
    });

    // This console.log outside onMounted will show empty object because it runs before data is loaded

    return {
      selectDataset,
      chartOptions,
    };
  },
  template: `
    <div class="p-6">
      <!-- Chart component -->
      <chart-container :chartData="selectDataset"></chart-container>
      <div class="mt-6 bg-white shadow-md rounded-lg p-4" style="height: 550px; width: 100%;"></div>
    </div>
  `
};
