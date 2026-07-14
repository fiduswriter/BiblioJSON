<p align="center">
  <img src="assets/logo.svg" alt="BiblioJSON logo" width="128" height="128">
</p>

# BiblioJSON

[![Test CI](https://github.com/fiduswriter/bibliojson/actions/workflows/test.yml/badge.svg)](https://github.com/fiduswriter/bibliojson/actions/workflows/test.yml)
[![Coverage Status](https://coveralls.io/repos/github/fiduswriter/bibliojson/badge.svg?branch=main)](https://coveralls.io/github/fiduswriter/bibliojson?branch=main)
[![npm version](https://img.shields.io/npm/v/bibliojson.svg)](https://www.npmjs.com/package/bibliojson)
[![npm downloads](https://img.shields.io/npm/dm/bibliojson.svg)](https://www.npmjs.com/package/bibliojson)
[![License: LGPL-3.0](https://img.shields.io/badge/License-LGPL%20v3-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0)

A JSON-based bibliography format with importers and exporters for BibLaTeX, BibTeX, CSL-JSON, RIS, ENW, EndNote XML, Citavi, DOCX citations, and ODT citations.

> **Note:** This package was previously published to npm as `biblatex-csl-converter`. The project has been renamed to `bibliojson`; please update your dependencies.

Try the demo [here](https://fiduswriter.github.io/bibliojson/).

## Supported Conversions

### Main formats

| From | To |
|------|----|
| BibLaTeX | BiblioJSON |
| CSL | BiblioJSON |
| BiblioJSON | CSL |
| BiblioJSON | BibLaTeX |

### Additional import formats

| From | To |
|------|----|
| EndNote | BiblioJSON |
| RIS | BiblioJSON |
| Citavi | BiblioJSON |
| DOCX native format | BiblioJSON |
| ODT native format | BiblioJSON |

We can even read the citation information from various citation managers inside ODT/DOCX files!

## The BiblioJSON format

BiblioJSON is the JSON-based bibliography format at the heart of this library. It is designed to preserve as much information as possible from source formats — especially BibLaTeX — so that data can be exported again to either BibLaTeX or CSL-JSON without loss.

### Why BiblioJSON instead of CSL-JSON?

CSL-JSON cannot represent everything that BibLaTeX can express. If we used CSL-JSON as the internal representation, details such as BibLaTeX-specific fields, name particles, or date granularity would be lost on round-trip. BiblioJSON keeps that information structured and accessible, so converting BibLaTeX → BiblioJSON → CSL, or CSL → BiblioJSON → BibLaTeX, stays as faithful as possible.

### Top-level structure: `BibDB`

A parsed bibliography is returned as a `BibDB` — a plain object whose keys are numeric entry IDs and whose values are `EntryObject`s:

```json
{
  "1": { /* EntryObject */ },
  "2": { /* EntryObject */ }
}
```

### `EntryObject`

Each entry has the following shape:

| Key | Type | Description |
|-----|------|-------------|
| `entry_key` | `string` | The citation key (e.g. `"doe2023"`). |
| `bib_type` | `string` | The BiblioJSON entry type (e.g. `"article-journal"`, `"book"`). |
| `fields` | `object` | The main, normalized fields for the entry. |
| `unexpected_fields` | `object` | Fields that are valid BibLaTeX fields but not expected for this entry type (only present when `processUnexpected` is enabled). |
| `unknown_fields` | `object` | Fields that are not part of the BibLaTeX spec (only present when `processUnknown` is enabled). |
| `raw_fields` | `object` | The almost-raw, pre-processed field contents from the source file. |
| `location` | `object` | Start/end offsets of the entry in the source text (only when `includeLocation` is enabled). |
| `raw_text` | `string` | The raw source text of the entry (only when `includeRawText` is enabled). |
| `incomplete` | `boolean` | Set when the parser could not fully parse the entry. |

### Field value types

Values inside `fields` are stored according to their semantic type so that exporters can render them correctly:

| BiblioJSON type | Used for | Example JSON value |
|-----------------|----------|--------------------|
| `f_literal` / `f_long_literal` | Plain text fields such as `abstract` or `note`. | `[{"type":"text","text":"..."}]` |
| `f_title` | Title fields (`title`, `booktitle`, `journaltitle`, …). Titles keep capitalization and markup. | `[{"type":"text","text":"The Title"}]` |
| `f_name` | Names (`author`, `editor`, `translator`, …). | `[{"family":[{"type":"text","text":"Doe"}],"given":[{"type":"text","text":"Jane"}]}]` |
| `f_date` | Dates (`date`, `origdate`, `urldate`, …) as EDTF strings. | `"2023-05"` |
| `f_key` | Controlled vocabulary (`langid`, `pagination`, `type`, …). | `"english"` |
| `f_integer` | Integer values (`edition`, `volume`, …). | `3` |
| `f_verbatim` | Values that should not be interpreted (`doi`, `isbn`, …). | `"10.1000/abc"` |
| `f_uri` | URI values (`url`, `eprint`, …). | `"https://example.org"` |

Rich text is represented as a `NodeArray` — an array of nodes. A plain text node looks like `{"type":"text","text":"..."}`. Nodes can also carry `marks` for formatting such as bold, italic, small-caps, superscript, or subscript, allowing markup to survive round-trips.

### Minimal example

```json
{
  "1": {
    "entry_key": "sample1",
    "bib_type": "article-journal",
    "fields": {
      "title": [{"type": "text", "text": "Sample title"}],
      "author": [
        {
          "family": [{"type": "text", "text": "Doe"}],
          "given": [{"type": "text", "text": "Jane"}]
        }
      ],
      "date": "2023",
      "journaltitle": [{"type": "text", "text": "Journal Name"}]
    }
  }
}
```

For the complete list of entry types and fields, see the TypeScript definitions in `src/const.ts` or the API documentation in **[API.md](API.md)**.

## Usage

```JavaScript
import {BibLatexParser} from "bibliojson"

// synchronous:
let parser = new BibLatexParser(input, {processUnexpected: true, processUnknown: true})
let bib = parser.parse()

// asynchronous:
let parser = new BibLatexParser(input, {processUnexpected: true, processUnknown: true})
parser.parseAsync().then((bib) => { ... })
```

## API Documentation

For comprehensive API documentation, see **[API.md](API.md)**.

## Extracting Citations from ODT and DOCX Files

See [CITATIONS_IN_DOCS.md](CITATIONS_IN_DOCS.md) for documentation on how Zotero, Mendeley, EndNote, Citavi, and JabRef store citations and bibliographies inside ODT and DOCX files.

## Note on quality of conversions

While writing this library, we have had a lot of experience converting between CSL and BibLaTeX and have also worked with the exports and imports generated by Zotero. This is open source/free software, making it easy to verify whether conversions are correct. Conversions involving these formats are therefore generally more reliable.

Other software, such as EndNote, Citavi, and Mendeley, is proprietary and closed source, making testing more difficult—especially without licenses for these products. We rely on publicly available documentation and ODT/DOCX test files produced by others to understand how these formats work and to test our conversions. If something is not converted correctly, please report it so we can improve the library; example files are welcome.

## FAQ

---

**Q:** Why do you use BiblioJSON instead of just the JSON format of CSL? Wouldn't that save you one conversion step?

**A:** Unfortunately, the CSL JSON format cannot hold all the information we import from BibLaTeX. If we used CSL JSON internally, we would lose information that we may want to export to BibLaTeX later on. BiblioJSON is designed to keep that information structured and lossless.

---

**Q:** Do you import all information from the imported BibTeX/BibLaTeX files?

**A:** We only keep the information found in any of the required or optional fields defined in the BibLaTeX documentation. Other fields are removed upon import.

---

**Q:** How do I see if there are errors when parsing the BibTeX/BibLaTeX file?

**A:** An array of errors encountered while parsing the file can be found at `parser.errors` after parsing. There is also `parser.warnings` for less serious issues.

---

**Q:** I need access to the raw/non-processed contents of certain fields. What do I do?

**A:** The fields in their almost raw form can be found under `entry.raw_fields[FIELD_NAME]`.

---

**Q:** What if I need to process fields that don't follow the BibLaTeX definition?

**A:** You can initialize the parser with a config object like this: `new BibLatexParser(inputString, {processUnexpected: true, processUnknown: {collaborator: 'l_name'}})`. The `processUnexpected` setting enables parsing of fields that are known but shouldn't appear in a bibliography entry due to its type. The `processUnknown` setting allows parsing of entirely unknown fields. You can set it to `true`, or to an object containing descriptions of how these unknown fields should be processed. If a field is not specified, it will be processed as a literal field (`f_literal`). These fields will be available under `entry.unexpected_fields[FIELD_NAME]` and `entry.unknown_fields[FIELD_NAME]`, respectively.

---

**Q:** I use variables in my BibLaTeX files. Will your converter read them?

**A:** Yes, but for the converter to create a string, the variables need to be defined. Undefined variables can also be handled by the BibLaTeX importer/exporter, but when exporting to CSL, they simply print out the variable name inside an HTML tag that is not supported by citeproc (and an error is thrown).

---

**Q:** I want to run the demo locally.

**A:** [http-server](https://www.npmjs.com/package/http-server) is handy. Do a global install of http-server with `npm install http-server -g` and run `http-server docs`.

---

**Q:** I want to include this on my website, and I don't use npm packages, etc. Is there a file I can just add to the header of my webpage?

**A:** Yes, you can download such a file [here](https://github.com/fiduswriter/bibliojson/tree/browser).

---

## Upgrading

### From 2.x to 3.x

Note that the `output` getter has been removed. Use `parse()` instead.

This applies to `BibLatexExporter`, `CSLExporter`, and `BibLatexParser`. Note that the output of `BibLatexParser` is structured differently when using the `parse()` function if you previously used the `output` getter.

In the case of `BibLatexExporter` and `CSLExporter`, instead of:

```JavaScript
const output = parser.output
```

Do:

```JavaScript
const output = parser.parse()
```

In the case of `BibLatexParser`, instead of:

```JavaScript
const output = parser.output
```

Do:

```JavaScript
const parsed = parser.parse()
const output = parsed.entries
```

### From 1.x to 2.x

Note that the API for the asynchronous parser has changed.

You need to change instances of this:

```JavaScript
let parser = new BibLatexParser(input, {processUnexpected: true, processUnknown: true, async: true})
parser.parse().then((bib) => { ... })
```

to:

```JavaScript
let parser = new BibLatexParser(input, {processUnexpected: true, processUnknown: true})
parser.parseAsync().then((bib) => { ... })
```
