package com.demo.playground.scpex.Repositories;

import com.demo.playground.scpex.Models.Employee;
import com.demo.playground.scpex.Models.Pojo.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Deprecated
//@Repository
public interface RepoUsers<T> /*extends JpaRepository<T, Long>*/ { // problem: T has been wiped after compile.

    Page<T> findByNameContaining(String name, Pageable page);


}
