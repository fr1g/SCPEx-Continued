

export default class PageRequest{
    SearchField: string = "name";
    SortingField: string = "id";
    SortingMethod: "asc" | "desc" = "asc";

    Keyword: string;

    constructor(keyword = "", searchField = "name", sortingField = "id", sortingMethod: "asc" | "desc" = "asc"){
        this.Keyword = keyword;
        this.SearchField = searchField;
        this.SortingField = sortingField;
        this.SortingMethod = sortingMethod;
    }

    PageSize = 10; // fvck.

    // REMINDER if something cannot return search result as expect, check the caps Id or id.
}