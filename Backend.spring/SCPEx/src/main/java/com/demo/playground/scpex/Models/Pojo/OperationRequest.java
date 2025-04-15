package com.demo.playground.scpex.Models.Pojo;

import com.demo.playground.scpex.Shared.NullReferenceException;

import java.util.Arrays;

/**
 * not likely something that too "PoJO"
 * */
public record OperationRequest(String operation, String payloadJson) {
    public OperationRequest {
        payloadJson = payloadJson;
        var prep = operation.toLowerCase().strip().trim().replaceAll(" ", "");
        switch (prep) {
            case "add", "new", "insert", "in", "create":
                operation = "add";
                break;
            case "upd", "update", "patch":
                operation = "upd";
                break;
            case "delete", "del", "rem", "remove":
                operation = "del";
                break;
            default:
                throw new NullReferenceException("[NM:A] Null reference found for such operation: Not acceptable operation for " + prep);
        }
    }
}
