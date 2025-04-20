import { useNavigate } from "react-router";
import RecommendedItem from "../models/RecommendItem";


export default function RecommendedItemCard({item, hero = false} : {item: RecommendedItem, hero?: boolean}){

    let navto = useNavigate();
// !!! url should be FRONTENDTIVE.

    return <>
        <div className="w-full rounded-md shadow-md hover:shadow-lg transition" onClick={() => navto(item.url)}>
            <div className={`${hero ? '' : 'h-32 w-32 '}   `}>

            </div>
        </div>
    
    </>
}