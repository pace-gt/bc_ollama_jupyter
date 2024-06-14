"use strict"

let max_nodes = new Map([
    ['cpu', 1],
    ['V100_16GB', 1],
    ['RTX6000', 1],
])

// Currently not used by the webform. These were defined based on the 
// partition only, but Slurm uses a combination of nodes and partitions
// to determine this limit
let max_walltimes = new Map([
    ['cpu', '8'],
    ['V100_16GB', '8'],
    ['RTX6000', '8'],
])

let max_cores = new Map([
    ['cpu', 24],
    ['V100_16GB', 24],
    ['RTX6000', 24],
])

let max_node_mem = new Map([
    ['cpu', 191],
    ['V100_16GB', 385],
    ['RTX6000', 385],
])

let max_gpus = new Map([
    ['cpu', 0],
    ['V100_16GB', 2],
    ['RTX6000', 4],
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

function node_type_change_handler(selected_node_type, selected_qos_type) {
    _update_gpu_inputs(selected_node_type)
    _update_cores_inputs(selected_node_type)
    _update_nodes_inputs(selected_node_type)
    //_update_walltime_inputs(selected_node_type, selected_qos_type)
}

function qos_change_handler(selected_node_type, selected_qos_type) {
    //_update_walltime_inputs(selected_node_type, selected_qos_type)
}

$(document).ready(function () {
    let node_type = $('#batch_connect_session_context_node_type')
    let qos = $('#batch_connect_session_context_qos')
  
    // Initialize everything on page load
   node_type_change_handler(node_type, qos)
   qos_change_handler(node_type, qos)
  
    //Handles the change events
    node_type.change(function () { node_type_change_handler(node_type, qos) })
    qos.change(function () { qos_change_handler(node_type, qos) })
  })
