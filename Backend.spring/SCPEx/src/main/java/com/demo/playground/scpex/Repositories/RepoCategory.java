package com.demo.playground.scpex.Repositories;

import com.demo.playground.scpex.Models.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RepoCategory extends JpaRepository<Category, Long> {
}
