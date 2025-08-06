// Define the RegionsMap component
window.RegionsMap = {
  setup() {

    const { ref, inject, onMounted, computed } = Vue;
    const selectedRegion = inject('globalSelectedRegion');
    const selectDataType = inject('globalSelectedDataType');
    const mapData = ref(null);
    const map = ref(null);
    const boundingBoxRectangle = ref(null);
    const regions = ref([]);
    const loadScript = window.loadScript;



    // Function to get current region data
    const getCurrentRegion = computed(() => {
      if (!selectedRegion.value || !window.NRM_AUS_centroid_bbox) return null;
      return window.NRM_AUS_centroid_bbox[selectedRegion.value];
    });


    // Initialize map
    const initMap = () => {
      // Initialize the map centered on Australia
      map.value = L.map('map').setView([-25.2744, 133.7751], 5);

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
      }).addTo(map.value);

      // Add image overlay for the map data
      const mapSel = mapData.value['dry']['Beef - modified land'][2050];
      const imageOverlay = L.imageOverlay(
        mapSel.img_str,
        [[mapSel.bbox[1], mapSel.bbox[0]], [mapSel.bbox[3], mapSel.bbox[2]]],
        {
          // Disable image smoothing/interpolation
          className: 'crisp-image'
        }
      ).addTo(map.value);

      // Apply CSS to disable image interpolation
      setTimeout(() => {
        const imgElement = imageOverlay.getElement();
        if (imgElement) {
          imgElement.style.imageRendering = 'pixelated';
          imgElement.style.imageRendering = '-moz-crisp-edges';
          imgElement.style.imageRendering = 'crisp-edges';
        }
      }, 100);
    };

    // Update map when region changes
    const updateMap = () => {
      if (!selectedRegion.value || !getCurrentRegion.value) return;

      const region = getCurrentRegion.value;

      // Fade out existing elements first
      fadeOutExistingElements().then(() => {
        // Remove existing rectangles after fade out
        if (boundingBoxRectangle.value) {
          map.value.removeLayer(boundingBoxRectangle.value);
        }

        // Calculate bounds for smooth transition
        const bbox = region.bounding_box;
        const bounds = [
          [bbox[1], bbox[0]], // Southwest corner
          [bbox[3], bbox[2]]  // Northeast corner
        ];

        // Smooth pan and zoom to the new region
        map.value.flyToBounds(bounds, {
          padding: [20, 20],
          duration: 1.5,
          easeLinearity: 0.25
        });

        // Add new elements with a delay to allow map transition
        setTimeout(() => {
          addNewElements(region, bounds);
        }, 500);
      });
    };

    // Fade out existing map elements
    const fadeOutExistingElements = () => {
      return new Promise((resolve) => {
        if (boundingBoxRectangle.value) {
          animateRectangleOpacity(boundingBoxRectangle.value, 0.2, 0, 300);
        }
        setTimeout(resolve, 300);
      });
    };

    // Add new elements to the map
    const addNewElements = (region, bounds) => {
      // Add bounding box rectangle with initial opacity 0
      boundingBoxRectangle.value = L.rectangle(bounds, {
        color: '#3b82f6',
        weight: 2,
        fillColor: '#3b82f6',
        fillOpacity: 0,
        opacity: 0
      }).addTo(map.value);

      boundingBoxRectangle.value.bindPopup(`
        <div class="text-center">
          <h3 class="font-bold">${selectedRegion.value}</h3>
          <p class="text-sm">Bounding Box</p>
          <p class="text-xs">SW: ${bounds[0][0].toFixed(4)}°, ${bounds[0][1].toFixed(4)}°</p>
          <p class="text-xs">NE: ${bounds[1][0].toFixed(4)}°, ${bounds[1][1].toFixed(4)}°</p>
        </div>
      `);

      // Fade in new elements
      setTimeout(() => {
        animateRectangleOpacity(boundingBoxRectangle.value, 0, 0.2, 500);
      }, 200);
    };

    // Animation functions
    const animateRectangleOpacity = (rectangle, startFillOpacity, endFillOpacity, duration) => {
      const startTime = Date.now();
      const startStrokeOpacity = startFillOpacity > 0 ? 1 : 0;
      const endStrokeOpacity = endFillOpacity > 0 ? 1 : 0;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeInOut(progress);

        const currentFillOpacity = startFillOpacity + (endFillOpacity - startFillOpacity) * easedProgress;
        const currentStrokeOpacity = startStrokeOpacity + (endStrokeOpacity - startStrokeOpacity) * easedProgress;

        rectangle.setStyle({
          fillOpacity: currentFillOpacity,
          opacity: currentStrokeOpacity
        });

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    };

    const easeInOut = (t) => {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    };

    // Load region data and initialize map on component mount
    onMounted(async () => {
      try {
        // Load region data
        await loadScript("data/map_area_Ag.js", 'map_area_Ag');
        await loadScript('data/geo/NRM_AUS_centroid_bbox.js', 'NRM_AUS_centroid_bbox');

        // Convert region data object to array
        regions.value = Object.keys(window.NRM_AUS_centroid_bbox).map(name => ({
          name,
          ...window.NRM_AUS_centroid_bbox[name]
        }));

        mapData.value = window.map_area_Ag;

        // Initialize map
        initMap();

        // Update map if a region is already selected
        if (selectedRegion.value && selectedRegion.value !== 'AUSTRALIA') {
          updateMap();
        }
      } catch (error) {
        console.error('Failed to initialize RegionsMap:', error);
      }
    });

    // Watch for changes in the selected region
    Vue.watch(selectedRegion, (newValue, oldValue) => {
      if (newValue && newValue !== 'AUSTRALIA') {
        updateMap();
      }
    });

    return {
      selectedRegion,
      regions,
      getCurrentRegion,
      updateMap
    };
  },
  template: `
    <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">Australia Regions Explorer</h2>
      
      <!-- Controls Panel -->
      <div class="flex flex-col md:flex-row gap-4 items-start md:items-center mb-4">
        <div class="flex-1 relative z-50">
          <label for="region-select" class="block text-sm font-medium text-gray-700 mb-2">
            Select Region:
          </label>
          <filterable-dropdown></filterable-dropdown>
        </div>
        
        <!-- Region Info -->
        <transition 
          enter-active-class="transition-all duration-500 ease-out"
          enter-from-class="opacity-0 transform translate-y-2"
          enter-to-class="opacity-100 transform translate-y-0"
          leave-active-class="transition-all duration-300 ease-in"
          leave-from-class="opacity-100 transform translate-y-0"
          leave-to-class="opacity-0 transform translate-y-2"
        >
        </transition>
      </div>

      <!-- Map Container -->
      <div class="bg-white rounded-lg shadow-lg overflow-hidden mt-8">
        <div id="map" class="w-full h-96 md:h-[500px] relative z-10"></div>
      </div>

      <!-- Legend -->
      <div class="bg-white rounded-lg shadow-lg p-4 mt-6">
        <h3 class="font-semibold text-gray-800 mb-3">Legend</h3>
        <div class="flex flex-wrap gap-6 text-sm">
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 border-2 border-blue-500 bg-blue-100"></div>
            <span>Bounding Box</span>
          </div>
        </div>
      </div>
    </div>
  `
};