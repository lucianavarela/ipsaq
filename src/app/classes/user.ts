export class User {
    public id?: number | null;
    public first_name: string | null;
    public last_name: string | null;

    constructor(obj?: {id: number, first_name: string, last_name: string}) {
        this.id = obj?.id ?? null;
        this.first_name = obj?.first_name ?? null;
        this.last_name = obj?.last_name ?? null;
    }
}
