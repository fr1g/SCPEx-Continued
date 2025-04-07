package com.demo.playground.scpex.utils;

import java.lang.reflect.Field;

public class PropertyComparator {

    public static Object compare(Object old, Object neo, String strategy) {
        boolean isApplyToNew = strategy.equals("prefer-new");
        Class<?> oldClass = old.getClass();
        if (old == null && neo == null) return null;
        else if (neo == null) return old;
        else if (old == null) return neo;
        else if (oldClass != neo.getClass()) throw new ClassCastException("The new object is not of type " + oldClass.getName());

        var prepare = neo;
        var sample = old;
        if(!isApplyToNew) {
            prepare = old;
            sample = neo;
        }

        while(oldClass != null){ // ? usePrepareAndSample?
            Field[] fieldsOld = oldClass.getDeclaredFields(),
                    fieldsNew = neo.getClass().getDeclaredFields();
            int index = 0;
            for (Field field : fieldsOld) {

            }

        }




        return neo;
    }

    public static Object compare(Object old, Object neo) {
        return compare(old, neo, "prefer-new");
    }
}
