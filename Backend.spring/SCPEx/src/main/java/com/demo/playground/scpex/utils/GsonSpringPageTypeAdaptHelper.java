package com.demo.playground.scpex.utils;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.google.gson.Gson;
import com.google.gson.JsonSerializer;
import com.google.gson.TypeAdapter;
import com.google.gson.stream.JsonReader;
import com.google.gson.stream.JsonWriter;
import org.springframework.data.domain.Page;

import java.io.IOException;

public class GsonSpringPageTypeAdaptHelper <T> extends TypeAdapter<Page<T>> {
    @Override
    public void write(JsonWriter out, Page<T> page) throws IOException {

        out.beginObject();
        out.name("content");
        out.beginArray();
        for (T item : page.getContent()) {
            System.out.println(item.toString());
            out.jsonValue(new Gson().toJson(item));
        }
        out.endArray();

        out.name("pageable").beginObject();
        out.name("pageNumber").value(page.getNumber());
        out.name("pageSize").value(page.getSize());
        out.name("sort").beginObject();
        // 序列化排序信息（示例）
        out.name("sorted").value(page.getSort().isSorted());
        out.endObject();
        out.endObject();

        out.name("totalElements").value(page.getTotalElements());
        out.name("totalPages").value(page.getTotalPages());
        out.name("last").value(page.isLast());
        out.name("first").value(page.isFirst());
        out.endObject();
    }

    @Override
    public Page<T> read(JsonReader jsonReader) throws IOException {
        return null;
    }
}
