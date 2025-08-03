window.SettingsView = {
  setup(props, { emit }) {
    const { ref, onMounted, watch, computed } = Vue;
    const loadScript = window.loadScript;

    const settingsFilterTxt = ref("");
    const filteredSettings = ref([]);
    const chartMemLogData = ref({});
    const activeFilter = ref("all");

    const categories = {
      'Basic Configuration': {
        icon: '⚙️',
        keywords: ['VERSION', 'INPUT_DIR', 'OUTPUT_DIR', 'RAW_DATA', 'SSP', 'RCP', 'SCENARIO', 'OBJECTIVE', 'SIM_YEARS']
      },
      'Diet & Consumption': {
        icon: '🍽️',
        keywords: ['DIET_DOM', 'DIET_GLOB', 'WASTE', 'FEED_EFFICIENCY', 'CONVERGENCE', 'IMPORT_TREND', 'OFF_LAND_COMMODITIES', 'EGGS_AVG_WEIGHT']
      },
      'Economic Parameters': {
        icon: '💰',
        keywords: ['DISCOUNT_RATE', 'RESFACTOR', 'CARBON_PRICE', 'COST', 'AMORTISE', 'AMORTISATION', 'FENCING_COST', 'IRRIG_COST', 'MAINTENANCE', 'ECOSYSTEM_SERVICES']
      },
      'Risk & Environmental': {
        icon: '⚠️',
        keywords: ['RISK_OF_REVERSAL', 'FIRE_RISK', 'CO2_FERT', 'SOC_AMORTISATION']
      },
      'Biodiversity & Conservation': {
        icon: '🌿',
        keywords: ['BIO_CONTRIBUTION', 'GBF', 'BIODIVERSITY', 'HABITAT', 'CONNECTIVITY', 'EP_', 'RP_', 'DEGRADED_AREAS']
      },
      'Climate & GHG': {
        icon: '🌡️',
        keywords: ['GHG', 'CO2', 'CARBON', 'CLIMATE', 'EMISSIONS', 'SCOPE_1', 'CROP_GHG', 'LVSTK_GHG']
      },
      'Water Management': {
        icon: '💧',
        keywords: ['WATER', 'IRRIGATION', 'DRAINAGE', 'LIVESTOCK_DRINKING', 'LICENSE']
      },
      'Land Use & Planning': {
        icon: '🌾',
        keywords: ['LAND', 'AGRICULTURAL', 'NON_AG', 'PLANTING', 'AGROFORESTRY', 'NO_GO', 'REGIONAL_ADOPTION', 'CULL_MODE', 'MAX_LAND_USES']
      },
      'Carbon Plantings': {
        icon: '🌳',
        keywords: ['CP_BLOCK', 'CP_BELT', 'CARBON_PLANTING']
      },
      'Riparian & Agroforestry': {
        icon: '🌲',
        keywords: ['RIPARIAN', 'AF_', 'AGROFORESTRY', 'ROW_WIDTH', 'ROW_SPACING', 'PROPORTION', 'BUFFER_WIDTH', 'TORTUOSITY']
      },
      'Agricultural Management': {
        icon: '🚜',
        keywords: ['AG_MANAGEMENTS', 'HIR_', 'BEEF_HIR', 'SHEEP_HIR', 'SAVBURN', 'PRODUCTIVITY', 'EFFECT_YEARS', 'USE_THRESHOLD']
      },
      'Solver & Optimization': {
        icon: '🔧',
        keywords: ['SOLVER', 'WEIGHT', 'TOLERANCE', 'PRESOLVE', 'CROSSOVER', 'BARRIER', 'SCALE_FLAG', 'NUMERIC_FOCUS', 'BARHOMOGENOUS', 'CONSTRAINT_TYPE', 'PENALTY', 'ALPHA', 'BETA']
      },
      'Output & Processing': {
        icon: '📊',
        keywords: ['WRITE', 'OUTPUT', 'PARALLEL', 'GEOTIFFS', 'RESCALE_FACTOR', 'VERBOSE', 'KEEP_OUTPUTS', 'ROUND_DECMIALS']
      },
      'System Resources': {
        icon: '💻',
        keywords: ['THREADS', 'MEM', 'NCPUS', 'TIME', 'QUEUE', 'JOB_NAME', 'SOLVE_METHOD', 'AGGREGATE']
      },
      'Land Use Configuration': {
        icon: '🗺️',
        keywords: ['EXCLUDE_NO_GO', 'VECTORS', 'REVERSIBLE', 'BASE_CODE', 'PERCENTAGE']
      }
    };

    const categorizeParameters = (parameters) => {
      const categorized = {};
      const uncategorized = [];

      Object.keys(categories).forEach(cat => {
        categorized[cat] = [];
      });

      parameters.forEach(param => {
        let assigned = false;

        for (const [categoryName, categoryData] of Object.entries(categories)) {
          if (categoryData.keywords.some(keyword =>
            param.parameter.toUpperCase().includes(keyword.toUpperCase())
          )) {
            categorized[categoryName].push(param);
            assigned = true;
            break;
          }
        }

        if (!assigned) {
          uncategorized.push(param);
        }
      });

      if (uncategorized.length > 0) {
        categorized['Other'] = uncategorized;
      }

      return categorized;
    };

    const filterParameters = (searchTerm, filterType, allSettings) => {
      let filtered = allSettings || [];

      if (searchTerm) {
        filtered = filtered.filter(param =>
          param.parameter.toLowerCase().includes(searchTerm.toLowerCase()) ||
          param.val.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (filterType && filterType !== 'all') {
        filtered = filtered.filter(param =>
          param.parameter.includes(filterType)
        );
      }

      return filtered;
    };

    const categorizedSettings = computed(() => {
      const allSettings = window['Supporting_info']?.model_run_settings || [];
      const filtered = filterParameters(settingsFilterTxt.value, activeFilter.value, allSettings);
      return categorizeParameters(filtered);
    });

    const settingsStats = computed(() => {
      const allSettings = window['Supporting_info']?.model_run_settings || [];
      const filtered = filterParameters(settingsFilterTxt.value, activeFilter.value, allSettings);
      const categories = new Set();

      filtered.forEach(param => {
        if (param.parameter.includes('BIO_')) categories.add('Biodiversity');
        if (param.parameter.includes('GHG')) categories.add('GHG');
        if (param.parameter.includes('WATER')) categories.add('Water');
        if (param.parameter.includes('SOLVER')) categories.add('Solver');
        if (param.parameter.includes('AG_')) categories.add('Agriculture');
        if (param.parameter.includes('CP_')) categories.add('Carbon');
        if (param.parameter.includes('COST')) categories.add('Costs');
      });

      return {
        total: filtered.length,
        categories: categories.size,
        biodiversity: filtered.filter(p => p.parameter.includes('BIO_')).length,
        enabled: filtered.filter(p => p.val === 'on' || p.val === 'True').length
      };
    });

    const setActiveFilter = (filter) => {
      activeFilter.value = filter;
    };

    const isLongValue = (value) => {
      return typeof value === 'string' && value.length > 50;
    };

    const isVeryLongValue = (value) => {
      return typeof value === 'string' && value.length > 200;
    };

    onMounted(async () => {
      try {
        await loadScript("./data/Supporting_info.js", 'Supporting_info');
        await loadScript("./data/chart_option/Chart_default_options.js", 'Chart_default_options');
        await loadScript("./data/chart_option/chartMemLogOptions.js", 'chartMemLogOptions');

        chartMemLogData.value = {
          ...window['Chart_default_options'],
          ...window['chartMemLogOptions'],
          series: window['Supporting_info'].mem_logs,
        };

        filteredSettings.value = window['Supporting_info']['model_run_settings'] || [];

      } catch (error) {
        console.error("Error loading dependencies for Settings view:", error);
      }
    });

    return {
      settingsFilterTxt,
      filteredSettings,
      chartMemLogData,
      activeFilter,
      categories,
      categorizedSettings,
      settingsStats,
      setActiveFilter,
      isLongValue,
      isVeryLongValue,
    };
  },

  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">Settings and Logs</h1>
      
      <div class="flex gap-4 mb-16">
        <!-- Settings -->
        <div class="flex-1 flex-col rounded-[10px] bg-white shadow-md">
          <div class="flex items-center h-[auto] min-h-[40px]">
            <p class="flex-1 text-sm font-bold ml-2 p-1 items-center z-10">Scenarios and Settings</p>
            <input v-model="settingsFilterTxt" type="text" placeholder="Filter parameters..." class="sticky bg-white mr-4 justify-end text-sm border rounded" />
          </div>
          <div class="h-[440px] overflow-y-auto mb-2">
            <table class="text-left min-w-[300px]">
              <tbody>
                <tr v-for="setting in filteredSettings" :key="setting.parameter" class="bg-white border-b border-gray-200 hover:bg-gray-100">
                  <td class="px-2 py-1 text-[0.55rem] text-gray-900 whitespace-wrap break-words">{{ setting.parameter }}</td>
                  <td class="px-2 py-1 text-[0.55rem] text-gray-500 whitespace-wrap break-words">{{ setting.val }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Memory use logs -->
        <div class="flex flex-col rounded-[10px] bg-white shadow-md flex-1 mr-4">
          <div class="flex items-center justify-start ml-2 h-[40px]">
            <p class="text-sm font-bold">Memory Use Logs</p>
          </div>
          <hr class="border-gray-300">
          <chart-container class="flex-1 rounded-[10px]" :chartData="chartMemLogData"/>
        </div>
      </div>
    </div>
  `,
};