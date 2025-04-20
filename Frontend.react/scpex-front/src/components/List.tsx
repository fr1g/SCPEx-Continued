import { ReactNode } from "react";
import { Gen } from "../tools/UniqueGenerator";


export default function List({ children, gap = 3, colsClassNames = '', className = '', useFilters = true }: { children: ReactNode, gap?: number, colsClassNames?: string, className?: string, useFilters?: boolean }) {

    let gene = Gen('soifhjioew');
    // REMINDER the product need some selling stastics, which updates each time trade completes. // wuh?
    // Filters: Sorting(desc, asc); SortBy(fields); SearchBy?(fields)
    // the data @ BACKEND should: sorting should not affecting searchByField
    // REMINDER some of the searches ONLY search via name, or FUSION SEARCH @BACKEND: SEARCH IN NAME, TAGS, DETAILS etc. @UNNECESSARY 
    return <>
        <div id={`List--@${gene}`}>
            { useFilters &&
                <div className="@FILTERS w-full grid grid-cols-6 gap-1.5">

                </div>
            }
            <div id={`List--cont--@${gene}`} className={`grid ${colsClassNames == '' ? 'grid-cols-' : colsClassNames}  ${className} gap-${gap}`}>
                {children}
            </div>
        </div>
    </>
}