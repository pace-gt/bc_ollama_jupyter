// Can retrieve these using get_resource_limits.py script

let max_nodes = new Map([
    ['cpu-small', 2],
    ['cpu-medium', 0],
    ['cpu-large', 0],
    ['cpu-sas', 0],
    ['cpu-amd', 0],
    ['gpu-v100', 1],
    ['gpu-a100', 0],
    ['gpu-rtx6000', 0],
    ['cpu-pmem', 0],
    ['cpu-small-X', 2],
    ['cpu-medium-X', 0],
    ['cpu-large-X', 0],
    ['cpu-sas-X', 0],
    ['cpu-amd-X', 0],
    ['gpu-v100-X', 1],
    ['gpu-a100-X', 0],
    ['gpu-rtx6000-X', 0],
    ['cpu-pmem-X', 0],
])

let max_walltimes = new Map([
    ['cpu-small', 504],
    ['cpu-medium', 504],
    ['cpu-large', 504],
    ['cpu-sas', 504],
    ['cpu-amd', 504],
    ['gpu-v100', 72],
    ['gpu-a100', 72],
    ['gpu-rtx6000', 72],
    ['cpu-pmem', 504],
    ['cpu-small-X', 504],
    ['cpu-medium-X', 504],
    ['cpu-large-X', 504],
    ['cpu-sas-X', 504],
    ['cpu-amd-X', 504],
    ['gpu-v100-X', 72],
    ['gpu-a100-X', 72],
    ['gpu-rtx6000-X', 72],
    ['cpu-pmem-X', 504],
])

let max_cores = new Map([
    ['cpu-small', 24],
    ['cpu-medium', 0],
    ['cpu-large', 0],
    ['cpu-sas', 0],
    ['cpu-amd', 0],
    ['gpu-v100', 24],
    ['gpu-a100', 0],
    ['gpu-rtx6000', 0],
    ['cpu-pmem', 0],
    ['cpu-small-X', 24],
    ['cpu-medium-X', 0],
    ['cpu-large-X', 0],
    ['cpu-sas-X', 0],
    ['cpu-amd-X', 0],
    ['gpu-v100-X', 24],
    ['gpu-a100-X', 0],
    ['gpu-rtx6000-X', 0],
    ['cpu-pmem-X', 0],
])

let max_node_mem = new Map([
    ['cpu-small', 191],
    ['cpu-medium', 0],
    ['cpu-large', 0],
    ['cpu-sas', 0],
    ['cpu-amd', 0],
    ['gpu-v100', 385],
    ['gpu-a100', 0],
    ['gpu-rtx6000', 0],
    ['cpu-pmem', 0],
    ['cpu-small-X', 191],
    ['cpu-medium-X', 0],
    ['cpu-large-X', 0],
    ['cpu-sas-X', 0],
    ['cpu-amd-X', 0],
    ['gpu-v100-X', 385],
    ['gpu-a100-X', 0],
    ['gpu-rtx6000-X', 0],
    ['cpu-pmem-X', 0],
])

let max_gpus = new Map([
    ['cpu-small', 0],
    ['cpu-medium', 0],
    ['cpu-large', 0],
    ['cpu-sas', 0],
    ['cpu-amd', 0],
    ['gpu-v100', 2],
    ['gpu-a100', 0],
    ['gpu-rtx6000', 0],
    ['cpu-pmem', 0],
    ['cpu-small-X', 0],
    ['cpu-medium-X', 0],
    ['cpu-large-X', 0],
    ['cpu-sas-X', 0],
    ['cpu-amd-X', 0],
    ['gpu-v100-X', 2],
    ['gpu-a100-X', 0],
    ['gpu-rtx6000-X', 0],
    ['cpu-pmem-X', 0],
])

function _update_gpu_inputs(selected_custom_queue) {
    let queue_name = selected_custom_queue[0].value
    let num_gpus = $('#num_gpus')

    //console.log("Queue name:", queue_name)

    let gmax = max_gpus.has(queue_name) ? max_gpus.get(queue_name) : 0
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

function _update_cores_inputs(selected_custom_queue) {
    let queue_name = selected_custom_queue[0].value
    let num_cores = $('#num_cores')

    //console.log("Queue name:", queue_name)

    if (max_cores.has(queue_name)) {
        let cmax = max_cores.get(queue_name)
        //console.log("> Max cores: ", cmax)
        num_cores.attr('max', cmax)
        num_cores.val(Math.min(Math.max(num_cores.val(), 1), cmax))
    }
}

function _update_nodes_inputs(selected_custom_queue) {
    let queue_name = selected_custom_queue[0].value
    let num_nodes = $('#batch_connect_session_context_bc_num_slots')

    //console.log("Queue name:", queue_name)
    //console.log("> Num nodes:", num_nodes.val())

    if (max_nodes.has(queue_name)) {
        let nmax = max_nodes.get(queue_name)
        //console.log("> Max nodes: ", nmax)
        num_nodes.attr('max', nmax)
        num_nodes.val(Math.min(Math.max(num_nodes.val(), 1), nmax))
    }
}

function _update_walltime_inputs(selected_custom_queue) {
    let queue_name = selected_custom_queue[0].value
    let num_hours = $('#batch_connect_session_context_bc_num_hours')

    //console.log("Queue name:", queue_name)
    //console.log("> Num hours:", num_hours.val())

    if (max_walltimes.has(queue_name)) {
        let wmax = max_walltimes.get(queue_name)
        //console.log("> Max hours: ", wmax)
        num_hours.attr('max', wmax)
        num_hours.val(Math.min(Math.max(num_hours.val(), 1), wmax))
    }
}

function custom_queue_change_handler(selected_custom_queue) {
    _update_gpu_inputs(selected_custom_queue)
    _update_cores_inputs(selected_custom_queue)
    _update_nodes_inputs(selected_custom_queue)
    _update_walltime_inputs(selected_custom_queue)
}

$(document).ready(function () {
    let custom_queue = $('#batch_connect_session_context_custom_queue')
  
    // Initialize everything on page load
   custom_queue_change_handler(custom_queue)
  
    //Handles the change events
    custom_queue.change(function () { custom_queue_change_handler(custom_queue) })
  })
