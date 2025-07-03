import json
import geopandas as gpd


NRM_AUS = gpd.read_file('NRM_SIMPLIFY_FILTER/NRM_AUS_SIMPLIFIED.shp')

# Save to GeoJSON file
NRM_AUS.to_file('../data/geo/NRM_AUS.geojson', driver='GeoJSON')

# Load the GeoJSON as a Python dict using json.load
with open('../data/geo/NRM_AUS.geojson', 'r', encoding='utf-8') as f:
    geojson_data = json.load(f)
    
with open('../data/geo/NRM_AUS.js', 'w', encoding='utf-8') as f:
    f.write(f'window.NRM_AUS_data = {json.dumps(geojson_data, indent=2)};\n')
















