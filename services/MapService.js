// Map Data Service
// This service provides data about maps for different regions and categories

window.MapService = {
  /**
   * Get map categories by listing files in the data directory
   * Files starting with map_ are considered map data files
   * @param {String} DataType - The type of data
   * @param {String} subcategory - The subcategory of the map (e.g., 'Ag', 'Am', 'NonAg')
   * @returns {String} The path to the map category file
   */
  getMapCategories(DataType = 'Area', subcategory = 'Ag') {
    const mapCategories = {
      'Area': {
        'Ag': 'data/map_area_Ag.js',
        'Am': 'data/map_area_Am.js',
        'NonAg': 'data/map_area_NonAg.js',
      },
      'Biodiversity': {
        'overall': {
          'Ag': 'data/map_bio_overall_Ag.js',
          'Am': 'data/map_bio_overall_Am.js',
          'NonAg': 'data/map_bio_overall_NonAg.js',
        },
        'GBF2': {
          'Ag': 'data/map_bio_GBF2_Ag.js',
          'Am': 'data/map_bio_GBF2_Am.js',
          'NonAg': 'data/map_bio_GBF2_NonAg.js',
        }
      },
      'Economics': {
        'Cost': {
          'Ag': 'data/map_bio_cost_Ag.js',
          'Am': 'data/map_bio_cost_Am.js',
          'NonAg': 'data/map_bio_cost_NonAg.js',
        },
        'Revenue': {
          'Ag': 'data/map_bio_revenue_Ag.js',
          'Am': 'data/map_bio_revenue_Am.js',
          'NonAg': 'data/map_bio_revenue_NonAg.js',
        },
        'GHG': {
          'Ag': 'data/map_bio_ghg_Ag.js',
          'Am': 'data/map_bio_ghg_Am.js',
          'NonAg': 'data/map_bio_ghg_NonAg.js',
        },
        'Water': {
          'Ag': 'data/map_bio_water_yield_Ag.js',
          'Am': 'data/map_bio_water_yield_Am.js',
          'NonAg': 'data/map_bio_water_yield_NonAg.js',
        }
      }
    };

    return mapCategories[DataType][subcategory];
  },

};