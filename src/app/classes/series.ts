import { Sermon } from "./sermon";

export class Series {
    public id?: number;
    public name?: string;
    public sermons?: any[] | null;
    public sermons_amount?: number;
    public primero?: Date;
    public ultimo?: Date;

    constructor(obj?: {id: number, name: string, sermons?: any[], primero?: Date, ultimo?: Date, sermons_amount?: number}) {
        this.id = obj?.id;
        this.name = obj?.name;
        this.sermons = obj?.sermons && !('count' in obj?.sermons[0]) ? obj?.sermons : null;
        this.primero = obj?.primero;
        this.ultimo = obj?.ultimo;
        this.sermons_amount = obj?.sermons_amount;
    }
}