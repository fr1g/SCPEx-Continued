package com.demo.playground.scpex.utils;

import com.demo.playground.scpex.Models.Employee;
import com.demo.playground.scpex.Models.IModelClass;
import com.demo.playground.scpex.Repositories.RepoEmployee;
import com.demo.playground.scpex.Shared.NullReferenceException;
import com.demo.playground.scpex.Shared.SharedStatic;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.*;


public class EnhancedPageHelper <T, R extends JpaRepository<T, Long>>{

    R repository;

    int defaultPageSize = 10;

    public Pageable of(int page, int size, String sortName, String field) {
        return PageRequest.of(  page,
                                (size <= 0 ? this.defaultPageSize : size),
                                Sort.by(Sort.Direction.fromString((sortName.equals("default") ? "asc" : sortName)),
                                (field.equals("default") ? "id" : field)));
    }

    public Pageable of(int page, int size, String field) {
        return this.of(page, size, "asc", field);
    }

    public Pageable of(int page, int size) {
        return this.of(page, size, "asc", "id");
    }

    public Pageable of(int page) {
        return this.of(page, this.defaultPageSize, "asc", "id");
    }

    public Pageable of(int page, String field) {
        return this.of(page, this.defaultPageSize, "asc", field);
    }

    public Page<T> getPage(int page, int size, String sortName, String field) {
        return this.repository.findAll(of(page, size, sortName, field));
    }

    public Page<T> getPage(int page, String field) {
        return this.repository.findAll(of(page, field));
    }

    public Page<T> getPage(int page, String field, String sortName) {
        return this.repository.findAll(of(page, this.defaultPageSize, sortName, field));
    }

// ------------------------------------------------------------------------------------------------------------------ //

    protected Page<T> getTs(String targetFunctionName, Class<?> clazz, List<Class<?>> candidateIndicator, List<Object> arguments)
            throws NoSuchMethodException, IllegalAccessException, InvocationTargetException, ClassNotFoundException {
// partial
        Class<?>[] indicator = candidateIndicator.toArray(new Class<?>[0]);
        Method m;
        try {
            m = clazz.getMethod(targetFunctionName, indicator);
        }catch (NoSuchMethodException e){
            m = clazz.getDeclaredMethod(targetFunctionName, indicator);
            m.setAccessible(true);
        }catch (ClassCastException | NullPointerException ex) {
            throw new ClassCastException("Error casting for method-args: " + targetFunctionName + "\n Nested: " + ex.getMessage());
        }

        Object x = m.invoke(this.repository, arguments.toArray());
        System.out.println(SharedStatic.jsonHandler.toJson(x));
        if(x instanceof Page) return (Page<T>) x;
        else throw new ClassNotFoundException("Error casting into Page<T> class: the returned value is not as expected.");

    }

    /**
     * @param args the argument list of target function. make sure the target function accepts the Pageable at first, and do not occupy the first argument with null. Just ignore it.
     *
     * */
    public Page<T> getPage(String targetFunctionName,
                           List<Object> args,

                           // UPWARD for reflect
                           int page, int size, String field, String sortName)
            throws NoSuchMethodException,
                   IllegalAccessException,
                   ClassNotFoundException,
                   InvocationTargetException,
                   NullReferenceException,
                   ClassCastException {

        Pageable pageable = of(page, size, sortName, field);

        Class<?> clazz = this.repository.getClass();

        List<Class<?>> candidateIndicator = new ArrayList<>();
        List<Object> arguments = new ArrayList<>();

        candidateIndicator.add(pageable.getClass());
        arguments.add(pageable);

        for (var clas : args) {
            if(clas == null) throw new NullReferenceException("Cannot decide original class of args["
                    + args.indexOf(null)
                    + "] because it's a null value. You can try to pass in a LinkedHashMap to indicate the class.");

            candidateIndicator.add(clas.getClass());
            arguments.add(clas);
        }

        return getTs(targetFunctionName, clazz, candidateIndicator, arguments);

    }

    /**
     * @param candidate the key-value pair that ordered and presents types of method-args with values as the value. Use Paginated : null to give a space for appending the instance.
     * */
    public Page<T> getPage(String targetFunctionName,
                           LinkedHashMap<Class<?>, Object> candidate,
                           // UPWARD for reflect
                           int page, int size, String field, String sortName)
            throws NoSuchMethodException,
            IllegalAccessException,
            ClassNotFoundException,
            InvocationTargetException,
            NullReferenceException,
            ClassCastException {

        Class<?> clazz = this.repository.getClass();

        List<Class<?>> candidateIndicator = new ArrayList<>();
        List<Object> arguments = new ArrayList<>();

        for (var clas : candidate.entrySet()) {
            Class<?> className = clas.getKey();
            Object x = clas.getValue();
            if(className == Pageable.class && x == null)
                x = of(page, size, sortName, field);


            candidateIndicator.add(className);
            arguments.add(x);
        }

        return getTs(targetFunctionName, clazz, candidateIndicator, arguments);

    }


    /**
     * T: the type of controlling Entity.
     * R: the Repository's Name
     * @param repo the Target entity's Repository instance
     * */
    public EnhancedPageHelper(R repo, int defaultSize) {
        this.repository = repo;
        this.defaultPageSize = defaultSize;
    }
}
