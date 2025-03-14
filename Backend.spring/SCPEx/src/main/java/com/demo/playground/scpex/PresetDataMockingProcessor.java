package com.demo.playground.scpex;

import com.demo.playground.scpex.Models.Employee;
import com.demo.playground.scpex.Models.Enums.GeneralStatus;
import com.demo.playground.scpex.Models.Enums.Type;
import com.demo.playground.scpex.Repositories.*;
import com.demo.playground.scpex.Shared.SharedStatic;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Date;

@Configuration
public class PresetDataMockingProcessor {

    @Bean
    public CommandLineRunner initData(  RepoCategory category,
                                        RepoEmployee employee,
                                        RepoProduct product,
                                        RepoTrade trade,
                                        RepoTrader trader,
                                        RepoTransaction transaction
    ) {
        return args -> {
            if(!SharedStatic.usingMockData) return;
            else{
                employee.save(Employee.builder().birth((new Date())).type(Type.WAREHOUSE).contact("114514").name("Aziz von Schumal").status(GeneralStatus.APPROVED).JobTitle("general").passwd("").note("no note").build());
                employee.save(Employee.builder().birth((new Date())).type(Type.WAREHOUSE).contact("1919810").name("Volschtagen von Schumal").status(GeneralStatus.APPROVED).JobTitle("general").passwd("").note("no note").build());
                employee.save(Employee.builder().birth((new Date())).type(Type.WAREHOUSE).contact("233435").name("Herman von Schumal").status(GeneralStatus.APPROVED).JobTitle("general").passwd("").note("no note").build());
                employee.save(Employee.builder().birth((new Date())).type(Type.WAREHOUSE).contact("asdw114").name("Adolph von Schumal").status(GeneralStatus.APPROVED).JobTitle("general").passwd("").note("no note").build());
                employee.save(Employee.builder().birth((new Date())).type(Type.WAREHOUSE).contact("663634").name("Jaager von Schumal").status(GeneralStatus.APPROVED).JobTitle("general").passwd("").note("no note").build());
                employee.save(Employee.builder().birth((new Date())).type(Type.WAREHOUSE).contact("12244").name("Wilber von Schumal").status(GeneralStatus.APPROVED).JobTitle("general").passwd("").note("no note").build());
                employee.save(Employee.builder().birth((new Date())).type(Type.WAREHOUSE).contact("1667714").name("Canser von Schumal").status(GeneralStatus.APPROVED).JobTitle("general").passwd("").note("no note").build());
                employee.save(Employee.builder().birth((new Date())).type(Type.WAREHOUSE).contact("1778931").name("Donald von Schumal").status(GeneralStatus.APPROVED).JobTitle("general").passwd("").note("no note").build());
                employee.save(Employee.builder().birth((new Date())).type(Type.WAREHOUSE).contact("325332671").name("Chulmann von Schumal").status(GeneralStatus.APPROVED).JobTitle("general").passwd("").note("no note").build());
                employee.save(Employee.builder().birth((new Date())).type(Type.WAREHOUSE).contact("7355608").name("Helsinki von Schumal").status(GeneralStatus.APPROVED).JobTitle("general").passwd("").note("no note").build());
                employee.save(Employee.builder().birth((new Date())).type(Type.WAREHOUSE).contact("33068080").name("Davon von Schumal").status(GeneralStatus.APPROVED).JobTitle("general").passwd("").note("no note").build());
            }
        };
    }
}
