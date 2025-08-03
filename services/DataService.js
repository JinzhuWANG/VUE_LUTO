// Ranking Data Service
// This service provides data about rankings for different regions and metrics

window.DataService = {
  /**
   * Get ranking data based on the selected region and year
   * @param {String} selectRegion - The selected region (default: 'AUSTRALIA')
   * @param {String} selectYear - The selected year (default: 2020)
   * @returns {Object} The ranking data object
   */
  getRankingData(selectRegion = 'AUSTRALIA', selectYear = 2020) {
    try {
      // Helper function to safely access nested properties
      const safeAccess = (obj, path, defaultValue = null) => {
        try {
          return path.reduce((acc, key) => acc && acc[key], obj);
        } catch (e) {
          return defaultValue;
        }
      };

      // Populate the rankingData based on the selected region
      const rankingData = {
        'Economics': {
          'Revenue': {
            'Rank': safeAccess(window, ['Economics_ranking', selectRegion, 'Revenue', 'Rank', selectYear]),
            'color': safeAccess(window, ['Economics_ranking', selectRegion, 'Revenue', 'color', selectYear]),
            'value': safeAccess(window, ['Economics_ranking', selectRegion, 'Revenue', 'value', selectYear]),
          },
          'Cost': {
            'Rank': safeAccess(window, ['Economics_ranking', selectRegion, 'Cost', 'Rank', selectYear]),
            'color': safeAccess(window, ['Economics_ranking', selectRegion, 'Cost', 'color', selectYear]),
            'value': safeAccess(window, ['Economics_ranking', selectRegion, 'Cost', 'value', selectYear]),
          },
          'Total': {
            'Rank': safeAccess(window, ['Economics_ranking', selectRegion, 'Total', 'Rank', selectYear]),
            'color': safeAccess(window, ['Economics_ranking', selectRegion, 'Total', 'color', selectYear]),
            'value': safeAccess(window, ['Economics_ranking', selectRegion, 'Total', 'value', selectYear]),
          },
        },
        'Area': {
          'Ag': {
            'Rank': safeAccess(window, ['Area_ranking', selectRegion, 'Agricultural Landuse', 'Rank', selectYear]),
            'color': safeAccess(window, ['Area_ranking', selectRegion, 'Agricultural Landuse', 'color', selectYear]),
            'value': safeAccess(window, ['Area_ranking', selectRegion, 'Agricultural Landuse', 'value', selectYear]),
          },
          'Am': {
            'Rank': safeAccess(window, ['Area_ranking', selectRegion, 'Agricultural Management', 'Rank', selectYear]),
            'color': safeAccess(window, ['Area_ranking', selectRegion, 'Agricultural Management', 'color', selectYear]),
            'value': safeAccess(window, ['Area_ranking', selectRegion, 'Agricultural Management', 'value', selectYear]),
          },
          'NonAg': {
            'Rank': safeAccess(window, ['Area_ranking', selectRegion, 'Non-Agricultural Landuse', 'Rank', selectYear]),
            'color': safeAccess(window, ['Area_ranking', selectRegion, 'Non-Agricultural Landuse', 'color', selectYear]),
            'value': safeAccess(window, ['Area_ranking', selectRegion, 'Non-Agricultural Landuse', 'value', selectYear]),
          },
          'Total': {
            'Rank': safeAccess(window, ['Area_ranking', selectRegion, 'Total', 'Rank', selectYear]),
            'color': safeAccess(window, ['Area_ranking', selectRegion, 'Total', 'color', selectYear]),
            'value': safeAccess(window, ['Area_ranking', selectRegion, 'Total', 'value', selectYear]),
          },
        },
        'GHG': {
          'Emissions': {
            'Rank': safeAccess(window, ['GHG_ranking', selectRegion, 'GHG emissions', 'Rank', selectYear]),
            'color': safeAccess(window, ['GHG_ranking', selectRegion, 'GHG emissions', 'color', selectYear]),
            'value': safeAccess(window, ['GHG_ranking', selectRegion, 'GHG emissions', 'value', selectYear]),
          },
          'Sequestration': {
            'Rank': safeAccess(window, ['GHG_ranking', selectRegion, 'GHG sequestrations', 'Rank', selectYear]),
            'color': safeAccess(window, ['GHG_ranking', selectRegion, 'GHG sequestrations', 'color', selectYear]),
            'value': safeAccess(window, ['GHG_ranking', selectRegion, 'GHG sequestrations', 'value', selectYear]),
          },
          'Total': {
            'Rank': safeAccess(window, ['GHG_ranking', selectRegion, 'Total', 'Rank', selectYear]),
            'color': safeAccess(window, ['GHG_ranking', selectRegion, 'Total', 'color', selectYear]),
            'value': safeAccess(window, ['GHG_ranking', selectRegion, 'Total', 'value', selectYear]),
          },
        },
        'Water': {
          'Ag': {
            'Rank': safeAccess(window, ['Water_ranking', selectRegion, 'Agricultural Landuse', 'Rank', selectYear]),
            'color': safeAccess(window, ['Water_ranking', selectRegion, 'Agricultural Landuse', 'color', selectYear]),
            'value': safeAccess(window, ['Water_ranking', selectRegion, 'Agricultural Landuse', 'value', selectYear]),
          },
          'Am': {
            'Rank': safeAccess(window, ['Water_ranking', selectRegion, 'Agricultural Management', 'Rank', selectYear]),
            'color': safeAccess(window, ['Water_ranking', selectRegion, 'Agricultural Management', 'color', selectYear]),
            'value': safeAccess(window, ['Water_ranking', selectRegion, 'Agricultural Management', 'value', selectYear]),
          },
          'NonAg': {
            'Rank': safeAccess(window, ['Water_ranking', selectRegion, 'Non-Agricultural Landuse', 'Rank', selectYear]),
            'color': safeAccess(window, ['Water_ranking', selectRegion, 'Non-Agricultural Landuse', 'color', selectYear]),
            'value': safeAccess(window, ['Water_ranking', selectRegion, 'Non-Agricultural Landuse', 'value', selectYear]),
          },
          'Total': {
            'Rank': safeAccess(window, ['Water_ranking', selectRegion, 'Total', 'Rank', selectYear]),
            'color': safeAccess(window, ['Water_ranking', selectRegion, 'Total', 'color', selectYear]),
            'value': safeAccess(window, ['Water_ranking', selectRegion, 'Total', 'value', selectYear]),
          },
        },
        'Biodiversity': {
          'Ag': {
            'Rank': safeAccess(window, ['Biodiversity_ranking', selectRegion, 'Agricultural Landuse', 'Rank', selectYear]),
            'color': safeAccess(window, ['Biodiversity_ranking', selectRegion, 'Agricultural Landuse', 'color', selectYear]),
            'value': safeAccess(window, ['Biodiversity_ranking', selectRegion, 'Agricultural Landuse', 'value', selectYear]),
          },
          'Am': {
            'Rank': safeAccess(window, ['Biodiversity_ranking', selectRegion, 'Agricultural Management', 'Rank', selectYear]),
            'color': safeAccess(window, ['Biodiversity_ranking', selectRegion, 'Agricultural Management', 'color', selectYear]),
            'value': safeAccess(window, ['Biodiversity_ranking', selectRegion, 'Agricultural Management', 'value', selectYear]),
          },
          'NonAg': {
            'Rank': safeAccess(window, ['Biodiversity_ranking', selectRegion, 'Non-Agricultural land-use', 'Rank', selectYear]),
            'color': safeAccess(window, ['Biodiversity_ranking', selectRegion, 'Non-Agricultural land-use', 'color', selectYear]),
            'value': safeAccess(window, ['Biodiversity_ranking', selectRegion, 'Non-Agricultural land-use', 'value', selectYear]),
          },
          'Total': {
            'Rank': safeAccess(window, ['Biodiversity_ranking', selectRegion, 'Total', 'Rank', selectYear]),
            'color': safeAccess(window, ['Biodiversity_ranking', selectRegion, 'Total', 'color', selectYear]),
            'value': safeAccess(window, ['Biodiversity_ranking', selectRegion, 'Total', 'value', selectYear]),
          },
        },
      };

      return rankingData;
    } catch (error) {
      console.error("Error loading ranking data:", error);
      return {};
    }
  },

  /**
   * Get subcategory keys for a given data type
   * @param {String} dataType - The data type (Economics, Area, GHG, Water, Biodiversity)
   * @returns {Array} Array of subcategory keys
   */
  getSubcategories(dataType) {
    return this.SubcategoryMapping[dataType] ? Object.keys(this.SubcategoryMapping[dataType]) : [];
  },

  // Mapping between UI subcategory names and actual data structure keys
  SubcategoryMapping: {
    'Economics': {
      'Revenue': 'Revenue',
      'Cost': 'Cost',
    },
    'Area': {
      'Ag': 'Agricultural Landuse',
      'Ag Mgt': 'Agricultural Management',
      'Non-Ag': 'Non-Agricultural Landuse',
      'Total': 'Total'
    },
    'GHG': {
      'Emissions': 'GHG emissions',
      'Sequestration': 'GHG sequestrations',
    },
    'Water': {
      'Ag': 'Agricultural Landuse',
      'Ag Mgt': 'Agricultural Management',
      'Non-Ag': 'Non-Agricultural Landuse',
      'Total': 'Total'
    },
    'Biodiversity': {
      'Ag': 'Agricultural Landuse',
      'Ag Mgt': 'Agricultural Management',
      'Non-Ag': 'Non-Agricultural land-use',
      'Total': 'Total'
    }
  },

  /**
   * Maps a UI subcategory to the actual data structure key
   * @param {String} dataType - The data type (Economics, Area, GHG, Water, Biodiversity)
   * @param {String} subcategory - The UI subcategory (Ag, Am, NonAg, Total, etc.)
   * @returns {String} The actual data structure key
   */
  mapSubcategory(dataType, subcategory) {
    // Default to 'Total' if no subcategory provided
    if (!subcategory) return 'Total';

    // Get the mapping for this data type
    const mapping = this.SubcategoryMapping[dataType];
    if (!mapping) return subcategory;

    // Return the mapped subcategory or the original if no mapping found
    return mapping[subcategory] || subcategory;
  },

};
