export class Sermon {
    public id: number;
    public direccion: string;
    public predica: string;
    public titulo: string;
    public fecha: Date;
    public link_youtube: string;
    public lectura: string;

    constructor(id: number, direccion: string, predica: string, titulo: string,
        fecha: Date, link_youtube: string, lectura: string) {
        this.id = id;
        this.direccion = direccion;
        this.predica = predica;
        this.titulo = titulo;
        this.fecha = fecha;
        this.link_youtube = link_youtube;
        this.lectura = lectura;
    }
}
