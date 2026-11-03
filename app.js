// Pocket Ticket — a server's scratch pad. Nothing here is sent anywhere;
// everything lives in this browser's localStorage.

const STORAGE_KEY = "pocket-ticket:v1";

function emptyTable() {
  return { course: null, guests: 2, draft: {}, draftNote: "", rounds: [] };
}

function loadState() {
  let saved = null;
  try {
    saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch (e) {}
  const tables = {};
  for (let n = 1; n <= TABLE_COUNT; n++) {
    tables[n] = Object.assign(emptyTable(), saved && saved.tables && saved.tables[n]);
  }
  return { tables };
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {}
}

const state = loadState();
const ui = { view: "tables", table: null, tab: "order", cat: "meat", draftOpen: false, pickCourse: false };

// ---------- helpers ----------

const $app = document.getElementById("app");

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function sumQty(map) {
  return Object.values(map).reduce((a, b) => a + b, 0);
}

function pendingRounds(t) {
  return t.rounds.filter((r) => !r.entered);
}

function timeStr(ts) {
  const d = new Date(ts);
  return d.getHours().toString().padStart(2, "0") + ":" + d.getMinutes().toString().padStart(2, "0");
}

function itemLabel(it) {
  const no = it.no !== undefined ? `<span class="no">${esc(it.no)}</span>` : "";
  const spicy = it.spicy ? ' <span class="spicy">🌶</span>' : "";
  return `${no}<span class="zh">${esc(it.zh)}${spicy}</span><span class="en">${esc(it.en)}</span>`;
}

// Order of groups when listing what a table has ordered.
const GROUP_ORDER = ["premium", "meat", "soju", "fsoju", "beer", "wine", "soft"];
const GROUP_LABEL = { premium: "Premium A–D", meat: "肉类 / 菜", drinks: "酒水饮料" };

function sortedIds(ids) {
  const all = [...PREMIUM, ...MEATS, ...DRINK_GROUPS.flatMap((g) => g.items)].map((i) => i.id);
  return ids.slice().sort((a, b) => all.indexOf(a) - all.indexOf(b));
}

function categoriesFor(t) {
  const c = COURSES[t.course];
  const cats = [{ key: "meat", label: "肉类 " + c.short, items: c.meats }];
  if (c.premium) cats.unshift({ key: "premium", label: "Premium A–D", items: PREMIUM });
  for (const g of DRINK_GROUPS) cats.push({ key: g.key, label: g.label, items: g.items });
  return cats;
}

// ---------- views ----------

function renderTables() {
  let cells = "";
  for (let n = 1; n <= TABLE_COUNT; n++) {
    const t = state.tables[n];
    const pend = pendingRounds(t).length;
    const draft = sumQty(t.draft);
    const busy = t.course || t.rounds.length;
    cells += `
      <button class="table-cell ${busy ? "busy" : ""}" data-action="open-table" data-n="${n}">
        <span class="tnum">${n}</span>
        ${t.course ? `<span class="course-chip c-${t.course}">${COURSES[t.course].short}</span>` : `<span class="free">空</span>`}
        ${pend ? `<span class="badge pend">${pend} 待输入</span>` : ""}
        ${draft ? `<span class="badge draft">草稿 ${draft}</span>` : ""}
      </button>`;
  }
  return `
    <header class="bar">
      <h1>Pocket Ticket</h1>
    </header>
    <main class="tables-grid">${cells}</main>`;
}

function renderCoursePicker(n, t) {
  const opts = Object.entries(COURSES)
    .map(([k, c]) => `
      <button class="course-btn c-${k} ${t.course === k ? "active" : ""}" data-action="set-course" data-course="${k}">
        ${c.name}
      </button>`)
    .join("");
  return `
    <header class="bar">
      <button class="icon-btn" data-action="${t.course ? "close-picker" : "back"}">‹</button>
      <h1>${n} 号桌</h1>
      <span></span>
    </header>
    <main class="picker">
      <p class="hint">人数</p>
      <div class="stepper big">
        <button data-action="guests" data-d="-1">−</button>
        <span>${t.guests}</span>
        <button data-action="guests" data-d="1">+</button>
      </div>
      <p class="hint">选择套餐（一桌只能选一种）</p>
      <div class="course-list">${opts}</div>
    </main>`;
}

function renderOrderTab(t) {
  const cats = categoriesFor(t);
  if (!cats.some((c) => c.key === ui.cat)) ui.cat = cats[0].key;
  const cat = cats.find((c) => c.key === ui.cat);
  const chips = cats
    .map((c) => `<button class="chip ${c.key === ui.cat ? "active" : ""}" data-action="cat" data-cat="${c.key}">${esc(c.label)}</button>`)
    .join("");
  const items = cat.items
    .map((it) => {
      const q = t.draft[it.id] || 0;
      return `
        <button class="item ${q ? "picked" : ""}" data-action="add" data-id="${it.id}">
          ${itemLabel(it)}
          ${it.tip ? `<span class="tip">${esc(it.tip)}</span>` : ""}
          ${q ? `<span class="qty">${q}</span>` : ""}
        </button>`;
    })
    .join("");

  const draftCount = sumQty(t.draft);
  const draftRows = sortedIds(Object.keys(t.draft))
    .map((id) => {
      const it = ITEM_INDEX[id];
      return `
        <li>
          <span class="row-name">${it.no !== undefined ? `<b>${esc(it.no)}</b> ` : ""}${esc(it.zh)} <small>${esc(it.en)}</small></span>
          <span class="stepper">
            <button data-action="dec" data-id="${id}">−</button>
            <span>${t.draft[id]}</span>
            <button data-action="add" data-id="${id}">+</button>
          </span>
        </li>`;
    })
    .join("");

  const body = `
    <main class="items-grid">${items}</main>
    <section class="draft ${ui.draftOpen ? "open" : ""}">
      ${ui.draftOpen ? `
        <div class="draft-body">
          ${draftCount ? `<ul class="rows">${draftRows}</ul>` : `<p class="hint">还没有点菜</p>`}
          <textarea class="note" data-input="note" placeholder="备注（例如：不要辣、啤酒塔要 Kloud…）">${esc(t.draftNote)}</textarea>
          ${draftCount ? `<button class="text-btn danger" data-action="clear-draft">清空本次</button>` : ""}
        </div>` : ""}
      <div class="draft-bar">
        <button class="draft-toggle" data-action="toggle-draft">
          本次 <b>${draftCount}</b> 份 ${ui.draftOpen ? "▼" : "▲"}
        </button>
        <button class="submit" data-action="submit" ${draftCount ? "" : "disabled"}>下单</button>
      </div>
    </section>`;
  return { top: `<nav class="chips">${chips}</nav>`, body };
}

function renderRoundItems(items) {
  return sortedIds(Object.keys(items))
    .map((id) => {
      const it = ITEM_INDEX[id];
      return `<li><span class="row-name">${it.no !== undefined ? `<b>${esc(it.no)}</b> ` : ""}${esc(it.zh)} <small>${esc(it.en)}</small></span><span class="q">× ${items[id]}</span></li>`;
    })
    .join("");
}

function renderHistoryTab(t) {
  if (!t.rounds.length) return `<main class="history"><p class="hint center">还没有下单</p></main>`;

  const pend = t.rounds.map((r, i) => ({ r, i })).filter(({ r }) => !r.entered).reverse();
  const done = t.rounds.map((r, i) => ({ r, i })).filter(({ r }) => r.entered).reverse();

  const roundCard = ({ r, i }, isNew) => `
    <article class="round ${isNew ? "new" : ""}">
      <header>
        <span>第 ${i + 1} 次 · ${timeStr(r.time)}</span>
        ${isNew
          ? `<button class="mark" data-action="mark" data-i="${i}">已输入 POS ✓</button>`
          : `<button class="text-btn" data-action="unmark" data-i="${i}">改回未输入</button>`}
      </header>
      <ul class="rows">${renderRoundItems(r.items)}</ul>
      ${r.note ? `<p class="round-note">📝 ${esc(r.note)}</p>` : ""}
    </article>`;

  // Totals across every round, with how much of each is still not in the POS.
  const total = {};
  const fresh = {};
  for (const r of t.rounds) {
    for (const [id, q] of Object.entries(r.items)) {
      total[id] = (total[id] || 0) + q;
      if (!r.entered) fresh[id] = (fresh[id] || 0) + q;
    }
  }
  const buckets = { premium: [], meat: [], drinks: [] };
  for (const id of sortedIds(Object.keys(total))) {
    const g = ITEM_INDEX[id].group;
    buckets[g === "premium" || g === "meat" ? g : "drinks"].push(id);
  }
  const totalHtml = Object.entries(buckets)
    .filter(([, ids]) => ids.length)
    .map(([g, ids]) => `
      <h3>${GROUP_LABEL[g]}</h3>
      <ul class="rows">
        ${ids.map((id) => {
          const it = ITEM_INDEX[id];
          return `<li class="${fresh[id] ? "has-new" : ""}">
            <span class="row-name">${it.no !== undefined ? `<b>${esc(it.no)}</b> ` : ""}${esc(it.zh)} <small>${esc(it.en)}</small></span>
            <span class="q">${fresh[id] ? `<em>+${fresh[id]} 新</em> ` : ""}× ${total[id]}</span>
          </li>`;
        }).join("")}
      </ul>`)
    .join("");

  return `
    <main class="history">
      ${pend.length ? `<h2 class="sec new">新增 · 待输入 POS</h2>${pend.map((x) => roundCard(x, true)).join("")}` : `<p class="all-done">✓ 全部已输入 POS</p>`}
      <h2 class="sec">全部已点（合计）</h2>
      <section class="totals">${totalHtml}</section>
      ${done.length ? `
        <details class="past">
          <summary>已输入的记录（${done.length}）</summary>
          ${done.map((x) => roundCard(x, false)).join("")}
        </details>` : ""}
    </main>`;
}

function renderTable() {
  const n = ui.table;
  const t = state.tables[n];
  if (!t.course || ui.pickCourse) return renderCoursePicker(n, t);

  const pend = pendingRounds(t).length;
  const view = ui.tab === "order" ? renderOrderTab(t) : { top: "", body: renderHistoryTab(t) };
  return `
    <div class="top">
    <header class="bar">
      <button class="icon-btn" data-action="back">‹</button>
      <h1>${n} 号桌
        <button class="course-chip c-${t.course}" data-action="open-picker">${COURSES[t.course].short}</button>
        <small>${t.guests} 人</small>
      </h1>
      <button class="text-btn danger" data-action="clear-table">清桌</button>
    </header>
    <nav class="tabs">
      <button class="${ui.tab === "order" ? "active" : ""}" data-action="tab" data-tab="order">点单</button>
      <button class="${ui.tab === "history" ? "active" : ""}" data-action="tab" data-tab="history">
        已点 ${pend ? `<span class="badge pend">${pend}</span>` : ""}
      </button>
    </nav>
    ${view.top}
    </div>
    ${view.body}`;
}

function render() {
  $app.className = "view-" + ui.view + (ui.view === "table" && ui.tab === "order" ? " with-draft" : "");
  $app.innerHTML = ui.view === "tables" ? renderTables() : renderTable();
}

// ---------- actions ----------

const actions = {
  "open-table"(el) {
    ui.view = "table";
    ui.table = Number(el.dataset.n);
    const t = state.tables[ui.table];
    ui.tab = pendingRounds(t).length && !sumQty(t.draft) ? "history" : "order";
    ui.cat = "meat";
    ui.draftOpen = false;
    ui.pickCourse = false;
    window.scrollTo(0, 0);
  },
  back() {
    ui.view = "tables";
    ui.pickCourse = false;
  },
  "set-course"(el, t) {
    t.course = el.dataset.course;
    ui.pickCourse = false;
    ui.cat = t.course === "P" ? "premium" : "meat";
  },
  "open-picker"() { ui.pickCourse = true; },
  "close-picker"() { ui.pickCourse = false; },
  guests(el, t) { t.guests = Math.max(1, t.guests + Number(el.dataset.d)); },
  cat(el) { ui.cat = el.dataset.cat; window.scrollTo(0, 0); },
  tab(el) { ui.tab = el.dataset.tab; window.scrollTo(0, 0); },
  add(el, t) { t.draft[el.dataset.id] = (t.draft[el.dataset.id] || 0) + 1; },
  dec(el, t) {
    const id = el.dataset.id;
    if (--t.draft[id] <= 0) delete t.draft[id];
  },
  "toggle-draft"() { ui.draftOpen = !ui.draftOpen; },
  "clear-draft"(el, t) {
    if (!confirm("清空本次还没下单的菜？")) return false;
    t.draft = {};
    t.draftNote = "";
  },
  submit(el, t) {
    if (!sumQty(t.draft)) return false;
    t.rounds.push({ time: Date.now(), items: t.draft, note: t.draftNote.trim(), entered: false });
    t.draft = {};
    t.draftNote = "";
    ui.draftOpen = false;
    ui.tab = "history";
    window.scrollTo(0, 0);
  },
  mark(el, t) { t.rounds[Number(el.dataset.i)].entered = true; },
  unmark(el, t) { t.rounds[Number(el.dataset.i)].entered = false; },
  "clear-table"(el) {
    if (!confirm(`清空 ${ui.table} 号桌的所有记录？（客人走了再清）`)) return false;
    state.tables[ui.table] = emptyTable();
    ui.view = "tables";
  },
};

$app.addEventListener("click", (e) => {
  const el = e.target.closest("[data-action]");
  if (!el || el.disabled) return;
  const fn = actions[el.dataset.action];
  if (!fn) return;
  const t = ui.table ? state.tables[ui.table] : null;
  if (fn(el, t) === false) return;
  saveState();
  render();
});

$app.addEventListener("input", (e) => {
  if (e.target.dataset.input === "note") {
    state.tables[ui.table].draftNote = e.target.value;
    saveState();
  }
});

render();
