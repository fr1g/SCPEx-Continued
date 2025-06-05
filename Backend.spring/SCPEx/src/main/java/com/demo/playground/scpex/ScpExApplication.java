package com.demo.playground.scpex;

import com.demo.playground.scpex.Models.*;
import com.demo.playground.scpex.Models.Enums.GeneralStatus;
import com.demo.playground.scpex.Models.Enums.Type;
import com.demo.playground.scpex.Models.Pojo.OperationRequest;
import com.demo.playground.scpex.Models.Pojo.ProductInfo;
import com.demo.playground.scpex.Shared.SharedStatic;
import com.demo.playground.scpex.utils.GsonDateHelper;
import com.demo.playground.scpex.utils.GsonGeneralStatusAdapter;
import com.demo.playground.scpex.utils.GsonOperationRequestHelper;
import com.demo.playground.scpex.utils.GsonTraderVirtualEmployeeHelper;
import com.google.gson.GsonBuilder;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.util.Date;


//@ComponentScan(basePackages = {"com.demo.playground.scpex.Controllers.Rest"})
@SpringBootApplication
public class ScpExApplication {

    public static void main(String[] args) {

        var builder = new GsonBuilder();
        builder
                .registerTypeAdapter(Date.class, new GsonDateHelper())
                .registerTypeAdapter(GeneralStatus.class, new GsonGeneralStatusAdapter<GeneralStatus>())
                .registerTypeAdapter(Type.class, new GsonGeneralStatusAdapter<Type>())
                .registerTypeAdapter(OperationRequest.class, new GsonOperationRequestHelper())
                .registerTypeAdapter(Trader.class, new GsonTraderVirtualEmployeeHelper())
        ;


//        builder.registerTypeAdapter( Employee.class, new GsonSpringPageTypeAdaptHelper<Employee>())
//                .registerTypeAdapter( Category.class, new GsonSpringPageTypeAdaptHelper<Category>())
//                .registerTypeAdapter( Product.class, new GsonSpringPageTypeAdaptHelper<Product>())
//                .registerTypeAdapter( Transaction.class, new GsonSpringPageTypeAdaptHelper<Transaction>())
//                .registerTypeAdapter( Trade.class, new GsonSpringPageTypeAdaptHelper<Trade>())
//                .registerTypeAdapter( Trader.class, new GsonSpringPageTypeAdaptHelper<Trader>());
        // oj zrja!

        SharedStatic.jsonHandler = builder.create();

        SpringApplication.run(ScpExApplication.class, args);
    }

}
