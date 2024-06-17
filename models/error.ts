export class Error extends globalThis.Error { 
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}