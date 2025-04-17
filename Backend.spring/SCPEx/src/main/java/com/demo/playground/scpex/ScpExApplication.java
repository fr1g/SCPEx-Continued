package com.demo.playground.scpex;

import com.demo.playground.scpex.Models.*;
import com.demo.playground.scpex.Models.Pojo.OperationRequest;
import com.demo.playground.scpex.Models.Pojo.ProductInfo;
import com.demo.playground.scpex.Shared.SharedStatic;
import com.demo.playground.scpex.utils.GsonDateHelper;
import com.demo.playground.scpex.utils.GsonOperationRequestHelper;
import com.demo.playground.scpex.utils.GsonSpringPageTypeAdaptHelper;
import com.demo.playground.scpex.utils.GsonTraderVirtualEmployeeHelper;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.domain.Page;

import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.HashMap;

//@ComponentScan(basePackages = {"com.demo.playground.scpex.Controllers.Rest"})
@SpringBootApplication
public class ScpExApplication {

    public static void main(String[] args) {

        var builder = new GsonBuilder();
        builder
                .registerTypeAdapter(Date.class, new GsonDateHelper())
                .registerTypeAdapter(OperationRequest.class, new GsonOperationRequestHelper())
                .registerTypeAdapter(Trader.class, new GsonTraderVirtualEmployeeHelper())
        ;


//        builder.registerTypeAdapter( Employee.class, new GsonSpringPageTypeAdaptHelper<Employee>())
//                .registerTypeAdapter( Category.class, new GsonSpringPageTypeAdaptHelper<Category>())
//                .registerTypeAdapter( Product.class, new GsonSpringPageTypeAdaptHelper<Product>())
//                .registerTypeAdapter( Trade.class, new GsonSpringPageTypeAdaptHelper<Trade>())
//                .registerTypeAdapter( Transaction.class, new GsonSpringPageTypeAdaptHelper<Transaction>())
//                .registerTypeAdapter( Trader.class, new GsonSpringPageTypeAdaptHelper<Trader>());
        // oj zrja!

        SharedStatic.jsonHandler = builder.create();

        SpringApplication.run(ScpExApplication.class, args);
    }

}
