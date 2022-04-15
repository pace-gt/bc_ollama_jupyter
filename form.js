'use strict'

let max_gpus = new Map([
  ["cpu", 0],
  ["cpu-sas", 0],
  ["RTX6000", 4],
  ["TeslaV100-16GB", 2],
  ["TeslaV100-32GB", 2]
])

function set_max_time(custom_queue, node_type) {
  let max_hours = 21 * 24;  // Max for inferno CPU
  if (custom_queue == "embers") {
    max_hours = 8;  // Max for embers
  }
  else if (max_gpus.has(node_type) && max_gpus.get(node_type) > 0) {
    max_hours = 3 * 24;  // Max for inferno GPU
  }

  let num_hours = $('#bc_num_hours');
  num_hours.val(Math.min(max_hours, num_hours.val()))
  num_hours.attr('max', max_hours);
}

function set_max_gpus(node_type) {
  let num_gpus = $('#num_gpus')
  let max_val = max_gpus.has(node_type) ? max_gpus.get(node_type) : 0;
  num_gpus.attr('max', max_val);
  if (max_val > 0) {
    num_gpus.removeAttr('disabled');
    let v = num_gpus.val();  // Current value
    num_gpus.attr('min', 1);
    num_gpus.val(Math.min(Math.max(v, 1), max_val));
  }
  else {
    num_gpus.attr('min', 0);
    num_gpus.val(0);
    num_gpus.attr('disabled', 'disabled');
  }
}

function node_type_change_handler(selected_custom_queue, selected_node_type) {
  let custom_queue = selected_custom_queue[0].value;
  let node_type = selected_node_type[0].value;
  set_max_time(custom_queue, node_type);
  set_max_gpus(node_type);
};

function custom_queue_change_handler(selected_custom_queue, selected_node_type) {
  let custom_queue = selected_custom_queue[0].value;
  let node_type = selected_node_type[0].value;
  set_max_time(custom_queue, node_type);
};

$(document).ready(function () {

  $('select').find('option[value=cpu]').attr('selected', 'selected');
  $('select').find('option[value=inferno]').attr('selected', 'selected');

  set_max_gpus("cpu")
  set_max_time("cpu", "inferno")

  let custom_queue = $('#batch_connect_session_context_custom_queue');
  let node_type = $('#batch_connect_session_context_node_type');

  //Handles the change event.
  node_type.change(function () {
    node_type_change_handler(custom_queue, node_type);
  })
  custom_queue.change(function () {
    custom_queue_change_handler(custom_queue, node_type);
  })
});
