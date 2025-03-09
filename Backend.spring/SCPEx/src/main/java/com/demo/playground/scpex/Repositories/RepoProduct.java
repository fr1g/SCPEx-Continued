package com.demo.playground.scpex.Repositories;

import com.demo.playground.scpex.Models.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RepoProduct extends JpaRepository<Product, Long> {
}
