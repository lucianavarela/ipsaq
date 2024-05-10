import { Series } from "./series";
import { User } from "./user";

export class Sermon {
    public id?: number;
    public director?: User | null;
    public preacher?: User | null;
    public title?: string;
    public date?: string;
    public time?: string;
    public link_youtube?: string;
    public bible_verse?: string;
    public series?: Series;
    public chapter_number?: number;
    public ids_band?: number[] = [];

    constructor(obj?: {id: number, title: string, id_director: any, id_preacher: any, link_youtube: string, bible_verse: string,
        related_series: any, chapter_number: number, sermon_band: any[], datetime?: string, date?: string, time?: string}) {
        this.id = obj?.id;
        this.title = obj?.title;
        if (obj?.datetime) {
            const values = obj?.datetime.split('T');
            this.date = values[0];
            this.time = values[1].split('+')[0];
        } else {
            this.date = obj?.date ?? '';
            this.time = obj?.time ?? '';
        }
        this.link_youtube = obj?.link_youtube;
        this.bible_verse = obj?.bible_verse;
        this.series = obj?.related_series ? new Series({id: Number(obj?.related_series.id), name:obj?.related_series.name}) : undefined;
        this.chapter_number = obj?.chapter_number;
        this.director = obj?.id_director ? new User (obj?.id_director) : null;
        this.preacher = obj?.id_preacher ? new User (obj?.id_preacher) : null;
        if (obj && 'sermon_band' in obj && obj.sermon_band.length) {
            this.ids_band = obj.sermon_band.map(sb => sb.id_player);
        }
    }
}
