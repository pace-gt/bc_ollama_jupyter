#!/usr/bin/env python3

# USAGE: Dumps a .js file with resource limits from sinfo

import subprocess
from collections import defaultdict
import csv
import re

# Output to this JavaScript header file
js_output_file="resource_limits.js"

# Don't get limits for these partitions
excluded_parts = {
    "phoenix-all",
    "cpu-medium-X",
    "cpu-large-X",
    "cpu-sas-X",
    "cpu-amd-X",
    "gpu-v100-X",
    "gpu-a100-X",
    "gpu-rtx6000-X",
    "cpu-pmem-X"
}

# Maps a node type to the actual feature
ntype_to_feat = {
    "cpu": "cpu-small",
    "V100-16GB": "V100-16GB",
    "V100-32GB": "V100-32GB"
}

# Read data table from sinfo
proc = subprocess.run('sinfo -o "%P %f %D %l %c %m %G"', shell=True, check=True, 
        capture_output=True, text=True)
limit_data = csv.DictReader(proc.stdout.rstrip().split('\n'), delimiter=' ')

# Key is variable name for a resource limit ('max_nodes', etc).  
# Value is a list of [paritition, limit_value] pairs
limit_vars = defaultdict(list)

# limit_data must be outermost loop, since DictReader can only
# be iterated over one time.
for row in limit_data:
    part = row["PARTITION"]
    avail_feats = row["AVAIL_FEATURES"].split(",")
    print(f"{part}: {avail_feats}")
    for ntype, feat in ntype_to_feat.items():
        print(f"     {ntype}: {feat}")
        if part in excluded_parts or feat not in avail_feats:
            print("        skipping")
            continue

        # Max Nodes
        n = int(row["NODES"])
        limit_vars['max_nodes'].append([ntype, n])

        # Max walltime
        t = row["TIMELIMIT"]
        # sinfo doesn't output an ISO format, so parse it manually
        if "-" in t:
            days, t = t.split('-')
        else:
            days = 0
        total = int(days) * 24 + int(t.split(':')[0])
        limit_vars["max_walltimes"].append([ntype, total])

        # Max cores
        c = int(row["CPUS"])
        limit_vars["max_cores"].append([ntype, c])

        # Max memory
        m = int(row["MEMORY"]) // 1000
        limit_vars["max_node_mem"].append([ntype,m])

        # Max GPUs
        g = 0
        match = re.search(r"^gpu:\w+:(\d+)", row["GRES"])
        if match:
            g = int(match.group(1))
        limit_vars["max_gpus"].append([ntype, g])

# Write to .js header file. 
# Formatting to make it easier for humans to read
with open(js_output_file, 'w') as f:
    for var, vals in limit_vars.items():
        f.write(f"let {var} = new Map([\n")
        for x in vals:
            f.write(f"    {x},\n")
        f.write("])\n\n")
