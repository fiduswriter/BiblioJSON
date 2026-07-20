import {
    enquote,
    literal,
    smallcaps,
    sub,
    sup,
    text,
    url,
    variable,
} from "./common.js"
import { em, strong } from "./csl_bib.js"

const nocase = {
    parseDOM: [{ tag: "span.nocase" }],
    toDOM() {
        return ["span", { class: "nocase" }] as const
    },
}

const doc = {
    content: "literal",
}

export const titleSpec = {
    nodes: {
        doc,
        literal,
        text,
        variable,
    },
    marks: {
        em,
        enquote,
        nocase,
        smallcaps,
        strong,
        sup,
        sub,
        url,
    },
}
