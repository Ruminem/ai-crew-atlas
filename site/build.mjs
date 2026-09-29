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

const ROLE_CLASS = { 기준선: 'claude', 범용: 'general', 조사: 'research', 수집: 'collect', 제작: 'create', 게시: 'publish', 기록: 'record' };

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
expect('목차에서 읽은 도구', Object.keys(roleOf).length, 10);

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

const tokens = marked.lexer(md);
const slugger = new GithubSlugger();
const counters = [0, 0, 0, 0, 0];
const toc = [];
const out = [];
const open = [];
let buf = [];

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
  const role = d === 3 && roleOf[id];
  const chip = role ? ` <span class="chip r-${ROLE_CLASS[role]}">${role}</span>` : '';
  const numLink = num ? `<a class="num" href="#목차" title="목차로">${num}</a> ` : '';
  // 제목 안에 링크가 있으면 버튼 안에 링크가 들어가 잘못된 HTML 이 된다
  if (inner.includes('<a ')) throw new Error(`제목에 링크가 있음: ${tok.text}`);
  out.push(
    `<section class="s s${d}${id === '목차' ? ' s-toc' : ''}">` +
    `<h${d} id="${id}">${numLink}<button type="button" class="ht" aria-expanded="true">${inner}</button>${chip}</h${d}>` +
    `<div class="sb">\n`,
  );
  open.push(d);
}
flush();
while (open.length) { out.push('</div></section>\n'); open.pop(); }
expect('관계도', diagrams, 3);

let html = out.join('');

// 링크: 앵커는 사람이 읽는 글자로 되돌리고, 밖으로 나가는 것은 새 탭, 저장소 안 파일은 GitHub 로
html = html.replace(/<a href="([^"]*)"/g, (_, href) => {
  if (href.startsWith('#')) return `<a href="#${decodeURIComponent(href.slice(1))}"`;
  if (/^https?:/.test(href)) return `<a href="${href}" target="_blank" rel="noopener"`;
  return `<a href="${REPO_BLOB}${href}" target="_blank" rel="noopener"`;
});

// 절 머리의 "↑ 목차" 한 줄은 제목 번호가 같은 일을 하므로 뺀다. 도구 항목의 단추 줄은 남긴다
const solo = '<p><a href="#목차"><kbd>↑ 목차</kbd></a></p>\n';
expect('절 머리 ↑ 목차 줄', html.split(solo).length - 1, 4);
html = html.split(solo).join('');
const navHead = '<p><a href="#목차"><kbd>↑ 목차</kbd></a> ';
expect('도구 단추 줄', html.split(navHead).length - 1, 10);
html = html.split(navHead).join('<p class="navrow"><a href="#목차"><kbd>↑ 목차</kbd></a> ');

// GitHub 화면을 두고 쓴 안내 문장을 이 페이지의 쓰는 법으로 바꾼다
const hint = /<p>각 항목 제목 아래의 단추로[\s\S]*?<\/p>/;
if (!hint.test(html)) throw new Error('목차 아래 안내 문장을 못 찾음');
html = html.replace(hint, '<p class="hint">제목 앞 번호를 누르면 이 목차로 돌아오고, 제목을 누르면 그 절이 접히고 펴짐. 넓은 화면은 오른쪽, 좁은 화면은 오른쪽 아래 <b>☰</b> 단추에 전체 목차가 있음.</p>');

html = html
  .replace(/<table>/g, '<div class="table-wrap"><table>')
  .replace(/<\/table>/g, '</table></div>');

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
const [date, sha] = git('log', '-1', '--format=%cs %h', '--', 'TOOLS.md').split(' ');
const dirty = git('status', '--porcelain', '--', 'TOOLS.md') ? ' · 커밋 안 된 수정 있음' : '';
const stamp = `TOOLS.md ${date} · ${sha}${dirty}`;

const fill = (s, key, val) => {
  if (!s.includes(key)) throw new Error(`틀에 ${key} 가 없음`);
  return s.split(key).join(val);
};
let page = tpl;
page = fill(page, '<!--CONTENT-->', html);
page = fill(page, '<!--TOC-->', tocHtml(toc));
page = fill(page, '<!--STAMP-->', esc(stamp));
page = page.replace(/<!-- 틀:[\s\S]*?-->\n/, '<!-- 자동 생성: site 에서 npm run build 로 다시 만들 것. 고칠 때는 atlas.tpl.html 이나 ../TOOLS.md 를 고친다 -->\n');

fs.writeFileSync(path.join(here, 'atlas.html'), page);
console.log(`atlas.html · 제목 ${toc.length}개 · 관계도 ${diagrams}개 · ${(page.length / 1024).toFixed(0)}KB · ${stamp}`);

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
