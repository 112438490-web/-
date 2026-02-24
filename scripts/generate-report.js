const fs = require('fs');
const path = require('path');

const reportPath = path.join('reports', 'playwright-report.json');
let raw = fs.readFileSync(reportPath, 'utf8');
raw = raw.replace(/^\uFEFF/, '');
const report = JSON.parse(raw);
const BASE_URL = 'http://47.97.84.212:3000';

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

const toChineseTitle = (title) => titleMap[title] || title;

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
  'list page renders and columns are present':
    '\u8fdb\u5165\u95ee\u9898\u7c7b\u578b\u7ba1\u7406\u5217\u8868\u9875\u2192\u68c0\u67e5\u5217\u8868\u5b57\u6bb5(\u7f16\u7801/\u540d\u79f0/\u89e3\u51b3\u65b9\u5f0f)',
  'default page size is 20':
    '\u8fdb\u5165\u5217\u8868\u9875\u2192\u68c0\u67e5\u5206\u9875\u7ec4\u4ef6\u9ed8\u8ba4\u6bcf\u987520\u6761',
  'filter by resolution method':
    '\u8fdb\u5165\u5217\u8868\u9875\u2192\u9009\u62e9\u89e3\u51b3\u65b9\u5f0f=8D\u2192\u67e5\u8be2\u2192\u6821\u9a8c\u7ed3\u679c\u524d\u51e0\u6761\u5747\u4e3a8D',
  'filter by availability status':
    '\u8fdb\u5165\u5217\u8868\u9875\u2192\u9009\u62e9\u662f\u5426\u53ef\u7528=\u662f\u2192\u67e5\u8be2\u2192\u6821\u9a8c\u5217\u8868\u5f00\u5173\u5747\u4e3a\u5f00\u542f',
  'fuzzy search by problem type code':
    '\u65b0\u589e\u4e00\u6761\u7f16\u7801QTxxxxx\u6570\u636e\u2192\u8fd4\u56de\u5217\u8868\u2192\u8f93\u5165\u7f16\u7801\u524d\u7f00\u2192\u67e5\u8be2\u2192\u7ed3\u679c\u5305\u542b\u65b0\u6570\u636e',
  'remark shows full text on hover':
    '\u65b0\u589e\u5e26\u957f\u5907\u6ce8\u6570\u636e\u2192\u5217\u8868\u67e5\u8be2\u2192\u5907\u6ce8\u5217\u60ac\u505c\u2192\u663e\u793a\u5168\u6587',
  'create problem type with manual code':
    '\u5217\u8868\u9875\u70b9\u51fb\u65b0\u589e\u2192\u8f93\u5165\u7f16\u7801/\u540d\u79f0/\u89e3\u51b3\u65b9\u5f0f\u2192\u4fdd\u5b58\u2192\u8fd4\u56de\u5217\u8868\u67e5\u8be2',
  'create problem type with auto-generated code':
    '\u5217\u8868\u9875\u70b9\u51fb\u65b0\u589e\u2192\u4ec5\u586b\u540d\u79f0/\u89e3\u51b3\u65b9\u5f0f\u2192\u4fdd\u5b58\u2192\u7f16\u7801\u81ea\u52a8\u751f\u6210\u2192\u8fd4\u56de\u5217\u8868\u67e5\u8be2',
  'create validation: required fields':
    '\u65b0\u589e\u9875\u4e0d\u586b\u5fc5\u586b\u9879\u2192\u4fdd\u5b58/\u5931\u7126\u89e6\u53d1\u5fc5\u586b\u63d0\u793a',
  'create validation: duplicate code should fail':
    '\u65b0\u589e\u9875\u8f93\u5165\u5df2\u5b58\u5728\u7f16\u7801\u2192\u4fdd\u5b58\u2192\u63d0\u793a\u7f16\u7801\u91cd\u590d\u6216\u4fdd\u5b58\u5931\u8d25',
  'copy problem type':
    '\u5217\u8868\u9875\u9009\u4e2d\u4e00\u6761\u6570\u636e\u2192\u70b9\u51fb\u590d\u5236\u2192\u8f93\u5165\u65b0\u540d\u79f0\u2192\u4fdd\u5b58\u2192\u8fd4\u56de\u5217\u8868',
  'search by name and code':
    '\u65b0\u589e\u4e00\u6761\u6570\u636e\u2192\u5148\u6309\u540d\u79f0\u67e5\u8be2\u2192\u518d\u6309\u7f16\u7801\u67e5\u8be2',
  'search by name and code combined':
    '\u4f7f\u7528\u5217\u8868\u6700\u540e\u4e00\u6761\u6570\u636e\u7684\u540d\u79f0+\u7f16\u7801\u2192\u67e5\u8be2',
  'reset search restores list':
    '\u8f93\u5165\u4e0d\u5b58\u5728\u540d\u79f0\u67e5\u8be2\u2192\u7ed3\u679c\u7a7a\u5bf9\u8c61\u2192\u70b9\u51fb\u91cd\u7f6e/\u6e05\u7a7a\u2192\u5217\u8868\u6062\u590d',
  'search with no results shows empty state':
    '\u8f93\u5165\u4e0d\u5b58\u5728\u540d\u79f0\u2192\u67e5\u8be2\u2192\u663e\u793a\u7a7a\u72b6\u6001',
  'pagination and page size':
    '\u9009\u62e9\u6bcf\u9875\u6761\u6570=200\u2192\u5217\u8868\u5b9e\u9645\u884c\u6570\u5c0f\u4e8e\u7b49\u4e8e200',
  'edit problem type remark in detail view':
    '\u5217\u8868\u9875\u8fdb\u5165\u8be6\u60c5\u2192\u7f16\u8f91\u5907\u6ce8\u2192\u4fdd\u5b58\u2192\u8fd4\u56de\u5217\u8868',
  'toggle enable/disable':
    '\u5217\u8868\u9875\u70b9\u51fb\u542f\u7528/\u7981\u7528\u5f00\u5173\u2192\u89c2\u5bdf\u72b6\u6001\u7ffb\u8f6c',
  'delete created problem types':
    '\u5217\u8868\u9875\u5220\u9664\u6700\u540e\u4e24\u6761\u6570\u636e\u2192\u786e\u8ba4\u5220\u9664',
  'create then refresh list page still shows record':
    '\u65b0\u589e\u6570\u636e\u2192\u8fd4\u56de\u5217\u8868\u2192\u5237\u65b0\u9875\u9762\u2192\u67e5\u8be2\u65b0\u589e\u6570\u636e',
  'create then refresh retains data':
    '\u65b0\u589e\u6570\u636e\u2192\u67e5\u8be2\u786e\u8ba4\u5b58\u5728\u2192\u5237\u65b0\u9875\u9762\u2192\u518d\u6b21\u67e5\u8be2',
  'edit remark persists after refresh':
    '\u8be6\u60c5\u9875\u7f16\u8f91\u5907\u6ce8\u2192\u4fdd\u5b58\u2192\u8fd4\u56de\u5217\u8868\u2192\u5237\u65b0\u2192\u518d\u6b21\u67e5\u770b\u5907\u6ce8',
  'toggle enable/disable persists after refresh':
    '\u542f\u7528/\u7981\u7528\u5207\u6362\u2192\u5237\u65b0\u9875\u9762\u2192\u6821\u9a8c\u72b6\u6001\u4fdd\u6301',
  'delete then refresh no longer shows record':
    '\u5220\u9664\u4e00\u6761\u6570\u636e\u2192\u5237\u65b0\u9875\u9762\u2192\u6309\u540d\u79f0/\u7f16\u7801\u67e5\u8be2\u4e0d\u5e94\u5b58\u5728'
};

const dataMap = {
  'list page renders and columns are present': '\u65e0',
  'default page size is 20': '\u65e0',
  'filter by resolution method': '\u89e3\u51b3\u65b9\u5f0f=8D',
  'filter by availability status': '\u662f\u5426\u53ef\u7528=\u662f',
  'fuzzy search by problem type code': '\u7f16\u7801\u524d\u7f00\u67e5\u8be2(QTxxxxx)',
  'remark shows full text on hover': '\u5907\u6ce8=\u957f\u6587\u672c',
  'create problem type with manual code':
    '\u7f16\u7801=QT\u968f\u673a5\u4f4d\uff0c\u540d\u79f0=\u81ea\u52a8\u5316\u95ee\u9898\u7c7b\u578b-\u968f\u673a\uff0c\u89e3\u51b3\u65b9\u5f0f=8D',
  'create problem type with auto-generated code':
    '\u540d\u79f0=\u81ea\u52a8\u5316\u81ea\u52a8\u7f16\u7801-\u968f\u673a\uff0c\u7f16\u7801=\u81ea\u52a8\u751f\u6210\uff0c\u89e3\u51b3\u65b9\u5f0f=\u7cbe\u76ca',
  'create validation: required fields': '\u672a\u586b\u95ee\u9898\u7c7b\u578b\u540d\u79f0/\u89e3\u51b3\u65b9\u5f0f',
  'create validation: duplicate code should fail': '\u7f16\u7801=\u5df2\u5b58\u5728\u7f16\u7801',
  'copy problem type': '\u65b0\u540d\u79f0=\u81ea\u52a8\u5316\u590d\u5236-\u968f\u673a',
  'search by name and code': '\u540d\u79f0/\u7f16\u7801=\u81ea\u52a8\u5316\u67e5\u8be2-\u968f\u673a',
  'search by name and code combined': '\u6765\u6e90=\u5217\u8868\u6700\u540e\u4e00\u6761\u5df2\u6709\u6570\u636e',
  'reset search restores list': '\u67e5\u8be2\u540d\u79f0=\u4e0d\u5b58\u5728-\u968f\u673a',
  'search with no results shows empty state': '\u67e5\u8be2\u540d\u79f0=\u4e0d\u5b58\u5728-\u968f\u673a',
  'pagination and page size': '\u6bcf\u9875\u6761\u6570=200',
  'edit problem type remark in detail view': '\u5907\u6ce8=\u81ea\u52a8\u5316\u5907\u6ce8-\u968f\u673a',
  'toggle enable/disable': '\u5217\u8868\u6700\u540e\u4e00\u6761\u6570\u636e',
  'delete created problem types': '\u5220\u9664\u5217\u8868\u6700\u540e\u4e24\u6761\u6570\u636e',
  'create then refresh list page still shows record': '\u540d\u79f0=\u81ea\u52a8\u5316\u5237\u65b0\u5217\u8868-\u968f\u673a',
  'create then refresh retains data': '\u540d\u79f0=\u81ea\u52a8\u5316\u5237\u65b0\u6821\u9a8c-\u968f\u673a',
  'edit remark persists after refresh': '\u5907\u6ce8=\u5237\u65b0\u5907\u6ce8-\u968f\u673a',
  'toggle enable/disable persists after refresh': '\u5217\u8868\u6700\u540e\u4e00\u6761\u6570\u636e',
  'delete then refresh no longer shows record': '\u5217\u8868\u6700\u540e\u4e00\u6761\u6570\u636e'
};

const findScreenshots = (paths) => {
  const shotPaths = [];
  const seen = new Set();
  for (const p of paths) {
    if (!p) continue;
    const dir = path.dirname(p);
    if (seen.has(dir)) continue;
    seen.add(dir);
    try {
      const files = fs.readdirSync(dir);
      for (const f of files) {
        const lower = f.toLowerCase();
        if (lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.jpeg')) {
          shotPaths.push(path.join(dir, f));
        }
      }
    } catch (err) {
      // ignore missing dirs
    }
  }
  return shotPaths;
};

const toFileUrl = (p) => {
  const normalized = p.replace(/\\/g, '/');
  return `file:///${encodeURI(normalized)}`;
};

const toImageSrc = (p) => {
  if (!p) return '';
  try {
    const ext = path.extname(p).toLowerCase();
    const mime =
      ext === '.png'
        ? 'image/png'
        : ext === '.jpg' || ext === '.jpeg'
        ? 'image/jpeg'
        : ext === '.gif'
        ? 'image/gif'
        : 'application/octet-stream';
    const buffer = fs.readFileSync(p);
    const base64 = buffer.toString('base64');
    return `data:${mime};base64,${base64}`;
  } catch (err) {
    return toFileUrl(p);
  }
};

const escapeHtml = (value) => {
  if (!value) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

const renderRouteLinks = (routeText) => {
  if (!routeText) return '-';
  const parts = String(routeText)
    .split('->')
    .map((p) => p.trim())
    .filter(Boolean);
  if (!parts.length) return escapeHtml(routeText);
  return parts
    .map((p) => {
      const href = `${BASE_URL}${p.startsWith('/') ? p : `/${p}`}`;
      return `<a href="${escapeHtml(href)}" target="_blank" rel="noreferrer">${escapeHtml(p)}</a>`;
    })
    .join(' \u2192 ');
};

const stripAnsi = (value) => {
  if (!value) return '';
  return String(value).replace(/\u001b\[[0-9;]*m/g, '');
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
  line = line.replace(/\bExpected:/gi, '\u671f\u671b:');
  line = line.replace(/\bReceived:/gi, '\u5b9e\u9645:');
  return line;
};

const extractExpectedReceived = (value) => {
  if (!value) return { expected: '', received: '' };
  const lines = String(value).split('\n');
  let expected = '';
  let received = '';
  for (const line of lines) {
    const expMatch = line.match(/Expected:\s*(.*)/i);
    if (expMatch && !expected) {
      expected = expMatch[1].trim();
    }
    const recMatch = line.match(/Received:\s*(.*)/i);
    if (recMatch && !received) {
      received = recMatch[1].trim();
    }
  }
  return { expected, received };
};

const findArtifacts = (paths, exts) => {
  const found = [];
  const seen = new Set();
  for (const p of paths) {
    if (!p) continue;
    const dir = path.dirname(p);
    if (seen.has(dir)) continue;
    seen.add(dir);
    try {
      const files = fs.readdirSync(dir);
      for (const f of files) {
        const lower = f.toLowerCase();
        if (exts.some((ext) => lower.endsWith(ext))) {
          found.push(path.join(dir, f));
        }
      }
    } catch (err) {
      // ignore missing dirs
    }
  }
  return found;
};

function lastResult(results) {
  if (!results || !results.length) return null;
  return results[results.length - 1];
}

const rows = tests.map((t, idx) => {
  const r = lastResult(t.results);
  const status = r?.status || 'unknown';
  const durationMs = r?.duration || 0;
  const startTime = r?.startTime ? new Date(r.startTime) : null;
  const endTime = startTime ? new Date(startTime.getTime() + durationMs) : null;
  const attachments = (r?.attachments || []).map((a) => a.path).filter(Boolean);
  const screenshots = findScreenshots(attachments);
  const traces = findArtifacts(attachments, ['.zip', '.trace']);
  const videos = findArtifacts(attachments, ['.webm', '.mp4']);
  const isKnownIssue = (t.annotations || []).some((a) => a.type === 'fail');
  const error = normalizeError(r?.error?.message || '');
  const expectation = extractExpectedReceived(r?.error?.message || '');
  return {
    id: `TC-PTM-${String(idx + 1).padStart(3, '0')}`,
    rawTitle: t.title,
    title: toChineseTitle(t.title),
    status,
    durationMs,
    startTime,
    endTime,
    attachments,
    screenshots,
    traces,
    videos,
    isKnownIssue,
    error,
    expected: expectation.expected,
    received: expectation.received,
    route: routeMap[t.title] || '/problem-closed-loop-management/problem-type-management',
    steps:
      stepMap[t.title] ||
      `\u8fdb\u5165\u95ee\u9898\u7c7b\u578b\u7ba1\u7406\u9875\u9762\u2192\u6267\u884c\u300c${toChineseTitle(
        t.title
      )}\u300d\u6240\u63cf\u8ff0\u64cd\u4f5c\u2192\u89c2\u5bdf\u7ed3\u679c`,
    data: dataMap[t.title] || '\u81ea\u52a8\u5316\u968f\u673a\u6570\u636e'
  };
});

const totals = rows.reduce(
  (acc, r) => {
    acc.total += 1;
    if (r.status === 'passed') acc.passed += 1;
    else if (r.status === 'failed' || r.status === 'timedOut') acc.failed += 1;
    else if (r.status === 'skipped' && r.isKnownIssue) acc.failed += 1;
    else acc.skipped += 1;
    acc.durationMs += r.durationMs || 0;
    if (r.startTime && (!acc.startTime || r.startTime < acc.startTime)) acc.startTime = r.startTime;
    if (r.endTime && (!acc.endTime || r.endTime > acc.endTime)) acc.endTime = r.endTime;
    return acc;
  },
  { total: 0, passed: 0, failed: 0, skipped: 0, durationMs: 0, startTime: null, endTime: null }
);

const formatMs = (ms) => {
  const sec = Math.round(ms / 1000);
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  const parts = [];
  if (h) parts.push(`${h}h`);
  if (m) parts.push(`${m}m`);
  parts.push(`${s}s`);
  return parts.join(' ');
};

const formatDateTime = (d) => {
  if (!d) return '-';
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(
    d.getMinutes()
  )}:${pad(d.getSeconds())}`;
};

const today = new Date();
const reportDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
  today.getDate()
).padStart(2, '0')}`;
const conclusion = totals.failed > 0 ? '\u5931\u8d25' : '\u901a\u8fc7';

const cn = {
  title: '\u81ea\u52a8\u5316\u6d4b\u8bd5\u62a5\u544a - \u95ee\u9898\u7c7b\u578b\u7ba1\u7406',
  subtitle: '\u95ee\u9898\u95ed\u73af\u7ba1\u7406 / SPT-\u95ee\u9898\u7c7b\u578b\u7ba1\u7406',
  execDate: '\u6267\u884c\u65e5\u671f',
  total: '\u7528\u4f8b\u603b\u6570',
  result: '\u901a\u8fc7 / \u5931\u8d25 / \u672a\u6267\u884c',
  conclusion: '\u7ed3\u8bba',
  info: '\u6267\u884c\u4fe1\u606f',
  url: '\u6d4b\u8bd5\u5730\u5740',
  account: '\u6267\u884c\u8d26\u53f7',
  tool: '\u5de5\u5177',
  start: '\u5f00\u59cb\u65f6\u95f4',
  end: '\u7ed3\u675f\u65f6\u95f4',
  duration: '\u603b\u8017\u65f6',
  detail: '\u7528\u4f8b\u660e\u7ec6',
  id: '\u7528\u4f8b\u7f16\u53f7',
  name: '\u7528\u4f8b\u540d\u79f0',
  status: '\u7ed3\u679c',
  time: '\u8017\u65f6',
  startTime: '\u5f00\u59cb\u65f6\u95f4',
  shot: '\u622a\u56fe',
  passed: '\u901a\u8fc7',
  failed: '\u5931\u8d25',
  skipped: '\u672a\u6267\u884c',
  attachment: '\u9644\u4ef6\u4e0e\u8def\u5f84',
  native: '\u539f\u751f\u62a5\u544a',
  artifacts: '\u4ea7\u7269\u76ee\u5f55',
  devTipsTitle: '\u5f00\u53d1\u5b9a\u4f4d\u8981\u70b9',
  devTipsLead:
    '\u8bf7\u7ed3\u5408\u4ee5\u4e0b\u4fe1\u606f\u5feb\u901f\u5b9a\u4f4d\uff1a\u7528\u4f8b\u7f16\u53f7/\u540d\u79f0\u3001\u95ee\u9898\u8def\u5f84\u3001\u590d\u73b0\u6b65\u9aa4\u3001\u6570\u636e\u6761\u4ef6\u3001\u671f\u671b vs \u5b9e\u9645\uff0c\u4ee5\u53ca\u622a\u56fe/Trace/\u89c6\u9891\u8bc1\u636e\u3002',
  devTableTitle: '\u5f00\u53d1\u5b9a\u4f4d\u4fe1\u606f(\u5931\u8d25\u7528\u4f8b)',
  devRoute: '\u8def\u5f84/\u9875\u9762',
  devSteps: '\u590d\u73b0\u6b65\u9aa4',
  devData: '\u6d4b\u8bd5\u6570\u636e',
  devExpect: '\u671f\u671b vs \u5b9e\u9645',
  devError: '\u9519\u8bef\u6458\u8981',
  devEvidence: '\u8bc1\u636e',
  note:
    '\u5907\u6ce8\uff1a\u5f53\u524d\u8fd0\u884c\u672a\u751f\u6210\u622a\u56fe(\u4ec5\u5931\u8d25\u65f6\u751f\u6210)\uff0c\u5982\u9700\u5168\u91cf\u622a\u56fe\u53ef\u5f00\u542f screenshot: "on" \u91cd\u65b0\u6267\u884c\u3002'
};

const html = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${cn.title}</title>
  <style>
    :root {
      --bg: #f5f7fb;
      --card: #ffffff;
      --text: #111827;
      --muted: #6b7280;
      --primary: #2563eb;
      --success: #16a34a;
      --danger: #dc2626;
      --warning: #d97706;
      --border: #e5e7eb;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: "Segoe UI", "PingFang SC", "Microsoft YaHei", Arial, sans-serif;
      color: var(--text);
      background: radial-gradient(circle at 20% 20%, #eef2ff, #f5f7fb 40%);
    }
    .container { max-width: 1200px; margin: 24px auto 64px; padding: 0 20px; }
    .header {
      background: linear-gradient(135deg, #1e3a8a, #2563eb);
      color: #fff;
      border-radius: 16px;
      padding: 24px 28px;
      box-shadow: 0 12px 30px rgba(37, 99, 235, 0.25);
    }
    .title { font-size: 26px; font-weight: 700; margin-bottom: 6px; }
    .subtitle { opacity: 0.9; }
    .grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-top: 18px;
    }
    .card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 16px;
      box-shadow: 0 6px 16px rgba(15, 23, 42, 0.04);
    }
    .card h3 { font-size: 13px; color: var(--muted); margin: 0 0 8px; }
    .card .value { font-size: 24px; font-weight: 700; }
    .pill {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 600;
      color: #fff;
      background: ${totals.failed ? 'var(--danger)' : 'var(--success)'};
    }
    .section { margin-top: 26px; }
    .section h2 { font-size: 18px; margin: 0 0 12px; }
    table {
      width: 100%;
      border-collapse: collapse;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 12px;
      overflow: hidden;
    }
    th, td {
      text-align: left;
      padding: 12px 10px;
      border-bottom: 1px solid var(--border);
      vertical-align: top;
    }
    th { background: #f3f4f6; font-weight: 600; }
    tr:last-child td { border-bottom: none; }
    .muted { color: var(--muted); }
    .status-pass { color: var(--success); font-weight: 600; }
    .status-fail { color: var(--danger); font-weight: 600; }
    .status-skip { color: var(--warning); font-weight: 600; }
    .footer { margin-top: 18px; color: var(--muted); font-size: 12px; }
    .shot {
      display: inline-block;
      max-width: 180px;
      max-height: 120px;
      margin: 4px 6px 4px 0;
      border-radius: 8px;
      border: 1px solid var(--border);
      object-fit: cover;
      background: #fff;
      cursor: zoom-in;
    }
    #img-modal {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.75);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    }
    #img-modal.show { display: flex; }
    #img-modal img {
      max-width: 92vw;
      max-height: 92vh;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.4);
      background: #fff;
    }
    #img-modal .hint {
      position: absolute;
      top: 16px;
      right: 20px;
      color: #fff;
      font-size: 12px;
      opacity: 0.8;
    }
    @media (max-width: 980px) { .grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 640px) { .grid { grid-template-columns: 1fr; } .title { font-size: 20px; } }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="title">${cn.title}</div>
      <div class="subtitle">${cn.subtitle}</div>
    </div>

    <div class="grid">
      <div class="card"><h3>${cn.execDate}</h3><div class="value">${reportDate}</div></div>
      <div class="card"><h3>${cn.total}</h3><div class="value">${totals.total}</div></div>
      <div class="card"><h3>${cn.result}</h3><div class="value">${totals.passed} / ${totals.failed} / ${totals.skipped}</div></div>
      <div class="card"><h3>${cn.conclusion}</h3><div class="value"><span class="pill">${conclusion}</span></div></div>
    </div>

    <div class="section">
      <h2>${cn.info}</h2>
      <table>
        <tbody>
          <tr><th>${cn.url}</th><td>http://47.97.84.212:3000/</td></tr>
          <tr><th>${cn.account}</th><td>admin / 111111</td></tr>
          <tr><th>${cn.tool}</th><td>Playwright (\u65e0\u5934)</td></tr>
          <tr><th>${cn.start}</th><td>${formatDateTime(totals.startTime)}</td></tr>
          <tr><th>${cn.end}</th><td>${formatDateTime(totals.endTime)}</td></tr>
          <tr><th>${cn.duration}</th><td>${formatMs(totals.durationMs)} (\u7d2f\u8ba1\u7528\u4f8b\u8017\u65f6)</td></tr>
        </tbody>
      </table>
    </div>

    <div class="section">
      <h2>${cn.detail}</h2>
      <table>
        <thead>
          <tr>
            <th>${cn.id}</th>
            <th>${cn.name}</th>
            <th>${cn.status}</th>
            <th>${cn.time}</th>
            <th>${cn.startTime}</th>
            <th>${cn.shot}</th>
          </tr>
        </thead>
        <tbody>
          ${rows
            .map((r) => {
              const statusLabel =
                r.status === 'passed'
                  ? cn.passed
                  : r.status === 'failed' || r.status === 'timedOut'
                  ? cn.failed
                  : r.isKnownIssue
                  ? '\u5df2\u77e5\u7f3a\u9677'
                  : cn.skipped;
              const statusClass =
                r.status === 'passed'
                  ? 'status-pass'
                  : r.status === 'failed' || r.status === 'timedOut'
                  ? 'status-fail'
                  : r.isKnownIssue
                  ? 'status-fail'
                  : 'status-skip';
              const shots = r.screenshots.length
                ? r.screenshots
                    .map((p) => `<img class="shot zoomable" src="${toImageSrc(p)}" data-full="${toImageSrc(p)}" alt="screenshot" />`)
                    .join('')
                : '\u65e0(\u4ec5\u5931\u8d25\u622a\u56fe)';
              return `
            <tr>
              <td>${r.id}</td>
              <td>${r.title}</td>
              <td class="${statusClass}">${statusLabel}</td>
              <td>${formatMs(r.durationMs)}</td>
              <td>${formatDateTime(r.startTime)}</td>
              <td class="muted">${shots}</td>
            </tr>`;
            })
            .join('')}
        </tbody>
      </table>
    </div>

    ${rows.some((r) => r.status === 'failed' || r.status === 'timedOut' || (r.status === 'skipped' && r.isKnownIssue))
      ? `<div class="section">
      <h2>${cn.devTipsTitle}</h2>
      <div class="card">${cn.devTipsLead}</div>
      <h2 style="margin-top:16px;">${cn.devTableTitle}</h2>
      <table>
        <thead>
          <tr>
            <th>${cn.id}</th>
            <th>${cn.name}</th>
            <th>${cn.devRoute}</th>
            <th>${cn.devSteps}</th>
            <th>${cn.devData}</th>
            <th>${cn.devExpect}</th>
            <th>${cn.devError}</th>
            <th>${cn.devEvidence}</th>
          </tr>
        </thead>
        <tbody>
          ${rows
            .filter((r) => r.status === 'failed' || r.status === 'timedOut' || (r.status === 'skipped' && r.isKnownIssue))
            .map((r) => {
              const expectedLine = r.expected ? `\u671f\u671b\uff1a${escapeHtml(r.expected)}` : '';
              const receivedLine = r.received ? `\u5b9e\u9645\uff1a${escapeHtml(r.received)}` : '';
              const expectHtml = expectedLine || receivedLine ? `${expectedLine}<br/>${receivedLine}` : '-';
              const errLine = escapeHtml(toChineseErrorSummary(r.error || '') || '-');
              const shots = r.screenshots.length
                ? r.screenshots
                    .map((p) => `<img class="shot zoomable" src="${toImageSrc(p)}" data-full="${toImageSrc(p)}" alt="screenshot" />`)
                    .join('')
                : '\u65e0';
              const traceLinks = r.traces.length
                ? r.traces.map((p) => `<div class="muted">\u8ffd\u8e2a: ${escapeHtml(p)}</div>`).join('')
                : '';
              const videoLinks = r.videos.length
                ? r.videos.map((p) => `<div class="muted">\u89c6\u9891: ${escapeHtml(p)}</div>`).join('')
                : '';
              return `
            <tr>
              <td>${r.id}</td>
              <td>${r.title}</td>
              <td class="muted">${renderRouteLinks(r.route)}</td>
              <td>${escapeHtml(r.steps)}</td>
              <td>${escapeHtml(r.data)}</td>
              <td class="muted">${expectHtml}</td>
              <td class="muted">${errLine}</td>
              <td>${shots}${traceLinks}${videoLinks}</td>
            </tr>`;
            })
            .join('')}
        </tbody>
      </table>
    </div>`
      : ''}

    <div class="section">
      <h2>${cn.attachment}</h2>
      <div class="card">
        <div>${cn.native}: E:\\u5b9d\u6d01\\test3\\playwright-report\\index.html</div>
        <div>${cn.artifacts}: E:\\u5b9d\u6d01\\test3\\test-results</div>
      </div>
    </div>

    <div class="footer">${cn.note}</div>
  </div>
  <div id="img-modal">
    <img alt="preview" />
    <div class="hint">\u70b9\u51fb\u7a7a\u767d\u5904\u5173\u95ed / Esc</div>
  </div>
  <script>
    (function () {
      const modal = document.getElementById('img-modal');
      const modalImg = modal.querySelector('img');
      document.addEventListener('click', (e) => {
        const t = e.target;
        if (t && t.classList && t.classList.contains('zoomable')) {
          modalImg.src = t.getAttribute('data-full') || t.src;
          modal.classList.add('show');
          return;
        }
      });
      modal.addEventListener('click', () => {
        modal.classList.remove('show');
        modalImg.src = '';
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          modal.classList.remove('show');
          modalImg.src = '';
        }
      });
    })();
  </script>
</body>
</html>`;

const reportName = `\u81ea\u52a8\u5316\u6d4b\u8bd5\u62a5\u544a_\u95ee\u9898\u7c7b\u578b\u7ba1\u7406_${reportDate}.html`;
const htmlWithBom = `\uFEFF${html}`;
fs.writeFileSync(path.join('reports', 'report.html'), htmlWithBom, 'utf8');
fs.writeFileSync(path.join('reports', reportName), htmlWithBom, 'utf8');
console.log(path.join('reports', reportName));



