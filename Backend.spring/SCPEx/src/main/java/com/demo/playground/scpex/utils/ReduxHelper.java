package com.demo.playground.scpex.utils;

import com.demo.playground.scpex.Models.IModelClass;
import com.demo.playground.scpex.Models.Pojo.OperationRequest;
import com.demo.playground.scpex.Shared.NullReferenceException;
import com.demo.playground.scpex.Shared.SharedStatic;
import com.google.gson.Gson;
import org.hibernate.sql.Update;
import org.springframework.data.jpa.repository.JpaRepository;

@Deprecated
public class ReduxHelper<T extends IModelClass> {

    Operation operation;
    T payload;
    JpaRepository<T, Long> repository;
    Class type;

    public ReduxHelper(JpaRepository<T, Long> jr, Class type){
        this.repository = jr;
        this.type = type;
    }


    public T operate(boolean checkBefore){
        boolean isExist, isComparable;
        if(checkBefore){
            if(this.repository == null) throw new NullReferenceException("No such persistence object");
            isExist = repository.findById(this.payload.getId()).isPresent();
            isComparable = this.operation == Operation.UPDATE;
        }


        return null;
    }

    public ReduxHelper<T> setup(OperationRequest op){
        var code = op.operation().toLowerCase(); // x
        switch(code) {
            case "create", "cr":
                this.operation = Operation.CREATE;
                break;
            case "update", "upd":
                this.operation = Operation.UPDATE;
                break;
            case "delete", "remove", "del", "re":
                this.operation = Operation.DELETE;
                break;
            default: {
                if(code.contains("del") || code.contains("re")) this.operation = Operation.DELETE;
                else if(code.contains("cr")) this.operation = Operation.CREATE;
                else if(code.contains("upd")) this.operation = Operation.UPDATE;
                else throw new NullPointerException("Not specified operation or unknown type of operation: " + code);
            } break;
        }
        try{
            this.payload = (T) (new Gson()).fromJson(op.payloadJson(), this.type);
        }catch (Exception ex){

        }

        return this;
    }




    @Override
    public String toString() {
        return ("=== RHCS ===\nRedux Helper 「Current Step」\n" + this.operation + "\n Type: @" + this.type + "\n Payload: " + this.payload + "\n=== E ===");
    }
}

@Deprecated
enum Operation{
    UPDATE, DELETE, CREATE;
}