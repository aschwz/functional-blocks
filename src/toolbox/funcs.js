import * as Blockly from 'blockly';
import { typeVarsNames } from "../blocks/type";
import { knownVariableFuncsCount } from "..";
import { knownFuncs } from '..';
export var funcsFlyoutCallback = function(workspace) {
  var blockList = [
        {
          kind: 'block',
          type: 'defn_function',
        },
        {
            kind: 'block',
            type: 'call_func',
        }
        // {
        //     kind: 'block',
        //     type: 'sum_type',
        // },
        // {
        //     kind: 'block',
        //     type: 'type_builtin_bool',
        // },
        // {
        //     kind: 'block',
        //     type: 'type_builtin_float',
        // },
    ];

    typeVarsNames(knownVariableFuncsCount).forEach(c => {
        blockList.push({
            kind: 'block',
            type: 'func_param_' + c
        })
    })
    
    knownFuncs.forEach(x => blockList.push({
        kind: 'block',
        type: "func_" + x.getFieldValue('FUNCTIONNAME')
    }));
  return blockList;
};
