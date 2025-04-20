package com.demo.playground.scpex.Services;

import com.demo.playground.scpex.Models.Pojo.PageRequest;
import com.demo.playground.scpex.Models.Trader;
import com.demo.playground.scpex.Repositories.RepoEmployee;
import com.demo.playground.scpex.Repositories.RepoTrader;
import com.demo.playground.scpex.Shared.NullReferenceException;
import com.demo.playground.scpex.utils.GeneralSpecificationHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class TraderSvc implements IBaseService<Trader>{

    @Autowired
    RepoEmployee _e;

    @Autowired
    RepoTrader _t;

    @Override
    public boolean isThisExist(Long id) { return _t.existsById(id); }

    public boolean isRegistrarExist(Long id) { return _e.existsById(id); }

    @Override
    public Trader getObjectById(Long id) throws NullReferenceException {
        return _t.findById(id).orElseThrow(() -> new NullReferenceException("Trader not found"));
    }

    @Override
    public Page<Trader> getPageObjects(PageRequest pageRequest, int targetPage) {
        return _t.findAll(pageRequest.toPageable(targetPage));
    }


    @Override
    public Page<Trader> getSpecifiedPageObjects(PageRequest pageRequest, int targetPage) {
        String searchField;
        if (pageRequest.SearchField == null || pageRequest.SearchField.isEmpty())
            searchField = pageRequest.SortingField.toLowerCase();
        else
            searchField = pageRequest.SearchField.toLowerCase();

        // TODO actually can be distracted as single individual method?

        return _t.findAll(
                (new GeneralSpecificationHelper<Trader>())
                        .like(  searchField,
                                pageRequest.Keyword.toLowerCase()  ),
                pageRequest.toPageable(targetPage)
        );
    }

    @Override
    public void add(Trader object) {
        // todo optional add some logics to easily verify
        _t.save(object);
    }

    @Override
    public void update(Trader object) throws IOException {
        try {
            var original = getObjectById(object.getId());
            object.setPasswd(original.getPasswd());
            _t.save(object);
        }catch (Exception ex){
            throw new IOException("Exception happened during UPDATE on Trader. Nested: " + ex.getMessage());
        }
    }

    @Override
    public void delete(Long id) {
        var o = _t.findById(id).orElseThrow(() -> new NullReferenceException("Trader not found: No such record."));
        _t.delete(o);
    }

    @Override
    public void delete(Trader object) {
        delete(object.getId());
    }
}
