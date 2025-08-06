window.AreaView = {
  setup() {
    const { ref, onMounted, inject, computed } = Vue;

    const selectRegion = inject('globalSelectedRegion');
    const isDrawerOpen = ref(false);

    const availableYears = ref([]);
    const availableCategories = ref([]);

    const yearIndex = ref(0);
    const selectYear = ref(2020);
    const selectDataset = ref({});

    const selectAgMgt = ref('');
    const selectCategory = ref('');
    const selectLanduse = ref('');
    const selectWater = ref('');
    const mapPathName = ref({});
    const mapSelectKey = ref([]);



    onMounted(async () => {

      await loadScript("./data/Supporting_info.js", 'Supporting_info');
      await loadScript("./data/chart_option/Chart_default_options.js", 'Chart_default_options');
      await loadScript("./data/Area_overview_2_Category.js", 'Area_overview_2_Category');
      await loadScript("./services/MapService.js", 'MapService');




      availableYears.value = window.Supporting_info.years;
      availableCategories.value = Object.keys(window.MapService.mapCategories['Area']);

      selectYear.value = availableYears.value[0];
      selectAgMgt.value = 'Environmental Plantings';
      selectCategory.value = 'Ag';
      selectLanduse.value = 'Beef - modified land';
      selectWater.value = 'dry';

      if (selectCategory.value === 'Ag') {
        mapPathName.value = window.MapService.mapCategories['Area']['Ag'];
        mapSelectKey.value = [selectLanduse.value, selectWater.value, selectYear.value];
      } else if (selectCategory.value === 'Ag Mgt') {
        mapPathName.value = window.MapService.mapCategories['Area']['Ag Mgt'];
        mapSelectKey.value = [selectAgMgt.value, selectWater.value, selectLanduse.value, selectYear.value];
      } else if (selectCategory.value === 'Non-Ag') {
        mapPathName.value = window.MapService.mapCategories['Area']['Non-Ag'];
        mapSelectKey.value = [selectLanduse.value, selectYear.value];
      }

      selectDataset.value = {
        ...window.Chart_default_options,
        chart: {
          height: 300,
        },
        legend: {
          width: 150,
        },
        series: window['Area_overview_2_Category']['AUSTRALIA'],
      };


    });

    const toggleDrawer = () => {
      isDrawerOpen.value = !isDrawerOpen.value;
    };

    const changeDataset = (key) => {
      selectCategory.value = key;

      // Update mapPathName and mapSelectKey based on category
      if (key === 'Ag') {
        mapPathName.value = window.MapService.mapCategories['Area']['Ag'];
        mapSelectKey.value = [selectLanduse.value, selectWater.value, selectYear.value];
      } else if (key === 'Ag Mgt') {
        mapPathName.value = window.MapService.mapCategories['Area']['Ag Mgt'];
        mapSelectKey.value = [selectAgMgt.value, selectWater.value, selectLanduse.value, selectYear.value];
      } else if (key === 'Non-Ag') {
        mapPathName.value = window.MapService.mapCategories['Area']['Non-Ag'];
        mapSelectKey.value = [selectLanduse.value, selectYear.value];
      }
    };

    // Watch for year changes to update mapSelectKey
    Vue.watch(selectYear, (newYear) => {
      if (selectCategory.value === 'Ag') {
        mapSelectKey.value = [selectLanduse.value, selectWater.value, newYear];
      } else if (selectCategory.value === 'Ag Mgt') {
        mapSelectKey.value = [selectAgMgt.value, selectWater.value, selectLanduse.value, newYear];
      } else if (selectCategory.value === 'Non-Ag') {
        mapSelectKey.value = [selectLanduse.value, newYear];
      }
    });


    return {
      selectDataset,
      isDrawerOpen,
      toggleDrawer,
      selectCategory,
      changeDataset,
      availableYears,
      availableCategories,
      yearIndex,
      selectYear,
      selectLanduse,
      selectWater,
      mapSelectKey,
      mapPathName,
    };
  },
  template: `
    <div class="relative w-full h-screen">
      <!-- Drawer toggle button -->
      <button 
        @click="toggleDrawer"
        class="absolute top-5 z-[1001] p-2.5 bg-white border border-gray-300 rounded cursor-pointer transition-all duration-300 ease-in-out"
        :class="isDrawerOpen ? 'right-[420px]' : 'right-5'">
        {{ isDrawerOpen ? '→' : '←' }}
      </button>

      <div class="flex items-center justify-end absolute top-[250px] left-[20px] z-[1001]">
        <div class="flex space-x-1">
          <button v-for="(data, key) in availableCategories" :key="key"
            @click="selectCategory = key; changeDataset(key)"
            class="bg-[#e8eaed] text-[#1f1f1f] text-[0.8rem] px-1 py-1 rounded"
            :class="{'bg-sky-500 text-white': selectCategory === key}">
            {{ key }}
          </button>
        </div>
      </div>

      <el-slider
        v-if="availableYears.length > 0"
        class="absolute top-[230px] left-[20px] z-[1001] max-w-[150px]"
        v-model="yearIndex"
        size="small"
        :show-tooltip="false"
        :min="0"
        :max="availableYears.length - 1"
        :step="1"
        :format-tooltip="index => availableYears[index]"
        :marks="availableYears.reduce((acc, year, index) => ({ ...acc, [index]: year }), {})"
        @input="(index) => { yearIndex = index; selectYear = availableYears[index]; }"
      />
      
      <!-- Map container with drawer -->
      <div style="position: relative; width: 100%; height: 100%;">
        <!-- Map component takes full space -->
        <regions-map 
          :mapPathName="mapPathName"
          :mapKey="mapSelectKey"
          style="width: 100%; height: 100%;">
        </regions-map>
        
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
