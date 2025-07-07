window.AreaView = {
  setup() {
    const { ref } = Vue;
    const activeDataset = ref("area_1_total_area_wide");

    const datasetNames = [
      "area_1_total_area_wide",
      "area_2_forest_coverage",
      "area_3_agricultural_land",
    ];

    const changeDataset = (datasetName) => {
      activeDataset.value = datasetName;
    };

    return {
      activeDataset,
      datasetNames,
      changeDataset,
    };
  },
  template: `
    <div class="p-6">
      <!-- Chart component -->
      <chart-container :dataset-name="activeDataset"></chart-container>
      <div class="mt-6 bg-white shadow-md rounded-lg p-4" style="height: 550px; width: 100%;"></div>
    </div>
  `
};
