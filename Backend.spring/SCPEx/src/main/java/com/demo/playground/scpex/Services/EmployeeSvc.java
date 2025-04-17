package com.demo.playground.scpex.Services;

import com.demo.playground.scpex.Models.Employee;
import com.demo.playground.scpex.Models.Pojo.PageRequest;
import com.demo.playground.scpex.Models.Trader;
import com.demo.playground.scpex.Repositories.RepoEmployee;
import com.demo.playground.scpex.Repositories.RepoTrader;
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
        return false;
    }

    @Override
    public Employee getObjectById(Long id) {
        return null;
    }

    @Override
    public Page<Employee> getPageObjects(PageRequest pageRequest, int targetPage) {
        return null;
    }

    @Override
    public Page<Trader> getSpecifiedPageObjects(PageRequest pageRequest, int targetPage) {
        return null;
    }

    @Override
    public void add(Employee object) {

    }

    @Override
    public void update(Employee object) {

    }

    @Override
    public void delete(Long id) {

    }

    @Override
    public void delete(Employee object) {

    }
}
