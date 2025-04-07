package com.demo.playground.scpex.Repositories;

import com.demo.playground.scpex.Models.Employee;
import com.demo.playground.scpex.Models.Trader;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
//public interface RepoTrader extends RepoUsers<Trader>
public interface RepoTrader extends JpaRepository<Trader, Long>
{
    Page<Trader> findByNameContaining(String name, Pageable page);

}
