 
export default function Icon({pua, className, spacing = false, fix = false} : {pua : string, className?: string, spacing? : boolean, fix? : boolean}){

    return <span 
            className={`${className} ${spacing ? 'mx-1' : ''} ${fix ? 'translate-y-[5px]' : 'translate-y-[3.5px]'}   inline-block select-none max-h-min`} dangerouslySetInnerHTML={{__html: `&#x${pua};`}}></span>
}