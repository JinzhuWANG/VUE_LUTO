window.Test = {
    components: {
        FilterableDropdown: FilterableDropdown // Reference the global component directly
    },
    setup() {
        const { ref, onMounted, inject } = Vue;
        const selectedRegion = inject('globalSelectedRegion');
        const regionNames = ref([]);

        onMounted(async () => {
            await window.loadScript("./data/geo/NRM_AUS.js", 'NRM_AUS');
            regionNames.value = window.NRM_AUS.features.map(feature => feature.properties.NHT2NAME).sort();
        });

        return {
            regionNames,
            selectedRegion
        };
    },
    template: `
    <div class="max-w-[500px] p-6 justify-center items-center bg-grey-700 rounded-lg shadow-md">
      <h2 class="text-2xl font-bold mb-4 text-gray-800">Filterable Dropdown Example</h2>
      
      <FilterableDropdown 
        :items="regionNames"
        v-model="selectedRegion"
        placeholder="Select a region..."
        searchPlaceholder="Search regions..."
        :showResultCount="false"
        :showSelectedDisplay="false"
      />
    </div>
  `
};