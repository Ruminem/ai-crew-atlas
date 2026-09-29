# Third-party notices

`site/` uses the following at build time only. None of their code ends up in the generated page (`atlas.html`); `node_modules/` is not committed.

| Package | Version | License | Source |
|---|---|---|---|
| marked | 18.0.14 | MIT (includes John Gruber's Markdown notice, BSD-3-Clause) | https://github.com/markedjs/marked |
| github-slugger | 2.0.0 | ISC | https://github.com/Flet/github-slugger |

The full license texts ship with each package in `node_modules/<package>/LICENSE`.

The page loads these fonts from Google Fonts at view time; they are not redistributed here.

| Font | License | Source |
|---|---|---|
| IBM Plex Sans KR | OFL-1.1 | https://github.com/google/fonts/tree/main/ofl/ibmplexsanskr |
| IBM Plex Mono | OFL-1.1 | https://github.com/google/fonts/tree/main/ofl/ibmplexmono |
| Hahmlet | OFL-1.1 | https://github.com/google/fonts/tree/main/ofl/hahmlet |

The GitHub Pages build (`dist/index.html`) loads this library from jsDelivr at view time to draw the diagrams; it is not redistributed here.

| Library | Version | License | Source |
|---|---|---|---|
| mermaid | 12.0.0 | MIT | https://github.com/mermaid-js/mermaid |
