import { useState } from "react"
import { Category } from "../../models/Category"
import { api } from "../../axios";

export default function EAUCategory(){

    // list cats, disable cat by id, create cat.
    // due to the time not enough,, the disable of category won't be implemented.

    const [cats, setCats] = useState<Category | null>(null);

    async function getCats(){

        try{
            let res = await api.Stock.listCat();
            
        }catch(ex){
            console.log(ex);
        }

    }


    return <>
    
    </>
}