 
export default function Icon({pua, className, spacing = false, fix = false, forceNoTranslate = false} : {pua : string, className?: string, spacing? : boolean, fix? : boolean, forceNoTranslate?: boolean}){

    return (
        <span 
            className={`${className} ${spacing ? 'mx-1' : ''} ${fix ? (forceNoTranslate ? '  [fix+FNT]  ' : 'translate-y-[5px] [fix] ') : (forceNoTranslate ? '  [FNT]   ' : 'translate-y-[3px]  default[]   ')}   inline-block select-none max-h-min`} 
            style={{fontFamily: 'sfi'}}
            dangerouslySetInnerHTML={{__html: `&#x${pua};`}}
        ></span>
    );
}