// Map Data Service
// This service provides data about maps for different regions and categories

window.MapService = {

  mapCategories: {
    'Area': {
      'Ag': 'data/map_area_Ag.js',
      'Ag Mgt': 'data/map_area_Am.js',
      'Non-Ag': 'data/map_area_NonAg.js',
    },
    'Biodiversity': {
      'overall': {
        'Ag': 'data/map_bio_overall_Ag.js',
        'Ag Mgt': 'data/map_bio_overall_Am.js',
        'Non-Ag': 'data/map_bio_overall_NonAg.js',
      },
      'GBF2': {
        'Ag': 'data/map_bio_GBF2_Ag.js',
        'Ag Mgt': 'data/map_bio_GBF2_Am.js',
        'Non-Ag': 'data/map_bio_GBF2_NonAg.js',
      }
    },
    'Economics': {
      'Cost': {
        'Ag': 'data/map_bio_cost_Ag.js',
        'Ag Mgt': 'data/map_bio_cost_Am.js',
        'Non-Ag': 'data/map_bio_cost_NonAg.js',
      },
      'Revenue': {
        'Ag': 'data/map_bio_revenue_Ag.js',
        'Ag Mgt': 'data/map_bio_revenue_Am.js',
        'Non-Ag': 'data/map_bio_revenue_NonAg.js',
      },
      'GHG': {
        'Ag': 'data/map_bio_ghg_Ag.js',
        'Ag Mgt': 'data/map_bio_ghg_Am.js',
        'Non-Ag': 'data/map_bio_ghg_NonAg.js',
      },
      'Water': {
        'Ag': 'data/map_bio_water_yield_Ag.js',
        'Ag Mgt': 'data/map_bio_water_yield_Am.js',
        'Non-Ag': 'data/map_bio_water_yield_NonAg.js',
      }
    }
  }


};