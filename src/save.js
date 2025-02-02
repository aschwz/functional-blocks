import { ws } from "."
import { genericDataConstructorInternals, genericTypeDeconstructorInternals, typeVarsNames } from "./blocks/type"
import * as Blockly from 'blockly/core';



export function saveTypeCtors() {
    // also serialise the params since consistent IDs are nice i guess?
    const tvs = typeVarsNames(26).map(c => {
        ws.getBlocksByType("func_param_" + c).map( block => {
            var p = Blockly.serialization.blocks.save(block)
            console.log("P", p)
            return p
        })
    }).concat(typeVarsNames(26).map(c => {
        ws.getBlocksByType("type_param_" + c).map( block => {
            return Blockly.serialization.blocks.save(block)
        })
    }))

    const typess = ws.getBlocksByType("defn_type")
    const tdecons = typess.map(ty => [ty.getFieldValue("TYPENAME"), ty.products])
    return {
        types: tdecons,
        params: tvs
    }
}

export function loadTypeCtors(state) {
    console.log("LTCT")
    const types = state.types

    types.forEach( v => {
        const [name, numDecons] = v
        genericTypeDeconstructorInternals(name, numDecons)
        genericDataConstructorInternals(name, numDecons)
    })
    
    state.params.forEach(alpha => {
        alpha.forEach(block => Blockly.serialization.blocks.append(block, ws))
    })
}

export function clearTypes() {
    // there is nothing to be done.
}


