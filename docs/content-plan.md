# Editorial plan — draft

Three flagship projects, with research and infrastructure grouped under Wydown.

## Content to collect before launch

| Section | Evidence and editorial decisions |
| --- | --- |
| Homepage | Approve headline, short introduction and palette; replace conceptual thumbnails with real images where possible. |
| FSAE | Identify individual contributions versus team work; choose steering CAD, geometry trade studies, design requirements and test methods; verify quantitative claims and distinguish simulations from measurements. |
| Vehicle dynamics | Select a geometry-neutral schematic, architecture diagram, analytical comparison plot and verification example. Include assumptions and distinguish analytical verification from physical correlation. |
| Wydown | Explain the relationship between the portfolio framework, microstructure experiments, credit research and real-time data acquisition; select approved benchmark results and research plots; separate research findings from live execution. |
| About | Review biography, experience, education, contact details and public résumé. Add links only once verified. |

Do not publish private raw data, secrets or unnecessary host/access details. Share technical methods and appropriate team engineering information without exposing data that teammates expect to remain private. Do not present illustrative figures as evidence.

## Later
Add technical notes only when there is substantive content. Add a Markdown notes collection, KaTeX and figure tooling when a first article needs them. No empty research or résumé routes at launch.

## Content expansion / review gate
The FSAE article and standalone steering FDR digest use the October 2026 WUFR-27 review and pinned public steering analysis documentation. The original team document is not copied into this public repository; use a reviewed static PDF, not a live Drive permission change. Place the approved file under public/documents/ and set the path in src/data/documents.ts. Verify figure rights, remove working comments and unrelated team information. The digest remains explicitly separate from the original. Wydown's updated article distinguishes recorder/research work from review-draft portfolio architecture. Before adding recorder benchmark metrics, confirm original reports and measurement definitions. ARB test results and individual contribution descriptions remain to be confirmed.

## PDF publishing
The user supplied the 93-page WUFR-27 FDR and one-page résumé. Upload the public résumé and supplied FDR to public/documents/jesse-koeppel-resume.pdf and public/documents/wufr-27-steering-fdr.pdf respectively. The WUFR-26 original can be added at public/documents/wufr-26-steering-fdr.pdf. The site detects these files at build time and shows inline/open/download options only when present. Do not publish private phone contact or raw restricted tire data. The 2027 original is a historical design record, not a release specification. WUFR-26 digest is based on the August 2025 review; résumé supplies scope, ARB measurements and recorder metrics. The 14% effort reduction is modeled, not measured. Box archive candidates: WUFR-26 complete steering assembly drawing, 998 geometry and 999 sim folders, April 11–12 testing notes, driver feedback, skidpad logs and October 2026 Formula WHEAT telemetry. Review actual test metadata before reporting handling conclusions.

The owner uploaded all three original PDFs. Their bytes are preserved and filenames normalized; the résumé upload is the original, including its phone contact line, not the previously prepared redacted variant. The PDF readers are required by CI and the files are checked for readable first pages and expected page counts where known.
