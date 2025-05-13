package com.demo.playground.scpex.Services;

import com.demo.playground.scpex.Models.Employee;
import com.demo.playground.scpex.Models.Pojo.PageRequest;
import com.demo.playground.scpex.Models.Trader;
import com.demo.playground.scpex.Repositories.RepoEmployee;
import com.demo.playground.scpex.Repositories.RepoTrader;
import com.demo.playground.scpex.Shared.NullReferenceException;
import com.demo.playground.scpex.utils.GeneralSpecificationHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class EmployeeSvc implements IBaseService<Employee>{

    @Autowired
    RepoEmployee _e;

    @Autowired
    RepoTrader _t;

    @Override
    public boolean isThisExist(Long id) {
        return _e.existsById(id);
    }

    @Override
    public Employee getObjectById(Long id) {
        return _e.findById(id).orElseThrow(() -> new NullReferenceException("Employee not found"));
    }

    @Override
    public Page<Employee> getPageObjects(PageRequest pageRequest, int targetPage) {
        return _e.findAll(pageRequest.toPageable(targetPage));
    }


    @Override
    public void add(Employee object) {
        _e.save(object);
    }

    @Override
    public void update(Employee object) {
        _e.save(object);
    }

    @Override
    public void delete(Long id) {
        _e.deleteById(id);
    }

    @Override
    public void delete(Employee object) {
        if(object.getId() == null || object.getId() == 0)
            throw new NullReferenceException("No such target to delete");
        _e.deleteById(object.getId());
    }
}
