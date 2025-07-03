import pathlib
import json
from glob import glob
from tqdm.auto import tqdm


files = glob('../assets/*.json')


for f in tqdm(files, total=len(files)):
    with open(f, 'r', encoding='utf-8') as src_file:
        f_name = pathlib.Path(f).name.replace('.json', '')
        data = json.load(src_file)
        
    with open(f'../data/{f_name}.js', 'w', encoding='utf-8') as dest_file:
        dest_file.write(f'window.{f_name}_data = {json.dumps(data, indent=2)};\n')

