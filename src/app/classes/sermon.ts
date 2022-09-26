import { Series } from "./series";

export class Sermon {
    public id?: number;
    public director?: number;
    public preacher?: number;
    public title?: string;
    public date?: Date;
    public link_youtube?: string;
    public bible_verse?: string;
    public series?: Series;

    constructor(obj?: {id: number, director: number, preacher: number, title: string,
        date: Date, link_youtube: string, bible_verse: string, related_series: any}) {
        this.id = obj?.id;
        this.director = obj?.director;
        this.preacher = obj?.preacher;
        this.title = obj?.title;
        this.date = obj?.date;
        this.link_youtube = obj?.link_youtube;
        this.bible_verse = obj?.bible_verse;
        this.series = obj?.related_series ? new Series({id: Number(obj?.related_series.id), name:obj?.related_series.name}) : undefined;
    }
}
