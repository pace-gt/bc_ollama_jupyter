// Can be queried with `sinfo -o "%P %G %f"`
let max_gpus = new Map([
    ["hive", 0],
    ["hive-gpu", 2],
    ["hive-dev", 1]
])

// Can be queried with `sinfo -o "%P %G %f"`
let gpu_types = new Map([
    ["hive", []],
    ["hive-gpu", ["First available", "V100", "A100"]],
    ["hive-dev", ["V100"]]
])

// Can be queried with `sinfo -o "%P %D"`
let max_nodes = new Map([
    ["hive", 3],
    ["hive-gpu", 2],
    ["hive-dev", 1]
])

// Can be queried with `sinfo -o "%P %l"
let max_walltimes = new Map([
    ["hive", 60],
    ["hive-gpu", 60],
    ["hive-dev", 60]
])

// Can be queried with `sinfo -o "%P %c"
let max_cores = new Map([
    ["hive", 4],
    ["hive-gpu", 24],
    ["hive-dev", 24]
])

function _update_gpu_inputs(selected_custom_queue) {
    let queue_name = selected_custom_queue[0].value
    let num_gpus = $('#num_gpus')

    console.log("Queue name:", queue_name)

    let gmax = max_gpus.has(queue_name) ? max_gpus.get(queue_name) : 0
    let gtypes = gpu_types.has(queue_name) ? gpu_types.get(queue_name) : []

    console.log("> Max GPUs: ", gmax)
    console.log("> GPU Types: ", gtypes)

    if (gmax > 0 && gtypes.length > 0) {
        num_gpus.removeAttr('disabled')
        num_gpus.attr('min', 1)
        num_gpus.attr('max', gmax)
        num_gpus.val(Math.min(Math.max(num_gpus.val(), 1), gmax))
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

    console.log("Queue name:", queue_name)

    if (max_cores.has(queue_name)) {
        let cmax = max_cores.get(queue_name)
        console.log("> Max cores: ", cmax)
        num_cores.attr('max', cmax)
        num_cores.val(Math.min(Math.max(num_cores.val(), 1), cmax))
    }
}

function custom_queue_change_handler(selected_custom_queue) {
    _update_gpu_inputs(selected_custom_queue)
    _update_cores_inputs(selected_custom_queue)
}

$(document).ready(function () {
    let custom_queue = $('#batch_connect_session_context_custom_queue')
  
    // Initialize everything on page load
   custom_queue_change_handler(custom_queue)
  
    //Handles the change events
    custom_queue.change(function () { custom_queue_change_handler(custom_queue) })
  })
  




