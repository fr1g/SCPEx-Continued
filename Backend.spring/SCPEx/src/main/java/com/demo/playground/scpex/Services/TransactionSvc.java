package com.demo.playground.scpex.Services;

import com.demo.playground.scpex.Models.Pojo.PageRequest;
import com.demo.playground.scpex.Models.Transaction;
import com.demo.playground.scpex.Repositories.RepoTransaction;
import com.demo.playground.scpex.Shared.NullReferenceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class TransactionSvc implements IBaseService<Transaction> {
    @Autowired
    RepoTransaction _t;


    @Override
    public boolean isThisExist(Long id) {
        return _t.existsById(id);
    }

    @Override
    public Transaction getObjectById(Long id) {
        return _t.findById(id).orElseThrow(() -> new NullReferenceException("Trade not found"));
    }

    @Override
    public Page<Transaction> getPageObjects(PageRequest pageRequest, int targetPage) {
        return null;
    }

    @Override
    public void add(Transaction object) {
        _t.saveAndFlush(object);
    }

    @Override
    public void update(Transaction object) throws IOException {
        _t.save(object);
    }

    @Override
    public void delete(Long id) {
        _t.deleteById(id);
    }

    @Override
    public void delete(Transaction object) {
        if(!_t.existsById(object.getId())) throw new NullReferenceException("Trade not found");
        _t.deleteById(object.getId());
    }
}
