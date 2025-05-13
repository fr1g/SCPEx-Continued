package com.demo.playground.scpex.Repositories;

import com.demo.playground.scpex.Models.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RepoProduct extends JpaRepository<Product, Long> {
    @Query("SELECT e FROM Product e WHERE e.warehouse = :warehouse")
    Page<Product> findAllByWarehouse(
            @Param("warehouse") String warehouse,
            Pageable pageable
    );

}
