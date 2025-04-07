package com.demo.playground.scpex.Models.Pojo;

public class PageRequest {
    public String PageOf;
    public String Field = "id";
    public String SortBy = "default";
    public String Keyword = "";
    public int PageSize = 0;
    // todo: possible request params:
    //      pathVar: page number
    //      reqBody: {
    //          pageSize?
    //          sorting?
    //          ofField? 'name' | 'description' | 'id' | string
    //          keyword?
    //      }  => all have default words
}
