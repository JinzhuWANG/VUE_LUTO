import json
import geopandas as gpd


NRM_AUS = gpd.read_file('dataTransform/NRM_SIMPLIFY_FILTER/NRM_AUS_SIMPLIFIED.shp')

# Save to GeoJSON file
NRM_AUS.to_file('data/geo/NRM_AUS.geojson', driver='GeoJSON')



# Load the GeoJSON as a Python dict using json.load
with open('data/geo/NRM_AUS.geojson', 'r', encoding='utf-8') as f:
    geojson_data = json.load(f)
    
with open('data/geo/NRM_AUS.js', 'w', encoding='utf-8') as f:
    f.write(f'window.NRM_AUS = {json.dumps(geojson_data, indent=2)};\n')



# Calculate the centroid and bounding box for each feature
region_centroid_bbox = {}
for _, row in NRM_AUS.iterrows():
    centroid_point = row.geometry.centroid.coords[0]
    bounding_box = row.geometry.bounds
    region_centroid_bbox[row['NHT2NAME']] = {
        'centroid': centroid_point,
        'bounding_box': bounding_box
    }

with open('data/geo/NRM_AUS_centroid_bbox.js', 'w', encoding='utf-8') as f:
    f.write(f'window.NRM_AUS_centroid_bbox = {json.dumps(region_centroid_bbox, indent=2)};\n')








