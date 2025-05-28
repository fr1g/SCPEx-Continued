export class Operation {
    operation: 'add' | 'upd' | 'del';
    payloadJson: string;

    constructor(operation: 'add' | 'upd' | 'del', payloadJson: string) {
        this.operation = operation
        this.payloadJson = payloadJson
    }

}