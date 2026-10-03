# ai-crew-atlas

**English** · [한국어](#korean)

A dictionary of AI services and tools that fill the gaps around Claude — the things Claude can't do on its own, such as generating images and video, crawling whole sites, posting to social media, or running event-driven agents inside a notes app.

## What's in it
Everything lives in [`TOOLS.md`](TOOLS.md):
- **Diagrams** (Mermaid) — how each tool connects to Claude, which gap each tool fills, and an example "Claude + 5 tools = marketing team" workflow
- **At a glance** — one table with role, free/paid status, every paid tier, how it connects to Claude, and license
- **One entry per tool**, each with:
  - free/paid status, split into personal use, commercial/work use, and commercial use of generated output
  - price per tier (monthly and annual) and what each tier allows
  - what it does that Claude can't
  - license of the service and of the connector parts (MCP servers, plugins)
  - sources, each graded as official, vendor marketing, or third party

Current entries: Claude (the baseline), ChatGPT, Gemini, Grok, Perplexity, NotebookLM (now Gemini Notebook), Firecrawl, Higgsfield, Blotato, Notion, Obsidian, Jev.

## Web page
The same content as a single wiki-style page — numbered headings you can fold one by one, all at once (buttons in the table of contents) or by sub-heading across every tool, such as all twelve Sources at once (chips at the top of the Tools section), a table of contents that follows your scroll (on the right on wide screens, behind the ☰ button on phones), floating buttons to jump to the top or bottom, diagrams that fit the screen and zoom on their own (pinch, Ctrl+wheel or double-tap, without zooming the page) or open full screen, wide tables that turn into one card per row on phones, a dark mode switch in the header (off by default), a reading mode button next to it that hides the table of contents and floating buttons and sets the text in a serif face in one narrow column, like a book (remembered on that browser), and a change log at the top that the header's research date links to, tracking what changed in the researched plans, terms and features over time (only the latest date is unfolded): **https://ruminem.github.io/ai-crew-atlas/**. It is built from `TOOLS.md` by the code in [`site/`](site/) and redeployed to GitHub Pages on every push to `main`; to build it yourself, run `npm ci && npm run build` there and open `site/dist/index.html`.

## How far to trust it
Prices go stale fastest. Every entry carries the date it was last checked, and a cell that couldn't be verified says so instead of guessing. Many vendor pricing pages were unreachable from the research environment, so a lot of values come from search-result summaries — those sources are marked `(검색 요약)`. Check the official pricing page before you pay.

## Updating
The research and update rules are in [`CLAUDE.md`](CLAUDE.md) (Korean).

## License
The text is [CC BY 4.0](LICENSE); the page code in `site/` is [Apache-2.0](site/LICENSE). Product names belong to their owners; this project is not affiliated with any of them.

---

## Korean

[English](#ai-crew-atlas) · **한국어**

클로드 주변의 빈자리를 메우는 AI 서비스와 도구의 사전임. 이미지·영상 생성, 사이트 통째로 크롤, SNS 게시, 노트 앱 안에서 이벤트로 도는 에이전트처럼 클로드가 혼자서는 못 하는 일을 하는 것들을 모음.

### 무엇이 들어 있나
전부 [`TOOLS.md`](TOOLS.md) 에 있음.
- **관계도**(Mermaid) — 도구마다 클로드와 어떻게 잇는지, 어느 빈자리를 메우는지, 그리고 "클로드 + 5개 = 마케팅팀" 조합 예
- **한눈에 보기** — 역할 · 무료·유료 · 유료 요금 · 클로드와 잇는 법 · 라이선스를 표 하나로
- **도구마다 항목 하나**, 항목마다 들어 있는 것:
  - 무료·유료 여부 — 개인 이용, 상업·업무 이용, 생성물의 상업적 이용으로 나눠 적음
  - 등급별 요금(월·연 결제)과 그 등급에서 할 수 있는 것
  - 클로드로는 못 하는 것
  - 서비스 자체와 연결 부품(MCP 서버·플러그인)의 라이선스
  - 출처 — 공식 · 자사 홍보 · 제3자로 등급을 붙임

지금 있는 항목: Claude(기준선), ChatGPT, Gemini, Grok, Perplexity, NotebookLM(지금은 Gemini Notebook), Firecrawl, Higgsfield, Blotato, Notion, Obsidian, Jev.

### 웹 페이지
같은 내용을 위키처럼 한 장으로 본 것임 — 하나씩, 한꺼번에(목차의 단추), 또는 도구 12개의 출처를 한 번에 접듯 소제목별로(도구 절 맨 위의 칩) 접히는 번호 붙은 제목, 스크롤을 따라가는 목차(넓은 화면은 오른쪽, 휴대폰은 ☰ 단추 안), 맨 위·맨 아래로 가는 떠 있는 단추, 화면 폭에 맞춰 보이고 페이지가 아니라 그림만 커지는(두 손가락·Ctrl+휠·두 번 누르기) 관계도와 그 전체 화면 보기, 휴대폰에서는 행마다 카드로 바뀌는 넓은 표, 머리 띠의 다크 모드 단추(기본은 꺼짐), 그 옆에서 목차와 떠 있는 단추를 숨기고 본문을 명조 한 단으로 좁혀 책처럼 읽게 하는 읽기 모드 단추(그 브라우저에 기억됨), 머리 띠의 조사 날짜를 누르면 가는 맨 위의 바뀐 것 절(요금·약관·기능이 날짜별로 어떻게 바뀌었는지 따라가는 곳, 최신 날짜만 펼쳐 둠)이 있음: **https://ruminem.github.io/ai-crew-atlas/**. [`site/`](site/) 의 코드가 `TOOLS.md` 로 만들고, `main` 에 푸시할 때마다 GitHub Pages 에 다시 올림. 직접 만들려면 거기서 `npm ci && npm run build` 를 돌리고 `site/dist/index.html` 을 열면 됨.

### 어디까지 믿을 수 있나
요금이 제일 빨리 낡음. 항목마다 마지막으로 확인한 날짜가 있고, 확인하지 못한 칸은 추측으로 메우지 않고 그렇다고 적음. 조사 환경에서 여러 회사의 가격표 페이지가 막혀 검색 결과 요약으로 본 값이 많음 — 그런 출처에는 `(검색 요약)` 이 붙어 있음. 결제하기 전에 공식 가격표를 직접 볼 것.

### 갱신
조사·갱신 규칙은 [`CLAUDE.md`](CLAUDE.md) 에 있음.

### 라이선스
글은 [CC BY 4.0](LICENSE), `site/` 의 페이지 코드는 [Apache-2.0](site/LICENSE) 임. 제품 이름은 각 회사의 것이고, 이 프로젝트는 그 어느 회사와도 관계없음.
