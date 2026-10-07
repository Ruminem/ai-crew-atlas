// SPDX-License-Identifier: Apache-2.0
// 스크립트로 그리는 가격표를 헤드리스 크롬으로 그려 스크린숏과 본문 앞부분을 남긴다. TLS 검증은 켠 채로 연다.
// 사용: node shot.mjs <주소> <png 경로>
import { createRequire } from 'module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const [url, out] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await b.newPage();
try {
  // networkidle 은 grok.com 처럼 연결을 계속 여는 페이지에서 끝나지 않는다
  const r = await p.goto(url, { waitUntil: 'load', timeout: 45000 });
  console.log('status', r && r.status());
  await p.waitForTimeout(6000);
  await p.screenshot({ path: out, fullPage: true });
  console.log('text', (await p.innerText('body')).slice(0, 300).replace(/\s+/g, ' '));
} catch (e) { console.log('ERR', e.message.split('\n')[0]); }
await b.close();
