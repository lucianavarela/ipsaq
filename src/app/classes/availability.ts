import { Profile } from "./profile";

export class Availability {
    public id?: number | null;
    public profile?: Profile;
    public sermon_date?: string;
    public is_available?: boolean;
    public is_designated?: boolean;
    public is_directing?: boolean;

    constructor(obj?: {id?: number, profile?: Profile, sermon_date?: string, is_available?: boolean, is_designated?: boolean, is_directing?: boolean}) {
        this.id = obj?.id;
        this.profile = obj?.profile;
        this.sermon_date = obj?.sermon_date;
        this.is_available = obj?.is_available;
        this.is_designated = obj?.is_designated;
        this.is_directing = obj?.is_directing;
    }

    static mapObjects(data: any[]) {
        return data.map(obj => {
            return new Availability({
                id: obj['id'],
                sermon_date: obj['sermon_date'],
                is_available: obj['is_available'],
                is_designated: obj['is_designated'],
                is_directing: obj['is_directing'],
                profile: obj['id_user'] ? new Profile(obj['id_user']) : undefined,
            });
        });
    }
}
