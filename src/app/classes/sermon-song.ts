import { Sermon } from "./sermon";
import { Song } from "./song";

export class SermonSong {
    public id?: number;
    public song?: Song;
    public sermon_id?: number;

    constructor(obj?: {id: number, song: Song, sermon_id: number}) {
        this.id = obj?.id;
        this.song = obj?.song;
        this.sermon_id = obj?.sermon_id;
    }

    static mapObjects(data: any[], sermon_id: number) {
        return data.map(obj => {
            return new SermonSong({
                id: obj['id'],
                sermon_id: sermon_id,
                song: new Song(obj['songs'])
            });
        });
    }
}
