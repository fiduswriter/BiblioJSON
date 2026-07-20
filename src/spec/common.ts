export const text = {
    group: "inline",
}

export const literal = {
    content: "inline*",
    marks: "_",
    parseDOM: [{ tag: "div.literal" }],
    toDOM() {
        return ["div", { class: "literal" }, 0] as const
    },
}

export const variable = {
    inline: true,
    group: "inline",
    attrs: {
        variable: { default: "" },
    },
    parseDOM: [
        {
            tag: "span[data-variable]",
            getAttrs(dom: HTMLElement) {
                return {
                    variable: dom.getAttribute("data-variable"),
                }
            },
        },
    ],
    toDOM(node: { attrs: Record<string, string> }) {
        return [
            "span",
            { "data-variable": node.attrs.variable },
            node.attrs.variable,
        ] as const
    },
}

export const sup = {
    parseDOM: [
        { tag: "sup" },
        {
            style: "vertical-align",
            getAttrs: (value: string) => value === "super" && null,
        },
    ],
    toDOM() {
        return ["sup"] as const
    },
}

export const sub = {
    parseDOM: [
        { tag: "sub" },
        {
            style: "vertical-align",
            getAttrs: (value: string) => value === "sub" && null,
        },
    ],
    toDOM() {
        return ["sub"] as const
    },
}

export const smallcaps = {
    parseDOM: [
        { tag: "span.smallcaps" },
        {
            style: "font-variant",
            getAttrs: (value: string) => value === "small-caps" && null,
        },
    ],
    toDOM() {
        return ["span", { class: "smallcaps" }] as const
    },
}

// Currently unsupported

export const url = {
    parseDOM: [{ tag: "span.url" }],
    toDOM() {
        return ["span", { class: "url" }] as const
    },
}

export const enquote = {
    parseDOM: [{ tag: "span.enquote" }],
    toDOM() {
        return ["span", { class: "enquote" }] as const
    },
}
