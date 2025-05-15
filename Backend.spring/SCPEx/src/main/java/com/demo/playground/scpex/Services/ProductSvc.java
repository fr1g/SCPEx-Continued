package com.demo.playground.scpex.Services;

import com.demo.playground.scpex.Models.Pojo.PageRequest;
import com.demo.playground.scpex.Models.Pojo.ProductInfo;
import com.demo.playground.scpex.Models.Product;
import com.demo.playground.scpex.Models.Trader;
import com.demo.playground.scpex.Repositories.RepoProduct;
import com.demo.playground.scpex.Shared.NullReferenceException;
import com.demo.playground.scpex.utils.GeneralSpecificationHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class ProductSvc implements IBaseService<Product>{

    @Autowired
    RepoProduct _p;

    @Override
    public boolean isThisExist(Long id) { return _p.existsById(id); }

    @Override
    public Product getObjectById(Long id) {
        return _p.findById(id).orElseThrow(() -> new NullReferenceException("Not found"));
    }

    @Override
    public Page<Product> getPageObjects(PageRequest pageRequest, int targetPage) {
        return _p.findAll(pageRequest.toPageable(targetPage));
    }

    @Override
    public void add(Product object) {

    }

    @Override
    public void update(Product object) throws IOException {

    }

    @Override
    public void delete(Long id) {

    }

    @Override
    public void delete(Product object) {

    }
}
