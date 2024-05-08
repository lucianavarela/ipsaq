export class Comment {
    public id: number | null;
    public created_at: Date | null;
    public author: string;
    public message: string;

    constructor(obj?: {id: number, created_at: Date, author: string, message: string}) {
        this.id = obj?.id ?? null;
        this.created_at = obj?.created_at ?? null;
        this.author = obj?.author ?? '';
        this.message = obj?.message ?? '';
    }
}