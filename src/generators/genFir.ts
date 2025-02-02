import {Deconstruct, DeconOption} from "./fir.ts"

var perBlock = {}

export function genCodeFor(block) {
    var ty = block.type
    console.log("GEN", ty)
    if (ty == "deconstruct_type_into") {
        const valueToDeconstruct = block.getInputTargetBlock("VALUE")
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
            const final = decon.getInputTargetBlock("VALUE")
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
                console.log("BIND: ", bind)
                // variableNames.push(the name once I get it)
            })

            const branch = new DeconOption(from, variableNames, final)
            paths.push(branch)
        })
        return new Deconstruct(valueToDeconstruct, paths)
    }
}

