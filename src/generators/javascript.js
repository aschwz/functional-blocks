/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {Order} from 'blockly/javascript';
import * as Blockly from 'blockly/core';


import { knownTypes } from '..';

// Export all the code generators for our custom blocks,
// but don't register them with Blockly yet.
// This file has no side effects!
export const forBlock = Object.create(null);

forBlock['add_text'] = function (block, generator) {
  const text = generator.valueToCode(block, 'TEXT', Order.NONE) || "''";
  const addText = generator.provideFunction_(
    'addText',
    `function ${generator.FUNCTION_NAME_PLACEHOLDER_}(text) {

  // Add text to the output area.
  const outputDiv = document.getElementById('output');
  const textEl = document.createElement('p');
  textEl.innerText = text;
  outputDiv.appendChild(textEl);
}`,
  );
  // Generate the function call for this block.
  const code = `${addText}(${text});\n`;
  return code;
};

forBlock['defn_type'] = function (block, generator) {
//     knownTypes.push(block)
    const typeName = block.getFieldValue('TYPENAME')
//     // Blockly.Blocks["type_" + typeName] = {
//         // init: function() {
//             // this.appendValueInput('T1')
//                 // .setCheck('Type')
//                 // .appendField('Sum')
//             // this.appendValueInput('T2')
//                 // .setCheck('Type')
//             // this.setOutput(true, 'Type')
//             // this.setColour(160)       
//         // }
//     // }
//     // const text = generator.valueToCode(block, 'TYPENAME', Order.NONE) || '';
    return `// Type: ${typeName}`
}
