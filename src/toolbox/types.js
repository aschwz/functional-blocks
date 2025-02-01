import { knownTypes } from "..";

import * as Blockly from 'blockly';
export var typesFlyoutCallback = function(workspace) {
  // Returns an array of hex colours, e.g. ['#4286f4', '#ef0447']
  var blockList = [
        {
          kind: 'block',
          type: 'defn_type',
        },
        {
            kind: 'block',
            type: 'sum_type',
        },
    ];
    
    console.log(Blockly.Blocks)
    knownTypes.forEach(x => blockList.push({
        kind: 'block',
        type: "type_" + x.getFieldValue('TYPENAME').toLowerCase()
    }));
  return blockList;
};
