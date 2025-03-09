package com.demo.playground.scpex.utils;

public class PageHelper {
    /**
     * @param currentPage maybe misnamed, should be "offsetTargetPage"
     * */
    public static int at(int currentPage, int pageSize){
        return (currentPage - 1) * pageSize;
    }

    public static String getLimit(int jumpTo, int size){
        return (" limit " + size + " offset " + ( at(jumpTo, size) ) + " ");
    }

    public static int size(int from, int to){
        if(from < 0 || to <= 0 || from > to) throw new IndexOutOfBoundsException("The given range represents intouchable part of table.");
        return to - from;
    }
}
