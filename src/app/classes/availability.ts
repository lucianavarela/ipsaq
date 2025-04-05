import { User } from "./user";

export class Availability {
    public id?: number | null;
    public user?: User;
    public sermon_date?: string;
    public is_available?: boolean;

    constructor(obj?: {id?: number, user?: User, sermon_date?: string, is_available?: boolean}) {
        this.id = obj?.id;
        this.user = obj?.user;
        this.sermon_date = obj?.sermon_date;
        this.is_available = obj?.is_available;
    }

    static mapObjects(data: any[]) {
        return data.map(obj => {
            return new Availability({
                id: obj['id'],
                sermon_date: obj['sermon_date'],
                is_available: obj['is_available'],
                user: new User({'id': obj['user']}),
            });
        });
    }
}
