import Pageable from "../models/Pageable";
import ListItem from "./Fragments/ListItem";
import List from "./List";

export default function PageableList({page} : {page: Pageable | null}){


    if(page == null)
        return <>
            <div className="text-center text-xl animate-pulse my-3">
                No Content
            </div>
        </>

    return <>
    
        <List>
            {page.content.map((self) => {
                return <ListItem title={self.name} key={self.id} />
            })}
        </List>
    
    </>
}