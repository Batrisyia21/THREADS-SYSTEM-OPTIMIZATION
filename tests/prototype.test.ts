import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

function loadPrototypeLogic() {
  const html = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf8');
  const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
  assert.ok(scriptMatch, 'Inline <script> tag must exist in index.html');

  // Minimal DOM stub so the script evaluates cleanly in Node vm
  const noop = () => {};
  const makeEl = () => ({
    innerHTML: '',
    textContent: '',
    disabled: false,
    checked: false,
    value: '',
    style: {},
    classList: { toggle: noop, add: noop, remove: noop },
    setAttribute: noop,
    dataset: {},
  });

  const context: Record<string, unknown> = {
    document: {
      getElementById: () => makeEl(),
      body: { classList: { toggle: noop } },
      addEventListener: noop,
      activeElement: null,
    },
    setTimeout,
    clearTimeout,
    Date,
    JSON,
  };

  vm.createContext(context);
  vm.runInContext(scriptMatch[1], context);
  const exportsObj = vm.runInContext(
    '({ INITIAL_POSTS, INITIAL_HISTORY, INITIAL_CASES, createInitialState, filterHistoryItems, roleRank, getUnreadCount })',
    context
  );
  return exportsObj as {
    INITIAL_POSTS: unknown[];
    INITIAL_HISTORY: unknown[];
    INITIAL_CASES: unknown[];
    createInitialState: () => Record<string, unknown>;
    filterHistoryItems: (items: unknown[], criteria: Record<string, unknown>) => unknown[];
    roleRank: (role: string) => number;
    getUnreadCount: (tab: string) => number;
  };
}

test('self-contained index.html has zero external network/CDN references', () => {
  const html = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf8');
  assert.equal(/https?:\/\/(fonts\.|cdn\.|unpkg\.|jsdelivr\.)/i.test(html), false);
  assert.equal(/<link[^>]+rel=["']stylesheet["']/i.test(html), false);
  assert.equal(/<script[^>]+src=/i.test(html), false);
});

test('filterHistoryItems filters accurately on 8 sample history items', () => {
  const proto = loadPrototypeLogic();
  assert.equal(proto.INITIAL_HISTORY.length, 8);

  // Default Viewed filter yields 3 results
  const viewed = proto.filterHistoryItems(proto.INITIAL_HISTORY, {
    keyword: '',
    actions: ['Viewed'],
    from: '',
    to: '',
    category: 'All categories',
  });
  assert.equal(viewed.length, 3);

  // All filters cleared yields all 8 results
  const all = proto.filterHistoryItems(proto.INITIAL_HISTORY, {
    keyword: '',
    actions: [],
    from: '',
    to: '',
    category: 'All categories',
  });
  assert.equal(all.length, 8);

  // Date range out of bounds yields 0 results
  const empty = proto.filterHistoryItems(proto.INITIAL_HISTORY, {
    keyword: '',
    actions: [],
    from: '2026-10-20',
    to: '2026-10-25',
    category: 'All categories',
  });
  assert.equal(empty.length, 0);

  // Keyword + category filter
  const pythonTech = proto.filterHistoryItems(proto.INITIAL_HISTORY, {
    keyword: 'python',
    actions: [],
    from: '',
    to: '',
    category: 'Tech',
  });
  assert.equal(pythonTech.length, 1);
});

test('roleRank enforces privilege ordering for downgrade detection', () => {
  const proto = loadPrototypeLogic();
  assert.ok(proto.roleRank('Administrator') > proto.roleRank('Moderator'));
  assert.ok(proto.roleRank('Moderator') > proto.roleRank('End-User'));
});

test('initial notification unread counts match spec (Interaction: 2, Mentions: 1, System: 2)', () => {
  const proto = loadPrototypeLogic();
  assert.equal(proto.getUnreadCount('Interaction'), 2);
  assert.equal(proto.getUnreadCount('Mentions'), 1);
  assert.equal(proto.getUnreadCount('System'), 2);
});
