// Can be queried with `sinfo -o "%P %G %f"`
let max_gpus = new Map([
    ["hive", 0],
    ["hive-all", 4],
    ["hive-himem", 0],
    ["hive-nvme", 0],
    ["hive-sas", 0],
    ["hive-nvme-sas", 0],
    ["hive-interact", 0],
    ["hive-gpu", 4],
    ["hive-gpu-short", 4],
])

// Can be queried with `sinfo -o "%P %G %f"`
//let gpu_types = new Map([
//    ["hive", []],
//    ["hive-gpu", ["First available", "V100", "A100"]],
//    ["hive-dev", ["V100"]]
//])

// Can be queried with `sinfo -o "%P %D"`
let max_nodes = new Map([
    ["hive", 267],
    ["hive-all", 300],
    ["hive-himem", 3],
    ["hive-nvme", 10],
    ["hive-sas", 10],
    ["hive-nvme-sas", 20],
    ["hive-interact", 267],
    ["hive-gpu", 10],
    ["hive-gpu-short", 10],
])

// Can be queried with `sinfo -o "%P %l"
let max_walltimes = new Map([
    ["hive", 120],
    ["hive-all", 120],
    ["hive-himem", 120],
    ["hive-nvme", 720],
    ["hive-sas", 720],
    ["hive-nvme-sas", 720],
    ["hive-interact", 1],
    ["hive-gpu", 72],
    ["hive-gpu-short", 12],
])

// Can be queried with `sinfo -o "%P %c"
let max_cores = new Map([
    ["hive", 24],
    ["hive-all", 24],
    ["hive-himem", 24],
    ["hive-nvme", 24],
    ["hive-sas", 24],
    ["hive-nvme-sas", 24],
    ["hive-interact", 24],
    ["hive-gpu", 24],
    ["hive-gpu-short", 24],
])

// Can be queried with `sinfo -o "%P %m"
// Units are GB
let max_node_mem = new Map([
    ["hive", 191],
    ["hive-all", 191],
    ["hive-himem", 3094],
    ["hive-nvme", 191],
    ["hive-sas", 191],
    ["hive-nvme-sas", 191],
    ["hive-interact", 191],
    ["hive-gpu", 385],
    ["hive-gpu-short", 385],
])

// Can be found in /var/lib/slurm/slurmd/conf-cache/nodes.conf
// Units are GB
// Rounded up from 8192 MB in nodes.conf because it's unclear if 
// nodes.conf uses MiB or MB
let mem_spec_limit = 9

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
  




