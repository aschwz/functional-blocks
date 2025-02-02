import {Deconstruct, DeconOption, DataValue, Call, Var, InherentFun} from "./fir.ts"

var perBlock = {}

export function genCodeFor(block) {
    var ty = block.type
    console.log("GEN", ty)
    if (ty == "deconstruct_type_into") {
        const valueToDeconstruct = genCodeFor(block.getInputTargetBlock("VALUE"))
        var waysToDeconstruct = []
        var connection = block.getInputTargetBlock("CONDS")
        console.log("conn", connection)
        var conds = []
        while (connection) {
            conds.push(connection)
            connection = connection.getNextBlock()
            console.log("conn", connection)
        }
        var paths = []
        // Conds should all be type_decon_xyz
        conds.forEach(decon => {
            const final = genCodeFor(decon.getInputTargetBlock("VALUE"))
            const from = decon.deconTyName
            // all the Ix inputs should be variables?
            var binds = []
            var idx = 0
            var conn = decon.getInputTargetBlock("I_" + idx)
            while (conn) {
                binds.push(conn)
                idx++
                conn = decon.getInputTargetBlock("I_" + idx)
            }
            var variableNames = []
            binds.forEach(bind => {
                // bind is a variable, all I have to do is get the name out of it somehow
                var varName = bind.getField("VAR").selectedOption[0]
                variableNames.push(varName)
            })

            const branch = new DeconOption(from, variableNames, final)
            paths.push(branch)
        })
        var decon = new Deconstruct(valueToDeconstruct, paths)
        console.log("DECON BABEY", decon)
        return decon
    }
    if (ty == "math_arithmetic") {
        console.log(block)
        const op = block.getField("OP").selectedOption[0]
        if (op == "+") {
            return InherentFun((x, y) => (x + y))
        }
        if (op == "-") {
            return InherentFun((x, y) => (x + y))
        }
        if (op == "*") {
            return InherentFun((x, y) => (x * y))
        }
        if (op == "/") {
            return InherentFun((x, y) => (x / y))
        }
        alert("I can't handle the operator " + op)
        throw Error()
    }
    if (ty == "call_func") {
        const target = genCodeFor(block.getInputTargetBlock("FUNCTION"))
        var args = []
        var n = 0
        var a0 = block.getInputTargetBlock("ARG_" + n)
        while (a0) {
            args.push(genCodeFor(a0))
            n++
            a0 = block.getInputTargetBlock("ARG_" + n)
        }
        return new Call(target, args)
    }
    if (ty.startsWith("func_param_")) {
        const pName = ty.split("func_param_")[1]
        // TODO: maybe flatten this out if this is too much indirection
        return new Var(pName)
    }
    if (ty.startsWith("func_")) {
        const pName = ty.split("func_")[1]
        console.log("pname", pName)
        // TODO: maybe flatten this out if this is too much indirection
        var v1 = new Var(pName)
        console.log("v1", v1)
        return v1
    }
    if (ty.startsWith("type_constr_")) {
        const pName = ty.split("type_constr_")[1]
        var values = []
        var n = 0
        var a0 = block.getInputTargetBlock("I_" + n)
        while (a0) {
            values.push(genCodeFor(a0))
            n++
            a0 = block.getInputTargetBlock("I_" + n)
        }
        return new DataValue(pName, values)
    }
    if (ty == "variables_get") {
        var name = block.getField("VAR").selectedOption[0]
        console.log("variable", name)
        return new Var(name)
    }
    else {
        alert("I cannot compile " + ty)
        throw new Error()
    }
}

