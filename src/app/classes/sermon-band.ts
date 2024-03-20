import { User } from "./user";

export class SermonBand {
    public id?: number;
    public player?: User;
    public sermon_id?: number;
    public confirmed?: boolean;

    constructor(obj?: {id: number, player: User, sermon_id: number, confirmed: boolean}) {
        this.id = obj?.id;
        this.player = obj?.player;
        this.sermon_id = obj?.sermon_id;
        this.confirmed = obj?.confirmed ?? false;
    }

    static mapObjects(data: any[], sermon_id: number) {
        return data.map(obj => {
            return new SermonBand({
                id: obj['id'],
                sermon_id: sermon_id,
                player: new User(obj['users']),
                confirmed: obj['confirmed'],
            });
        });
    }
}
