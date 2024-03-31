import { Song } from "./song";

export class SermonSong {
    public id?: number;
    public song?: Song;
    public id_sermon?: number;

    constructor(obj?: {id: number, song: Song, id_sermon: number}) {
        this.id = obj?.id;
        this.song = obj?.song;
        this.id_sermon = obj?.id_sermon;
    }

    static mapObjects(data: any[], id_sermon: number) {
        return data.map(obj => {
            return new SermonSong({
                id: obj['id'],
                id_sermon: id_sermon,
                song: new Song(obj['songs'])
            });
        });
    }
}
