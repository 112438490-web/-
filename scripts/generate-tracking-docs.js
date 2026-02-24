const fs = require('fs');
const path = require('path');

const reportPath = path.join('reports', 'playwright-report.json');
let raw = fs.readFileSync(reportPath, 'utf8');
raw = raw.replace(/^\uFEFF/, '');
const report = JSON.parse(raw);

const BASE_URL = 'http://47.97.84.212:3000';
const ASSIGNEE = '\u6b27\u9633\u7389\u5cf0';
const VERIFIER = '\u6b27\u9633\u7389\u5cf0';

function collectTests(suite, acc = []) {
  if (suite.specs) {
    for (const spec of suite.specs) {
      for (const test of spec.tests || []) {
        acc.push({
          title: spec.title || test.title || 'Untitled',
          results: test.results || [],
          annotations: test.annotations || []
        });
      }
    }
  }
  for (const s of suite.suites || []) collectTests(s, acc);
  return acc;
}

const tests = [];
for (const s of report.suites || []) collectTests(s, tests);

const titleMap = {
  'list page renders and columns are present': '\u5217\u8868\u9875\u5c55\u793a\u4e0e\u5b57\u6bb5\u6821\u9a8c',
  'default page size is 20': '\u9ed8\u8ba4\u6bcf\u987520\u6761',
  'filter by resolution method': '\u7b5b\u9009(\u89e3\u51b3\u65b9\u5f0f)',
  'filter by availability status': '\u7b5b\u9009(\u662f\u5426\u53ef\u7528)',
  'fuzzy search by problem type code': '\u7f16\u7801\u6a21\u7cca\u67e5\u8be2',
  'remark shows full text on hover': '\u5907\u6ce8\u60ac\u505c\u663e\u793a\u5168\u6587',
  'create problem type with manual code': '\u65b0\u589e\u95ee\u9898\u7c7b\u578b(\u624b\u52a8\u7f16\u7801)',
  'create problem type with auto-generated code': '\u65b0\u589e\u95ee\u9898\u7c7b\u578b(\u81ea\u52a8\u7f16\u7801)',
  'create validation: required fields': '\u5fc5\u586b\u6821\u9a8c(\u540d\u79f0\u3001\u89e3\u51b3\u65b9\u5f0f)',
  'create validation: duplicate code should fail': '\u91cd\u590d\u7f16\u7801\u6821\u9a8c',
  'copy problem type': '\u590d\u5236\u95ee\u9898\u7c7b\u578b',
  'search by name and code': '\u67e5\u8be2(\u540d\u79f0\u4e0e\u7f16\u7801)',
  'search with no results shows empty state': '\u67e5\u8be2\u65e0\u7ed3\u679c\u7a7a\u6001',
  'pagination and page size': '\u5206\u9875\u4e0e\u6bcf\u9875\u6761\u6570',
  'edit problem type remark in detail view': '\u8be6\u60c5\u7f16\u8f91\u5907\u6ce8',
  'toggle enable/disable': '\u542f\u7528/\u7981\u7528\u5207\u6362',
  'delete created problem types': '\u5220\u9664\u95ee\u9898\u7c7b\u578b',
  'create then refresh list page still shows record': '\u65b0\u589e\u540e\u5237\u65b0\u5217\u8868\u9875\u6570\u636e\u4ecd\u5b58\u5728',
  'create then refresh retains data': '\u65b0\u589e\u540e\u5237\u65b0\u67e5\u8be2\u4ecd\u5b58\u5728',
  'search by name and code combined': '\u67e5\u8be2(\u540d\u79f0+\u7f16\u7801\u7ec4\u5408)',
  'reset search restores list': '\u91cd\u7f6e\u67e5\u8be2\u6062\u590d\u5217\u8868',
  'edit remark persists after refresh': '\u7f16\u8f91\u5907\u6ce8\u5237\u65b0\u540e\u4fdd\u6301',
  'toggle enable/disable persists after refresh': '\u542f\u7528/\u7981\u7528\u5237\u65b0\u540e\u4fdd\u6301',
  'delete then refresh no longer shows record': '\u5220\u9664\u540e\u5237\u65b0\u4e0d\u518d\u663e\u793a'
};

const routeMap = {
  'list page renders and columns are present': '/problem-closed-loop-management/problem-type-management',
  'default page size is 20': '/problem-closed-loop-management/problem-type-management',
  'filter by resolution method': '/problem-closed-loop-management/problem-type-management',
  'filter by availability status': '/problem-closed-loop-management/problem-type-management',
  'fuzzy search by problem type code': '/problem-closed-loop-management/problem-type-management/create -> /problem-closed-loop-management/problem-type-management',
  'remark shows full text on hover': '/problem-closed-loop-management/problem-type-management/create -> /problem-closed-loop-management/problem-type-management',
  'create problem type with manual code': '/problem-closed-loop-management/problem-type-management',
  'create problem type with auto-generated code': '/problem-closed-loop-management/problem-type-management',
  'create validation: required fields': '/problem-closed-loop-management/problem-type-management',
  'create validation: duplicate code should fail': '/problem-closed-loop-management/problem-type-management',
  'copy problem type': '/problem-closed-loop-management/problem-type-management',
  'search by name and code': '/problem-closed-loop-management/problem-type-management',
  'search with no results shows empty state': '/problem-closed-loop-management/problem-type-management',
  'pagination and page size': '/problem-closed-loop-management/problem-type-management',
  'edit problem type remark in detail view': '/problem-closed-loop-management/problem-type-management',
  'toggle enable/disable': '/problem-closed-loop-management/problem-type-management',
  'delete created problem types': '/problem-closed-loop-management/problem-type-management',
  'create then refresh list page still shows record': '/problem-closed-loop-management/problem-type-management',
  'create then refresh retains data': '/problem-closed-loop-management/problem-type-management',
  'search by name and code combined': '/problem-closed-loop-management/problem-type-management',
  'reset search restores list': '/problem-closed-loop-management/problem-type-management',
  'edit remark persists after refresh': '/problem-closed-loop-management/problem-type-management',
  'toggle enable/disable persists after refresh': '/problem-closed-loop-management/problem-type-management',
  'delete then refresh no longer shows record': '/problem-closed-loop-management/problem-type-management'
};

const stepMap = {
  'filter by availability status':
    '\u8fdb\u5165\u5217\u8868\u9875\u2192\u9009\u62e9\u662f\u5426\u53ef\u7528=\u662f\u2192\u67e5\u8be2\u2192\u68c0\u67e5\u5217\u8868\u5f00\u5173\u72b6\u6001',
  'fuzzy search by problem type code':
    '\u65b0\u589e\u4e00\u6761\u7f16\u7801\u6570\u636e\u2192\u8fd4\u56de\u5217\u8868\u2192\u8f93\u5165\u7f16\u7801\u524d\u7f00\u2192\u67e5\u8be2\u2192\u5224\u65ad\u662f\u5426\u80fd\u641c\u51fa',
  'remark shows full text on hover':
    '\u65b0\u589e\u5e26\u957f\u5907\u6ce8\u6570\u636e\u2192\u5217\u8868\u67e5\u8be2\u2192\u5907\u6ce8\u5217\u60ac\u505c\u2192\u663e\u793a\u5168\u6587',
  'delete then refresh no longer shows record':
    '\u5217\u8868\u5220\u9664\u6570\u636e\u2192\u5237\u65b0\u9875\u9762\u2192\u67e5\u8be2\u786e\u8ba4\u4e0d\u5b58\u5728',
  'edit remark persists after refresh':
    '\u8be6\u60c5\u9875\u7f16\u8f91\u5907\u6ce8\u2192\u4fdd\u5b58\u2192\u8fd4\u56de\u5217\u8868\u2192\u5237\u65b0\u2192\u518d\u6b21\u67e5\u770b\u5907\u6ce8',
  'toggle enable/disable persists after refresh':
    '\u542f\u7528/\u7981\u7528\u5207\u6362\u2192\u5237\u65b0\u9875\u9762\u2192\u6821\u9a8c\u72b6\u6001\u4fdd\u6301',
  'create then refresh list page still shows record':
    '\u65b0\u589e\u6570\u636e\u2192\u8fd4\u56de\u5217\u8868\u2192\u5237\u65b0\u9875\u9762\u2192\u67e5\u8be2\u65b0\u589e\u6570\u636e',
  'create then refresh retains data':
    '\u65b0\u589e\u6570\u636e\u2192\u67e5\u8be2\u786e\u8ba4\u5b58\u5728\u2192\u5237\u65b0\u9875\u9762\u2192\u518d\u6b21\u67e5\u8be2'
};

const expectedMap = {
  'filter by availability status': '\u5217\u8868\u5f00\u5173\u72b6\u6001\u5e94\u4e3a\u5f00\u542f(\u662f/\u542f\u7528)',
  'fuzzy search by problem type code': '\u7528\u7f16\u7801\u524d\u7f00\u67e5\u8be2\u80fd\u641c\u51fa\u65b0\u589e\u6570\u636e',
  'remark shows full text on hover': '\u5907\u6ce8\u5168\u6587\u80fd\u901a\u8fc7\u60ac\u505c\u663e\u793a',
  'delete then refresh no longer shows record': '\u5220\u9664\u540e\u5237\u65b0\u4e0d\u5e94\u518d\u51fa\u73b0',
  'edit remark persists after refresh': '\u5907\u6ce8\u7f16\u8f91\u540e\u5237\u65b0\u4fdd\u6301',
  'toggle enable/disable persists after refresh': '\u542f\u7528/\u7981\u7528\u5207\u6362\u540e\u5237\u65b0\u4fdd\u6301\u65b0\u72b6\u6001',
  'create then refresh list page still shows record': '\u65b0\u589e\u6570\u636e\u5237\u65b0\u540e\u4ecd\u5b58\u5728',
  'create then refresh retains data': '\u65b0\u589e\u6570\u636e\u5237\u65b0\u540e\u4ecd\u53ef\u67e5\u8be2'
};

const severityMap = {
  'create then refresh list page still shows record': '\u9ad8',
  'create then refresh retains data': '\u9ad8',
  'delete then refresh no longer shows record': '\u9ad8'
};

const priorityMap = {
  high: 'P1',
  medium: 'P2',
  low: 'P3'
};

const stripAnsi = (value) => {
  if (!value) return '';
  return String(value).replace(/\u001b\[[0-9;]*m/g, '');
};

const decodeUnicodeEscapes = (value) => {
  if (!value) return value;
  return String(value).replace(/\\u([0-9a-fA-F]{4})/g, (match, hex) =>
    String.fromCharCode(parseInt(hex, 16))
  );
};

const normalizeError = (value) => {
  if (!value) return '';
  const noAnsi = stripAnsi(value);
  return noAnsi.replace(/[\u0000-\u001F\u007F]/g, '');
};

const toChineseErrorSummary = (value) => {
  if (!value) return '';
  let line = String(value).split('\n')[0] || '';
  line = line.replace(/^Error:\s*/i, '\u9519\u8bef\uff1a');
  line = line.replace(/^TimeoutError:\s*/i, '\u8d85\u65f6\u9519\u8bef\uff1a');
  line = line.replace(/locator\.fill/gi, '\u5143\u7d20\u8f93\u5165');
  line = line.replace(/locator\.waitFor/gi, '\u5143\u7d20\u7b49\u5f85');
  line = line.replace(/toBeVisible/gi, '\u53ef\u89c1\u65ad\u8a00');
  line = line.replace(/toContainText/gi, '\u5305\u542b\u6587\u672c\u65ad\u8a00');
  line = line.replace(/not\.toBe/gi, '\u4e0d\u7b49\u65ad\u8a00');
  line = line.replace(/expect/gi, '\u65ad\u8a00');
  line = line.replace(/Timeout\s+(\d+)ms\s+exceeded/gi, '\u8d85\u65f6($1ms)');
  line = line.replace(/\bfailed\b/gi, '\u5931\u8d25');
  return line;
};

const extractExpectedReceived = (value) => {
  if (!value) return { expected: '', received: '' };
  const lines = String(value).split('\n');
  let expected = '';
  let received = '';
  for (const line of lines) {
    const expMatch = line.match(/Expected:\s*(.*)/i);
    if (expMatch && !expected) expected = expMatch[1].trim();
    const recMatch = line.match(/Received:\s*(.*)/i);
    if (recMatch && !received) received = recMatch[1].trim();
  }
  return { expected, received };
};

const countScreenshots = (attachments) => {
  let count = 0;
  for (const p of attachments || []) {
    try {
      const dir = path.dirname(p);
      const files = fs.readdirSync(dir);
      for (const f of files) {
        const lower = f.toLowerCase();
        if (lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.jpeg')) count += 1;
      }
    } catch (err) {
      // ignore
    }
  }
  return count;
};

function lastResult(results) {
  if (!results || !results.length) return null;
  return results[results.length - 1];
}

const rows = tests.map((t, idx) => {
  const r = lastResult(t.results) || {};
  const attachments = (r.attachments || []).map((a) => a.path).filter(Boolean);
  const error = normalizeError(r.error && r.error.message ? r.error.message : '');
  const expected = extractExpectedReceived(error).expected;
  const received = extractExpectedReceived(error).received;
  return {
    id: `TC-PTM-${String(idx + 1).padStart(3, '0')}`,
    title: t.title,
    cnTitle: titleMap[t.title] || t.title,
    status: r.status || 'unknown',
    isKnownIssue: (t.annotations || []).some((a) => a.type === 'fail'),
    error,
    expected,
    received,
    route: routeMap[t.title] || '/problem-closed-loop-management/problem-type-management',
    steps: stepMap[t.title] || '\u8bf7\u6309\u7528\u4f8b\u6b65\u9aa4\u64cd\u4f5c',
    shotCount: countScreenshots(attachments)
  };
});

const failedRows = rows.filter((r) => r.status && r.status !== 'passed');

const today = new Date();
const reportDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
  today.getDate()
).padStart(2, '0')}`;
const reportFile = `reports/\\u81ea\\u52a8\\u5316\\u6d4b\\u8bd5\\u62a5\\u544a_\\u95ee\\u9898\\u7c7b\\u578b\\u7ba1\\u7406_${reportDate}.html`;

const bugIdByCase = {};
failedRows.forEach((r, index) => {
  bugIdByCase[r.id] = `BUG-PTM-${String(index + 1).padStart(3, '0')}`;
});

const defectHeader = `# \\u7f3a\\u9677\\u8ddf\\u8e2a - \\u95ee\\u9898\\u7c7b\\u578b\\u7ba1\\u7406 - ${reportDate}

## \\u57fa\\u672c\\u4fe1\\u606f
- \\u6d4b\\u8bd5\\u73af\\u5883: ${BASE_URL}
- \\u8d26\\u53f7: admin / 111111
- \\u4ea7\\u7269\\u62a5\\u544a: ${reportFile}

## \\u7f3a\\u9677\\u8ddf\\u8e2a\\u8868(\\u5305\\u542b\\u6240\\u6709\\u7528\\u4f8b)
| \\u7528\\u4f8bID | \\u7528\\u4f8b\\u540d\\u79f0 | \\u6267\\u884c\\u7ed3\\u679c | \\u7f3a\\u9677ID | \\u7f3a\\u9677\\u72b6\\u6001 | \\u4e25\\u91cd\\u7ea7\\u522b | \\u4f18\\u5148\\u7ea7 | \\u8def\\u5f84/\\u9875\\u9762 | \\u64cd\\u4f5c\\u6b65\\u9aa4 | \\u671f\\u671b | \\u5b9e\\u9645(\\u9519\\u8bef\\u6458\\u8981) | \\u8bc1\\u636e | \\u6307\\u6d3e\\u4eba | \\u9a8c\\u8bc1\\u4eba |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
`;

const defectBody = rows
  .map((r) => {
    const route = r.route
      .split('->')
      .map((p) => p.trim())
      .filter(Boolean)
      .map((p) => `${BASE_URL}${p.startsWith('/') ? p : `/${p}`}`)
      .join(' -> ');
    const result =
      r.status === 'passed' ? '\u901a\u8fc7' : r.isKnownIssue ? '\u5df2\u77e5\u7f3a\u9677' : '\u5931\u8d25';
    const bugId = bugIdByCase[r.id] || '-';
    const defectStatus = bugId === '-' ? '-' : r.isKnownIssue ? '\u5df2\u77e5\u7f3a\u9677' : 'Open';
    const severity = bugId === '-' ? '-' : severityMap[r.title] || '\u4e2d';
    const priority = bugId === '-' ? '-' : severity === '\u9ad8' ? priorityMap.high : priorityMap.medium;
    const expected = bugId === '-' ? '' : expectedMap[r.title] || r.expected || '\u89c1\u7528\u4f8b\u63cf\u8ff0';
    const actual = bugId === '-' ? '' : toChineseErrorSummary(r.error || '');
    const evidence =
      bugId === '-' ? '' : `\\u62a5\\u544a\\u5185\\u5d4c\\u622a\\u56fe(${r.shotCount}\\u5f20) + ${reportFile}`;
    return `| ${r.id} | ${r.cnTitle} | ${result} | ${bugId} | ${defectStatus} | ${severity} | ${priority} | ${route} | ${r.steps} | ${expected} | ${actual} | ${evidence} | ${ASSIGNEE} | ${VERIFIER} |`;
  })
  .join('\n');

const defectDoc = decodeUnicodeEscapes(`${defectHeader}${defectBody}\n`);

const defectPath = path.join('reports', `\u7f3a\u9677\u8ddf\u8e2a_\u95ee\u9898\u7c7b\u578b\u7ba1\u7406_${reportDate}.md`);

fs.writeFileSync(defectPath, defectDoc, 'utf8');

console.log(defectPath);
