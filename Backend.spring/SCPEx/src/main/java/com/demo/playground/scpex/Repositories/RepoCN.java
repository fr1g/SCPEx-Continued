package com.demo.playground.scpex.Repositories;

import com.demo.playground.scpex.Models.ContractNegotiation;
import com.demo.playground.scpex.Models.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface RepoCN extends JpaRepository<ContractNegotiation, Long> {
    // repository of Contract Negotiation
    @Query("SELECT cn FROM ContractNegotiation cn WHERE cn.sender = :sellerId")
    Page<Product> findAllOfSeller(
            @Param("sellerId") long sellerId,
            Pageable pageable
    );

}
