class Env {
    values: Map<String, Value>[] = [new Map()]
    pushFrame() {
        this.values.push(new Map())
    }
    popFrame() {
        this.values.pop()
    }
    lookup(k: string): Value {
        for (var i = this.values.length - 1; i <= 0; i--) {
            const map = this.values[i]
            if (map.has(k)) {
                return map.get(k) as Value
            }
        }
        return new NullValue()
    }
    set(k: String, v: Value) {
        this.values[this.values.length - 1].set(k, v)
    }
}

var env = new Env()

class FIRNode {
    
}

class Value extends FIRNode {
    evalOne(): Value {return new NullValue()}
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

class App extends Value {
    target: Value
    args: Value[]

    evalOne(): Value {
        
        return new NullValue()
    }

    constructor(target: Value, args: Value[]) {
        super()
        this.target = target
        this.args = args
    }
}

class Var extends Value {
    name: string

    constructor(name: string) {
        super()
        this.name = name
    }

    evalOne(): Value {
        return env.lookup(this.name)
    }
}

class DataValue extends Value {
    name: string
    values: Value[]
    constructor(name: string, values: Value[]) {
        super()
        this.name = name
        this.values = values
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
        var evaluated = this.to.evalOne()
        env.popFrame()
        return evaluated
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
            this.from.evalOne()
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

class Fun extends Value {
    // params: number
    body: Value

    constructor(params: number, body: Value) {
        super()
        // this.params = params
        this.body = body
    }

    evalOne() {
        return this.body.evalOne()
    }
    isEvaluated(): boolean {
        return this.body.isEvaluated()
    }
}

class Call extends Value {
    func: string
    params: Value[]
    constructor(func: string, params: Value[]) {
        super()
        this.func = func
        this.params = params
    }
    evalOne(): Value {
        var toEval = env.lookup(this.func)
        env.pushFrame()
        for (var i = 0; i < this.params.length; i++) {
            env.set(alpha[i], this.params[i])
        }
        const evaled = toEval.evalOne()
        env.popFrame()
        return evaled
    }
    isEvaluated(): boolean {
        var toEval = env.lookup(this.func)
        env.pushFrame()
        for (var i = 0; i < this.params.length; i++) {
            env.set(alpha[i], this.params[i])
        }
        const evaled = toEval.isEvaluated()
        env.popFrame()
        return evaled
    }
}

class FlatValue {}

class Callable {
    call(...args: FlatValue[]): any {}
}

class InherentFun extends Callable {
    body: (...args: any[]) => any

    constructor(fun: (...args: any[]) => any) {
        super()
        this.body = fun
    }

    // evalOne()
}

class DataType extends Value {
    ctorName: String
    values: Value[]

    constructor(ctorName: String, values: Value[]) {
        super()
        this.ctorName = ctorName
        this.values = values
    }
}

class Lit extends Value {

}

class IntLit extends Lit {
    
}
