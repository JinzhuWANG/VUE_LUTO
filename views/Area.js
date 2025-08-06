window.AreaView = {
  setup() {
    const { ref, onMounted, inject } = Vue;

    const selectRegion = inject('globalSelectedRegion');
    const selectDataType = inject('globalSelectedDataType');

    const selectDataset = ref({});
    const chartOptions = ref({});
    const isDrawerOpen = ref(false);

    onMounted(async () => {

      await loadScript("./data/chart_option/Chart_default_options.js", 'Chart_default_options');
      await loadScript("./data/Area_overview_2_Category.js", 'Area_overview_2_Category');

      selectDataset.value = {
        ...window.Chart_default_options,
        chart: {
          height: 300,
        },
        series: window['Area_overview_2_Category']['AUSTRALIA'],
      };
    });

    const toggleDrawer = () => {
      isDrawerOpen.value = !isDrawerOpen.value;
    };

    return {
      selectDataset,
      chartOptions,
      isDrawerOpen,
      toggleDrawer,
    };
  },
  template: `
    <div style="position: relative; width: 100%; height: 100vh;">
      <!-- Drawer toggle button -->
      <button 
        @click="toggleDrawer"
        :style="{
          position: 'absolute',
          top: '20px',
          right: isDrawerOpen ? '420px' : '20px',
          zIndex: 1001,
          padding: '10px',
          background: 'white',
          border: '1px solid #ccc',
          borderRadius: '4px',
          cursor: 'pointer',
          transition: 'right 0.3s ease'
        }">
        {{ isDrawerOpen ? '→' : '←' }}
      </button>
      
      <!-- Map container with drawer -->
      <div style="position: relative; width: 100%; height: 100%;">
        <!-- Map component takes full space -->
        <regions-map style="width: 100%; height: 100%;"></regions-map>
        
        <!-- Chart drawer positioned relative to map -->
        <div 
          :style="{
            position: 'absolute',
            top: '10px',
            bottom: '10px',
            right: isDrawerOpen ? '0px' : 'calc(-66.666% - 10px)',
            width: '66.666%',
            background: 'transparent',
            transition: 'right 0.3s ease',
            zIndex: 1000,
            padding: '60px 20px 20px 20px',
            boxSizing: 'border-box'
          }">
          <chart-container 
            :chartData="selectDataset" 
            style="width: 100%; height: 200px;">
          </chart-container>
        </div>
      </div>
    </div>
  `
};
