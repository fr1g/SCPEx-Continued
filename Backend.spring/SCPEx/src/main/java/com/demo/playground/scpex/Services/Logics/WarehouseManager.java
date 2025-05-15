package com.demo.playground.scpex.Services.Logics;

import com.demo.playground.scpex.Models.Category;
import com.demo.playground.scpex.Models.Employee;
import com.demo.playground.scpex.Models.Product;
import com.demo.playground.scpex.Repositories.RepoCategory;
import com.demo.playground.scpex.Repositories.RepoEmployee;
import com.demo.playground.scpex.Repositories.RepoProduct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class WarehouseManager {
    /*
    todo:
        - CRUD categories
        - CRUD products
        - UPDATE trade/tran
     */
    @Autowired
    RepoCategory _c;

    @Autowired
    RepoEmployee _e;

    @Autowired
    RepoProduct _p;

    public Page<Product> getWarehouseProducts(Pageable pageable, String warehouseName) {
        var result = _p.findAllByWarehouse(warehouseName, pageable);
        return result;
    }

    public void addCategory(String categoryName, Employee operator) {
        _c.saveAndFlush(new Category(categoryName, ("Category created by " + operator.getName() + ", id: " + operator.getId() + " at time: " + (new Date()).getTime())));
    }


}
