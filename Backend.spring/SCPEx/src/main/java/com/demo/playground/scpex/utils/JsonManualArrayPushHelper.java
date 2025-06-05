package com.demo.playground.scpex.utils;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

public class JsonManualArrayPushHelper {
    public static String push(String sourceJson, String newObject, String targetArrayName){
        var g = new Gson();
        var jsonObj = g.fromJson(sourceJson, JsonObject.class);
        var jsonArray = jsonObj.getAsJsonArray(targetArrayName);
        var newJsonObj = JsonParser.parseString(newObject).getAsJsonObject();
        jsonArray.add(newJsonObj);
//        jsonObj.
        var generated = g.toJson(jsonObj);
        System.out.println(generated);
        System.out.println(g.toJson(jsonArray));
        System.out.println("=======");
//        return "{\"prefers\": "+ generated +"}";
        return generated;
    }
}
