package com.demo.playground.scpex.Shared;

public class NullReferenceException extends NullPointerException {
    public NullReferenceException(String message) {
        super("Object reference not set to an instance of an object. \n" + message);
    }
}
