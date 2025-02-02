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

class FIRNode {
    
}

class Value extends FIRNode {
    evalOne(e: Env): Value {return new NullValue()}
    isEvaluated(): boolean {return true}
}

class NullValue extends Value {
    evalOne(e: Env): Value {
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

    evalOne(e: Env): Value {
        
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

    evalOne(e: Env): Value {
        return e.lookup(this.name)
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

    evalOne(e: Env, inp: DataValue) {
        this.to.evalOne(e)
        for (var i = 0; i < max(this.into.length, inp.values.length); i++) {
            e.set(this.into[i], inp.values[i])
        }
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
}

class Fun extends Value {
    body: Value[]
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

    // evalOne(e: Env)
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
