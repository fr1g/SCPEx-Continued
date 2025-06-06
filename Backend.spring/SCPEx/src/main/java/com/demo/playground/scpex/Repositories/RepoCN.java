package com.demo.playground.scpex.Repositories;

import com.demo.playground.scpex.Models.ContractNegotiation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RepoCN extends JpaRepository<ContractNegotiation, Long> {
    // repository of Contract Negotiation
    @Query("SELECT cn FROM ContractNegotiation cn WHERE cn.sender.id = :sellerId")
    Page<ContractNegotiation> findAllOfSeller(
            @Param("sellerId") long sellerId,
            Pageable pageable
    );

//    @Override
    @Query("select cn from ContractNegotiation cn where cn.id = :id")
    Optional<ContractNegotiation> findById(@Param("id") long id);

}
