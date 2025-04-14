package com.demo.playground.scpex.utils;

import java.lang.reflect.Field;
import java.util.Arrays;
import java.util.Objects;

@Deprecated
public class PropertyComparator {
    public static boolean isSameValue(Object sample, Object compare) {
        if (sample == null || compare == null)
            return sample == compare;

        if (sample.getClass().isArray() && compare.getClass().isArray())
            return Arrays.deepEquals((Object[]) sample, (Object[]) compare);

        if (sample instanceof Iterable && compare instanceof Iterable)
            return Objects.equals(sample, compare);

        return sample.equals(compare);
    }

    public static Object compare(Object old, Object neo, String strategy) {
        boolean preferNew = strategy.equals("prefer-new");
        if (old == null && neo == null) return null;
        else if (neo == null) return old;
        else if (old == null) return neo;

        Class<?> oldClass = old.getClass();
        if (oldClass != neo.getClass()) throw new ClassCastException("The new object is not of type " + oldClass.getName());

        var prepare = neo;
        if(!preferNew)
            prepare = old;


        while(oldClass != null){ // ? usePrepareAndSample?
            Field[] fieldsOld = prepare.getClass().getDeclaredFields();
            int index = 0;
            for (Field field : fieldsOld) {
                field.setAccessible(true);
                try {
                    Object valueOld = field.get(old);
                    Object valueNeo = field.get(neo);

                    // prefer new and new value is not skipping
                    if((preferNew && !(valueNeo == null || (valueNeo.getClass() == String.class && valueNeo.equals("hidden")))))
                        field.set(prepare, valueNeo); // set Neo value (not skipping) to prepare
                    else
                        field.set(prepare, valueOld); // or, set old value to prepare. here must be a value that not skipping.

                    if((!preferNew && !(valueOld == null || (valueOld.getClass() == String.class && valueOld.equals("hidden")))))
                        field.set(prepare, valueOld);
                    else
                        field.set(prepare, valueNeo);

                } catch (IllegalAccessException e) {
                    throw new RuntimeException("Failed to access field: " + field.getName(), e);
                }
            }

        }




        return neo;
    }

    public static Object compare(Object old, Object neo) {
        return compare(old, neo, "prefer-new");
    }
}
