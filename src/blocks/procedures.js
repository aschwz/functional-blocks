import * as Blockly from 'blockly/core';

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
      check: 'Function',
    },
  ],
  // previousStatement: null,
  // nextStatement: null,
  colour: 160,
  tooltip: '',
  helpUrl: '',
};

const callFunc = {
    type: 'call_func',
    message0: 'call func %1 with %2 as %3',
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
        {
            type: 'input_value',
            name: 'TYPE',
            check: 'Type',
        },
    ],
    // previousStatement: null,
    // nextStatement: null,
    colour: 160,
    tooltip: '',
    helpUrl: '',
    mutator: "type_multiparam_mutator",
    extraState: {"args": 0},
};

// Create the block definitions for the JSON-only blocks.
// This does not register their definitions with Blockly.
// This file has no side effects!
export const functionBlocks = Blockly.common.createBlockDefinitionsFromJsonArray([
  defnFunction,
]);
