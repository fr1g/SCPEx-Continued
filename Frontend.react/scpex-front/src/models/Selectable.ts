export default class Selectable{
    id: number;
    name: string;
    info?: any;

    constructor(id: number, name: string, info: any = null){
        this.id = id;
        this.name = name;
        this.info = info;
    }

}