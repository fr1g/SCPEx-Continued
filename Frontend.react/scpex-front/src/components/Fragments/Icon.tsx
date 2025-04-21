 
export default function Icon({pua, className, spacing = false, fix = false, forceNoTranslate = false} : {pua : string, className?: string, spacing? : boolean, fix? : boolean, forceNoTranslate?: boolean}){

    return (
        <span 
            className={`${className} ${spacing ? 'mx-1' : ''} ${fix ? (forceNoTranslate ? '' : 'translate-y-[5px]') : (forceNoTranslate ? '' : 'translate-y-[3.5px]')}   inline-block select-none max-h-min`} 
            dangerouslySetInnerHTML={{__html: `&#x${pua};`}}
        ></span>
    );
}