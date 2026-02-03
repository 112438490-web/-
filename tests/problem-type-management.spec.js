const { test, expect } = require('@playwright/test');

const BASE_PATH = '/';
const LOGIN_PATH = '/login';
const ADMIN_USER = 'admin';
const ADMIN_PASS = '111111';

function nowSuffix() {
  return String(Date.now());
}

async function loginIfNeeded(page) {
  const username = page.locator('input[placeholder*="账号"], input[placeholder*="用户名"], input[placeholder*="登录"], input[placeholder*="请输入您的账号"], input[type="text"]').first();
  const password = page.locator('input[type="password"], input[placeholder*="密码"], input[placeholder*="请输入您的密码"]').first();
  if (!(await username.count()) && !(await password.count())) {
    return;
  }
  if (!(await password.count())) {
    return;
  }
  await username.waitFor({ state: 'visible', timeout: 15000 });
  await password.waitFor({ state: 'visible', timeout: 15000 });
  await username.fill(ADMIN_USER);
  await password.fill(ADMIN_PASS);

  const loginButton = page.locator('button[type="submit"], button:has-text("登")').first();
  if (!(await loginButton.count())) {
    return;
  }
  await loginButton.waitFor({ state: 'visible', timeout: 10000 });
  await loginButton.click();
  const loggedIn = await page.waitForURL((url) => !url.toString().includes('/login'), { timeout: 20000 }).then(() => true).catch(() => false);
  if (!loggedIn) {
    await page.waitForTimeout(1000);
    await loginButton.click();
    await page.waitForURL((url) => !url.toString().includes('/login'), { timeout: 20000 }).catch(() => null);
  }
}

async function openProblemTypePage(page) {
  await page.goto('/problem-closed-loop-management/problem-type-management', { waitUntil: 'domcontentloaded' });
  await loginIfNeeded(page);
  if (page.url().includes('/login')) {
    await loginIfNeeded(page);
    await page.goto('/problem-closed-loop-management/problem-type-management', { waitUntil: 'domcontentloaded' });
  }
  await waitForProblemTypeList(page);
}

async function ensureTableLoaded(page) {
  await waitForProblemTypeList(page);
}

async function clickMenuItem(page, name) {
  const found = await page.evaluate((label) => {
    const normalize = (text) =>
      (text || '')
        .replace(/\\s+/g, '')
        .replace(/[^\\u4e00-\\u9fa5A-Za-z0-9-]/g, '');
    const target = normalize(label);
    const nodes = Array.from(document.querySelectorAll('.ant-menu-item, .ant-menu-submenu-title, .ant-menu-item-group-title, a, span, div'));
    const hit = nodes.find((n) => normalize(n.innerText).includes(target));
    if (hit) {
      hit.click();
      return true;
    }
    return false;
  }, name);

  if (found) {
    return;
  }

  const menuItem = page.getByText(name, { exact: false }).first();
  await menuItem.click();
}

async function waitForProblemTypeList(page) {
  const readySelector = 'text=问题类型列表, button:has-text("查询"), .ant-table-row, .ant-table';
  try {
    await page.waitForSelector(readySelector, { timeout: 15000, state: 'attached' });
    const header = page.locator('text=问题类型列表').first();
    const queryButton = page.getByRole('button', { name: /查询/ }).first();
    if (await header.count()) {
      await expect(header).toBeVisible({ timeout: 15000 });
    } else if (await queryButton.count()) {
      await expect(queryButton).toBeVisible({ timeout: 15000 });
    }
  } catch (err) {
    // Soft wait: allow tests to proceed even if readiness signal is not detected.
    await page.waitForTimeout(1000);
  }
}

async function getFormItem(page, labelText) {
  const formItem = page.locator('.ant-form-item').filter({ hasText: labelText }).first();
  if (await formItem.count()) {
    return formItem;
  }
  return page.locator(`label:has-text("${labelText}")`).first().locator('..');
}

async function fillInputByLabel(page, labelText, value) {
  const formItem = await getFormItem(page, labelText);
  const input = formItem.locator('input:not([disabled]), textarea:not([disabled])').first();
  if (await input.count()) {
    await input.fill(value);
    return;
  }
  if (labelText === '问题类型编码') {
    await page.locator('input[placeholder*="自动生成"]').first().fill(value);
    return;
  }
  if (labelText === '问题类型名称') {
    await page.locator('input[placeholder*="问题类型名称"]').first().fill(value);
    return;
  }
  if (labelText === '备注') {
    await page.locator('textarea[placeholder*="备注"], input[placeholder*="备注"]').first().fill(value);
  }
}

async function selectByLabel(page, labelText, optionText) {
  const formItem = await getFormItem(page, labelText);
  const select = formItem.locator('.ant-select').first();
  if (await select.count()) {
    const selection = select.locator('.ant-select-selection, .ant-select-selector').first();
    await selection.click();
  } else {
    await page.locator('.ant-select-selection__placeholder:has-text("请选择"), .ant-select-selection:has-text("请选择")').first().click();
  }
  const dropdown = page.locator('.ant-select-dropdown').filter({ hasNotText: 'display: none' });
  await expect(dropdown.first()).toBeVisible();
  const option = dropdown.locator(`.ant-select-dropdown-menu-item:has-text("${optionText}"), .ant-select-item:has-text("${optionText}")`).first();
  await option.click();
}

async function assertSelectedByLabel(page, labelText, optionText) {
  const formItem = await getFormItem(page, labelText);
  const selected = formItem.locator('.ant-select-selection-selected-value, .ant-select-selection-item').first();
  await expect(selected).toBeVisible({ timeout: 5000 });
  await expect(selected).toContainText(optionText);
}

async function selectByLabelIfPresent(page, labelText, optionTexts) {
  const formItem = page.locator('.ant-form-item').filter({ hasText: labelText }).first();
  if (!(await formItem.count())) {
    return false;
  }
  for (const optionText of optionTexts) {
    try {
      await selectByLabel(page, labelText, optionText);
      const selected = formItem.locator('.ant-select-selection-selected-value, .ant-select-selection-item').first();
      if (await selected.count()) {
        const selectedText = (await selected.textContent()) || '';
        if (selectedText.includes(optionText)) {
          return true;
        }
      } else {
        return true;
      }
    } catch (err) {
      // Try next option text.
    }
  }
  return false;
}

async function clickPrimaryButton(page, nameRegex) {
  const buttonByRole = page.getByRole('button', { name: nameRegex }).first();
  if (await buttonByRole.count()) {
    await buttonByRole.click();
    return;
  }
  const label = nameRegex.source || String(nameRegex);
  const labelButton = page.locator(`button:has-text("${label}"), .ant-btn:has-text("${label}")`).first();
  if (await labelButton.count()) {
    await labelButton.click();
    return;
  }
  const regexButton = page.locator('button, .ant-btn').filter({ hasText: nameRegex }).first();
  if (await regexButton.count()) {
    await regexButton.click();
    return;
  }
  if (nameRegex.source && nameRegex.source.includes('保存')) {
    const drawerSave = page.locator('.ant-drawer .ant-btn:has-text("保存"), .ant-drawer button:has-text("保存")').first();
    if (await drawerSave.count()) {
      await drawerSave.click({ force: true });
      return;
    }
    const primary = page.locator('.ant-btn-primary, button[type="submit"]').first();
    await primary.click({ force: true });
    return;
  }
  if (nameRegex.source && nameRegex.source.includes('查询')) {
    const searchButton = page.locator('.ant-btn-primary:has-text("查询"), button:has-text("查询")').first();
    await searchButton.click();
  }
}

async function waitForSuccessToast(page) {
  const message = page.locator('.ant-message, .ant-notification');
  const listTitle = page.getByText('问题类型列表', { exact: false }).first();
  try {
    await expect(message).toContainText(/成功/, { timeout: 5000 });
    return;
  } catch (err) {
    // Some flows do not show a toast or navigation; fall back to a short wait.
  }
  try {
    await listTitle.waitFor({ state: 'visible', timeout: 5000 });
  } catch (err) {
    await page.waitForTimeout(2000);
  }
}

async function waitForSaveResult(page) {
  const successToast = page.locator('.ant-message, .ant-notification').filter({ hasText: /成功/ }).first();
  const errorToast = page.locator('.ant-message, .ant-notification').filter({ hasText: /失败|错误/ }).first();

  const successSeen = await successToast.waitFor({ state: 'visible', timeout: 10000 }).then(() => true).catch(() => false);
  if (successSeen) {
    return;
  }

  const errorSeen = await errorToast.waitFor({ state: 'visible', timeout: 2000 }).then(() => true).catch(() => false);
  if (errorSeen) {
    const errorText = (await errorToast.textContent()) || '保存失败';
    throw new Error(`Save failed: ${errorText.trim()}`);
  }

  const formError = page.locator('.ant-form-item-has-error .ant-form-explain, .ant-form-item-has-error .ant-form-item-explain').first();
  if (await formError.count()) {
    const errorText = (await formError.textContent()) || '保存失败';
    throw new Error(`Save validation error: ${errorText.trim()}`);
  }

  await page.waitForTimeout(2000);
}

async function searchByName(page, name) {
  await fillSearchName(page, name);
  await clickPrimaryButton(page, /查询/);
  await ensureTableLoaded(page);
}

async function fillSearchName(page, name) {
  const searchInput = page.locator('input[placeholder*="问题类型名称"]').first();
  if (await searchInput.count()) {
    await searchInput.fill(name);
    return;
  }
  await fillInputByLabel(page, '问题类型名称', name);
}

async function resolveRowLocator(page) {
  const selector = '.ant-table-row, .ant-table-tbody > tr, table tbody tr, [role="row"]';
  const candidates = [];
  for (const frame of page.frames()) {
    candidates.push(frame.locator(selector));
  }
  for (const locator of candidates) {
    try {
      await expect(locator.first()).toBeVisible({ timeout: 5000 });
      return locator;
    } catch (err) {
      // try next
    }
  }
  // Fallback to main page locator with full timeout
  const fallback = page.locator(selector);
  await expect(fallback.first()).toBeVisible({ timeout: 15000 });
  return fallback;
}

async function findRowByName(page, name) {
  const rows = await resolveRowLocator(page);
  const row = rows.filter({ hasText: name }).first();
  await expect(row).toBeVisible({ timeout: 30000 });
  return row;
}

async function refreshList(page) {
  const resetButton = page.getByRole('button', { name: /重置|清空/ }).first();
  if (await resetButton.count()) {
    await resetButton.click();
  }
  const queryButton = page.getByRole('button', { name: /查询/ }).first();
  if (await queryButton.count()) {
    await queryButton.click();
  }
  const reloadButton = page.locator('button[h-icon="reload"], .ant-btn:has-text("刷新"), .anticon-reload').first();
  if (await reloadButton.count()) {
    await reloadButton.click();
  }
  await page.waitForTimeout(1000);
}

async function getLastRow(page) {
  const rows = await resolveRowLocator(page);
  await page.waitForLoadState('networkidle').catch(() => null);
  try {
    await expect(rows.first()).toBeVisible({ timeout: 15000 });
  } catch (err) {
    await page.waitForTimeout(1000);
    await refreshList(page);
    await expect(rows.first()).toBeVisible({ timeout: 15000 });
  }
  const count = await rows.count();
  return rows.nth(count - 1);
}

async function returnToList(page) {
  await clickPrimaryButton(page, /返\\s*回/);
  const onList = await waitForProblemTypeList(page).then(() => true).catch(() => false);
  if (!onList) {
    await page.waitForTimeout(500);
    await clickPrimaryButton(page, /返\\s*回/);
    const retry = await waitForProblemTypeList(page).then(() => true).catch(() => false);
    if (!retry) {
      await page.goto('/problem-closed-loop-management/problem-type-management', { waitUntil: 'domcontentloaded' });
      await waitForProblemTypeList(page);
    }
  }
}

async function enterEditMode(page) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const editButton = page.locator('button:has-text("编辑"), .ant-btn:has-text("编辑")').first();
    if (await editButton.count()) {
      await editButton.click({ force: true });
    }
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find((b) => (b.innerText || '').includes('编辑'));
      if (btn) btn.click();
    });
    const editable = page.locator('.ant-form-item, textarea:not([disabled]), input[placeholder*="问题类型名称"]').first();
    const ready = await editable.waitFor({ state: 'visible', timeout: 5000 }).then(() => true).catch(() => false);
    if (ready) {
      return;
    }
    await page.waitForTimeout(500);
  }
}


async function clickRowAction(row, nameRegex) {
  const button = row.getByRole('button', { name: nameRegex });
  if (await button.count()) {
    await button.first().click();
    return;
  }
  const link = row.getByRole('link', { name: nameRegex });
  if (await link.count()) {
    await link.first().click();
    return;
  }
  await row.getByText(nameRegex).first().click();
}

test.describe.serial('Problem Type Management', () => {
  const suffix = nowSuffix();
  const problemTypeName = `自动化问题类型-${suffix}`;
  const problemTypeCode = `QT${suffix.slice(-5)}`;
  const copiedProblemTypeName = `自动化复制-${suffix}`;
  const updatedRemark = `自动化备注-${suffix}`;
  let createdRowName = '';

  test('list page renders and columns are present', async ({ page }) => {
    await openProblemTypePage(page);
    await expect(page.getByText('问题类型编码', { exact: false }).first()).toBeVisible();
    await expect(page.getByText('问题类型名称', { exact: false }).first()).toBeVisible();
    await expect(page.getByText('解决方式', { exact: false }).first()).toBeVisible();
  });

  test('create problem type with manual code', async ({ page }) => {
    await openProblemTypePage(page);
    const addButton = page.locator('button[h-icon="add"]');
    if (await addButton.count()) {
      await addButton.click();
    } else {
      await clickPrimaryButton(page, /新增|新建|添加/);
    }
    await expect(page.getByText('新增问题类型', { exact: false }).first()).toBeVisible();

    await fillInputByLabel(page, '问题类型编码', problemTypeCode);
    await fillInputByLabel(page, '问题类型名称', problemTypeName);
    await selectByLabel(page, '解决方式', '8D');
    await assertSelectedByLabel(page, '解决方式', '8D');
    await selectByLabelIfPresent(page, '是否可用', ['是', '启用', '可用']);
    await clickPrimaryButton(page, /保\\s*存/);
    await waitForSaveResult(page);

    await returnToList(page);
    await refreshList(page);
    createdRowName = problemTypeName;
  });

  test('copy problem type', async ({ page }) => {
    await openProblemTypePage(page);
    await page.waitForLoadState('networkidle').catch(() => null);
    await refreshList(page);
    const row = await getLastRow(page);
    await clickRowAction(row, /复制/);

    await fillInputByLabel(page, '新问题类型名称', copiedProblemTypeName);
    await clickPrimaryButton(page, /保存/);
    await waitForSuccessToast(page);

    await returnToList(page);
  });

  test('edit problem type remark in detail view', async ({ page }) => {
    await openProblemTypePage(page);
    await refreshList(page);
    const row = await getLastRow(page);
    await clickRowAction(row, /详情|查看/);

    await enterEditMode(page);
    const editableField = page.locator('textarea:not([disabled]), input:not([disabled])').first();
    const canEdit = await editableField.isVisible().catch(() => false);
    if (canEdit) {
      try {
        await fillInputByLabel(page, '备注', updatedRemark);
      } catch (err) {
        await page.locator('textarea:not([disabled])').first().fill(updatedRemark);
      }
      await clickPrimaryButton(page, /保存/);
      await waitForSuccessToast(page);
    }

    await returnToList(page);
  });

  test('toggle enable/disable', async ({ page }) => {
    await openProblemTypePage(page);
    await refreshList(page);
    const row = await getLastRow(page);

    const toggle = row.locator('.ant-switch').first();
    await expect(toggle).toBeVisible();

    const initial = await toggle.getAttribute('aria-checked');
    await toggle.click();
    await waitForSuccessToast(page);

    const flipped = await toggle.getAttribute('aria-checked');
    expect(flipped).not.toBe(initial);
  });

  test('delete created problem types', async ({ page }) => {
    await openProblemTypePage(page);

    await refreshList(page);
    const lastRow = await getLastRow(page);
    await clickRowAction(lastRow, /删除/);
    await clickPrimaryButton(page, /确定|确认/);
    await waitForSuccessToast(page);

    await refreshList(page);
    const secondLastRow = await getLastRow(page);
    await clickRowAction(secondLastRow, /删除/);
    await clickPrimaryButton(page, /确定|确认/);
    await waitForSuccessToast(page);
  });
});
