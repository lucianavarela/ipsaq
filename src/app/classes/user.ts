import { AuthUser } from "@supabase/supabase-js";

export class User {
    public id?: number;
    public user_id?: string;
    public email?: string;
    public is_super_admin?: boolean = false;
    public nickname?: string;
    public first_name?: string;
    public last_name?: string;
    public sermon_role?: boolean;
    public choir_role?: boolean;
    public band_role?: boolean;
    public direction_role?: boolean;
    public player_icon?: string = '';

    constructor(obj?: {
        id: string, email?: string, is_super_admin?: boolean, nickname?: string, first_name?: string, last_name?: string,
        sermon_role?: boolean, choir_role?: boolean, band_role?: boolean, direction_role?: boolean
    }) {
        if (typeof obj === 'number') {
            this.id = Number(obj);
        } else {
            if (typeof obj?.id === 'number') {
                this.id = Number(obj.id);
            } else {
                this.user_id = obj?.id;
            }
            this.email = obj?.email;
            this.is_super_admin = obj?.is_super_admin;
            this.nickname = obj?.nickname;
            this.first_name = obj?.first_name;
            this.last_name = obj?.last_name;
            this.sermon_role = obj?.sermon_role;
            this.choir_role = obj?.choir_role;
            this.band_role = obj?.band_role;
            this.direction_role = obj?.direction_role;
        }
        if (this.band_role) {
            switch (this.id) {
                case 6: //jhonny
                    this.player_icon = '<i class="fa-solid fa-drum player"></i>';
                    break;
                case 7: //jose
                case 12: //luba
                    this.player_icon = '<i class="material-symbols-outlined piano-icon player">piano</i>';
                    break;
                default:
                    this.player_icon = '<i class="fa-solid fa-guitar player"></i>';
                    break;
            }
        }
        if (this.choir_role) this.player_icon = '<i class="material-symbols-outlined choir-icon choir">adaptive_audio_mic</i>';
    }
}
