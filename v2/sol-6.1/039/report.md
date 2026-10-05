# 039 — Letter Valley

Goal: let an embedded XML score control individual greeting glyph positions.
Candidates: XML valley; History API page fold; native range-control optical lens.
Selected parsed coordinate records; unlike 004's continuous textPath baseline,
each glyph receives independently validated XML coordinates.
Mechanism Signature: XML parse/serialize -> glyph records -> SVG letter valley.
Design Signature: monospace; lime/charcoal; descending/rising letters; phosphor;
static.

DOMParser reads the standalone embedded score as XML; XMLSerializer and a second
parse test round-trip preservation, including the literal word space. Eleven
records become native SVG text nodes. Errors are explicit; neither external XML
nor copied assets exist. Acceptance checks round-trip subject, exact node count
and matching SVG coordinates. First dependency check rejected a literal SVG
namespace URI; using the existing element's namespaceURI avoids duplicating
that constant. Second verify OK: eleven records and preserved "Hello World".
Opened screenshot.png: left-to-right reading identifies both words, with a
deliberate valley and wider gap between them; no glyph is clipped.
Limits: individual
positions intentionally sacrifice normal baseline reading; semantic clarity
requires actual image review, not merely the node/coordinate assertions.
