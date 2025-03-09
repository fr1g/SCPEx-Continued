package com.demo.playground.scpex.Repositories;

import com.demo.playground.scpex.Models.Trader;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RepoTrader extends JpaRepository<Trader, Long> {


}
