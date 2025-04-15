package com.demo.playground.scpex.Shared;

public class Response {
    private String title;
    private String content;
    private int code;

    public Response(int code, String title, String info) {
        this.title = title;
        this.content = info;
        this.code = code;
    }

    public Response(int code, String title) {
        this.title = title;
        this.content = "No info provided";
        this.code = code;
    }

    public Response(String content) {
        this.title = "default";
        this.content = content;
        this.code = 200;
    }

    public Response(int code) {
        this.content = "No info provided";
        this.code = code;
        switch (code){
            case 200:
                this.title = "OK";
                break;
            case 114:
                this.title = "Unexpected";
                break;
            case 401:
                this.title = "Unauthorized";
                break;
            case 403:
                this.title = "Forbidden";
                break;
            case 406:
                this.title = "Not Acceptable";
                break;
            case 514:
                this.title = "Unprocessable Entity or Exception/conflict";
                break;
            case 418:
                this.title = "I'm a teapot";
                break;
            case 555:
                this.title = "Critical server error";
                this.content = "you see, the server cried! 555";
                break;

            default:
                this.title = "Empty";
        }
    }

    public String getTitle() {
        return title;
    }

    public String getInfo() {
        return content;
    }

    public int getCode() {
        return code;
    }

    public String json(){
        return SharedStatic.jsonHandler.toJson(this);
    }
}
