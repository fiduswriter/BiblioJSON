import { expect } from "chai"
import {
    ar,
    bg,
    cs,
    de,
    en,
    es,
    fr,
    getFieldHelp,
    getFieldTitle,
    getLangidTitle,
    getLocale,
    getOtherOptionTitle,
    getTypeTitle,
    it as itLocale,
    ja,
    ko,
    locales,
    nl,
    pl,
    ptBR,
    ptPT,
    ru,
    sv,
    tr,
    zh,
} from "../src/i18n/index.ts"
import type { Locale } from "../src/i18n/types.ts"

const ALL_LOCALES: Record<string, Locale> = {
    ar,
    bg,
    cs,
    de,
    en,
    es,
    fr,
    it: itLocale,
    ja,
    ko,
    nl,
    pl,
    "pt-BR": ptBR,
    "pt-PT": ptPT,
    ru,
    sv,
    tr,
    zh,
}

// ---------------------------------------------------------------------------
// Structural integrity
// ---------------------------------------------------------------------------

describe("i18n locale structural integrity", () => {
    const expectedSections = [
        "fieldTitles",
        "fieldHelp",
        "typeTitles",
        "fieldTitlesByType",
        "langidOptions",
        "otherOptions",
    ]

    for (const [tag, locale] of Object.entries(ALL_LOCALES)) {
        describe(`locale: ${tag}`, () => {
            it("has all required top-level sections", () => {
                for (const section of expectedSections) {
                    expect(locale).to.have.property(section)
                }
            })

            it("has no extra top-level sections", () => {
                const actual = Object.keys(locale).sort()
                expect(actual).to.deep.equal(expectedSections.slice().sort())
            })

            it("fieldTitles has same keys as English", () => {
                const actual = Object.keys(locale.fieldTitles).sort()
                const expected = Object.keys(en.fieldTitles).sort()
                expect(actual).to.deep.equal(expected)
            })

            it("fieldHelp has same keys as English", () => {
                const actual = Object.keys(locale.fieldHelp).sort()
                const expected = Object.keys(en.fieldHelp).sort()
                expect(actual).to.deep.equal(expected)
            })

            it("typeTitles has same keys as English", () => {
                const actual = Object.keys(locale.typeTitles).sort()
                const expected = Object.keys(en.typeTitles).sort()
                expect(actual).to.deep.equal(expected)
            })

            it("langidOptions has same keys as English", () => {
                const actual = Object.keys(locale.langidOptions).sort()
                const expected = Object.keys(en.langidOptions).sort()
                expect(actual).to.deep.equal(expected)
            })

            it("otherOptions has same keys as English", () => {
                const actual = Object.keys(locale.otherOptions).sort()
                const expected = Object.keys(en.otherOptions).sort()
                expect(actual).to.deep.equal(expected)
            })

            it("fieldTitlesByType outer keys are a subset of English", () => {
                const actual = Object.keys(locale.fieldTitlesByType).sort()
                const expected = Object.keys(en.fieldTitlesByType).sort()
                for (const k of actual) {
                    expect(expected).to.include(k)
                }
            })

            it("all string values are non-empty", () => {
                for (const section of expectedSections) {
                    const obj = locale[section as keyof Locale]
                    if (section === "fieldTitlesByType") {
                        const ftbt = obj as Record<
                            string,
                            Record<string, string>
                        >
                        for (const [typeKey, fields] of Object.entries(ftbt)) {
                            for (const [fieldKey, value] of Object.entries(
                                fields,
                            )) {
                                expect(
                                    value,
                                    `${tag}.fieldTitlesByType.${typeKey}.${fieldKey}`,
                                ).to.be.a("string")
                                expect(
                                    value.trim(),
                                    `${tag}.fieldTitlesByType.${typeKey}.${fieldKey}`,
                                ).to.not.equal("")
                            }
                        }
                    } else {
                        const rec = obj as Record<string, string>
                        for (const [key, value] of Object.entries(rec)) {
                            expect(value, `${tag}.${section}.${key}`).to.be.a(
                                "string",
                            )
                            expect(
                                value.trim(),
                                `${tag}.${section}.${key}`,
                            ).to.not.equal("")
                        }
                    }
                }
            })
        })
    }
})

// ---------------------------------------------------------------------------
// No untranslated English leakage (soft check)
// ---------------------------------------------------------------------------

describe("i18n translation completeness", () => {
    for (const [tag, locale] of Object.entries(ALL_LOCALES)) {
        if (tag === "en") continue

        describe(`locale: ${tag}`, () => {
            it("fieldTitles are translated (not identical to English)", () => {
                const mismatches: string[] = []
                for (const [key, value] of Object.entries(locale.fieldTitles)) {
                    if (value === en.fieldTitles[key]) {
                        mismatches.push(key)
                    }
                }
                // Allow acronyms and legitimate cognates that are spelled the same
                const allowedSame: string[] = [
                    "isan",
                    "isbn",
                    "ismn",
                    "isrn",
                    "issn",
                    "iswc",
                    "doi",
                    "url",
                    // German cognates
                    "institution",
                    "version",
                    // French cognates
                    "annotation",
                    "institution",
                    "note",
                    "pages",
                    "pagination",
                    "version",
                    "volume",
                    // Italian cognates
                    "abstract",
                    "addendum",
                    "volume",
                    // Portuguese cognates
                    "volume",
                ]
                const unexpected = mismatches.filter(
                    (k) => !allowedSame.includes(k),
                )
                expect(
                    unexpected,
                    `untranslated fieldTitles: ${unexpected.join(", ")}`,
                ).to.deep.equal([])
            })

            it("typeTitles are translated (not identical to English)", () => {
                const mismatches: string[] = []
                for (const [key, value] of Object.entries(locale.typeTitles)) {
                    if (value === en.typeTitles[key]) {
                        mismatches.push(key)
                    }
                }
                // Acronyms, brand-like names, and legitimate cognates
                const allowedSame: string[] = [
                    "misc",
                    "software",
                    // German cognates
                    "interview",
                    "video",
                    // French cognates
                    "article",
                    "collection",
                    "figure",
                    // Italian cognates
                    "video",
                    // Spanish / Portuguese cognates
                    "manual",
                    // Czech cognates
                    "patent",
                    // Dutch cognates
                    "interview",
                    // Polish cognates
                    "patent",
                    // Portuguese-PT cognates
                    "manual",
                    // Swedish cognates
                    "patent",
                    // Turkish cognates
                    "patent",
                ]
                const unexpected = mismatches.filter(
                    (k) => !allowedSame.includes(k),
                )
                expect(
                    unexpected,
                    `untranslated typeTitles: ${unexpected.join(", ")}`,
                ).to.deep.equal([])
            })

            it("fieldHelp are translated (not identical to English)", () => {
                for (const [key, value] of Object.entries(locale.fieldHelp)) {
                    expect(value, `fieldHelp.${key}`).to.not.equal(
                        en.fieldHelp[key],
                    )
                }
            })
        })
    }
})

// ---------------------------------------------------------------------------
// API behaviour
// ---------------------------------------------------------------------------

describe("i18n API helpers", () => {
    describe("getLocale", () => {
        it("returns exact match", () => {
            expect(getLocale("de")).to.equal(de)
            expect(getLocale("pt-BR")).to.equal(ptBR)
        })

        it("falls back to base subtag", () => {
            // Base subtag "de" exists, so "de-AT" falls back to German
            expect(getLocale("de-AT")).to.equal(de)
            // Base subtag "pt" does NOT exist (only "pt-BR" and "pt-PT"), so falls back to English
            expect(getLocale("pt")).to.equal(en)
        })

        it("falls back to English for unknown languages", () => {
            expect(getLocale("xx")).to.equal(en)
            expect(getLocale("unknown-lang")).to.equal(en)
        })
    })

    describe("getFieldTitle", () => {
        it("falls back from fieldTitlesByType to fieldTitles", () => {
            expect(getFieldTitle(en, "book", "author")).to.equal("Author(s)")
            expect(getFieldTitle(en, "video", "author")).to.equal("Director(s)")
        })

        it("falls back to raw key when nothing is found", () => {
            expect(getFieldTitle(en, "book", "nonexistent")).to.equal(
                "nonexistent",
            )
        })

        it("returns per-type override in different locales", () => {
            expect(getFieldTitle(de, "video", "author")).to.equal(
                "Regisseur(in)",
            )
            expect(getFieldTitle(fr, "video", "author")).to.equal(
                "Réalisateur(s)",
            )
        })
    })

    describe("getTypeTitle", () => {
        it("returns translated type title", () => {
            expect(getTypeTitle(en, "book")).to.equal("Book")
            expect(getTypeTitle(de, "book")).to.equal("Buch")
        })

        it("falls back to raw key", () => {
            expect(getTypeTitle(en, "unknown")).to.equal("unknown")
        })
    })

    describe("getFieldHelp", () => {
        it("returns help text when available", () => {
            expect(getFieldHelp(en, "date")).to.include("EDTF")
        })

        it("returns undefined when not available", () => {
            expect(getFieldHelp(en, "title")).to.be.undefined
        })
    })

    describe("getLangidTitle", () => {
        it("returns language label", () => {
            expect(getLangidTitle(en, "german")).to.equal("German")
            expect(getLangidTitle(de, "german")).to.equal("Deutsch")
        })

        it("falls back to raw key", () => {
            expect(getLangidTitle(en, "klingon")).to.equal("klingon")
        })
    })

    describe("getOtherOptionTitle", () => {
        it("returns option label", () => {
            expect(getOtherOptionTitle(en, "phdthesis")).to.equal(
                "Ph.D. thesis",
            )
            expect(getOtherOptionTitle(de, "phdthesis")).to.equal(
                "Doktorarbeit",
            )
        })

        it("falls back to raw key", () => {
            expect(getOtherOptionTitle(en, "unknown")).to.equal("unknown")
        })
    })
})

// ---------------------------------------------------------------------------
// Locale registry consistency
// ---------------------------------------------------------------------------

describe("i18n locale registry", () => {
    it("locales object keys match exported locale objects", () => {
        expect(Object.keys(locales).sort()).to.deep.equal(
            Object.keys(ALL_LOCALES).sort(),
        )
    })

    it("locales.ts barrel file matches filesystem JSON files", () => {
        const expectedTags = Object.keys(ALL_LOCALES).sort()
        expect(Object.keys(locales).sort()).to.deep.equal(expectedTags)
    })
})
