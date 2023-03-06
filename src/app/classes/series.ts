import { Sermon } from "./sermon";

export class Series {
    public id?: number;
    public name?: string;
    public sermons?: any[];

    constructor(obj?: {id: number, name: string, sermons?: any[]}) {
        this.id = obj?.id;
        this.name = obj?.name;
        this.sermons = obj?.sermons;
    }
}
