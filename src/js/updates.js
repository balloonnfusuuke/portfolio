/* ==========================================================================
   updates.js — 更新履歴（updates.json）を読み込んで一覧を描画します。
   - 履歴の正は updates.json だけ。HTML には書きません。
   - index.html（最新5件）と updates.html（全件）の両方で使います。
   - 1件＝1行の細いリスト。行を押すと、その更新の対象（プロジェクトなど）へ移動します。
   - 言語を切り替えたときは、登録済みの一覧を描き直します。
   ========================================================================== */
var UPDATES = (function () {
  "use strict";

  var SOURCE = "updates.json";

  /* updates.json の category はこの5つ。表示名は i18n.js 側で言語ごとに持ちます。 */
  var CATEGORY_KEYS = {
    "新規ページ": "updates.cat.new",
    "機能追加": "updates.cat.feature",
    "コンテンツ更新": "updates.cat.content",
    "デザイン": "updates.cat.design",
    "修正": "updates.cat.fix"
  };

  var cache = null;
  var mounted = [];

  function t(key) {
    return window.I18N ? I18N.t(key) : key;
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /* "2026-11-12" → "2026.11.12"（表示用。並べ替えは元の文字列で行います） */
  function formatDate(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || ""));
    return m ? m[1] + "." + m[2] + "." + m[3] : String(iso || "");
  }

  function categoryLabel(category) {
    var key = CATEGORY_KEYS[category];
    return key ? t(key) : category;
  }

  /* 英語表示のときは titleEn を使います（無ければ日本語のまま）。 */
  function titleOf(item) {
    if (window.I18N && I18N.lang === "en" && item.titleEn) return item.titleEn;
    return item.title;
  }

  /* "#project-x" のようなページ内リンクは、呼び出し側の base を前につけます
     （updates.html からは "index.html#project-x" にする）。 */
  function resolveLink(link, base) {
    if (!link) return "";
    if (link.charAt(0) === "#") return (base || "") + link;
    return link;
  }

  /* 日付の新しい順。同じ日付は updates.json に書いた順を保ちます。 */
  function sortNewestFirst(items) {
    return items.slice().sort(function (a, b) {
      var da = String(a.date || "");
      var db = String(b.date || "");
      if (da === db) return 0;
      return da < db ? 1 : -1;
    });
  }

  function itemHtml(item, base) {
    var href = resolveLink(item.link, base);
    var inner =
      '<time class="update__date" datetime="' + escapeHtml(item.date) + '">' +
        escapeHtml(formatDate(item.date)) +
      "</time>" +
      '<span class="update__title">' + escapeHtml(titleOf(item)) + "</span>" +
      '<span class="update__badge">' + escapeHtml(categoryLabel(item.category)) + "</span>" +
      (href ? '<span class="update__arrow" aria-hidden="true">→</span>' : "");

    if (!href) {
      return '<li class="update"><div class="update__row">' + inner + "</div></li>";
    }
    return (
      '<li class="update"><a class="update__row" href="' + escapeHtml(href) + '">' +
        inner +
      "</a></li>"
    );
  }

  function render(container, items, base) {
    container.innerHTML = items.length
      ? items.map(function (item) { return itemHtml(item, base); }).join("")
      : '<li class="update update--empty">' + escapeHtml(t("updates.empty")) + "</li>";
  }

  function load() {
    if (cache) return Promise.resolve(cache);
    return fetch(SOURCE, { cache: "no-cache" })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (data) {
        cache = sortNewestFirst(Array.isArray(data) ? data : []);
        return cache;
      });
  }

  function itemsFor(entry, items) {
    return entry.limit ? items.slice(0, entry.limit) : items;
  }

  /* container に描画します。limit を渡すと新しいものからその件数だけ。
     options.base は "#..." リンクの前に付ける文字列（例: "index.html"）。 */
  function mount(container, limit, options) {
    if (!container) return;
    var entry = {
      el: container,
      limit: limit || 0,
      base: (options && options.base) || ""
    };
    mounted.push(entry);

    load()
      .then(function (items) {
        render(entry.el, itemsFor(entry, items), entry.base);
      })
      .catch(function () {
        entry.el.innerHTML =
          '<li class="update update--empty">' + escapeHtml(t("updates.error")) + "</li>";
      });
  }

  if (window.I18N && I18N.onChange) {
    I18N.onChange(function () {
      load()
        .then(function (items) {
          mounted.forEach(function (entry) {
            render(entry.el, itemsFor(entry, items), entry.base);
          });
        })
        .catch(function () { /* 読み込めないときはそのまま */ });
    });
  }

  return {
    load: load,
    mount: mount,
    render: render,
    formatDate: formatDate,
    categoryLabel: categoryLabel
  };
})();
