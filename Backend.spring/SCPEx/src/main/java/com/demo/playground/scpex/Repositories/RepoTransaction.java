package com.demo.playground.scpex.Repositories;

import com.demo.playground.scpex.Models.Trade;
import org.springframework.data.jpa.repository.JpaRepository;


public interface RepoTransaction extends JpaRepository<Trade, Long> {
}
