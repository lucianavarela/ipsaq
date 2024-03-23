import { Series } from "./series";

export class Sermon {
    public id?: number;
    public director?: string;
    public preacher?: string;
    public id_director?: number;
    public id_preacher?: number;
    public title?: string;
    public date?: Date;
    public link_youtube?: string;
    public bible_verse?: string;
    public series?: Series;
    public chapter_number?: number;
    public ids_band?: number[] = [];

    constructor(obj?: {id: number, director: string, preacher: string, title: string, date: Date, id_director: number, id_preacher: number, 
        link_youtube: string, bible_verse: string, id_series: any, chapter_number: number, sermon_band: any[]}) {
        this.id = obj?.id;
        this.director = obj?.director;
        this.preacher = obj?.preacher;
        this.title = obj?.title;
        this.date = obj?.date;
        this.link_youtube = obj?.link_youtube;
        this.bible_verse = obj?.bible_verse;
        this.series = obj?.id_series ? new Series({id: Number(obj?.id_series.id), name:obj?.id_series.name}) : undefined;
        this.chapter_number = obj?.chapter_number;
        this.id_director = obj?.id_director;
        this.id_preacher = obj?.id_preacher;
        if (obj && 'sermon_band' in obj && obj.sermon_band.length) {
            this.ids_band = obj.sermon_band.map(sb => sb.id_player)
        }
    }
}
