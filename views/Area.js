window.AreaView = {
  setup() {
    const { ref, onMounted, inject, computed, watch } = Vue;

    const selectRegion = inject('globalSelectedRegion');
    const isDrawerOpen = ref(false);
    const yearIndex = ref(0);

    const selectDataset = ref({});
    const mapPathName = ref({});
    const mapSelectKey = ref([]);

    const selectCategory = ref('Ag');
    const selectAgMgt = ref('Environmental Plantings');
    const selectWater = ref('dry');
    const selectLanduse = ref('Beef - modified land');
    const selectYear = ref(2020);

    const availableYears = ref([]);
    const availableCategories = ref([]);

    // Centralized function to navigate nested data structure based on current selections
    const getNestedData = (path = []) => {
      // Start with the appropriate data object based on category
      let dataSource;
      if (selectCategory.value === 'Ag') {
        dataSource = window.map_area_Ag;
      } else if (selectCategory.value === 'Ag Mgt') {
        dataSource = window.map_area_Am;
      } else if (selectCategory.value === 'Non-Ag') {
        dataSource = window.map_area_NonAg;
      }

      if (!dataSource) return null;

      // Navigate through the nested structure using the provided path
      for (const key of path) {
        if (!dataSource || !dataSource[key]) return null;
        dataSource = dataSource[key];
      }

      return dataSource;
    };

    // Get options for a specific level in the hierarchy
    const getOptionsForLevel = (level) => {
      if (level === 'agMgt') {
        // Ag Mgt options only available in 'Ag Mgt' category
        if (selectCategory.value !== 'Ag Mgt' || !window.map_area_Am) return [];
        return Object.keys(window.map_area_Am);
      }

      if (level === 'water') {
        // Water options depend on category and possibly ag mgt selection
        if (selectCategory.value === 'Ag') {
          return Object.keys(window.map_area_Ag || {});
        } else if (selectCategory.value === 'Ag Mgt') {
          const agMgtData = getNestedData([selectAgMgt.value]);
          return agMgtData ? Object.keys(agMgtData) : [];
        }
        return [];
      }

      if (level === 'landuse') {
        // Landuse options depend on category and previous selections
        if (selectCategory.value === 'Ag') {
          const waterData = getNestedData([selectWater.value]);
          return waterData ? Object.keys(waterData) : [];
        } else if (selectCategory.value === 'Ag Mgt') {
          const waterData = getNestedData([selectAgMgt.value, selectWater.value]);
          return waterData ? Object.keys(waterData) : [];
        } else if (selectCategory.value === 'Non-Ag') {
          return Object.keys(window.map_area_NonAg || {});
        }
        return [];
      }

      return [];
    };

    // Computed properties using the centralized functions
    const availableAgMgt = computed(() => getOptionsForLevel('agMgt'));
    const availableWater = computed(() => getOptionsForLevel('water'));
    const availableLanduse = computed(() => getOptionsForLevel('landuse'));



    onMounted(async () => {

      await loadScript("./data/Supporting_info.js", 'Supporting_info');
      await loadScript("./data/chart_option/Chart_default_options.js", 'Chart_default_options');
      await loadScript("./data/Area_overview_2_Category.js", 'Area_overview_2_Category');
      await loadScript("./data/Area_overview_2_Category.js", 'Area_overview_2_Category');
      await loadScript(`${window.MapService.mapCategories['Area']['Ag']}`, 'map_area_Ag');
      await loadScript(`${window.MapService.mapCategories['Area']['Ag Mgt']}`, 'map_area_Am');
      await loadScript(`${window.MapService.mapCategories['Area']['Non-Ag']}`, 'map_area_NonAg');


      availableYears.value = window.Supporting_info.years;
      availableCategories.value = Object.keys(window.MapService.mapCategories['Area']);

      if (selectCategory.value === 'Ag') {
        mapPathName.value = 'window.map_area_Ag';
        mapSelectKey.value = [selectWater.value, selectLanduse.value, selectYear.value];
      } else if (selectCategory.value === 'Ag Mgt') {
        mapPathName.value = 'window.map_area_Am';
        mapSelectKey.value = [selectAgMgt.value, selectWater.value, selectLanduse.value, selectYear.value];
      } else if (selectCategory.value === 'Non-Ag') {
        mapPathName.value = 'window.map_area_NonAg';
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

    // Update map configuration when selections change
    watch([selectCategory, selectAgMgt, selectWater, selectLanduse, selectYear], () => {
      // Reset values if they're no longer valid options
      if (selectCategory.value === 'Ag Mgt') {
        const validAgMgtOptions = getOptionsForLevel('agMgt');
        if (validAgMgtOptions.length > 0 && !validAgMgtOptions.includes(selectAgMgt.value)) {
          selectAgMgt.value = validAgMgtOptions[0];
        }
      }

      const validWaterOptions = getOptionsForLevel('water');
      if (validWaterOptions.length > 0 && !validWaterOptions.includes(selectWater.value)) {
        selectWater.value = validWaterOptions[0];
      }

      const validLanduseOptions = getOptionsForLevel('landuse');
      if (validLanduseOptions.length > 0 && !validLanduseOptions.includes(selectLanduse.value)) {
        selectLanduse.value = validLanduseOptions[0];
      }

      // Set map configuration based on category
      if (selectCategory.value === 'Ag') {
        mapPathName.value = 'window.map_area_Ag';
        mapSelectKey.value = [selectWater.value, selectLanduse.value, selectYear.value];
      } else if (selectCategory.value === 'Ag Mgt') {
        mapPathName.value = 'window.map_area_Am';
        mapSelectKey.value = [selectAgMgt.value, selectWater.value, selectLanduse.value, selectYear.value];
      } else if (selectCategory.value === 'Non-Ag') {
        mapPathName.value = 'window.map_area_NonAg';
        mapSelectKey.value = [selectLanduse.value, selectYear.value];
      }

      // Force a redraw by creating a new array reference
      mapSelectKey.value = [...mapSelectKey.value];
    });



    return {
      yearIndex,
      isDrawerOpen,
      toggleDrawer,

      availableYears,
      availableCategories,
      availableAgMgt,
      availableWater,
      availableLanduse,

      selectRegion,
      selectDataset,

      selectCategory,
      selectAgMgt,
      selectWater,
      selectLanduse,
      selectYear,

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
          <button v-for="(val, key) in availableCategories" :key="key"
            @click="selectCategory = val"
            class="bg-[#e8eaed] text-[#1f1f1f] text-[0.8rem] px-1 py-1 rounded"
            :class="{'bg-sky-500 text-white': selectCategory === val}">
            {{ val }}
          </button>
        </div>
      </div>


      <!-- Dynamic control panel with consistent styling -->
      <!-- Category buttons (always visible) -->
      <div class="flex items-center justify-end absolute top-[250px] left-[20px] z-[1001]">
        <div class="flex space-x-1">
          <button v-for="(val, key) in availableCategories" :key="key"
            @click="selectCategory = val"
            class="bg-[#e8eaed] text-[#1f1f1f] text-[0.8rem] px-1 py-1 rounded"
            :class="{'bg-sky-500 text-white': selectCategory === val}">
            {{ val }}
          </button>
        </div>
      </div>

      <!-- Ag Mgt options (only for Ag Mgt category) -->
      <div v-if="availableAgMgt.length > 0" class="flex items-center justify-end absolute top-[280px] left-[20px] z-[1001]">
        <div class="flex flex-wrap gap-1 max-w-[400px]">
          <span class="text-[0.8rem] mr-1 font-medium">Ag Mgt:</span>
          <button v-for="(val, key) in availableAgMgt" :key="key"
            @click="selectAgMgt = val"
            class="bg-[#e8eaed] text-[#1f1f1f] text-[0.8rem] px-1 py-1 rounded mb-1"
            :class="{'bg-sky-500 text-white': selectAgMgt === val}">
            {{ val }}
          </button>
        </div>
      </div>

      <!-- Water options -->
      <div v-if="availableWater.length > 0" class="flex items-center justify-end absolute top-[310px] left-[20px] z-[1001]">
        <div class="flex flex-wrap gap-1 max-w-[400px]">
          <span class="text-[0.8rem] mr-1 font-medium">Water:</span>
          <button v-for="(val, key) in availableWater" :key="key"
            @click="selectWater = val"
            class="bg-[#e8eaed] text-[#1f1f1f] text-[0.8rem] px-1 py-1 rounded mb-1"
            :class="{'bg-sky-500 text-white': selectWater === val}">
            {{ val }}
          </button>
        </div>
      </div>

      <!-- Landuse options -->
      <div v-if="availableLanduse.length > 0" class="flex items-center justify-end absolute top-[340px] left-[20px] z-[1001]">
        <div class="flex flex-wrap gap-1 max-w-[400px]">
          <span class="text-[0.8rem] mr-1 font-medium">Landuse:</span>
          <button v-for="(val, key) in availableLanduse" :key="key"
            @click="selectLanduse = val"
            class="bg-[#e8eaed] text-[#1f1f1f] text-[0.8rem] px-1 py-1 rounded mb-1"
            :class="{'bg-sky-500 text-white': selectLanduse === val}">
            {{ val }}
          </button>
        </div>
      </div>







      <el-slider
        v-if="availableYears && availableYears.length > 0"
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
