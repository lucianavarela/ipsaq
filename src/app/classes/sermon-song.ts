export class SermonSong {
    public id: number;
    public id_cancion: number;
    public id_culto: number;

    constructor(id: number, id_cancion: number, id_culto: number) {
        this.id = id;
        this.id_cancion = id_cancion;
        this.id_culto = id_culto;
    }
}
