// SPDX-License-Identifier: Apache-2.0
// TOOLS.md 를 위키 꼴 웹 페이지 한 장으로 만든다 — 아티팩트용 조각 site/atlas.html 과 Pages 용 문서 site/dist/index.html. 사용: npm run build
// 제목 번호·목차·접기 틀은 여기서 다 만들어 두고, 페이지의 스크립트는 스크롤·접기·이동만 한다.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';
import GithubSlugger from 'github-slugger';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');
const REPO_BLOB = 'https://github.com/Ruminem/ai-crew-atlas/blob/main/';
const md = fs.readFileSync(path.join(root, 'TOOLS.md'), 'utf8');
const tpl = fs.readFileSync(path.join(here, 'atlas.tpl.html'), 'utf8');
// CHANGELOG.md 는 목차 바로 뒤, 첫 절(`읽는 법`) 앞에 `바뀐 것` 절로 끼운다 — 가장 자주 보는 절이다.
// 파일의 # 제목을 ## 절로, 날짜 ## 를 ### 로 한 단계씩 내린다
const CHANGES_ID = '바뀐-것';
const changelog = fs.readFileSync(path.join(root, 'CHANGELOG.md'), 'utf8');
if (!/^# 바뀐 것\n/.test(changelog)) throw new Error('CHANGELOG.md 첫 줄이 "# 바뀐 것" 이 아님');
const FIRST = '\n## 읽는 법\n';
if (!md.includes(FIRST)) throw new Error('TOOLS.md 에 "## 읽는 법" 절이 없음');
const at = md.indexOf(FIRST);
const src = `${md.slice(0, at)}\n\n${changelog.trimEnd().replace(/^(#{1,3}) /gm, '#$1 ')}\n${md.slice(at)}`;

const ROLE_CLASS = { 기준선: 'claude', 범용: 'general', 조사: 'research', 수집: 'collect', 제작: 'create', 게시: 'publish', 기록: 'record', 판정: 'judge' };

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// GitHub 가 앵커를 만들 때 보는 글자만 남긴다 (scratchpad 의 check_anchors 와 같은 규칙)
const plain = (s) => s.replace(/`([^`]*)`/g, '$1').replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');

function expect(name, got, want) {
  if (got !== want) throw new Error(`${name}: ${want}개를 기대했는데 ${got}개`);
}

// 역할은 TOOLS.md 목차의 "  - 조사: [Perplexity](#perplexity) · …" 줄에서 앵커 단위로 읽는다
const roleOf = {};
for (const m of md.matchAll(/^ {2}- (\S+): (.+)$/gm)) {
  if (!ROLE_CLASS[m[1]]) continue;
  for (const a of m[2].matchAll(/\]\(#([^)]+)\)/g)) roleOf[a[1]] = m[1];
}
expect('목차에서 읽은 도구', Object.keys(roleOf).length, 12);

const icon = (d) => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg>`;
const DG_TOOLS = '<div class="dg-tools">' +
  `<button type="button" class="dg-btn" data-dg="out" aria-label="그림 축소" disabled>${icon('M5 12h14')}</button>` +
  `<button type="button" class="dg-btn" data-dg="in" aria-label="그림 확대">${icon('M12 5v14M5 12h14')}</button>` +
  `<button type="button" class="dg-btn" data-dg="full" aria-label="그림 전체 화면으로 보기">${icon('M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5')}</button>` +
  '<span class="dg-hint">두 손가락이나 Ctrl+휠로 확대 · 두 번 누르면 확대·되돌림</span></div>';

let diagrams = 0;
marked.use({
  renderer: {
    code(tok) {
      if (tok.lang !== 'mermaid') return false;
      diagrams++;
      // 그림은 페이지를 띄우는 쪽이 <pre class="mermaid"> 를 보고 그린다. 확대·전체 화면은 틀의 스크립트가 한다
      return `<div class="dg"><div class="diagram"><pre class="mermaid">${esc(tok.text)}</pre></div>${DG_TOOLS}</div>\n`;
    },
  },
});

const tokens = marked.lexer(src);
const slugger = new GithubSlugger();
const counters = [0, 0, 0, 0, 0];
const toc = [];
const out = [];
const open = [];
let buf = [];
let inChanges = false;
let changeDates = 0;

const flush = () => {
  if (!buf.length) return;
  out.push(marked.parser(Object.assign(buf, { links: tokens.links })));
  buf = [];
};

for (const tok of tokens) {
  if (tok.type !== 'heading' || tok.depth > 4) { buf.push(tok); continue; }
  flush();
  const d = tok.depth;
  while (open.length && open.at(-1) >= d) { out.push('</div></section>\n'); open.pop(); }
  const id = slugger.slug(plain(tok.text));
  const inner = marked.parseInline(tok.text);
  if (d === 1) { out.push(`<h1 id="${id}">${inner}</h1>\n`); continue; }

  let num = '';
  if (id !== '목차') {
    counters[d]++;
    for (let i = d + 1; i < counters.length; i++) counters[i] = 0;
    num = counters.slice(2, d + 1).join('.') + '.';
    toc.push({ depth: d, id, num, label: esc(plain(tok.text)) });
  }
  // 바뀐 것은 맨 위라 다 펼치면 첫 화면부터 여러 장이다(2026-10-04 폰에서 4,725px). 최신 날짜만 펼치고 나머지는 접는다
  if (d === 2) inChanges = id === CHANGES_ID;
  const fold = inChanges && d === 3 && changeDates++ > 0;
  const role = d === 3 && roleOf[id];
  const chip = role ? ` <span class="chip r-${ROLE_CLASS[role]}">${role}</span>` : '';
  const numLink = num ? `<a class="num" href="#목차" title="목차로">${num}</a> ` : '';
  // 제목 안에 링크가 있으면 버튼 안에 링크가 들어가 잘못된 HTML 이 된다
  if (inner.includes('<a ')) throw new Error(`제목에 링크가 있음: ${tok.text}`);
  out.push(
    `<section class="s s${d}${id === '목차' ? ' s-toc' : ''}${fold ? ' folded' : ''}">` +
    `<h${d} id="${id}">${numLink}<button type="button" class="ht" aria-expanded="${!fold}">${inner}</button>${chip}</h${d}>` +
    `<div class="sb">\n`,
  );
  open.push(d);
}
flush();
while (open.length) { out.push('</div></section>\n'); open.pop(); }
expect('관계도', diagrams, 3);
expect('바뀐 것 절', toc.filter((t) => t.id === CHANGES_ID).length, 1);
if (toc[0].id !== CHANGES_ID) throw new Error(`첫 번호 절이 바뀐 것이 아니라 ${toc[0].id}`);
expect('바뀐 것의 날짜 절', changeDates, (changelog.match(/^## /gm) ?? []).length);

let html = out.join('');

// 링크: 앵커는 사람이 읽는 글자로 되돌리고, 밖으로 나가는 것은 새 탭, 저장소 안 파일은 GitHub 로
html = html.replace(/<a href="([^"]*)"/g, (_, href) => {
  // TOOLS.md 목차의 CHANGELOG.md 링크는 GitHub 에서는 파일로, 페이지에서는 그 절로 간다
  if (href === 'CHANGELOG.md') return `<a href="#${CHANGES_ID}"`;
  if (href.startsWith('#')) return `<a href="#${decodeURIComponent(href.slice(1))}"`;
  if (/^https?:/.test(href)) return `<a href="${href}" target="_blank" rel="noopener"`;
  return `<a href="${REPO_BLOB}${href}" target="_blank" rel="noopener"`;
});

// 절 머리의 "↑ 목차" 한 줄은 제목 번호가 같은 일을 하므로 뺀다. 도구 항목의 단추 줄은 남긴다
const solo = '<p><a href="#목차"><kbd>↑ 목차</kbd></a></p>\n';
expect('절 머리 ↑ 목차 줄', html.split(solo).length - 1, 4);
html = html.split(solo).join('');
const navHead = '<p><a href="#목차"><kbd>↑ 목차</kbd></a> ';
expect('도구 단추 줄', html.split(navHead).length - 1, 12);
html = html.split(navHead).join('<p class="navrow"><a href="#목차"><kbd>↑ 목차</kbd></a> ');

// GitHub 화면을 두고 쓴 안내 문장을 이 페이지의 쓰는 법으로 바꾼다
const hint = /<p>각 항목 제목 아래의 단추로[\s\S]*?<\/p>/;
if (!hint.test(html)) throw new Error('목차 아래 안내 문장을 못 찾음');
html = html.replace(hint, '<p class="hint">제목 앞 번호를 누르면 이 목차로 돌아오고, 제목을 누르면 그 절이 접히고 펴짐. 넓은 화면은 오른쪽, 좁은 화면은 오른쪽 아래 <b>☰</b> 단추에 전체 목차가 있음.</p>');

// 칸이 셋 이상인 표(.cards)는 좁은 화면에서 행마다 카드로 그린다. 칸마다 머리글을 data-label 로 달고,
// 값은 한 겹 감싸 굵은 글씨·링크가 격자 칸으로 흩어지지 않게 한다. display 를 바꾸면 표 의미가 빠지므로 role 로 되살린다
let cardTables = 0;
html = html.replace(/<table>([\s\S]*?)<\/table>/g, (_, body) => {
  const heads = [...body.matchAll(/<th>([\s\S]*?)<\/th>/g)].map((m) => m[1].replace(/<[^>]+>/g, '').trim());
  if (heads.length < 3) return `<div class="table-wrap"><table>${body}</table></div>`;
  cardTables++;
  let col = 0;
  body = body.replace(/<tr>|<th>|<td>([\s\S]*?)<\/td>/g, (m, cell) => {
    if (m === '<tr>') { col = 0; return '<tr role="row">'; }
    if (m === '<th>') return '<th role="columnheader">';
    // 머리글은 marked 가 이미 escape 해 두었다
    if (col >= heads.length) throw new Error(`표 칸이 머리글(${heads.length})보다 많음: ${heads.join(' | ')}`);
    return `<td role="cell" data-label="${heads[col++]}"><div class="cv">${cell}</div></td>`;
  });
  return `<div class="table-wrap cards"><table role="table">${body}</table></div>`;
});

function tocHtml(items) {
  let h = '';
  const stack = [];
  for (const it of items) {
    while (stack.length && stack.at(-1) > it.depth) { h += '</li></ul>'; stack.pop(); }
    if (stack.length && stack.at(-1) === it.depth) h += '</li>';
    else { h += '<ul>'; stack.push(it.depth); }
    h += `<li class="t${it.depth}"><a href="#${it.id}"><span class="tn">${it.num}</span><span>${it.label}</span></a>`;
  }
  while (stack.length) { h += '</li></ul>'; stack.pop(); }
  return h;
}

const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
// 조사 날짜는 한눈에 보기 표의 확인한 날짜 중 가장 최근 것이다. 오타만 고친 커밋이 조사 날짜를 끌어올리지 않게 커밋 날짜를 쓰지 않는다
const checked = [...md.matchAll(/^\| \[.+\| (\d{4}-\d{2}-\d{2}) \|$/gm)].map((m) => m[1]);
expect('한눈에 보기의 확인한 날짜', checked.length, 12);
// 한눈에 보기의 유료 요금 칸은 항목 요금 표를 옮긴 것이다. 칸의 금액이 그 항목 어디에도 없으면 한쪽만 고친 것이다
// 금액이 항목에 '있는지' 만 본다 — 등급과 짝이 맞는지는 못 본다
const money = (s) => s.match(/\$\d[\d,]*(?:\.\d+)?/g) ?? [];
const sections = md.slice(md.indexOf('\n## 도구\n')).split(/\n(?=### )/).slice(1);
const priced = [...md.matchAll(/^\| \[([^\]]+)\]\(#[^)]+\) \|[^|]*\|[^|]*\| ([^|]*) \|/gm)];
expect('한눈에 보기의 유료 요금 칸', priced.length, 12);
for (const [, name, cell] of priced) {
  const sec = sections.find((s) => s.startsWith(`### ${name}`));
  if (!sec) throw new Error(`한눈에 보기의 ${name} 에 맞는 항목이 없음`);
  const have = new Set(money(sec.slice(sec.indexOf('\n'))));
  const lost = money(cell).filter((m) => !have.has(m));
  if (lost.length) throw new Error(`한눈에 보기의 ${name} 요금 ${lost.join(' ')} 이 항목에 없음`);
}
const stamp = `조사 ${checked.sort().at(-1)}`;
// 업데이트 시각·해시는 페이지를 바꾸는 파일의 마지막 커밋이다. 빌드 시각을 쓰면 같은 입력에서도 산출물이 달라진다
const PAGE_SRC = ['TOOLS.md', 'CHANGELOG.md', 'site'];
const [pagedIso, pagedSha] = git('log', '-1', '--format=%cI %h', '--', ...PAGE_SRC).split(' ');
const pagedAt = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul', dateStyle: 'short', timeStyle: 'short' }).format(new Date(pagedIso));
const paged = `업데이트 ${pagedAt} · ${pagedSha}${git('status', '--porcelain', '--', ...PAGE_SRC) ? ' · 커밋 안 된 수정 있음' : ''}`;

const fill = (s, key, val) => {
  if (!s.includes(key)) throw new Error(`틀에 ${key} 가 없음`);
  return s.split(key).join(val);
};
let page = tpl;
page = fill(page, '<!--CONTENT-->', html);
page = fill(page, '<!--TOC-->', tocHtml(toc));
page = fill(page, '<!--STAMP-->', esc(stamp));
// 폰 머리 띠에서는 연도를 숨겨야 한 줄에 들어간다(390 폭에서 28px 넘침). 연도는 조사 줄에도 있다
page = fill(page, '<!--PAGED-->', esc(paged).replace(/ (\d{4}-)/, ' <span class="yr">$1</span>'));
page = page.replace(/<!-- 틀:[\s\S]*?-->\n/, '<!-- 자동 생성: site 에서 npm run build 로 다시 만들 것. 고칠 때는 atlas.tpl.html 이나 ../TOOLS.md 를 고친다 -->\n');

fs.writeFileSync(path.join(here, 'atlas.html'), page);
console.log(`atlas.html · 제목 ${toc.length}개 · 관계도 ${diagrams}개 · 카드 표 ${cardTables}개 · ${(page.length / 1024).toFixed(0)}KB · ${stamp} · ${paged}`);

// GitHub Pages 판(dist/index.html). 아티팩트는 문서 뼈대와 mermaid 를 호스트가 대 주지만
// Pages 는 맨 파일이라 뼈대를 두르고 mermaid 를 CDN 에서 부른다. 저장소에 싣지 않으므로
// mermaid 가 딸고 오는 elkjs(EPL-2.0) 같은 것을 재배포하지 않는다. 판을 올릴 때는 이 줄만 고친다
const MERMAID = 'https://cdn.jsdelivr.net/npm/mermaid@12.0.0/dist/mermaid.esm.min.mjs';
const cut = page.indexOf('</style>\n');
if (cut < 0) throw new Error('틀에서 </style> 을 못 찾음');
const doc = `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
${page.slice(0, cut)}</style>
</head>
<body>
${page.slice(cut + '</style>\n'.length)}<script type="module">
// 절은 처음에 다 펴져 있어 그림 크기가 제대로 잡힌다. 못 불러오면 관계도 코드가 글자로 남는다
import mermaid from '${MERMAID}';
mermaid.initialize({ startOnLoad: false, securityLevel: 'strict' });
await mermaid.run({ querySelector: 'pre.mermaid' });
</script>
</body>
</html>
`;
fs.mkdirSync(path.join(here, 'dist'), { recursive: true });
fs.writeFileSync(path.join(here, 'dist', 'index.html'), doc);
console.log(`dist/index.html · ${(doc.length / 1024).toFixed(0)}KB`);
