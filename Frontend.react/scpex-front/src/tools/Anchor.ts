import { useNavigate } from "react-router";

const __default_public_anchor_id = "@AnchorHelper_DefaultPublicAnchor";

function anchor(): HTMLAnchorElement {
    let chk = document.getElementById(__default_public_anchor_id);
    if (chk) {
        if (chk!.tagName.toLowerCase() !== "a") chk.parentElement?.removeChild(chk);
        else return cleanAnchorAttrs(chk as HTMLAnchorElement);
    }
    let a = document.createElement("a");
    a.setAttribute("id", __default_public_anchor_id);
    a.style.display = "none";
    document.appendChild(a);
    return a;
}

function cleanAnchorAttrs(a: HTMLAnchorElement): HTMLAnchorElement {
    a.removeAttribute("href");
    a.removeAttribute("download");
    a.removeAttribute("target");

    a.style.display = "none";

    return a;
}

/**
* `useAnchor` hook helper
* @author Feiron Iguista
* @version 1.0.0
* @return {Function} Return a function, call it to use vanilla anchor or react-router useNavigate immediately
*/
export default function useAnchor(): Function {
    return runAnchor;
}

/**
* `useAnchor => runAnchor` hook helper
* @author Feiron Iguista
* @param {string} path Required. The target's path. This one is the only necessary. Only if using url NOT starting with "http://" or "https://", and set `outLink` to `false` (default), will make ALL other params EXCEPT this one became IGNORED.
* @param {"_blank" | "_parent" | "_self" | "_top"} target
* @version 1.0.0
*/
function runAnchor (
    path: string,
    target: "_blank" | "_parent" | "_self" | "_top" = "_blank",
    title?: string,
    download?: string,
    outLink: boolean = false
) {
    if (path.startsWith("http://") || path.startsWith("https://") || outLink) {
        let anc = anchor();
        anc.target = target;
        anc.href = path;
        if (download) anc.download = (download == "default" ? "" : download);
        if (title) anc.title = title;

        anc.click();
    }
    else return (useNavigate())(path);
};