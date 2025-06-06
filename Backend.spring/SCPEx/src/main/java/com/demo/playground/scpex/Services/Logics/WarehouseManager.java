package com.demo.playground.scpex.Services.Logics;

import com.demo.playground.scpex.Models.Category;
import com.demo.playground.scpex.Models.Employee;
import com.demo.playground.scpex.Models.Enums.GeneralStatus;
import com.demo.playground.scpex.Models.Product;
import com.demo.playground.scpex.Models.Trader;
import com.demo.playground.scpex.Repositories.RepoCategory;
import com.demo.playground.scpex.Repositories.RepoEmployee;
import com.demo.playground.scpex.Repositories.RepoProduct;
import com.demo.playground.scpex.Shared.NullReferenceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional
    public Product createProduct(Product product) {
//        product.setVersion(null); // 清除任何可能的版本值
        var _product = product;
        _product.setId(null);
        return _p.saveAndFlush(_product);
    }

    public Category addCategory(Category newCat, Employee operator) {
        var modified = newCat;
        modified.setStatus(GeneralStatus.APPROVED);
        modified.setNote(("Category created by " + operator.getName() + ", id: " + operator.getId() + " at time: " + (new Date()).getTime()));
        try{
            modified = _c.saveAndFlush(modified);
        }catch(Exception e){
            modified.setNote("");
            modified = _c.saveAndFlush(modified);
        }
        return modified;
    }

    public void disableCategory(Category cat, Employee operator) {
        var modified = _c.findById(cat.getId()).orElseThrow(() -> new NullReferenceException("no such existing cat"));

        if(cat.getId() == 1L) return;

        modified = appendNote(operator, modified);

        try {
            _c.saveAndFlush(modified);
        }catch (Exception e){
            modified.setNote("");
            modified = appendNote(operator, modified);
            _c.saveAndFlush(modified);
        }


    }

    protected Category appendNote(Employee operator, Category modified) {
        if(modified.getStatus().equals(GeneralStatus.REJECTED)) {
            modified.setNote(modified.getNote().split("@@@")[0] + "@@@ enabled: " + " by " + operator.getName() + ", id: " + operator.getId() + " at time: " + (new Date()).getTime());
            modified.setStatus(GeneralStatus.APPROVED);
        }else{
            modified.setNote(modified.getNote() + "@@@ disabled: " + " by " + operator.getName() + ", id: " + operator.getId() + " at time: " + (new Date()).getTime());
            modified.setStatus(GeneralStatus.REJECTED);
        }
        return modified;
    }

}
