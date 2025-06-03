

export default class PageRequest{
    SearchField: string = "name";
    SortingField: string = "id";
    SortingMethod: "asc" | "desc" = "asc";

    KeyWord: string;

    constructor(keyword = "", searchField = "name", sortingField = "id", sortingMethod: "asc" | "desc" = "asc"){
        this.KeyWord = keyword;
        this.SearchField = searchField;
        this.SortingField = sortingField;
        this.SortingMethod = sortingMethod;
    }

    PageSize = 10; // fvck.

    // REMINDER if something cannot return search result as expect, check the caps Id or id.
}