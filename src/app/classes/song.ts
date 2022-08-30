export class Song {
    public id: number;
    public titulo: string;
    public comienzo: string;
    public indice: number;
    public artista: string;
    public link_original: string;
    public link_ipsaq: string;
    public letra: string;
    public link_acordes: string;

    constructor(id: number, titulo: string, comienzo: string, indice: number,
        artista: string, link_original: string, link_ipsaq: string, letra: string,
        link_acordes: string) {
        this.id = id;
        this.titulo = titulo;
        this.comienzo = comienzo;
        this.indice = indice;
        this.artista = artista;
        this.link_original = link_original;
        this.link_ipsaq = link_ipsaq;
        this.letra = letra;
        this.link_acordes = link_acordes;
    }
}
