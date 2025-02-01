import * as Blockly from 'blockly/core';
import { knownVariableTypesCount, setKVTC } from '..';

export function typeVarsNames(x) {
    return "abcdefghijklmnopqrstuvwxyz".slice(0, x).split('')
}



// Create a custom block called 'add_text' that adds
// text to the output div on the sample app.
// This is just an example and you should replace this with your
// own custom blocks.
const defnType = {
    type: 'defn_type',
    message0: 'define type %1 with %2 as',
    args0: [
        {
            "type": "field_input",
            "name": "TYPENAME",
            "text": "name your type",
        },
        {
            "type": "field_label",
            "name": "VARTEXT",
            "text": "no params"
        },
        // {
        //     type: 'input_value',
        //     name: 'TYPE',
        //     check: 'Type',
        // },
    ],
    // previousStatement: null,
    // nextStatement: null,
    colour: 160,
    tooltip: '',
    helpUrl: '',
    mutator: "type_multiparam_mutator",
    extraState: {"args": 0, "products": 0},
};

const boolType = {
    type: 'type_builtin_bool',
    message0: 'Bool',
    output: 'Type',
}
const floatType = {
    type: 'type_builtin_float',
    message0: 'Float',
    output: 'Type',
}

const typeParamsContainer = {
    type: 'type_params_container',
    message0: 'params %1',
    args0: [{
        "type": "input_statement",
        "name": "STACK"
    }],
    message1: 'products %1',
    args1: [{
        "type": "input_statement",
        "name": "STACK2",
    }]
}

const typeParamsParam = {
    type: 'type_params_param',
    message0: 'Unit',
    previousStatement: null,
    nextStatement: null,
    // args0: {
    // }
}

Blockly.Blocks["sum_type"] = {
    init: function() {
        this.appendValueInput('T1')
            .setCheck('Type')
            .appendField('Sum')
        this.appendValueInput('T2')
            .setCheck('Type')
        this.setOutput(true, 'Type')
        this.setColour(160)       
    }
}

typeVarsNames(26).forEach(c => {
    Blockly.Blocks["type_param_" + c] = {
        init: function() {
            this.appendDummyInput()
                .appendField(c)
            this.setOutput(true, 'Type')
        }
    }
})

Blockly.Extensions.registerMutator(
    'type_multiparam_mutator',
    {
        saveExtraState: function() {
            return {"args": this.args, "products": this.products}
        },
        loadExtraState: function(state) {
            this.args = state["args"]
            this.products = state["products"]
        },
        decompose: function(workspace) {
            workspace.addTopBl
            var topBlock = workspace.newBlock('type_params_container');
            topBlock.initSvg();

            // // Then we add one sub-block for each item in the list.
            var connection = topBlock.getInput('STACK').connection; 
            // var itemBlock = workspace.newBlock('type_params_param');
            //     itemBlock.initSvg();
            //     connection.connect(itemBlock.previousConnection);
            //     connection = itemBlock.nextConnection;
            for (var i = 0; i < this.args; i++) {
                var itemBlock = workspace.newBlock('type_params_param');
                itemBlock.initSvg();
                connection.connect(itemBlock.previousConnection);
                connection = itemBlock.nextConnection;
            }
            connection = topBlock.getInput('STACK2').connection; 
            // var itemBlock = workspace.newBlock('type_params_param');
            //     itemBlock.initSvg();
            //     connection.connect(itemBlock.previousConnection);
            //     connection = itemBlock.nextConnection;
            for (var i = 0; i < this.products; i++) {
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

            // update max
            if (knownVariableTypesCount < this.args) {
                setKVTC(this.args)
            }
            // set variables
            if (this.args == 0) {
                this.setFieldValue("no params", "VARTEXT")
            } else {
                this.setFieldValue(`params ${typeVarsNames(this.args)}`, "VARTEXT")
            }



            itemBlock = topBlock.getInputTargetBlock('STACK2');

            // Then we collect up all of the connections of on our main block that are
            // referenced by our sub-blocks.
            // This relates to the saveConnections hook (explained below).
            connections = [];
            while (itemBlock && !itemBlock.isInsertionMarker()) {  // Ignore insertion markers!
                connections.push(itemBlock.valueConnection_);
                itemBlock = itemBlock.nextConnection &&
                    itemBlock.nextConnection.targetBlock();
            }

            this.products = connections.length

            // Then we disconnect any children where the sub-block associated with that
            // child has been deleted/removed from the stack.
            for (var i = 0; i < this.products; i++) {
                var connection = this.getInput('PROD_' + i)
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
            for (let i = 0; i < this.products; i++) {
                if (!this.getInput('PROD_' + i)) {
                    const input = this.appendValueInput('PROD_' + i)
                    // if (i === 0) {
                        // input.appendField(Msg['LISTS_CREATE_WITH_INPUT_WITH']);
                    // }
                }
            }
            // Remove deleted inputs.
            for (let i = this.products; this.getInput('ADD' + i); i++) {
                this.removeInput('PROD_' + i);
            }

            // // And finally we reconnect any child blocks.
            for (var i = 0; i < this.itemCount_; i++) {
                connections[i].reconnect(this, 'PROD_' + i);
            }
        }
    },
    undefined,
    ["type_params_param"]
)

// Create the block definitions for the JSON-only blocks.
// This does not register their definitions with Blockly.
// This file has no side effects!
export const typeBlocks = Blockly.common.createBlockDefinitionsFromJsonArray([
    defnType, typeParamsContainer, typeParamsParam, boolType, floatType,
]);
