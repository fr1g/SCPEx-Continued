package com.demo.playground.scpex.Repositories;

import com.demo.playground.scpex.Models.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RepoTrade extends JpaRepository<Transaction, Long> {
}
