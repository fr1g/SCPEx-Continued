package com.demo.playground.scpex.utils;

import com.demo.playground.scpex.Models.Enums.GeneralStatus;
import com.google.gson.*;

import java.lang.reflect.Type;

public class GsonGeneralStatusAdapter<T extends Enum<T>> implements JsonSerializer<T>, JsonDeserializer<T> {

        @Override
        public T deserialize(JsonElement json, Type type, JsonDeserializationContext context) {
            int code = 0;
            try{
                code = json.getAsInt();
                for (T enumConstant : ((Class<T>) type).getEnumConstants()) {
                    if (enumConstant.ordinal() == code) {  // 使用枚举序号匹配
                        return enumConstant;
                    }
                }
            }catch (Exception e){
                if(e.getMessage().contains("For input string")){
                    var reget = json.getAsString();
                    return Enum.valueOf((Class<T>) type, reget.toUpperCase());
                }
            }
            throw new JsonParseException("Invalid enum code: " + code);
        }

        @Override
        public JsonElement serialize(T src, Type type, JsonSerializationContext context) {
            return new JsonPrimitive(src.ordinal());
        }

}
