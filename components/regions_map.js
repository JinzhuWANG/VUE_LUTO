// Define the RegionsMap component
window.RegionsMap = {

  props: {
    mapPathName: {
      type: String,
      required: true
    },
    mapKey: {
      type: Array,
      required: true
    },
  },

  setup(props) {
    const { ref, inject, onMounted, computed } = Vue;
    const selectedRegion = inject('globalSelectedRegion');

    const map = ref(null);
    const boundingBox = ref(null);
    const loadScript = window.loadScript;
    const selectedBaseMap = ref('OSM');
    const tileLayers = ref({});

    const mapData = ref({})


    // Function to get current bounding box for the selected region
    const getCurrentRegion = computed(() => window.NRM_AUS_centroid_bbox[selectedRegion.value]);

    // Initialize map
    const initMap = () => {
      // Initialize the map centered on Australia
      map.value = L.map('map', {
        zoomControl: false
      }).setView([-25.2744, 133.7751], 5);

      // Create tile layers but don't add them yet
      tileLayers.value = {
        OSM: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 18
        }),
        Satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
          maxZoom: 18
        })
      };

      // Add initial base map
      if (selectedBaseMap.value !== 'None') {
        tileLayers.value[selectedBaseMap.value].addTo(map.value);
      }
    };

    // Update map when region changes
    const updateMap = () => {

      // Fade out existing elements first
      fadeOutExistingElements().then(() => {
        // Remove existing rectangles after fade out
        if (boundingBox.value) {
          map.value.removeLayer(boundingBox.value);
        }

        // Calculate bounds for smooth transition
        const bbox = window.NRM_AUS_centroid_bbox[selectedRegion.value].bounding_box;
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
          addRegionLayer();
        }, 500);
      });
    };

    // Fade out existing map elements
    const fadeOutExistingElements = () => {
      return new Promise((resolve) => {
        if (boundingBox.value) {
          animateRectangleOpacity(boundingBox.value, 0.2, 0, 300);
        }
        setTimeout(resolve, 300);
      });
    };

    // Add new elements to the map
    const addRegionLayer = () => {
      // Find the actual region feature from NRM_AUS data
      const regionLayer = window.NRM_AUS.features.find(feature =>
        feature.properties.NHT2NAME === selectedRegion.value
      );

      // Add the actual region polygon with initial opacity 0
      boundingBox.value = L.geoJSON(regionLayer, {
        style: {
          color: '#3b82f6',
          weight: 2,
          fillColor: '#3b82f6',
          fillOpacity: 0,
          opacity: 0
        }
      }).addTo(map.value);

      // Fade in new elements
      setTimeout(() => {
        animateRectangleOpacity(boundingBox.value, 0, 0.2, 500);
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
        await loadScript("services/MapService.js", 'MapService');
        await loadScript('data/geo/NRM_AUS_centroid_bbox.js', 'NRM_AUS_centroid_bbox');
        await loadScript('data/geo/NRM_AUS.js', 'NRM_AUS');

        // Initialize map first
        initMap();

        // Load map data if props are available
        await loadMapData();

        // Update map if a region is already selected
        if (selectedRegion.value && selectedRegion.value !== 'AUSTRALIA') {
          updateMap();
        }
      } catch (error) {
        console.error('Failed to initialize RegionsMap:', error);
      }
    });

    // Function to load map data
    const loadMapData = async () => {
      if (!props.mapPathName) {
        return;
      }

      // Map data is already loaded in Area.js
      const pathName = typeof props.mapPathName === 'string' ? 
        props.mapPathName.replace('window.', '') : 
        '';
      
      if (pathName) {
        mapData.value = props.mapKey.reduce((acc, key) => acc && acc[key], window[pathName]);
      }

      // Update the image overlay if map is already initialized
      if (map.value && mapData.value && mapData.value.img_str && mapData.value.bounds) {
        // Remove existing overlay if any
        map.value.eachLayer((layer) => {
          if (layer instanceof L.ImageOverlay) {
            map.value.removeLayer(layer);
          }
        });

        // Add new image overlay
        const imageOverlay = L.imageOverlay(
          mapData.value.img_str,
          mapData.value.bounds,
          {
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
      }
    };

    // Watch for changes in mapPathName and mapKey
    Vue.watch(() => [props.mapPathName, props.mapKey], async () => {
      await loadMapData();
    }, { deep: true });

    // Watch for changes in the selected region
    Vue.watch(selectedRegion, (newValue, oldValue) => {
      if (newValue && newValue !== 'AUSTRALIA') {
        updateMap();
      }
    });

    // Function to change base map
    const changeBaseMap = (mapType) => {
      selectedBaseMap.value = mapType;

      // Remove all existing tile layers
      Object.values(tileLayers.value).forEach(layer => {
        if (map.value.hasLayer(layer)) {
          map.value.removeLayer(layer);
        }
      });

      // Add new tile layer if not 'None'
      if (mapType !== 'None' && tileLayers.value[mapType]) {
        tileLayers.value[mapType].addTo(map.value);
      }
    };

    return {
      selectedRegion,
      getCurrentRegion,
      updateMap,
      selectedBaseMap,
      changeBaseMap
    };
  },
  template: `
    <div class="bg-white h-screen flex flex-col">
    
      <!-- Map Container with Controls Overlay -->
      <div class="bg-white shadow-lg flex-1 relative">
        <!-- Controls Panel -->
        <div class="absolute w-[270px] top-32 left-4 z-50 bg-white rounded-lg shadow-lg p-4 max-w-xs">
          <filterable-dropdown></filterable-dropdown>
        </div>

        <!-- Base Map Selector -->
        <div class="absolute top-4 left-4 z-50 bg-white rounded-lg shadow-lg p-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Base Map:</label>
          <select 
            v-model="selectedBaseMap" 
            @change="changeBaseMap(selectedBaseMap)"
            class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="OSM">OpenStreetMap</option>
            <option value="Satellite">Satellite</option>
            <option value="None">None</option>
          </select>
        </div>

        <!-- Legend -->
        <div class="absolute bottom-20 left-10 z-50 bg-white rounded-lg shadow-lg p-4">
          <h3 class="font-semibold text-gray-800 mb-3">Legend</h3>
          <div class="flex flex-wrap gap-6 text-sm">
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 border-2 border-blue-500 bg-blue-100"></div>
              <span>Bounding Box</span>
            </div>
          </div>
        </div>

        <!-- Map Container -->
        <div id="map" class="w-full h-full relative z-10"></div>
      </div>
    </div>
  `
};