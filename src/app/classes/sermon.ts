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
        date: Date, link_youtube: string, bible_verse: string, series: any}) {
        this.id = obj?.id;
        this.director = obj?.director;
        this.preacher = obj?.preacher;
        this.title = obj?.title;
        this.date = obj?.date;
        this.link_youtube = obj?.link_youtube;
        this.bible_verse = obj?.bible_verse;
        this.series = obj?.series ? new Series(obj?.series) : undefined;
    }
}
