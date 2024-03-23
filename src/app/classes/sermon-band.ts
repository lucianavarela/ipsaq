import { User } from "./user";

export class SermonBand {
    public id?: number;
    public player?: User;
    public sermon_id?: number;

    constructor(obj?: {id: number, player: User, sermon_id: number}) {
        this.id = obj?.id;
        this.player = obj?.player;
        this.sermon_id = obj?.sermon_id;
    }

    static mapObjects(data: any[], sermon_id: number) {
        return data.map(obj => {
            const user = 'player_id' in obj ? new User({'id': obj['player_id']}) : new User(obj['users']);
            return new SermonBand({
                id: obj['id'],
                sermon_id: sermon_id,
                player: user,
            });
        });
    }
}
