/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from 'blockly';
import { genericDataConstructor, genericTypeDeconstructor, typeBlocks } from './blocks/type';
import {forBlock} from './generators/javascript';
import {javascriptGenerator} from 'blockly/javascript';
import {save, load} from './serialization';
import {toolbox} from './toolbox';
import { typesFlyoutCallback } from './toolbox/types';
import './index.css';
import { builtinFns } from './blocks/builtinFns';
import { functionBlocks } from './blocks/procedures';
import { funcsFlyoutCallback } from './toolbox/funcs';
import { genCodeFor } from './generators/genFir';
import { addToEnv, Env, env, Force, forcedMain, renderState, resetEnv, setupForcedMain } from './generators/fir';
import * as Save from './save'

Blockly.serialization.registry.register(
    "types_and_ctors",
    {
        save: Save.saveTypeCtors,
        load: Save.loadTypeCtors,
        clear: Save.clearTypes,
        priority: 1000,
    }
)
export var knownTypes = []
export var knownFuncs = []
export var knownVariableTypesCount = 0
export function setKVTC(x) {knownVariableTypesCount = x}

export var knownVariableFuncsCount = 0
export function setKVFC(x) {knownVariableFuncsCount = x}

export var ws = null 

// since we import to react for compile and run, we need to delegate things
export function setup(blocklyDiv) {
    // Register the blocks and generator with Blockly
    Blockly.common.defineBlocks(typeBlocks)
    Blockly.common.defineBlocks(builtinFns)
    Blockly.common.defineBlocks(functionBlocks)
    Object.assign(javascriptGenerator.forBlock, forBlock);

    ws = Blockly.inject(blocklyDiv, {toolbox})

    ws.registerToolboxCategoryCallback('TYPES_PALETTE', typesFlyoutCallback)
    ws.registerToolboxCategoryCallback('FUNCS_PALETTE', funcsFlyoutCallback)

    ws.addChangeListener(syncTypes)


    // Load the initial state from storage and run the code.
    console.log("loading!!!")
    // load(ws);

    // Every time the workspace changes state, save the changes to storage.
    // ws.addChangeListener((e) => {
    //     //   // UI events are things like scrolling, zooming, etc.
    //     //   // No need to save after one of these.
    //     if (e.isUiEvent) return;
    //     save(ws);
    // });

}

export function compile() {
    resetEnv()
    ws.getBlocksByType("defn_function").forEach(block => {
        const fnName = block.getFieldValue("FUNCTIONNAME")
        const compiledFunction = genCodeFor(block.getInputTargetBlock("FUNCTION"))
        // addToEnv(fn)
        env.set(fnName, compiledFunction)
    })
    setupForcedMain()
    console.log(env)
}
export function run() {
    console.log("Running")
    if (!forcedMain.isEvaluated()) {
        forcedMain.evalOne();
    }
    // broken
    if ((new Force(forcedMain.value.func)).isEvaluated()) {
        console.log("I'm done.")
    }
    renderState()
}

function syncTypes() {
    console.log("sync-types")
    knownTypes = ws.getBlocksByType("defn_type")
    knownFuncs = ws.getBlocksByType("defn_function")

    // ensure all knownTypes have impls
    knownTypes.forEach(type => {

        console.log("TYP", type)
        genericTypeDeconstructor(type)
        genericDataConstructor(type)
        // type universe type constuctor
        var block = Blockly.Blocks[`type_${type.getFieldValue('TYPENAME')}`]
        if (undefined == block) {
            // not found
            Blockly.Blocks[`type_${type.getFieldValue('TYPENAME')}`] = {
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
                Blockly.Blocks[`type_${type.getFieldValue('TYPENAME')}`] = {
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
        var block = Blockly.Blocks[`func_${type.getFieldValue('FUNCTIONNAME')}`]
        if (undefined == block) {
            // not found
            // functions as values
            Blockly.Blocks[`func_${type.getFieldValue('FUNCTIONNAME')}`] = {
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

