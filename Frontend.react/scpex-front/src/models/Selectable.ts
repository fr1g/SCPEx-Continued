export default class Selectable{
    id: number;
    name: string;
    info?: string | null;

    constructor(id: number, name: string, info: string | null = null){
        this.id = id;
        this.name = name;
        this.info = info;
    }

}