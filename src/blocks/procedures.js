import * as Blockly from 'blockly/core';
import { knownVariableFuncsCount } from '..';
import { setKVFC } from '..';
import { typeVarsNames } from './type';

// Create a custom block called 'add_text' that adds
// text to the output div on the sample app.
// This is just an example and you should replace this with your
// own custom blocks.
const defnFunction = {
  type: 'defn_function',
  message0: 'define function %1 as %2',
  args0: [
    {
      "type": "field_input",
      "name": "FUNCTIONNAME",
      "text": "name your function",
    },
    {
      type: 'input_value',
      name: 'FUNCTION',
    },
  ],
  // previousStatement: null,
  // nextStatement: null,
  colour: 160,
  tooltip: '',
  helpUrl: '',
  extraState: {"args": 0},
  mutator: "function_defn_multiparam_mutator"
};

const callFunc = {
    type: 'call_func',
    message0: 'evaluate %1 with',
    args0: [
        {
            "type": "input_value",
            "name": "FUNCTION",
        },
    ],
    // previousStatement: null,
    // nextStatement: null,
    output: null,
    colour: 160,
    tooltip: '',
    helpUrl: '',
    mutator: "function_multiparam_mutator",
    extraState: {"args": 0},
};

typeVarsNames(26).forEach(c => {
    if (Blockly.Blocks["func_param_"+c] == undefined) {
        Blockly.Blocks["func_param_" + c] = {
            init: function() {
                this.appendDummyInput()
                    .appendField(c)
                this.setOutput(true)
            }
        }
    }
})

const funcParamsContainer = {
    type: 'func_params_container',
    message0: 'params %1',
    args0: [{
        "type": "input_statement",
        "name": "STACK"
    }],
}

Blockly.Extensions.registerMutator(
    'function_multiparam_mutator',
    {
        saveExtraState: function() {
            return {"args": this.args}
        },
        loadExtraState: function(state) {
            this.args = state["args"]
        },
        decompose: function(workspace) {
            var topBlock = workspace.newBlock('func_params_container');
            topBlock.initSvg();

            // // Then we add one sub-block for each item in the list.
            var connection = topBlock.getInput('STACK').connection; 
            for (var i = 0; i < this.args; i++) {
                var itemBlock = workspace.newBlock('type_params_param');
                itemBlock.initSvg();
                connection.connect(itemBlock.previousConnection);
                connection = itemBlock.nextConnection;
            }

            // And finally we have to return the top-block.
            return topBlock;
        },
        compose: function(topBlock) {
            // First we get the first sub-block (which represents an input on our main block).
            //
            var itemBlock = topBlock.getInputTargetBlock('STACK');

            // Then we collect up all of the connections of on our main block that are
            // referenced by our sub-blocks.
            // This relates to the saveConnections hook (explained below).
            var connections = [];
            while (itemBlock && !itemBlock.isInsertionMarker()) {  // Ignore insertion markers!
                connections.push(itemBlock.valueConnection_);
                itemBlock = itemBlock.nextConnection &&
                    itemBlock.nextConnection.targetBlock();
            }

            this.args = connections.length

            // Then we disconnect any children where the sub-block associated with that
            // child has been deleted/removed from the stack.
            for (var i = 0; i < this.arg; i++) {
                var connection = this.getInput('ARG_' + i)
                if (connection) {
                    connection = connection.connection.targetConnection;
                if (connection && connections.indexOf(connection) == -1) {
                    connection.disconnect();
                }
                }
            }


            // // Then we update the shape of our block (removing or adding iputs as necessary).
            // // `this` refers to the main block.
            // this.itemCount_ = connections.length;
            // // this.updateShape_();
            // Add new inputs.
            for (let i = 0; i < this.args; i++) {
                if (!this.getInput('ARG_' + i)) {
                    const input = this.appendValueInput('ARG_' + i)
                    // if (i === 0) {
                        // input.appendField(Msg['LISTS_CREATE_WITH_INPUT_WITH']);
                    // }
                }
            }
            // Remove deleted inputs.
            for (let i = this.args; this.getInput('ARG_' + i); i++) {
                this.removeInput('ARG_' + i);
            }

            // // And finally we reconnect any child blocks.
            for (var i = 0; i < this.args; i++) {
                connections[i].reconnect(this, 'ARG_' + i);
            }
        }
    },
    undefined,
    ["type_params_param"]
)

Blockly.Extensions.registerMutator(
    'function_defn_multiparam_mutator',
    {
        saveExtraState: function() {
            return {"args": this.args}
        },
        loadExtraState: function(state) {
            this.args = state["args"]
        },
        decompose: function(workspace) {
            var topBlock = workspace.newBlock('func_params_container');
            topBlock.initSvg();

            // // Then we add one sub-block for each item in the list.
            var connection = topBlock.getInput('STACK').connection; 
            for (var i = 0; i < this.args; i++) {
                var itemBlock = workspace.newBlock('type_params_param');
                itemBlock.initSvg();
                connection.connect(itemBlock.previousConnection);
                connection = itemBlock.nextConnection;
            }

            // And finally we have to return the top-block.
            return topBlock;
        },
        compose: function(topBlock) {
            // First we get the first sub-block (which represents an input on our main block).
            //
            var itemBlock = topBlock.getInputTargetBlock('STACK');

            // Then we collect up all of the connections of on our main block that are
            // referenced by our sub-blocks.
            // This relates to the saveConnections hook (explained below).
            var connections = [];
            while (itemBlock && !itemBlock.isInsertionMarker()) {  // Ignore insertion markers!
                connections.push(itemBlock.valueConnection_);
                itemBlock = itemBlock.nextConnection &&
                    itemBlock.nextConnection.targetBlock();
            }

            this.args = connections.length
            console.log("HI!", knownVariableFuncsCount, this.args)
            if (knownVariableFuncsCount < this.args) {
                setKVFC(this.args)
            }
        }
    },
    undefined,
    ["type_params_param"]
)             


// Create the block definitions for the JSON-only blocks.
// This does not register their definitions with Blockly.
// This file has no side effects!
export const functionBlocks = Blockly.common.createBlockDefinitionsFromJsonArray([
  defnFunction, funcParamsContainer, callFunc
]);
