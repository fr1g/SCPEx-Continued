package com.demo.playground.scpex.utils;

import jakarta.persistence.criteria.Path;
import org.springframework.data.jpa.domain.Specification;

public class GeneralSpecificationHelper <T>{
    /**
     * @param searchField  the field that looking for
     * @param searchValue  required expected value
     */
    public Specification<T> like(String searchField, String searchValue) {
        return (root, query, criteriaBuilder) -> {
            Path<String> fieldPath = root.get(searchField);
            return criteriaBuilder.like(criteriaBuilder.lower(fieldPath), "%" + searchValue.toLowerCase() + "%");
        };
    }
}
