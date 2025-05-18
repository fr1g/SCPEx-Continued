package com.demo.playground.scpex.Repositories;

import com.demo.playground.scpex.Models.ContractNegotiation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RepoCN extends JpaRepository<ContractNegotiation, Long> {
    // repository of Contract Negotiation


}
