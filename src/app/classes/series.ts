import { Sermon } from "./sermon";

export class Series {
    public id?: number;
    public name?: string;
    public sermons?: any[];
    public primero?: Date;
    public ultimo?: Date;

    constructor(obj?: {id: number, name: string, sermons?: any[], primero?: Date, ultimo?: Date}) {
        this.id = obj?.id;
        this.name = obj?.name;
        this.sermons = obj?.sermons;
        this.primero = obj?.primero;
        this.ultimo = obj?.ultimo;
    }
}
