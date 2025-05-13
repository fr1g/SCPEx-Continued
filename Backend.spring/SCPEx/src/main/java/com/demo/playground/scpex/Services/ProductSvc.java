package com.demo.playground.scpex.Services;

import com.demo.playground.scpex.Models.Pojo.PageRequest;
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
public class ProductSvc implements IBaseService{

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
    public Page<Product> getSpecifiedPageObjects(PageRequest pageRequest, int targetPage) {
        String searchField;
        if (pageRequest.SearchField == null || pageRequest.SearchField.isEmpty())
            searchField = pageRequest.SortingField.toLowerCase();
        else
            searchField = pageRequest.SearchField.toLowerCase();

        // TODO actually can be distracted as single individual method?

        return _p.findAll(
                (new GeneralSpecificationHelper<Trader>())
                        .like(  searchField,
                                pageRequest.Keyword.toLowerCase()  ),
                pageRequest.toPageable(targetPage)
        );
    }

    @Override
    public void add(Object object) {

    }

    @Override
    public void update(Object object) throws IOException {

    }

    @Override
    public void delete(Long id) {

    }

    @Override
    public void delete(Object object) {

    }
}
