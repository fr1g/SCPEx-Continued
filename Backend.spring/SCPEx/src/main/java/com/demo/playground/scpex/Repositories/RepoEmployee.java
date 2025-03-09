package com.demo.playground.scpex.Repositories;

import com.demo.playground.scpex.Models.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepoEmployee extends JpaRepository<Employee, Long> {

    @Query(value = "select * from Employee where id = :id", nativeQuery = true)
    Employee get(@Param("id") long id);

    @Query(value = "select * from Employee limit :limit offset :offset", nativeQuery = true)
    List<Employee> get(@Param("limit") int limit, @Param("offset") int offset);

    @Query(value = "select * from Employee :limit", nativeQuery = true)
    List<Employee> get(@Param("limit") String limit);

    @Query(value = "select e from Employee e where lower(e.name) like LOWER(CONCAT('%', :name, '%'))")
    List<Employee> ofName(@Param("name") String name);

    @Query(value = "select e from Employee e where lower(e.name) like LOWER(CONCAT('%', :name, '%')) and 1=1")
    Page<Employee> ofName(Pageable pageable, @Param("name") String name);

//    Page<Employee> enhancedGet(Pageable pageable);
//
//    Page<Employee> enhancedFindByName(Pageable pageable, String name);
}
