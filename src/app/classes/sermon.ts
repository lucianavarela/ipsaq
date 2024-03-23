import { Series } from "./series";
import { SermonBand } from "./sermon-band";

export class Sermon {
    public id?: number;
    public director?: string;
    public preacher?: string;
    public director_id?: number;
    public preacher_id?: number;
    public title?: string;
    public date?: Date;
    public link_youtube?: string;
    public bible_verse?: string;
    public series?: Series;
    public chapter_number?: number;
    public band?: number[] = [];

    constructor(obj?: {id: number, director: string, preacher: string, title: string, date: Date, related_director: number, related_preacher: number, 
        link_youtube: string, bible_verse: string, related_series: any, chapter_number: number, sermon_band: any[]}) {
        this.id = obj?.id;
        this.director = obj?.director;
        this.preacher = obj?.preacher;
        this.title = obj?.title;
        this.date = obj?.date;
        this.link_youtube = obj?.link_youtube;
        this.bible_verse = obj?.bible_verse;
        this.series = obj?.related_series ? new Series({id: Number(obj?.related_series.id), name:obj?.related_series.name}) : undefined;
        this.chapter_number = obj?.chapter_number;
        this.director_id = obj?.related_director;
        this.preacher_id = obj?.related_preacher;
        if (obj && 'sermon_band' in obj && obj.sermon_band.length) {
            this.band = obj.sermon_band.map(sb => sb.id_player)
        }
    }
}
