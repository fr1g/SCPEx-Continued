package com.demo.playground.scpex.Models.Pojo;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

public class PageRequest {
    public String SearchField;
    public String SortingField = "id";
    public String SortingMethod = "default";
    public String Keyword = "";
    public int PageSize = 10;
    // todo: possible request params:
    //      pathVar: page number
    //      reqBody: {
    //          pageSize?
    //          sorting?
    //          ofField? 'name' | 'description' | 'id' | string
    //          keyword?
    //      }  => all have default words

    public Pageable toPageable(int ofPage){
        return org.springframework.data.domain.PageRequest.of( ofPage,
                this.PageSize <= 0 ? 10 : this.PageSize,
                Sort.by(Sort.Direction.fromString(((this.SortingMethod.equals("default") || this.SortingMethod == null) ? "asc" : this.SortingMethod)),
                        ((this.SortingField.equals("default") || this.SortingField == null) ? "id" : this.SortingField))

        );
    }
}
