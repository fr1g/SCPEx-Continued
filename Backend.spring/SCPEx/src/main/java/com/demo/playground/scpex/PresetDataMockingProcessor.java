package com.demo.playground.scpex;

import com.demo.playground.scpex.Models.Category;
import com.demo.playground.scpex.Models.Employee;
import com.demo.playground.scpex.Models.Enums.GeneralStatus;
import com.demo.playground.scpex.Models.Enums.Type;
import com.demo.playground.scpex.Models.Pojo.ProductInfo;
import com.demo.playground.scpex.Models.Product;
import com.demo.playground.scpex.Models.Trader;
import com.demo.playground.scpex.Repositories.*;
import com.demo.playground.scpex.Services.ProductSvc;
import com.demo.playground.scpex.Shared.SharedStatic;
import com.demo.playground.scpex.utils.MD5Helper;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Date;

@Configuration
public class PresetDataMockingProcessor {

    static String encrypter(String raw){
        return "" + MD5Helper.encrypt(raw);
    }

    String inConfigDefaultPasswd = "000000";
    
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
                employee.save(Employee.builder().birth((new Date())).type(Type.ADMIN).contact("_root").name("Root Super User").status(GeneralStatus.APPROVED).JobTitle("general").passwd(encrypter(inConfigDefaultPasswd)).note("preset default super user").build());

            Category cat;
            if(!category.existsById(1L)){
                cat = new Category("Unsorted Category", "The default category by system");
                cat.setStatus(GeneralStatus.APPROVED);
                cat = category.saveAndFlush(cat);
            }
            else
                cat = category.findById(1L).get();

            if(!SharedStatic.usingMockData) return;
            else{

                employee.save(Employee.builder().birth((new Date())).type(Type.WAREHOUSE).contact("1919810").name("Example Banned Schumal").status(GeneralStatus.CANCELED).JobTitle("general").passwd(encrypter("123456")).note("no note").build());
                employee.save(Employee.builder().birth((new Date())).type(Type.REGISTRAR).contact("233435").name("Example Refuse Banned Schumal").status(GeneralStatus.REJECTED).JobTitle("general").passwd(encrypter("123456")).note("no note").build());

                Employee relatedChulmann = employee.findById(1L).orElse(null), relatedJaager = employee.findById(1L).orElse(null);

//                Category c = new Category(1, );
                trader.save(Trader.builder().name("Yahya al-Saif").birth((new Date())).contact("31314-73788497").passwd(encrypter("111111")).status(GeneralStatus.APPROVED).preferJson("{\"prefers\": []}").type(Type.SELLER).registrar(relatedJaager).build());
                trader.save(Trader.builder().name("Yenefa Ibrahin").birth((new Date())).contact("312223-73788497").passwd(encrypter("111111")).status(GeneralStatus.APPROVED).preferJson("{\"prefers\": []}").type(Type.CUSTOMER).registrar(relatedJaager).build());
                trader.save(Trader.builder().name("Bin Nsibi").birth((new Date())).contact("31313-73788466").passwd(encrypter("111111")).status(GeneralStatus.APPROVED).preferJson("{\"prefers\": []}").type(Type.CUSTOMER).registrar(relatedChulmann).build());
                trader.save(Trader.builder().name("Said al-abdulah").birth((new Date())).contact("31313@7884.com").passwd(encrypter("111111")).status(GeneralStatus.APPROVED).preferJson("{\"prefers\": []}").type(Type.SELLER).registrar(relatedChulmann).build());

                Product p = new Product();
                p.setAmount(1);
                p.setSinglePrice(100);
                p.setStatus(GeneralStatus.APPROVED);
                p.setDiscount(1);
                p.setCategory(cat);
                p.setName("Testing product");
                product.save(p);

                Product p1 = new Product();
                p1.setAmount(1);
                p1.setSinglePrice(12);
                p1.setStatus(GeneralStatus.APPROVED);
                p1.setDiscount(1);
                p1.setCategory(cat);
                p1.setName("Dozen of product");
                product.save(p1);

                Product p2 = new Product();
                p2.setAmount(100);
                p2.setSinglePrice(1999);
                p2.setStatus(GeneralStatus.APPROVED);
                p2.setDiscount(0.9f);
                p2.setCategory(cat);
                p2.setName("Hyawr!");
                product.save(p2);

//                product.save((Product) (ProductInfo.build().));
//                var rh = (new ReduxHelper<Trader>(trader, Trader.class));
//                System.out.println(rh);

//                System.out.println(PropertyComparator.compare(new String("old"), new String("old")));
            }
        };
    }
}
