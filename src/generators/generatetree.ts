export class Tree {
    readonly value: any;
    readonly children: Tree[]

    public constructor(value: any, ...children: Tree[]) {
        this.value = value
        this.children = children
    }

    public evaluate(): any {
        if (typeof this.value === 'function') {
            return this.value(...this.children.flatMap(this.evaluate))
        }
        else return this.value
    }
    
}