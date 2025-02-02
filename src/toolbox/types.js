import { knownTypes, knownVariableTypesCount } from "..";

import * as Blockly from 'blockly';
import { typeVarsNames } from "../blocks/type";
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
        {
            kind: 'block',
            type: 'type_builtin_bool',
        },
        {
            kind: 'block',
            type: 'type_builtin_float',
        },
        {
            kind: 'block',
            type: 'deconstruct_type_into'
        }
        
    ];

    typeVarsNames(knownVariableTypesCount).forEach(c => {
        blockList.push({
            kind: 'block',
            type: 'type_param_' + c
        })
    })
    
    console.log(Blockly.Blocks)
    knownTypes.forEach(x => {
        blockList.push({
            kind: 'block',
            type: "type_" + x.getFieldValue('TYPENAME').toLowerCase()
        })
        blockList.push({
            kind: 'block',
            type: "type_decon_" + x.getFieldValue("TYPENAME")
        })
    });
  return blockList;
};
