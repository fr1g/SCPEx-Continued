
export default class RecommendedItem{
    title: string;
    details: string;
    sold: string;
    instock: string;
    category: string;
    cover: string;

    url: string;
    isForeignUrl: boolean;

    price: string;

    constructor(title: string, cover: string, url: string, price: string, sold: string, category: string, instock: string = "alot", details: string = "None", isForeignUrl: boolean = false){
        this.category = category;
        this.price = price;
        this.instock = instock;
        this.sold = sold;
        this.details = details;
        this.title = title;
        this.cover = cover;
        this.url = url;
        this.isForeignUrl = isForeignUrl;
    }

}