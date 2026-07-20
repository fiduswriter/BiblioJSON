import { enquote, smallcaps, sub, sup, text, url, variable } from "./common.js"
import { em, strong } from "./csl_bib.js"

const longliteral = {
    content: "inline*",
    marks: "_",
    code: true,
    defining: true,
    parseDOM: [{ tag: "pre.long-literal" }],
    toDOM() {
        return ["pre", { class: "long-literal" }, 0] as const
    },
}

const doc = {
    content: "longliteral",
}

export const longLitSpec = {
    nodes: {
        doc,
        longliteral,
        text,
        variable,
    },
    marks: {
        em,
        enquote,
        smallcaps,
        strong,
        sup,
        sub,
        url,
    },
}
