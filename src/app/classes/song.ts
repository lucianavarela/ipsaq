import { SafeResourceUrl } from "@angular/platform-browser";

export class Song {
    public id?: number | null;
    public title: string | null;
    public beginning: string | null;
    public index: number | null;
    public artist: string | null;
    public link_original: string | SafeResourceUrl | null;
    public link_ipsaq: string | SafeResourceUrl | null;
    public link_chords: string | SafeResourceUrl | null;
    public lyrics: string | null;
    public created_at: Date | null;

    constructor(obj?: {id: number, titulo: string, beginning: string, index: number,
        artist: string, link_original: string, link_ipsaq: string, lyrics: string,
        link_chords: string, created_at: Date}) {
        this.id = obj?.id ?? null;
        this.title = obj?.titulo ?? null;
        this.beginning = obj?.beginning ?? null;
        this.index = obj?.index ?? null;
        this.artist = obj?.artist ?? null;
        this.link_original = obj?.link_original ?? null;
        this.link_ipsaq = obj?.link_ipsaq ?? null;
        this.link_chords = obj?.link_chords ?? null;
        this.lyrics = obj?.lyrics ?? null;
        this.created_at = obj?.created_at ?? null;
    }
}
