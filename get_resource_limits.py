#!/usr/bin/env python3

# USAGE: Dumps a .js file with resource limits from sinfo

import subprocess
from collections import defaultdict
import csv
import re

# Output to this JavaScript header file
js_output_file="resource_limits.js"

# Don't get limits for these partitions
excluded_parts = {"phoenix-all"}

# Read data table from sinfo
proc = subprocess.run('sinfo -o "%P %D %l %c %m %G"', shell=True, check=True, 
        capture_output=True, text=True)
limit_data = csv.DictReader(proc.stdout.rstrip().split('\n'), delimiter=' ')

# Key is variable name for a resource limit ('max_nodes', etc).  
# Value is a list of [paritition, limit_value] pairs
limit_vars = defaultdict(list)

for row in limit_data:
    p = row["PARTITION"].rstrip('*')
    if p in excluded_parts:
        continue

    # Max Nodes
    n = int(row["NODES"])
    limit_vars['max_nodes'].append([p, n])

    # Max walltime
    t = row["TIMELIMIT"]
    # sinfo doesn't output an ISO format, so parse it manually
    if "-" in t:
        days, t = t.split('-')
    else:
        days = 0
    total = int(days) * 24 + int(t.split(':')[0])
    limit_vars["max_walltimes"].append([p, total])

    # Max cores
    c = int(row["CPUS"])
    limit_vars["max_cores"].append([p, c])

    # Max memory
    m = int(row["MEMORY"]) // 1000
    limit_vars["max_node_mem"].append([p, m])

    # Max GPUs
    g = 0
    match = re.search(r"^gpu:\w+:(\d+)", row["GRES"])
    if match:
        g = int(match.group(1))
    limit_vars["max_gpus"].append([p, g])

# Write to .js header file. 
# Formatting to make it easier for humans to read
with open(js_output_file, 'w') as f:
    for var, vals in limit_vars.items():
        f.write(f"let {var} = new Map([\n")
        for x in vals:
            f.write(f"    {x},\n")
        f.write("])\n\n")
