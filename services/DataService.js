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
      // Populate the rankingData based on the selected region
      const rankingData = {
        'Economics': {
          'Revenue': selectRegion === 'AUSTRALIA' ? { 'Rank': 'N.A.', 'Percent': 0, 'color': '#e8eaed' } : {
            'Rank': window['Economics_ranking'][selectRegion]['Revenue']['Rank'][selectYear],
            'Percent': window['Economics_ranking'][selectRegion]['Revenue']['Percent'][selectYear],
            'color': window['Economics_ranking'][selectRegion]['Revenue']['color'][selectYear],
          },
          'Cost': selectRegion === 'AUSTRALIA' ? { 'Rank': 'N.A.', 'Percent': 0, 'color': '#e8eaed' } : {
            'Rank': window['Economics_ranking'][selectRegion]['Cost']['Rank'][selectYear],
            'Percent': window['Economics_ranking'][selectRegion]['Cost']['Percent'][selectYear],
            'color': window['Economics_ranking'][selectRegion]['Cost']['color'][selectYear],
          },
        },
        'Area': {
          'Ag': selectRegion === 'AUSTRALIA' ? { 'Rank': 'N.A.', 'Percent': 0, 'color': '#e8eaed' } : {
            'Rank': window['Area_ranking'][selectRegion]['Agricultural landuse']['Rank'][selectYear],
            'Percent': window['Area_ranking'][selectRegion]['Agricultural landuse']['Percent'][selectYear],
            'color': window['Area_ranking'][selectRegion]['Agricultural landuse']['color'][selectYear],
          },
          'Am': selectRegion === 'AUSTRALIA' ? { 'Rank': 'N.A.', 'Percent': 0, 'color': '#e8eaed' } : {
            'Rank': window['Area_ranking'][selectRegion]['Agricultural management']['Rank'][selectYear],
            'Percent': window['Area_ranking'][selectRegion]['Agricultural management']['Percent'][selectYear],
            'color': window['Area_ranking'][selectRegion]['Agricultural management']['color'][selectYear],
          },
          'NonAg': selectRegion === 'AUSTRALIA' ? { 'Rank': 'N.A.', 'Percent': 0, 'color': '#e8eaed' } : {
            'Rank': window['Area_ranking'][selectRegion]['Non-agricultural landuse']['Rank'][selectYear],
            'Percent': window['Area_ranking'][selectRegion]['Non-agricultural landuse']['Percent'][selectYear],
            'color': window['Area_ranking'][selectRegion]['Non-agricultural landuse']['color'][selectYear],
          },
          'Total': selectRegion === 'AUSTRALIA' ? { 'Rank': 'N.A.', 'Percent': 0, 'color': '#e8eaed' } : {
            'Rank': window['Area_ranking'][selectRegion]['Total']['Rank'][selectYear],
            'Percent': window['Area_ranking'][selectRegion]['Total']['Percent'][selectYear],
            'color': window['Area_ranking'][selectRegion]['Total']['color'][selectYear],
          },
        },
        'GHG': {
          'Emissions': selectRegion === 'AUSTRALIA' ? { 'Rank': 'N.A.', 'Percent': 0, 'color': '#e8eaed' } : {
            'Rank': window['GHG_ranking'][selectRegion]['GHG emissions']['Rank'][selectYear],
            'Percent': window['GHG_ranking'][selectRegion]['GHG emissions']['Percent'][selectYear],
            'color': window['GHG_ranking'][selectRegion]['GHG emissions']['color'][selectYear],
          },
          'Sequestration': selectRegion === 'AUSTRALIA' ? { 'Rank': 'N.A.', 'Percent': 0, 'color': '#e8eaed' } : {
            'Rank': window['GHG_ranking'][selectRegion]['GHG sequestrations']['Rank'][selectYear],
            'Percent': window['GHG_ranking'][selectRegion]['GHG sequestrations']['Percent'][selectYear],
            'color': window['GHG_ranking'][selectRegion]['GHG sequestrations']['color'][selectYear],
          },
        },
        'Water': {
          'Ag': selectRegion === 'AUSTRALIA' ? { 'Rank': 'N.A.', 'Percent': 0, 'color': '#e8eaed' } : {
            'Rank': window['Water_yield_ranking'][selectRegion]['Agricultural Landuse']['Rank'][selectYear],
            'Percent': window['Water_yield_ranking'][selectRegion]['Agricultural Landuse']['Percent'][selectYear],
            'color': window['Water_yield_ranking'][selectRegion]['Agricultural Landuse']['color'][selectYear],
          },
          'Am': selectRegion === 'AUSTRALIA' ? { 'Rank': 'N.A.', 'Percent': 0, 'color': '#e8eaed' } : {
            'Rank': window['Water_yield_ranking'][selectRegion]['Agricultural Management']['Rank'][selectYear],
            'Percent': window['Water_yield_ranking'][selectRegion]['Agricultural Management']['Percent'][selectYear],
            'color': window['Water_yield_ranking'][selectRegion]['Agricultural Management']['color'][selectYear],
          },
          'NonAg': selectRegion === 'AUSTRALIA' ? { 'Rank': 'N.A.', 'Percent': 0, 'color': '#e8eaed' } : {
            'Rank': window['Water_yield_ranking'][selectRegion]['Non-Agricultural Landuse']['Rank'][selectYear],
            'Percent': window['Water_yield_ranking'][selectRegion]['Non-Agricultural Landuse']['Percent'][selectYear],
            'color': window['Water_yield_ranking'][selectRegion]['Non-Agricultural Landuse']['color'][selectYear],
          },
          'Total': selectRegion === 'AUSTRALIA' ? { 'Rank': 'N.A.', 'Percent': 0, 'color': '#e8eaed' } : {
            'Rank': window['Water_yield_ranking'][selectRegion]['Total']['Rank'][selectYear],
            'Percent': window['Water_yield_ranking'][selectRegion]['Total']['Percent'][selectYear],
            'color': window['Water_yield_ranking'][selectRegion]['Total']['color'][selectYear],
          },
        },
        'Biodiversity': {
          'Ag': selectRegion === 'AUSTRALIA' ? { 'Rank': 'N.A.', 'Percent': 0, 'color': '#e8eaed' } : {
            'Rank': window['Biodiversity_ranking'][selectRegion]['Agricultural Landuse']['Rank'][selectYear],
            'Percent': window['Biodiversity_ranking'][selectRegion]['Agricultural Landuse']['Percent'][selectYear],
            'color': window['Biodiversity_ranking'][selectRegion]['Agricultural Landuse']['color'][selectYear],
          },
          'Am': selectRegion === 'AUSTRALIA' ? { 'Rank': 'N.A.', 'Percent': 0, 'color': '#e8eaed' } : {
            'Rank': window['Biodiversity_ranking'][selectRegion]['Agricultural Management']['Rank'][selectYear],
            'Percent': window['Biodiversity_ranking'][selectRegion]['Agricultural Management']['Percent'][selectYear],
            'color': window['Biodiversity_ranking'][selectRegion]['Agricultural Management']['color'][selectYear],
          },
          'NonAg': selectRegion === 'AUSTRALIA' ? { 'Rank': 'N.A.', 'Percent': 0, 'color': '#e8eaed' } : {
            'Rank': window['Biodiversity_ranking'][selectRegion]['Non-Agricultural land-use']['Rank'][selectYear],
            'Percent': window['Biodiversity_ranking'][selectRegion]['Non-Agricultural land-use']['Percent'][selectYear],
            'color': window['Biodiversity_ranking'][selectRegion]['Non-Agricultural land-use']['color'][selectYear],
          },
          'Total': selectRegion === 'AUSTRALIA' ? { 'Rank': 'N.A.', 'Percent': 0, 'color': '#e8eaed' } : {
            'Rank': window['Biodiversity_ranking'][selectRegion]['Total']['Rank'][selectYear],
            'Percent': window['Biodiversity_ranking'][selectRegion]['Total']['Percent'][selectYear],
            'color': window['Biodiversity_ranking'][selectRegion]['Total']['color'][selectYear],
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
      'Total': 'Total'
    },
    'Area': {
      'Ag': 'Agricultural landuse',
      'Am': 'Agricultural management',
      'NonAg': 'Non-agricultural landuse',
      'Total': 'Total'
    },
    'GHG': {
      'Emissions': 'GHG emissions',
      'Sequestration': 'GHG sequestrations',
      'Total': 'Total'
    },
    'Water': {
      'Ag': 'Agricultural Landuse',
      'Am': 'Agricultural Management',
      'NonAg': 'Non-Agricultural Landuse',
      'Total': 'Total'
    },
    'Biodiversity': {
      'Ag': 'Agricultural Landuse',
      'Am': 'Agricultural Management',
      'NonAg': 'Non-Agricultural land-use',
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