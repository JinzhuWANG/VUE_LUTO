// Map Data Service
// This service provides data about maps for different regions and categories

window.MapService = {

  mapCategories: {
    'Area': {
      'Ag': { 'path': 'data/map_area_Ag.js', 'name': 'map_area_Ag' },
      'Ag Mgt': { 'path': 'data/map_area_Am.js', 'name': 'map_area_Am' },
      'Non-Ag': { 'path': 'data/map_area_NonAg.js', 'name': 'map_area_NonAg' },
    },
    'Biodiversity': {
      'overall': {
        'Ag': { 'path': 'data/map_bio_overall_Ag.js', 'name': 'map_bio_overall_Ag' },
        'Ag Mgt': { 'path': 'data/map_bio_overall_Am.js', 'name': 'map_bio_overall_Am' },
        'Non-Ag': { 'path': 'data/map_bio_overall_NonAg.js', 'name': 'map_bio_overall_NonAg' },
      },
      'GBF2': {
        'Ag': { 'path': 'data/map_bio_GBF2_Ag.js', 'name': 'map_bio_GBF2_Ag' },
        'Ag Mgt': { 'path': 'data/map_bio_GBF2_Am.js', 'name': 'map_bio_GBF2_Am' },
        'Non-Ag': { 'path': 'data/map_bio_GBF2_NonAg.js', 'name': 'map_bio_GBF2_NonAg' },
      }
    },
    'Economics': {
      'Cost': {
        'Ag': { 'path': 'data/map_bio_cost_Ag.js', 'name': 'map_bio_cost_Ag' },
        'Ag Mgt': { 'path': 'data/map_bio_cost_Am.js', 'name': 'map_bio_cost_Am' },
        'Non-Ag': { 'path': 'data/map_bio_cost_NonAg.js', 'name': 'map_bio_cost_NonAg' },
      },
      'Revenue': {
        'Ag': { 'path': 'data/map_bio_revenue_Ag.js', 'name': 'map_bio_revenue_Ag' },
        'Ag Mgt': { 'path': 'data/map_bio_revenue_Am.js', 'name': 'map_bio_revenue_Am' },
        'Non-Ag': { 'path': 'data/map_bio_revenue_NonAg.js', 'name': 'map_bio_revenue_NonAg' },
      },
      'GHG': {
        'Ag': { 'path': 'data/map_bio_ghg_Ag.js', 'name': 'map_bio_ghg_Ag' },
        'Ag Mgt': { 'path': 'data/map_bio_ghg_Am.js', 'name': 'map_bio_ghg_Am' },
        'Non-Ag': { 'path': 'data/map_bio_ghg_NonAg.js', 'name': 'map_bio_ghg_NonAg' },
      },
      'Water': {
        'Ag': { 'path': 'data/map_bio_water_yield_Ag.js', 'name': 'map_bio_water_yield_Ag' },
        'Ag Mgt': { 'path': 'data/map_bio_water_yield_Am.js', 'name': 'map_bio_water_yield_Am' },
        'Non-Ag': { 'path': 'data/map_bio_water_yield_NonAg.js', 'name': 'map_bio_water_yield_NonAg' },
      }
    }
  }


};