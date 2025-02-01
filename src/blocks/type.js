import * as Blockly from 'blockly/core';

// Create a custom block called 'add_text' that adds
// text to the output div on the sample app.
// This is just an example and you should replace this with your
// own custom blocks.
const defnType = {
  type: 'defn_type',
  message0: 'define type %1 as %2',
  args0: [
    {
      "type": "field_input",
      "name": "TYPENAME",
      "text": "name your type",
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
};

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

// Create the block definitions for the JSON-only blocks.
// This does not register their definitions with Blockly.
// This file has no side effects!
export const typeBlocks = Blockly.common.createBlockDefinitionsFromJsonArray([
  defnType,
]);
