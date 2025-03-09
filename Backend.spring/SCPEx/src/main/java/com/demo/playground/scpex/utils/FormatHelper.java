package com.demo.playground.scpex.utils;

import java.text.*;
import java.time.*;
import java.util.TimeZone;
import java.util.Date;

// import org.mariadb.jdbc.SimpleParameterMetaData;

public class FormatHelper {
    static SimpleDateFormat generalFormat(){
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        df.setTimeZone(TimeZone.getTimeZone(ZoneId.systemDefault()));
        return df;
    }

    public static String Format(Date d){
        return generalFormat().format(d);
    }

    public static Date AsDate(String formatted) throws ParseException{
        return generalFormat().parse(formatted);
    }
}