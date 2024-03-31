export class Song {
    public id?: number;
    public title?: string;
    public beginning?: string;
    public index?: number;
    public artist?: string;
    public link_original?: string;
    public link_ipsaq?: string;
    public link_chords?: string;
    public lyrics?: string;
    public created_at?: Date;
    public last_used?: Date;
    public amount_used?: number;
    public suggestion?: boolean;
    public verified?: boolean;

    constructor(obj?: {id: number, title: string, beginning: string, index: number,
        artist: string, link_original: string, link_ipsaq: string, lyrics: string,
        link_chords: string, created_at: Date, last_used: Date, amount_used: number,
        suggestion: boolean, verified: boolean}) {
        this.id = obj?.id;
        this.title = obj?.title;
        this.beginning = obj?.beginning;
        this.index = obj?.index;
        this.artist = obj?.artist;
        this.link_original = obj?.link_original;
        this.link_ipsaq = obj?.link_ipsaq;
        this.link_chords = obj?.link_chords;
        this.lyrics = obj?.lyrics;
        this.created_at = obj?.created_at;
        this.last_used = obj?.last_used;
        this.amount_used = obj?.amount_used;
        this.suggestion = !!(obj?.suggestion);
        this.verified = !!(obj?.verified);
    }
}
