package com.demo.playground.scpex.Repositories;

import com.demo.playground.scpex.Models.Trade;
import com.demo.playground.scpex.Models.Trader;
import com.demo.playground.scpex.Models.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RepoTrade extends JpaRepository<Trade, Long> {
    @Query("select t from Trade t where t.trader = :target")
    Page<Trade> findAllOfTrader(Pageable pageable, @Param("target") Long traderId);

}
