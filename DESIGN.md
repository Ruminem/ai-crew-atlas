---
version: alpha
name: AI 도구 사전
description: 클로드와 이어 쓰는 AI·도구를 한 장에 모은 위키 꼴 사전 페이지의 모양
colors:
  bg: "#f4f5f8"
  surface: "#ffffff"
  surface-2: "#eceff4"
  ink: "#1a2031"
  muted: "#566074"
  faint: "#8790a2"
  line: "#dce1e9"
  accent: "#2a4fc4"
  accent-soft: "#e4eafb"
  note-bg: "#fff8e1"
  note-line: "#e3b341"
  head-bg: "rgba(244, 245, 248, .88)"
  scrim: "rgba(12, 16, 28, .42)"
  plate: "#fbfcfd"
  plate-line: "#dce1e9"
  bg-dark: "#0e1219"
  surface-dark: "#161b25"
  surface-2-dark: "#1e2431"
  ink-dark: "#e3e7ef"
  muted-dark: "#9aa4b6"
  faint-dark: "#6d788c"
  line-dark: "#2a3242"
  accent-dark: "#8fabff"
  accent-soft-dark: "#1d2842"
  note-bg-dark: "#2a2412"
  note-line-dark: "#9c7a22"
  head-bg-dark: "rgba(14, 18, 25, .86)"
  scrim-dark: "rgba(0, 0, 0, .55)"
  plate-dark: "#f3f5f8"
  plate-line-dark: "#3a4356"
typography:
  body:
    fontFamily: IBM Plex Sans KR
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.72
  body-read:
    fontFamily: Hahmlet
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.72
  h1:
    fontFamily: Hahmlet
    fontSize: 2.7rem
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.02em
  h2:
    fontFamily: Hahmlet
    fontSize: 1.5rem
    fontWeight: 700
    lineHeight: 1.35
    letterSpacing: -0.01em
  h3:
    fontFamily: IBM Plex Sans KR
    fontSize: 1.2rem
    fontWeight: 700
    lineHeight: 1.4
  h4:
    fontFamily: IBM Plex Sans KR
    fontSize: 1.02rem
    fontWeight: 600
    lineHeight: 1.45
  table:
    fontFamily: IBM Plex Sans KR
    fontSize: 0.9rem
    lineHeight: 1.55
  chip:
    fontFamily: IBM Plex Sans KR
    fontSize: 0.72rem
    fontWeight: 600
    lineHeight: 1
    letterSpacing: 0.02em
  mono:
    fontFamily: IBM Plex Mono
    fontSize: 0.78rem
    fontWeight: 500
    lineHeight: 1.55
rounded:
  xs: 4px
  code: 5px
  sm: 8px
  md: 10px
  lg: 12px
  sheet: 18px
  pill: 999px
spacing:
  gutter: 16px
  gutter-wide: 32px
  column-gap: 56px
  main-max: 820px
  page-max: 1180px
  toc-width: 272px
  read-max: 640px
  touch-min: 44px
components:
  page:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
  table-wrap:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.table}"
    rounded: "{rounded.lg}"
  code:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink}"
    rounded: "{rounded.code}"
  note:
    backgroundColor: "{colors.note-bg}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: 16px
  toc-link-current:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.accent}"
    rounded: "{rounded.sm}"
  pill-button:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    height: 32px
  diagram-plate:
    backgroundColor: "{colors.plate}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: 16px
  head-band:
    backgroundColor: "{colors.head-bg}"
    textColor: "{colors.ink}"
  hint:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.muted}"
  toc-number:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.faint}"
    typography: "{typography.mono}"
  page-dark:
    backgroundColor: "{colors.bg-dark}"
    textColor: "{colors.ink-dark}"
  table-wrap-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.ink-dark}"
  code-dark:
    backgroundColor: "{colors.surface-2-dark}"
    textColor: "{colors.ink-dark}"
  note-dark:
    backgroundColor: "{colors.note-bg-dark}"
    textColor: "{colors.ink-dark}"
  toc-link-current-dark:
    backgroundColor: "{colors.accent-soft-dark}"
    textColor: "{colors.accent-dark}"
  head-band-dark:
    backgroundColor: "{colors.head-bg-dark}"
    textColor: "{colors.ink-dark}"
  hint-dark:
    backgroundColor: "{colors.bg-dark}"
    textColor: "{colors.muted-dark}"
  toc-number-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.faint-dark}"
  diagram-plate-dark:
    backgroundColor: "{colors.plate-dark}"
    rounded: "{rounded.lg}"
---

## Overview

`TOOLS.md` 를 한 장으로 그린 위키 꼴 사전임. 조용한 회백 바탕에 흰 판을 얹고, 파랑 하나(`accent`)만 강조로 씀. 색이 많은 자리는 역할 칩과 관계도뿐이고 그 색은 역할을 가르는 데만 씀. 읽는 페이지라 장식보다 글이 먼저임.

이 파일은 모양의 원본임. 값은 `site/atlas.tpl.html` 의 `:root` 에도 적혀 있고, 빌드가 둘을 대조해 다르면 멈춤. 모양을 고칠 때는 여기부터 고치고 틀을 맞춤.

## Colors

- 밝은 화면이 기본임. 시스템·호스트의 다크 설정을 따라가지 않고 머리 띠 단추가 `data-atlas-theme="dark"` 를 붙일 때만 `-dark` 값으로 바뀜. DESIGN.md 형식에 다크 개념이 없어 같은 이름에 `-dark` 를 붙여 적음
- `ink`·`muted`·`faint` 는 글 세 단계임. `faint` 는 번호·꺾쇠 같은 곁 표시에만 쓰고 읽어야 할 글에는 안 씀 — 바탕과의 대비가 낮음
- `note-bg`·`note-line` 은 인용(주의) 상자의 바탕과 왼쪽 선임
- `plate`·`plate-line` 은 관계도 판임. 다크에서도 판은 밝게 둠 — 관계도 칸이 연한 바탕에 진한 글자라 어두운 판에 올리면 칸만 떠 보임
- `head-bg` 는 반투명 머리 띠, `scrim` 은 목차 서랍·그림 전체 화면 뒤를 덮는 막임
- 역할 칩 색(`claude` 주황 · `general` 파랑 · `research` 보라 · `collect` 청록 · `create` 분홍 · `publish` 노랑 · `record` 초록)은 관계도의 `classDef` 와 같은 값을 씀. 원본은 `TOOLS.md` 의 관계도임

## Typography

- 본문은 IBM Plex Sans KR 16px, 줄 높이 1.72. 480px 아래에서 15.5px
- `h1`·`h2` 와 목차 머리는 Hahmlet(명조)임. `h1` 은 `clamp(1.9rem, 1.3rem + 2.2vw, 2.7rem)` 이라 위 값은 상한임
- 번호·도장·코드는 IBM Plex Mono
- 읽기 모드(`data-atlas-read`)는 글꼴과 폭만 바꿈 — 본문이 Hahmlet 400 으로 640px 한 단이 되고, 코드·번호는 고정폭 그대로임
- 글꼴은 Google Fonts 에서 부름. 못 불러오면 각 OS 의 한글 글꼴로 내려감

## Layout

- 넓이 1100px 이 경계임. 넘으면 본문(최대 820px) 오른쪽에 272px 고정 목차, 안 넘으면 ☰ 서랍
- 양옆 여백은 16px 에 `env(safe-area-inset-*)` 를 더함. 떠 있는 단추도 같음
- 높이는 `vh` 뒤에 `dvh` 를 한 번 더 적음 — iOS 사파리·안드로이드 크롬의 주소창 때문임
- 칸이 셋 이상인 표는 640px 아래에서 행마다 카드가 됨. 칸 둘짜리 표는 표로 둠
- 머리 띠 오른쪽 도장은 두 줄이고 480px 아래에서 업데이트 줄의 연도를 숨김
- 손가락으로 누르는 것은 폰에서 44px 이상임

## Elevation & Depth

그림자는 하나만 씀(`--shadow`): 밝은 화면 `0 1px 2px rgba(18, 28, 56, .06), 0 10px 28px rgba(18, 28, 56, .12)`, 어두운 화면 `0 1px 2px rgba(0, 0, 0, .4), 0 10px 28px rgba(0, 0, 0, .45)`. 떠 있는 단추·목차 서랍·그림 전체 화면처럼 페이지 위에 뜨는 것에만 쓰고, 본문의 판은 선(`line`)으로만 가름.

## Shapes

- 판(표·관계도·카드)은 12px, 인용 상자는 10px(왼쪽은 선이라 0), 목차 줄은 8px, 코드는 5px
- 칩·알약 단추는 999px, 동그란 단추는 50%
- 폰 목차 서랍은 위 두 모서리만 18px

## Components

- **역할 칩** — 목차·도구 절 머리·`바뀐 것` 의 도구 라벨. 테두리 1px 에 역할 색
- **소제목 칩** — 도구 절 머리에서 같은 소제목 묶음을 한꺼번에 접고 폄(`build.mjs` 의 `TOPICS`)
- **목차** — 지금 읽는 절이 `accent-soft` 바탕으로 따라감. 머리에 모두 펼치기·접기
- **떠 있는 단추** — 폰에서 ☰·↑·↓. 관계도 확대 단추 줄은 이것에 안 덮이게 왼쪽에 둠
- **관계도** — 그림만 확대함(두 손가락·Ctrl+휠·두 번 누르기·단추). 상자는 `touch-action: pan-y`

## Do's and Don'ts

- hover 모양은 `@media (hover: hover)` 안에만 둠. 터치 기기는 탭한 뒤 hover 가 남음
- 강조색을 하나 더 만들지 않음. 새 역할이 생기면 관계도 `classDef` 에 색을 더하고 칩이 그것을 씀
- 다크 값을 `prefers-color-scheme` 에 걸지 않음. 사용자가 정한 것임
- 토큰 값을 바꾸면 `site/atlas.tpl.html` 의 `:root` 도 같은 커밋에서 바꿈. 안 바꾸면 빌드가 멈춤
