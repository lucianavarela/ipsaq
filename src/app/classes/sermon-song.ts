export class SermonSong {
    public id?: number | null;
    public id_cancion: number | null;
    public id_culto: number | null;

    constructor(obj?: {id: number, id_cancion: number, id_culto: number}) {
        this.id = obj?.id ?? null;
        this.id_cancion = obj?.id_cancion ?? null;
        this.id_culto = obj?.id_culto ?? null;
    }
}
