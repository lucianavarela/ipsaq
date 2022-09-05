export class User {
    public id?: number;
    public email?: string;

    constructor(obj?: {id: number, email: string}) {
        this.id = obj?.id;
        this.email = obj?.email;
    }
}
