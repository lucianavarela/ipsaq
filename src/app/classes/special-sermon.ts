// Clase para eventos especiales (special_sermons)
export class SpecialSermon {
  id?: number;
  sermon_date!: string; // formato YYYY-MM-DD

  constructor(obj?: any) {
    this.id = obj?.id;
    this.sermon_date = obj?.sermon_date;
  }
}
