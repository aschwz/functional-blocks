/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from 'blockly';
import {blocks} from './blocks/text';
import { typeBlocks } from './blocks/type';
import {forBlock} from './generators/javascript';
import {javascriptGenerator} from 'blockly/javascript';
import {save, load} from './serialization';
import {toolbox} from './toolbox';
import { typesFlyoutCallback } from './toolbox/types';
import './index.css';
import { builtinFns } from './blocks/builtinFns';
import { functionBlocks } from './blocks/procedures';
import { funcsFlyoutCallback } from './toolbox/funcs';

export var knownTypes = []
export var knownFuncs = []
export var knownVariableTypesCount = 0
export function setKVTC(x) {knownVariableTypesCount = x}

export var knownVariableFuncsCount = 0
export function setKVFC(x) {knownVariableFuncsCount = x}


// Register the blocks and generator with Blockly
Blockly.common.defineBlocks(blocks);
Blockly.common.defineBlocks(typeBlocks)
Blockly.common.defineBlocks(builtinFns)
Blockly.common.defineBlocks(functionBlocks)
Object.assign(javascriptGenerator.forBlock, forBlock);

// Set up UI elements and inject Blockly
const codeDiv = document.getElementById('generatedCode').firstChild;
const outputDiv = document.getElementById('output');
const blocklyDiv = document.getElementById('blocklyDiv');
export const ws = Blockly.inject(blocklyDiv, {toolbox});

ws.registerToolboxCategoryCallback('TYPES_PALETTE', typesFlyoutCallback)
ws.registerToolboxCategoryCallback('FUNCS_PALETTE', funcsFlyoutCallback)

function syncTypes() {
    knownTypes = ws.getBlocksByType("defn_type")
    knownFuncs = ws.getBlocksByType("defn_function")

    // ensure all knownTypes have impls
    knownTypes.forEach(type => {
        var block = Blockly.Blocks[`type_${type.getFieldValue('TYPENAME').toLowerCase()}`]
        if (undefined == block) {
            // not found
            Blockly.Blocks[`type_${type.getFieldValue('TYPENAME').toLowerCase()}`] = {
                init: function() {
                    this.paramsCount = type.args

                    this.appendDummyInput()
                        .appendField(type.getFieldValue('TYPENAME'));
                    for (var i = 0; i < type.args; i++) {
                        this.appendValueInput('TYPE_' + i)
                            .setCheck('Type')
                    }
                    this.setOutput(true, 'Type')
                    this.setColour(160)       
                }
            }
        } else {
            // ensure type count sync
            if (block.paramsCount != type.args) {
                // cry.
                Blockly.Blocks[`type_${type.getFieldValue('TYPENAME').toLowerCase()}`] = {
                init: function() {
                    this.paramsCount = type.args
                    this.appendDummyInput()
                        .appendField(type.getFieldValue('TYPENAME'));
                    for (var i = 0; i < type.args; i++) {
                        this.appendValueInput('TYPE_' + i)
                            .setCheck('Type')
                    }
                    this.setOutput(true, 'Type')
                    this.setColour(160)       
                }
            }
            }
        }
    })
    knownFuncs.forEach(type => {
        var block = Blockly.Blocks[`func_${type.getFieldValue('FUNCTIONNAME').toLowerCase()}`]
        if (undefined == block) {
            // not found
            Blockly.Blocks[`func_${type.getFieldValue('FUNCTIONNAME').toLowerCase()}`] = {
                init: function() {
                    this.paramsCount = type.args

                    this.appendDummyInput()
                        .appendField(type.getFieldValue('FUNCTIONNAME'));
                    this.setOutput(true, 'Value')
                    this.setColour(160)       
                }
            }
        }
    })
}

ws.addChangeListener(syncTypes)

// This function resets the code and output divs, shows the
// generated code from the workspace, and evals the code.
// In a real application, you probably shouldn't use `eval`.
// const runCode = () => {
//   const code = javascriptGenerator.workspaceToCode(ws);
//   codeDiv.innerText = code;

//   outputDiv.innerHTML = '';

//   eval(code);
// };

// Load the initial state from storage and run the code.
load(ws);
// runCode();

// Every time the workspace changes state, save the changes to storage.
// ws.addChangeListener((e) => {
//   // UI events are things like scrolling, zooming, etc.
//   // No need to save after one of these.
//   if (e.isUiEvent) return;
//   save(ws);
// });

// // Whenever the workspace changes meaningfully, run the code again.
// ws.addChangeListener((e) => {
//   // Don't run the code when the workspace finishes loading; we're
//   // already running it once when the application starts.
//   // Don't run the code during drags; we might have invalid state.
//   if (
//     e.isUiEvent ||
//     e.type == Blockly.Events.FINISHED_LOADING ||
//     ws.isDragging()
//   ) {
//     return;
//   }
//   runCode();
// });
