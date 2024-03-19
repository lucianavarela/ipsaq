import { AuthUser } from "@supabase/supabase-js";

export class User {
    public id?: number;
    public email?: string;
    public nickname?: string;
    public first_name?: string;
    public last_name?: string;
    public sermon_role?: boolean;
    public choir_role?: boolean;
    public band_role?: boolean;
    public direction_role?: boolean;

    constructor(obj?: {id: number, email: string, nickname: string, first_name: string, last_name: string,
        sermon_role: boolean, choir_role: boolean, band_role: boolean, direction_role: boolean}, auth_user?: AuthUser) {
        this.id = obj?.id;
        this.email = auth_user?.email;
        this.nickname = obj?.nickname;
        this.first_name = obj?.first_name;
        this.last_name = obj?.last_name;
        this.sermon_role = obj?.sermon_role;
        this.choir_role = obj?.choir_role;
        this.band_role = obj?.band_role;
        this.direction_role = obj?.direction_role;
    }
}
