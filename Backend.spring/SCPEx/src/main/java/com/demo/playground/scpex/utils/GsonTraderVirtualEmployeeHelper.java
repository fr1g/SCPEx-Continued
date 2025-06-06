package com.demo.playground.scpex.utils;

import com.demo.playground.scpex.Models.Employee;
import com.demo.playground.scpex.Models.Enums.GeneralStatus;
import com.demo.playground.scpex.Models.Pojo.OperationRequest;
import com.demo.playground.scpex.Models.Trader;
import com.google.gson.*;

import java.lang.reflect.Type;
import java.util.Date;

public class GsonTraderVirtualEmployeeHelper implements JsonDeserializer<Trader>{
    @Override
    public Trader deserialize(JsonElement jsonElement, Type type, JsonDeserializationContext jsonDeserializationContext) throws JsonParseException {
        var jo = jsonElement.getAsJsonObject();
        return Trader.builder()
                .name(jo.get("name").getAsString())
                .id(jo.get("id").getAsLong())
                .registrar(new Employee(jo.get("registrar").getAsLong()))

                .birth((jo.get("birth") == null) ? null : new Date(jo.get("birth").getAsLong()))
                .createdDate((jo.get("createdDate") == null) ? null : new Date(jo.get("createdDate").getAsLong()))

                .contact(jo.get("contact").getAsString())
                .passwd(jo.get("passwd").getAsString())
                .preferJson(jo.get("preferJson").getAsString())
                .locationJson((jo.get("locationJson") == null) ? null : jo.get("locationJson").getAsString())
                .note((jo.get("note") == null) ? null : jo.get("note").getAsString())
                .status(GeneralStatus.values()[jo.get("status").getAsInt()])
                .type(com.demo.playground.scpex.Models.Enums.Type.values()[jo.get("type").getAsInt()])
                .build();
    }

}
