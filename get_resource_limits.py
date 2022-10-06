#!/usr/bin/env python3

# USAGE: Dumps a .js file with resource limits from sinfo

import subprocess
from collections import defaultdict
import csv
import re
from typing import NamedTuple

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


class NodeTypeInfo(NamedTuple):
    node_type: str
    part_name: str
    inc_feat: set = {}

node_types = [
    NodeTypeInfo(node_type="cpu", part_name="cpu-small"),
    NodeTypeInfo(node_type="cpusas", part_name="cpu-sas"),
    NodeTypeInfo(node_type="V100-16GB", part_name="gpu-v100", inc_feat={"V100-16GB"}),
    NodeTypeInfo(node_type="V100-32GB", part_name="gpu-v100", inc_feat={"V100-32GB"}),
    NodeTypeInfo(node_type="RTX6000", part_name="gpu-rtx6000")
]

# Key is variable name for a resource limit ('max_nodes', etc).  
# Value is a list of [paritition, limit_value] pairs
limit_vars = defaultdict(list)

for nt in node_types:
    if nt.inc_feat:
        cmd = f'sinfo -o "%D %l %c %m %G %f" -p {nt.part_name}'
    else:
        cmd = f'sinfo -o "%D %l %c %m %G" -p {nt.part_name}'
    proc = subprocess.run(cmd, shell=True, check=True, capture_output=True, text=True)
    limit_data = csv.DictReader(proc.stdout.rstrip().split('\n'), delimiter=' ')
    for row in limit_data:
        if nt.inc_feat:
            avail_feat = set(row["AVAIL_FEATURES"].split(","))
            if not nt.inc_feat.issubset(avail_feat):
                continue

        # Max Nodes
        n = int(row["NODES"])
        limit_vars['max_nodes'].append([nt.node_type, n])

        # Max walltime
        t = row["TIMELIMIT"]
        # sinfo doesn't output an ISO format, so parse it manually
        if "-" in t:
            days, t = t.split('-')
        else:
            days = 0
        total = int(days) * 24 + int(t.split(':')[0])
        limit_vars["max_walltimes"].append([nt.node_type, total])

        # Max cores
        c = int(row["CPUS"])
        limit_vars["max_cores"].append([nt.node_type, c])

        # Max memory
        m = int(row["MEMORY"].rstrip('+')) // 1000
        limit_vars["max_node_mem"].append([nt.node_type,m])

        # Max GPUs
        g = 0
        match = re.search(r"^gpu:\w+:(\d+)", row["GRES"])
        if match:
            g = int(match.group(1))
        limit_vars["max_gpus"].append([nt.node_type, g])

# Write to .js header file. 
# Formatting to make it easier for humans to read
with open(js_output_file, 'w') as f:
    for var, vals in limit_vars.items():
        f.write(f"let {var} = new Map([\n")
        for x in vals:
            f.write(f"    {x},\n")
        f.write("])\n\n")
