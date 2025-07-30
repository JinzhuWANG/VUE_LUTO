window.AreaView = {
  setup() {
    const { ref, onMounted } = Vue;

    const selectDataset = ref({});
    const chartOptions = ref({});

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
    <div>
      <!-- Chart component -->
      <chart-container :chartData="selectDataset"></chart-container>
    </div>
  `
};
