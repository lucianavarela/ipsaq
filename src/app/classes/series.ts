export class Series {
    public id?: number;
    public name?: string;

    constructor(obj?: {id: number, name: string}) {
        this.id = obj?.id;
        this.name = obj?.name;
    }
}
