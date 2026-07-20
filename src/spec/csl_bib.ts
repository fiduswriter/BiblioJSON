import { smallcaps, sub, sup, text } from "./common.js"

const doc = { content: "cslbib" }

const cslbib = {
    content: "cslentry*",
    parseDOM: [{ tag: "div.csl-bib-body" }],
    toDOM() {
        return ["div", { class: "csl-bib-body" }, 0] as const
    },
}

const cslentry = {
    content: "block*",
    parseDOM: [{ tag: "div.csl-entry" }],
    toDOM() {
        return ["div", { class: "csl-entry" }, 0] as const
    },
}

// This block doesn't actually appear in the HTML output, but because the schema
// system doesn't allow for the mixing of inline and block content, it "imagines"
// that this block exists. This---rather than other blocks---is chosen, because
// it's the first in the list.
const cslinline = {
    group: "block",
    content: "text*",
    marks: "_",
    parseDOM: [{ tag: "div.csl-inline" }],
    toDOM() {
        return ["div", { class: "csl-inline" }, 0] as const
    },
}

const cslblock = {
    group: "block",
    content: "text*",
    marks: "_",
    parseDOM: [{ tag: "div.csl-block" }],
    toDOM() {
        return ["div", { class: "csl-block" }, 0] as const
    },
}

const cslleftmargin = {
    group: "block",
    content: "text*",
    marks: "_",
    parseDOM: [{ tag: "div.csl-left-margin" }],
    toDOM() {
        return ["div", { class: "csl-left-margin" }, 0] as const
    },
}

const cslrightinline = {
    group: "block",
    content: "text*",
    marks: "_",
    parseDOM: [{ tag: "div.csl-right-inline" }],
    toDOM() {
        return ["div", { class: "csl-right-inline" }, 0] as const
    },
}

const cslindent = {
    group: "block",
    content: "text*",
    marks: "_",
    parseDOM: [{ tag: "div.csl-indent" }],
    toDOM() {
        return ["div", { class: "csl-indent" }, 0] as const
    },
}

export const em = {
    parseDOM: [
        { tag: "i" },
        { tag: "em" },
        { style: "font-style=italic" },
        {
            style: "font-style=normal",
            clearMark: (m: { type: { name: string } }) => m.type.name === "em",
        },
    ],
    toDOM() {
        return ["em", 0] as const
    },
}

export const strong = {
    parseDOM: [
        { tag: "strong" },
        {
            tag: "b",
            getAttrs: (node: HTMLElement) =>
                node.style.fontWeight !== "normal" && null,
        },
        {
            style: "font-weight=400",
            clearMark: (m: { type: { name: string } }) =>
                m.type.name === "strong",
        },
        {
            style: "font-weight",
            getAttrs: (value: string) =>
                /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null,
        },
    ],
    toDOM() {
        return ["strong", 0] as const
    },
}

// A spec to express the citeproc HTML bibliography output
export const cslBibSpec = {
    nodes: {
        doc,
        cslbib,
        cslentry,
        cslinline,
        cslblock,
        cslleftmargin,
        cslrightinline,
        cslindent,
        text,
    },
    marks: {
        em,
        strong,
        smallcaps,
        sup,
        sub,
    },
}
