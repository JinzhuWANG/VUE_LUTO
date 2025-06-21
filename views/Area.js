window.AreaView = {
  setup() {
    const { ref, reactive } = Vue;
    const isLoading = ref(true);
    const activeDataset = ref("area_1_total_area_wide");

    // Stores all loaded datasets
    const datasets = reactive({});

    // List of available datasets
    const datasetNames = [
      "area_1_total_area_wide",
      "area_2_forest_coverage",
      "area_3_agricultural_land",
      // Add more dataset names here
    ];

    // Load a specific dataset by name
    const loadDataset = (datasetName) => {
      // If already loaded, use from cache
      if (datasets[datasetName]) {
        return Promise.resolve(datasets[datasetName]);
      }

      const scriptId = `${datasetName}_script`;
      const existingScript = document.getElementById(scriptId);

      // If script exists but data wasn't stored in our datasets object
      if (
        existingScript &&
        window[`${datasetName}_option`] &&
        window[`${datasetName}_data`]
      ) {
        datasets[datasetName] = {
          options: window[`${datasetName}_option`],
          data: window[`${datasetName}_data`],
        };
        return Promise.resolve(datasets[datasetName]);
      }

      // Otherwise load the script
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.id = scriptId;
        script.src = `./data/${datasetName}_data.js`;
        script.onload = () => {
          datasets[datasetName] = {
            options: window[`${datasetName}_option`],
            data: window[`${datasetName}_data`],
          };
          resolve(datasets[datasetName]);
        };
        script.onerror = () => {
          console.error(`Failed to load dataset: ${datasetName}`);
          reject();
        };
        document.head.appendChild(script);
      });
    };

    // Function to change current dataset
    const changeDataset = (datasetName) => {
      activeDataset.value = datasetName;
      isLoading.value = true;

      loadDataset(datasetName)
        .then(() => {
          isLoading.value = false;
        })
        .catch((error) => {
          console.error(`Error loading dataset ${datasetName}:`, error);
          isLoading.value = false;
        });
    };

    // Load the initial dataset
    loadDataset(activeDataset.value)
      .then(() => {
        isLoading.value = false;
      })
      .catch((error) => {
        console.error("Initial dataset load failed:", error);
        isLoading.value = false;
      });

    return {
      isLoading,
      activeDataset,
      datasetNames,
      changeDataset,
      // Computed properties to get current dataset's options and data
      chartOptions: () => datasets[activeDataset.value]?.options || null,
      chartData: () => datasets[activeDataset.value]?.data || null,
    };
  },
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-6">Area Analysis</h1>
      
      <!-- Dataset selector -->
      <div class="mb-6">
        <label class="block text-sm font-medium mb-2">Select Dataset:</label>
        <select 
          v-model="activeDataset"
          @change="changeDataset(activeDataset)"
          class="px-4 py-2 border rounded-md w-full md:w-64">
          <option v-for="name in datasetNames" :key="name" :value="name">
            {{ name.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') }}
          </option>
        </select>
      </div>
      
      <!-- Loading indicator -->
      <div v-if="isLoading" class="flex justify-center items-center h-[400px]">
        <div class="text-lg">Loading data...</div>
      </div>
      
      <!-- Chart -->
      <chart-container
        v-else
        :chart-options="chartOptions()"
        :chart-data="chartData()">
      </chart-container>
    </div>
  `,
};
