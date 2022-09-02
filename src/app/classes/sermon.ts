export class Sermon {
    public id?: number | null;
    public id_director: number | null;
    public id_preacher: number | null;
    public title: string | null;
    public date: Date | null;
    public link_youtube: string | null;
    public bible_verse: string | null;

    constructor(obj?: {id: number, id_director: number, id_preacher: number, title: string,
        date: Date, link_youtube: string, bible_verse: string}) {
        this.id = obj?.id ?? null;
        this.id_director = obj?.id_director ?? null;
        this.id_preacher = obj?.id_preacher ?? null;
        this.title = obj?.title ?? null;
        this.date = obj?.date ?? null;
        this.link_youtube = obj?.link_youtube ?? null;
        this.bible_verse = obj?.bible_verse ?? null;
    }
}
