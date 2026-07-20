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

const doc = {
    content: "literal",
}

export const litSpec = {
    nodes: {
        doc,
        literal,
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
