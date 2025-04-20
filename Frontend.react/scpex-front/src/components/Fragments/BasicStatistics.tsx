import Icon from "./Icon";


export default function BasicStatistics({sold = '-', instock = '-', category = '-'} : {sold: string, instock: string, category: string}){



    return <>
        <div className="flex flex-row flex-wrap gap-1 w-fit">
            <div aria-description="Sold">
                <Icon pua="ea44" className="mr-2"/>
                {sold}
            </div>
            <div aria-description="In Stock">
                <Icon pua="f133" className="mx-2 translate-y-[0.07rem]!" forceNoTranslate/>
                {instock}
            </div>
            <div aria-description="Of Category">
                <Icon pua="ec6c" className="mx-2 translate-y-[0.15rem]!" forceNoTranslate/>
                {category}
            </div>
        </div>
    </>
}