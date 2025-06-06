package com.demo.playground.scpex.Config;

import com.demo.playground.scpex.Models.Employee;
import com.demo.playground.scpex.Models.Enums.GeneralStatus;
import com.demo.playground.scpex.Models.Enums.Type;
import com.demo.playground.scpex.Models.Trader;
import com.demo.playground.scpex.Repositories.*;
import com.demo.playground.scpex.Shared.SharedStatic;
import com.demo.playground.scpex.utils.MD5Helper;
import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;

//@Configuration
@Deprecated
public class NecessaryDataProcessor {
// [im so desperate on this]
//    @Autowired
    EntityManager entityManager;

//        @Bean
//        @Transactional
        public CommandLineRunner initData( ) {
            return args -> {

                 var su = Employee.builder()
                                .birth((new Date()))
                                .type(Type.ADMIN)
                                .contact("o")
                                .name("internal superuser")
                                .status(GeneralStatus.APPROVED)
                                .jobTitle("SU")
                                .passwd("{gabxd}0")
                                .note("no note")
                                .id(0L)
                                .build();

                var st = Trader .builder()
                                .name("internal fake trader")
                                .birth((new Date())).contact("internal")
                                .passwd("{gabxd}0")
                                .status(GeneralStatus.APPROVED)
                                .preferJson("internal")
                                .type(Type.SELLER)
                                .id(0L)
                                .registrar(su).build();

                entityManager.persist(su);
                entityManager.persist(st);

            };

        }


}
