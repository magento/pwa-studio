import { ApolloLink, Observable } from 'apollo-link';

const toRequestKey = operation => {
    return operation.operationName;
};

export default class MutationQueueLink extends ApolloLink {
    constructor() {
        super();
        this.opQueue = [];
        this.inProcess = false;
    }

    processOperation(entry) {
        const { operation, forward, observer } = entry;
        this.inProcess = true;
        console.log('[PROCESSING] - ', toRequestKey(operation));
        forward(operation).subscribe({
            next: result => {
                this.inProcess = false;
                observer.next(result);
                console.log('[NEXT] - ', toRequestKey(operation));
                // If there are more operations, process them.
                if (this.opQueue.length) {
                    this.processOperation(this.opQueue.shift());
                }
            },
            error: error => {
                this.inProcess = false;
                observer.error(error);
                console.log('[ERROR] - ', toRequestKey(operation), error);
                // If there are more operations, process them.
                if (this.opQueue.length) {
                    this.processOperation(this.opQueue.shift());
                }
            },
            complete: observer.complete.bind(observer)
        });
    }

    request(operation, forward) {
        // Enqueue all mutations that unless manually skipped.
        if (
            operation.toKey().includes('"operation":"mutation"') &&
            !operation.getContext().skipQueue
        ) {
            return new Observable(observer => {
                const operationEntry = { operation, forward, observer };
                if (!this.inProcess) {
                    this.processOperation(operationEntry);
                } else {
                    console.log('[QUEUE] -', toRequestKey(operation));
                    this.opQueue.push(operationEntry);
                }
                return () => this.cancelOperation(operationEntry);
            });
        } else {
            return forward(operation);
        }
    }

    cancelOperation(entry) {
        this.opQueue = this.opQueue.filter(e => e !== entry);
    }

    enqueue(entry) {
        this.opQueue.push(entry);
    }
}
