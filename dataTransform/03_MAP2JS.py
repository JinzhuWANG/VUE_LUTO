import os
import json

from glob import glob
from tqdm.auto import tqdm



# Get map json files
map_json_files = glob('assets/map_metrics/*.json')


# Save to JS files
for map_json_file in tqdm(map_json_files):
    with open(map_json_file, 'r', encoding='utf-8') as f:
        map_json = json.load(f)

    js_file_path = f"data/map_{os.path.basename(map_json_file).replace('.json', '.js')}"
    with open(js_file_path, 'w', encoding='utf-8') as f:
        f.write(f'window.{os.path.basename(js_file_path).replace(".js", "")} = {json.dumps(map_json, indent=2)};\n')
