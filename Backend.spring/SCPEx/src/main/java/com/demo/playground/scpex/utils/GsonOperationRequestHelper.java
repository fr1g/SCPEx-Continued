package com.demo.playground.scpex.utils;

import com.demo.playground.scpex.Models.Pojo.OperationRequest;
import com.google.gson.*;

import java.lang.reflect.Type;

public class GsonOperationRequestHelper implements JsonDeserializer<OperationRequest>, JsonSerializer<OperationRequest> {
    @Override
    public OperationRequest deserialize(JsonElement jsonElement, Type type, JsonDeserializationContext jsonDeserializationContext) throws JsonParseException {
        var jo = jsonElement.getAsJsonObject();
        return new OperationRequest(jo.get("operation").getAsString(), jo.get("payloadJson").getAsString());
    }

    @Override
    public JsonElement serialize(OperationRequest operationRequest, Type type, JsonSerializationContext jsonSerializationContext) {
        var jo = new JsonObject();
        jo.addProperty("operation", operationRequest.operation());
        jo.addProperty("payloadJson", operationRequest.payloadJson());
        // ?
        return jo;
    }
}
