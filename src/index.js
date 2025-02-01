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

export var knownTypes = []
export var knownTypeImpls = {}

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
const ws = Blockly.inject(blocklyDiv, {toolbox});

ws.registerToolboxCategoryCallback('TYPES_PALETTE', typesFlyoutCallback)

function syncTypes() {
    knownTypes = ws.getBlocksByType("defn_type")
    console.log("kt", knownTypes)
    // var currentBlocks = []
    // console.log(knownTypes)
    // ws.getBlocksByType('defn_type').forEach(b => {
    //     var currB = knownTypes.find(known => {known.getFieldValue('TYPENAME').toLowerCase() == b.getFieldValue('TYPENAME').toLowerCase()})
    //     if (currB) {
    //         knownTypes = knownTypes.filter(known => {known.getFieldValue('TYPENAME').toLowerCase() != b.getFieldValue('TYPENAME').toLowerCase()})
    //         currentBlocks.push(currB)
    //     }
    // })
    // knownTypes = currentBlocks
    // ensure all knownTypes have impls
    knownTypes.forEach(type => {
        console.log("haiii", type)
        if (undefined == Blockly.Blocks[`type_${type.getFieldValue('TYPENAME').toLowerCase()}`]) {
            // not found
            Blockly.Blocks[`type_${type.getFieldValue('TYPENAME').toLowerCase()}`] = {
                init: function() {
        // this.appendValueInput('T1')
        //     .setCheck('Type')
        //     .appendField('Sum')
        // this.appendValueInput('T2')
        //     .setCheck('Type')
        // this.setOutput(true, 'Type')
        // this.setColour(160)   
                    this.appendDummyInput()
                        .appendField(type.getFieldValue('TYPENAME'));
                    this.setOutput(true, 'Type')
                    this.setColour(160)       
                }
            }
        }
    })
    // ensure all known impls have blocks
    // Blockly.Blocks.keys().forEach((k) => {
    //     if (k.startsWith("TYPE_")) {
    //         const name = k.split("TYPE_")[1]
    //         if (knownTypes.find(b => b.getFieldValue('TYPENAME') == name) == undefined) {
    //             // no!
    //             Blockly.Blocks[k].dispose()
    //         }
    //     }
    // })
    console.log(Blockly.Blocks)
}

ws.addChangeListener(syncTypes)

// This function resets the code and output divs, shows the
// generated code from the workspace, and evals the code.
// In a real application, you probably shouldn't use `eval`.
const runCode = () => {
  const code = javascriptGenerator.workspaceToCode(ws);
  codeDiv.innerText = code;

  outputDiv.innerHTML = '';

  eval(code);
};

// Load the initial state from storage and run the code.
load(ws);
// runCode();

// Every time the workspace changes state, save the changes to storage.
ws.addChangeListener((e) => {
  // UI events are things like scrolling, zooming, etc.
  // No need to save after one of these.
  if (e.isUiEvent) return;
  save(ws);
});

// Whenever the workspace changes meaningfully, run the code again.
ws.addChangeListener((e) => {
  // Don't run the code when the workspace finishes loading; we're
  // already running it once when the application starts.
  // Don't run the code during drags; we might have invalid state.
  if (
    e.isUiEvent ||
    e.type == Blockly.Events.FINISHED_LOADING ||
    ws.isDragging()
  ) {
    return;
  }
  runCode();
});
