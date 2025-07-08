import pathlib
import json
import pandas as pd
from glob import glob
from tqdm.auto import tqdm


files = glob('../assets/*.json')

# JSON files to JS files
for f in tqdm(files, total=len(files)):
    with open(f, 'r', encoding='utf-8') as src_file:
        f_name = pathlib.Path(f).name.replace('.json', '')
        data = json.load(src_file)
        
    with open(f'../data/{f_name}.js', 'w', encoding='utf-8') as dest_file:
        dest_file.write(f'window.{f_name} = {json.dumps(data, indent=2)};\n')
        
        
# load settings
with open('../assets/run_logs/model_run_settings.txt', 'r', encoding='utf-8') as src_file:
    settings = {i.split(':')[0].strip(): ''.join(i.split(':')[1:]).strip() for i in src_file.readlines()}
    resfactor = settings['RESFACTOR']
    settings = [{'parameter': k, 'val': v} for k, v in settings.items()]

with open('../data/run_logs/model_run_settings.js', 'w', encoding='utf-8') as dest_file:
    dest_file.write(f'window.model_run_settings = {json.dumps(settings, indent=2)};\n')
    
    
    
# load mem logs
with open(f'../assets/run_logs/RES_{resfactor}_mem_log.txt', 'r', encoding='utf-8') as src_file:
    mem_logs = src_file.readlines()
    mem_logs = [i.split('\t') for i in mem_logs]
    mem_logs = [{'time': i[0], 'mem (GB)': i[1].strip()} for i in mem_logs]
    mem_logs_df = pd.DataFrame(mem_logs)
    mem_logs_df['time'] = pd.to_datetime(mem_logs_df['time'], format='%Y-%m-%d %H:%M:%S')
    mem_logs_df['time'] = mem_logs_df['time'].astype('int64') // 10**6  # convert to milliseconds
    mem_logs_df['mem (GB)'] = mem_logs_df['mem (GB)'].astype(float)
    mem_logs_obj = [{
        'name': f'Memory Usage (RES {resfactor})',
        'data': mem_logs_df.values.tolist()
    }]


with open('../data/mem_log.js', 'w', encoding='utf-8') as dest_file:
    dest_file.write(f'window.mem_log = {json.dumps(mem_logs_obj, indent=2)};\n')


                    