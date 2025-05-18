import { Profile } from "./profile";

export class SermonBand {
    public id?: number | null;
    public player?: Profile;
    public id_sermon?: number;

    constructor(obj?: {id?: number, player?: Profile, id_sermon?: number}) {
        this.id = obj?.id;
        this.player = obj?.player;
        this.id_sermon = obj?.id_sermon;
    }

    static mapObjects(data: any[], id_sermon: number) {
        return data.map(obj => {
            const user = 'id_player' in obj ? new Profile({'id': obj['id_player']}) : new Profile(obj['users']);
            return new SermonBand({
                id: obj['id'],
                id_sermon: id_sermon,
                player: user,
            });
        });
    }
}
