import Pageable from "../models/Pageable";
import ListItem from "./Fragments/ListItem";
import List from "./List";

export default function PageableList({page} : {page: Pageable}){



    return <>
    
        <List>
            {page.content.map((self) => {
                return <ListItem title={self.name} key={self.id} />
            })}
        </List>
    
    </>
}