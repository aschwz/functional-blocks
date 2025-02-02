export class Env {
    values: Map<String, Value>[] = [new Map()]
    pushFrame() {
        this.values.push(new Map())
    }
    popFrame() {
        this.values.pop()
    }
    lookup(k: string): Value {
        for (var i = this.values.length - 1; i >= 0; i--) {
            const map = this.values[i]
            if (map.has(k)) {
                return map.get(k) as Value
            }
        }
        console.log(env)
        throw new Error("var " + k + " not found")
    }
    set(k: String, v: Value) {
        this.values[this.values.length - 1].set(k, v)
    }
}

export var env = new Env()

export var forcedMain = null

export function resetEnv() {
    env = new Env()
}
export function setupForcedMain() {
    forcedMain = new Force(env.lookup("main"))
}
export function addToEnv(k, v) {env.set(k, v)}

export function renderState() {
    // eventually this will render this nicely but i eepy
    console.log("Rendering state:", env)
}

class FIRNode {
    
}

class Value extends FIRNode {
    evalOne(): Value {throw Error("aaa")}
    isEvaluated(): boolean {throw Error("aaa")}
}

class NullValue extends Value {
    evalOne(): Value {
        alert("Attempt to evaluate a NullValue!!! Your code is Bad.")
        throw new Error()
    }
    isEvaluated(): boolean {
        return false
    }
}

export class Var extends Value {
    name: string

    constructor(name: string) {
        super()
        this.name = name
    }

    evalOne(): Value {
        return env.lookup(this.name)
    }
    isEvaluated(): boolean {
        return env.lookup(this.name).isEvaluated()   
    }
}

export class DataValue extends Value {
    name: string
    values: Value[]
    constructor(name: string, values: Value[]) {
        super()
        this.name = name
        this.values = values
    }
    evalOne(): Value {
        for (var i = 0; i < this.values.length; i++)
            if (!this.values[i].isEvaluated()) {
                this.values[i] = this.values[i].evalOne()
                return this
            }
            return this
        }
    isEvaluated(): boolean {
        for (var v of this.values) {
            if (!v.isEvaluated()) return false
        }   
        return true
    }
}


function max(x: number, y: number) {
    if (x > y) return x
    return y
}

export class DeconOption {
    nameMatch: string
    into: string[]
    to: Value

    evalOne(inp: DataValue): Value {
        env.pushFrame()
        for (var i = 0; i < max(this.into.length, inp.values.length); i++) {
            env.set(this.into[i], inp.values[i])
        }
        this.to = this.to.evalOne()
        env.popFrame()
        return this.to 
    }

    isEvaluated() {
        return this.to.isEvaluated()
    }

    constructor(nameMatch: string, into: string[], to: Value) {
        this.nameMatch = nameMatch
        this.into = into
        this.to = to
    }
}

export class Deconstruct extends Value {
    from: Value
    options: DeconOption[]
    constructor(from: Value, opts: DeconOption[]) {
        super()
        this.from = from
        this.options = opts
    }

    chosenOpt: DeconOption | null = null

    isEvaluated(): boolean {
        if (this.chosenOpt != null) {
            return this.chosenOpt.isEvaluated()
        }
        return false
    }

    evalOne(): Value {
        if (!this.from.isEvaluated()) {
            this.from = this.from.evalOne()
            return this
        } else {
            if (this.from instanceof DataValue) {
                const deconOpt = this.options.find(opt => opt.nameMatch == (this.from as DataValue).name)
                if (deconOpt != undefined) {
                    return deconOpt.evalOne((this.from as DataValue))
                } else {
                    alert("Deconstruct didn't match")
                    throw Error()
                }
            } else {
                alert("Deconstruct called on non-datatype")
                throw Error()
            }
        }
    }
}

const alpha = "abcdefghijklmnopqrstuvwxyz"

// class Fun extends Value {
//     // params: number
//     body: Value

//     constructor(params: number, body: Value) {
//         super()
//         // this.params = params
//         this.body = body
//     }

//     evalOne() {
//         return this.body.evalOne()
//     }
//     isEvaluated(): boolean {
//         return this.body.isEvaluated()
//     }
// }

export class Call extends Value {
    func: Value
    params: Value[]
    constructor(func: Value, params: Value[]) {
        super()
        this.func = func
        this.params = params
    }
    evalOne(): Value {
        // special case: if this is an inherent fn then this needs to be strict
        if (this.func instanceof InherentFun) {
            // eval args first
            for (var i = 0; i < this.params.length; i++) {
                if (!this.params[i].isEvaluated()) {
                    this.params[i] = this.params[i].evalOne()
                    return this
                } else {
                    if (this.params[i] !instanceof Lit) {
                        throw Error("Can't inherent on a non-lit")
                    }
                }
            }
            // they're all lit
            var values = this.params.map(v => (v as Lit).data)
            return this.func.body(...values)
        }
        if (this.func.isEvaluated()) {
            return this.func
        }
        // if (!this.func.isEvaluated()) {
        //     return this.func.evalOne()
        // }
        // var toEval = env.lookup(this.func)
        env.pushFrame()
        for (var i = 0; i < this.params.length; i++) {
            env.set(alpha[i], this.params[i])
        }
        this.func = this.func.evalOne()
        env.popFrame()
        return this
    }
    isEvaluated(): boolean {
        // var toEval = env.lookup(this.func)
        env.pushFrame()
        for (var i = 0; i < this.params.length; i++) {
            env.set(alpha[i], this.params[i])
        }
        const evaled = this.func.isEvaluated()
        env.popFrame()
        return evaled
    }
}


export class InherentFun extends Value {
    body: (...args: any[]) => any

    constructor(fun: (...args: any[]) => any) {
        super()
        this.body = fun
    }

    isEvaluated() {return true}
    evalOne() {return this}

    // evalOne()
}


class Lit extends Value {
    data: any

    constructor(data: any) {
        super()
        this.data = data
    }
    isEvaluated(): boolean {return true}
}



export class Force extends Value {
    value: Value
    constructor(value: Value) {
        super()
        this.value = value
    }
    isEvaluated(): boolean {
        if (this.value instanceof Lit) {
            return true
        }
        if (this.value instanceof DataValue) {
            const subValues = (this.value as DataValue).values.map(v => new Force(v))
            for (var i = 0; i < subValues.length; i++) {
                if (!subValues[i].isEvaluated()) {
                    return false
                }
            }
            return true
        }
        return false
    }
    evalOne(): Value {
        this.value = this.value.evalOne()   
        return this.value
    }
}
