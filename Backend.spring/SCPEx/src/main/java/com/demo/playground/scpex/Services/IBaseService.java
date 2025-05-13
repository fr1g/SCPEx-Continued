package com.demo.playground.scpex.Services;

import com.demo.playground.scpex.Models.Pojo.PageRequest;
import com.demo.playground.scpex.Models.Trader;
import com.demo.playground.scpex.utils.GeneralSpecificationHelper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.io.IOException;

public interface IBaseService<T> {
    boolean isThisExist(Long id);
    T getObjectById(Long id);
    Page<T> getPageObjects(PageRequest pageRequest, int targetPage);
//    public Page<Trader> getSpecifiedPageObjects(PageRequest pageRequest, int targetPage);
    
    void add(T object);
    void update(T object) throws IOException;
    void delete(Long id);
    void delete(T object);
}
