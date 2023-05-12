"use strict"

// Can retrieve these using get_resource_limits.py script
let max_nodes = new Map([
    ['cpu', 64],
    ['intel_cpu', 60],
    ['intel_cpu_sas', 1],
    ['amd_cpu', 4],
    ['nvidia_gpu', 35],
    ['V100_16GB', 11],
    ['V100_32GB', 8],
    ['A100_40GB', 2],
    ['A100_80GB', 2],
    ['MI210', 2],
    ['A40', 2],
    ['RTX_6000', 10],
])

let max_walltimes = new Map([
    ['cpu', '8'],
    ['intel_cpu', '8'],
    ['intel_cpu_sas', '8'],
    ['amd_cpu', '8'],
    ['nvidia_gpu', '8'],
    ['V100_16GB', '8'],
    ['V100_32GB', '8'],
    ['V100_32GB', '8'],
    ['A100_40GB', '8'],
    ['A100_80GB', '8'],
    ['MI210', '8'],
    ['A40', '8'],
    ['RTX_6000', '8'],
])

let max_cores = new Map([
    ['cpu', 24],
    ['intel_cpu', 24],
    ['intel_cpu_sas', 24],
    ['amd_cpu', 64],
    ['nvidia_gpu', 64],
    ['V100_16GB', 24],
    ['V100_32GB', 40],
    ['A100_40GB', 64],
    ['A100_80GB', 64],
    ['MI210', 64],
    ['A40', 64],
    ['RTX_6000', 24],
])

let max_node_mem = new Map([
    ['cpu', 191],
    ['intel_cpu', 385],
    ['intel_cpu_sas', 385],
    ['amd_cpu', 515],
    ['nvidia_gpu', 515],
    ['V100_16GB', 385],
    ['V100_32GB', 191],
    ['A100_40GB', 515],
    ['A100_80GB', 515],
    ['MI210', 515],
    ['A40', 515],
    ['RTX_6000', 191],
])

let max_gpus = new Map([
    ['cpu', 0],
    ['intel_cpu', 0],
    ['intel_cpu_sas', 0],
    ['amd_cpu', 0],
    ['nvidia_gpu', 4],
    ['V100_16GB', 2],
    ['V100_32GB', 4],
    ['A100_40GB', 2],
    ['A100_80GB', 2],
    ['MI210', 2],
    ['A40', 2],
    ['RTX_6000', 4],
])



function _update_gpu_inputs(selected_node_type) {
    let node_type = selected_node_type[0].value
    let num_gpus = $('#num_gpus')

    //console.log("Queue name:", queue_name)

    let gmax = max_gpus.has(node_type) ? max_gpus.get(node_type) : 0
    //console.log("> Max GPUs: ", gmax)

    if (gmax > 0) {
        num_gpus.removeAttr('disabled')
        num_gpus.attr('min', 1)
        num_gpus.attr('max', gmax)
        num_gpus.val(Math.min(Math.max(num_gpus.val(), 1), gmax))

        // TODO: Set allows values of GPU types field
        // let gtypes = gpu_types.has(queue_name) ? gpu_types.get(queue_name) : []
        // console.log("> GPU Types: ", gtypes)
        // if (gtypes.length > 0) { }
    }
    else {
        num_gpus.attr('disabled', 'disabled')
        num_gpus.attr('min', 0)
        num_gpus.attr('max', 0)
        num_gpus.val(0)
    }
}

function _update_cores_inputs(selected_node_type) {
    let node_type = selected_node_type[0].value
    let num_cores = $('#num_cores')

    //console.log("Queue name:", queue_name)

    if (max_cores.has(node_type)) {
        let cmax = max_cores.get(node_type)
        //console.log("> Max cores: ", cmax)
        num_cores.attr('max', cmax)
        num_cores.val(Math.min(Math.max(num_cores.val(), 1), cmax))
    }
}

function _update_nodes_inputs(selected_node_type) {
    let node_type = selected_node_type[0].value
    let num_nodes = $('#batch_connect_session_context_bc_num_slots')

    //console.log("Queue name:", queue_name)
    //console.log("> Num nodes:", num_nodes.val())

    if (max_nodes.has(node_type)) {
        let nmax = max_nodes.get(node_type)
        //console.log("> Max nodes: ", nmax)
        num_nodes.attr('max', nmax)
        num_nodes.val(Math.min(Math.max(num_nodes.val(), 1), nmax))
    }
}

function _update_walltime_inputs(selected_node_type, selected_qos_type) {
    let node_type = selected_node_type[0].value
    let qos = selected_qos_type[0].value
    let num_hours = $('#batch_connect_session_context_bc_num_hours')
    //console.log("QOS:", qos)
    //console.log("> Num hours:", num_hours.val())

    let wmax = 0
    if (qos == "embers") {
        wmax = 8
    }
    else if (max_walltimes.has(node_type)) {
        wmax = max_walltimes.get(node_type)
    }

    if (wmax > 0) {
        //console.log("> Max hours: ", wmax)
        num_hours.attr('max', wmax)
        num_hours.val(Math.min(Math.max(num_hours.val(), 1), wmax))
    }
}

function _update_memory_inputs(selected_node_type, selected_cores) {
    let node_type = selected_node_type[0].value
    let cores = selected_cores[0].value
    let mem_per_core = $('#num_mem_per_core')
    let core_max = 32
    if (max_node_mem.has(node_type)) {
      let node_max = max_node_mem.get(node_type)
      core_max = Math.floor(node_max / cores)
    }
    mem_per_core.attr('max', core_max)
    mem_per_core.val(Math.min(Math.max(mem_per_core.val(), 1), core_max))
}


function node_type_change_handler(selected_node_type, selected_qos_type, selected_cores) {
    _update_gpu_inputs(selected_node_type)
    _update_cores_inputs(selected_node_type)
    _update_memory_inputs(selected_node_type, selected_cores)
    _update_nodes_inputs(selected_node_type)
    _update_walltime_inputs(selected_node_type, selected_qos_type)
}

function qos_change_handler(selected_node_type, selected_qos_type) {
    _update_walltime_inputs(selected_node_type, selected_qos_type)
}

function cores_change_handler(selected_node_type, selected_cores) {
    _update_memory_inputs(selected_node_type, selected_cores)
}

$(document).ready(function () {
    let node_type = $('#batch_connect_session_context_node_type')
    let qos = $('#batch_connect_session_context_qos')
    let cores = $('#num_cores')
  
    // Initialize everything on page load
   node_type_change_handler(node_type, qos, cores)
   qos_change_handler(node_type, qos)
   cores_change_handler(node_type, cores)
  
    //Handles the change events
    node_type.change(function () { node_type_change_handler(node_type, qos, cores) })
    qos.change(function () { qos_change_handler(node_type, qos) })
    cores.change(function () { cores_change_handler(node_type, cores) })
  })
