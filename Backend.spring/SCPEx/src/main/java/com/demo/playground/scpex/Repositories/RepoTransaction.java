package com.demo.playground.scpex.Repositories;

import com.demo.playground.scpex.Models.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RepoTransaction extends JpaRepository<Transaction, Long> {

    @Query("select t from Transaction t where t.trade.id = :target")
    Page<Transaction> findAllOfGivenTrade(Pageable pageable, @Param("target") Long tradeId);

}
