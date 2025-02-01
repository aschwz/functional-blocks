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

// Create the block definitions for the JSON-only blocks.
// This does not register their definitions with Blockly.
// This file has no side effects!
export const functionBlocks = Blockly.common.createBlockDefinitionsFromJsonArray([
  defnFunction,
]);
