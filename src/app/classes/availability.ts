import { Profile } from "./profile";

export class Availability {
    public id?: number | null;
    public profile?: Profile;
    public sermon_date?: string;
    public is_available?: boolean;

    constructor(obj?: {id?: number, profile?: Profile, sermon_date?: string, is_available?: boolean}) {
        this.id = obj?.id;
        this.profile = obj?.profile;
        this.sermon_date = obj?.sermon_date;
        this.is_available = obj?.is_available;
    }

    static mapObjects(data: any[]) {
        return data.map(obj => {
            return new Availability({
                id: obj['id'],
                sermon_date: obj['sermon_date'],
                is_available: obj['is_available'],
                profile: obj['id_user'] ? new Profile(obj['id_user']) : undefined,
            });
        });
    }
}
