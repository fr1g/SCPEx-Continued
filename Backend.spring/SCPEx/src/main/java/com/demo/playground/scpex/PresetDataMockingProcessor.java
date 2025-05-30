package com.demo.playground.scpex;

import com.demo.playground.scpex.Models.Employee;
import com.demo.playground.scpex.Models.Enums.GeneralStatus;
import com.demo.playground.scpex.Models.Enums.Type;
import com.demo.playground.scpex.Models.Trader;
import com.demo.playground.scpex.Repositories.*;
import com.demo.playground.scpex.Shared.SharedStatic;
import com.demo.playground.scpex.utils.MD5Helper;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Date;

@Configuration
public class PresetDataMockingProcessor {

    static String encrypter(String raw){
        return "{gabxd}" + MD5Helper.encrypt(raw);
    }
    
    @Bean
    public CommandLineRunner testMocking(  RepoCategory category,
                                        RepoEmployee employee,
                                        RepoProduct product,
                                        RepoTrade trade,
                                        RepoTrader trader,
                                        RepoTransaction transaction
    ) {
        return args -> {
            if(!employee.existsById(1L))
                employee.save(Employee.builder().birth((new Date())).type(Type.ADMIN).contact("_root").name("_root").status(GeneralStatus.APPROVED).JobTitle("general").passwd(encrypter("laterihopeitcanbechangedviaconfig")).note("preset default super user").build());

            if(!SharedStatic.usingMockData) return;
            else{

                employee.save(Employee.builder().birth((new Date())).type(Type.WAREHOUSE).contact("1919810").name("Volschtagen von Schumal").status(GeneralStatus.APPROVED).JobTitle("general").passwd(encrypter("123456")).note("no note").build());
                employee.save(Employee.builder().birth((new Date())).type(Type.REGISTRAR).contact("233435").name("Herman von Schumal").status(GeneralStatus.APPROVED).JobTitle("general").passwd(encrypter("123456")).note("no note").build());
                employee.save(Employee.builder().birth((new Date())).type(Type.DEFAULT).contact("asdw114").name("Adolph von Schumal").status(GeneralStatus.APPROVED).JobTitle("general").passwd(encrypter("123456")).note("no note").build());
                employee.save(Employee.builder().birth((new Date())).type(Type.WAREHOUSE).contact("663634").name("Jaager von Schumal").status(GeneralStatus.APPROVED).JobTitle("general").passwd(encrypter("123456")).note("no note").build());
                employee.save(Employee.builder().birth((new Date())).type(Type.WAREHOUSE).contact("12244").name("Wilber von Schumal").status(GeneralStatus.APPROVED).JobTitle("general").passwd(encrypter("123456")).note("no note").build());
                employee.save(Employee.builder().birth((new Date())).type(Type.WAREHOUSE).contact("1667714").name("Canser von Schumal").status(GeneralStatus.APPROVED).JobTitle("general").passwd(encrypter("123456")).note("no note").build());
                employee.save(Employee.builder().birth((new Date())).type(Type.WAREHOUSE).contact("1778931").name("Donald von Schumal").status(GeneralStatus.APPROVED).JobTitle("general").passwd(encrypter("123456")).note("no note").build());
                employee.save(Employee.builder().birth((new Date())).type(Type.WAREHOUSE).contact("325332671").name("Chulmann von Schumal").status(GeneralStatus.APPROVED).JobTitle("general").passwd(encrypter("123456")).note("no note").build());
                employee.save(Employee.builder().birth((new Date())).type(Type.WAREHOUSE).contact("7355608").name("Helsinki von Schumal").status(GeneralStatus.APPROVED).JobTitle("general").passwd(encrypter("123456")).note("no note").build());
                employee.save(Employee.builder().birth((new Date())).type(Type.WAREHOUSE).contact("33068080").name("Davon von Schumal").status(GeneralStatus.APPROVED).JobTitle("general").passwd(encrypter("123456")).note("no note").build());

                Employee relatedChulmann = employee.findById(3L).orElse(null), relatedJaager = employee.findById(1l).orElse(null), relatedAziz = employee.findById(5l).orElse(null);

//                Category c = new Category(1, );
                trader.save(Trader.builder().name("Aziz al-abdulah").birth((new Date())).contact("31313-73788497").passwd(encrypter("123456777")).status(GeneralStatus.APPROVED).preferJson("{\"prefers\": []}").type(Type.SELLER).registrar(relatedAziz).build());
                trader.save(Trader.builder().name("Yahya al-Saif").birth((new Date())).contact("31314-73788497").passwd(encrypter("")).status(GeneralStatus.APPROVED).preferJson("{\"prefers\": []}").type(Type.SELLER).registrar(relatedJaager).build());
                trader.save(Trader.builder().name("Yenefa Ibrahin").birth((new Date())).contact("312223-73788497").passwd(encrypter("")).status(GeneralStatus.APPROVED).preferJson("{\"prefers\": []}").type(Type.SELLER).registrar(relatedJaager).build());
                trader.save(Trader.builder().name("Altair Ibn").birth((new Date())).contact("31313-737425397").passwd(encrypter("")).status(GeneralStatus.APPROVED).preferJson("{\"prefers\": []}").type(Type.SELLER).registrar(relatedAziz).build());
                trader.save(Trader.builder().name("Bin Nsibi").birth((new Date())).contact("31313-73788466").passwd(encrypter("")).status(GeneralStatus.APPROVED).preferJson("{\"prefers\": []}").type(Type.SELLER).registrar(relatedChulmann).build());
                trader.save(Trader.builder().name("Salam al-marin").birth((new Date())).contact("31313-73797").passwd(encrypter("")).status(GeneralStatus.APPROVED).preferJson("{\"prefers\": []}").type(Type.SELLER).registrar(relatedAziz).build());
                trader.save(Trader.builder().name("Said al-abdulah").birth((new Date())).contact("31313@7884.com").passwd(encrypter("")).status(GeneralStatus.APPROVED).preferJson("{\"prefers\": []}").type(Type.SELLER).registrar(relatedChulmann).build());


//                var rh = (new ReduxHelper<Trader>(trader, Trader.class));
//                System.out.println(rh);

//                System.out.println(PropertyComparator.compare(new String("old"), new String("old")));
            }
        };
    }
}
