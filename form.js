'use strict'

/*
 * Function to disable the gpu option initially.
 */
function disable_num_gpus_input(){
    let num_gpus_input = $('#num_gpus');
    num_gpus_input.attr('disabled', 'disabled');
    $('#num_gpus').val(0);
}



/*
 *Function to enable the gpu input.
 */
function enable_num_gpus_input(selected_node_type){
    let num_gpus_input = $('#num_gpus');
    if(selected_node_type[0].value === "RTX6000"){
      num_gpus['max'] = 4;
    } else {
      num_gpus['max'] = 2;
    }
    num_gpus_input.removeAttr('disabled');
}


/*
 * Function to handle the change event in the custom_queue select dropdown
 */

function node_type_change_handler(selected_node_type)
{
    let node_type_name = selected_node_type[0].value;
    let no_gpu_type_1= ["cpu"];
    let no_gpu_type_2= ["cpusas"];
    if(no_gpu_type_1.indexOf(node_type_name)>-1 ||
       no_gpu_type_2.indexOf(node_type_name)>-1 ){
      disable_num_gpus_input();
      $('#num_gpus').val(0);
    }
    else {
      enable_num_gpus_input(selected_node_type);
    }
};

/*
 * Invoke the functions when the page loads.
 */
$(document).ready(function(){

    $('select').find('option[value=cpu]').attr('selected','selected');

    //Initially set the num_gpus to 0 for default cpu node type.
    $('#num_gpus').val(0);
    disable_num_gpus_input();

    let node_type = $('#batch_connect_session_context_node_type');

    //Handles the change event.
    node_type.change(function(){
        node_type_change_handler(node_type);
    })
});
