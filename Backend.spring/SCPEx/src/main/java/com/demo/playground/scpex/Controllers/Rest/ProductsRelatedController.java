package com.demo.playground.scpex.Controllers.Rest;

import com.demo.playground.scpex.Models.Pojo.PageRequest;
import com.demo.playground.scpex.Services.ProductSvc;
import com.demo.playground.scpex.Shared.Response;
import com.demo.playground.scpex.utils.ResponseHelper;
import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


// todo this requires to permit at security config.
@RestController
@RequestMapping("/api/products")
public class ProductsRelatedController {
    /** TODO PUBLIC PRODUCTS
     *    - Products.Search (with sorting and filtering, pagination)
     *    - Products.GetInfo
     * */

    @Autowired
    ProductSvc _p;

    @PostMapping("/search/{page}")
    public ResponseEntity<String> search(@RequestBody String paged, @PathVariable(required = false) String page) {
        try{
            var pageInt = (page.isEmpty() || page == null) ? 0 : Integer.parseInt(page);
            var pr = (new Gson()).fromJson(paged, PageRequest.class);
            System.out.println(pr.Keyword + " -- recv kw");
            var result = _p.getSpecifiedPageObjects(pr, pageInt);

            return ResponseHelper.Return(new Response(200, "success", (new Gson()).toJson(result)));

        }catch (Exception ex){
            return ResponseHelper.Return(new Response(403, "Failed", ex.getMessage()));
        }
    }


    @PostMapping("/info/{productId}")
    public ResponseEntity<String> getProductInfo(@PathVariable("productId") String productId) {
        try {

            return ResponseHelper.Return(new Response(200, "success",
                    (new Gson()).toJson(_p.getObjectById(Long.parseLong(productId)))));
        }catch (Exception ex) {
            return ResponseHelper.Return(new Response(403, "Failed", ex.getMessage()));
        }
    }

    /*
        todo imagine on the recommend stuffs
            - front end gives some words about current viewing product
            - run search about those words for each
            - assembly result and return *not page list*
     */

}
