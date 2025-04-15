package com.demo.playground.scpex.Models.Pojo;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

public class PageRequest {
    public String PageOf;
    public String Field = "id";
    public String Sorting = "default";
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


    // todo STRATEGY:
    //  if the page num is bigger than total page, then use the first page? or return "null"?
    public Pageable toPageable(int ofPage){
        return org.springframework.data.domain.PageRequest.of( ofPage,
                this.PageSize <= 0 ? 10 : this.PageSize,
                Sort.by(Sort.Direction.fromString(((this.Sorting.equals("default") || this.Sorting == null) ? "asc" : this.Sorting)),
                        ((this.Field.equals("default") || this.Field == null) ? "id" : this.Field))

        );
    }
}
