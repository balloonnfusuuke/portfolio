/* ==========================================================================
   i18n.js — 日本語 / 英語の切り替え（ライブラリなし）
   - 日本語は index.html / data.js の元の文章をそのまま使います（ここには英語だけを書く）。
   - 言語の決め方：保存済みの選択（localStorage "fy-lang"）→ ブラウザの第一言語（ja* なら日本語、それ以外は英語）。
     ※ 実際の判定は index.html の <head> 内の小さなスクリプトで、描画前に行っています。
   - 静的な文章は data-i18n="key"（中身を差し替え）／ data-i18n-attr="aria-label=key;placeholder=key" で指定。
   ========================================================================== */
var I18N = (function () {
  "use strict";

  var STORAGE_KEY = "fy-lang";

  /* --- 画面の文章（英語） --------------------------------------------------- */
  var EN = {
    "meta.title": "Fusuke Yasuda | Portfolio",
    "meta.description": "Portfolio of Fusuke Yasuda, a Computer Science student from Osaka, Japan. I plan, build, and publish web and analytics tools on my own, working toward a future where baseball can be a career anywhere in the world.",

    "opening.region": "Opening video",
    "opening.skip": "Skip the opening",
    "nav.main": "Main navigation",
    "nav.open": "Open menu",
    "nav.close": "Close menu",
    "hero.scroll": "Scroll down",
    "hero.scrollText": "Scroll",
    "hero.projects": "View Projects",
    "hero.contact": "Contact Me",
    "hero.iam": "I am a",
    "hero.from": "From",
    "hero.fromVal": "Osaka, Japan",
    "hero.study": "Study",
    "hero.studyVal": "CS at Multimedia University",
    "hero.focus": "Focus",
    "hero.focusVal": "Web / AI / Sports Tech",
    "cast.moves": "Character motions",
    "cast.homerun": "Home run",
    "cast.fastball": "Fastball",
    "cast.curve": "Slow break",
    "cast.note": "A character I drew, then animated in Blender.",
    "cast.faceLight": "The white baseball character",
    "cast.faceNavy": "The same character, in navy and gold",

    "about.title": "About Me",
    "about.lead": "I care about turning the small, real problems I find on the ground into tools people can actually use.",
    "about.avatarAlt": "Profile photo of Fusuke Yasuda",
    "about.idName": "Fusuke Yasuda",
    "about.idSub": "安田 風介",
    "about.idSubLang": "ja",
    "about.idMeta": "From Osaka, Japan · CS Student / Builder",
    "about.heading": "Find the problem.<br>Build something that works.",
    "about.p1": "I'm from Osaka, Japan. After graduating from high school in New Zealand, I'm studying Computer Science at Multimedia University in Malaysia, starting October 2026.",
    "about.p2": "As the first-ever intern at the Wakayama Waves, an independent-league baseball club, I worked in PR and saw the club's challenges up close. That experience got me planning, building, and publishing my own web tools, from player evaluation to pitch analysis. I build outside baseball too, such as an automated stock-monitoring system.",
    "about.p3": "I love building with AI and diving into new technologies. I'm comfortable working in both Japanese and English.",

    "vision.title": "The World I'm Building Toward",
    "vision.lead": "The reason at the very heart of why I build.",
    "vision.quote": "<span>Baseball as a real career,</span> <span>anywhere in the world.</span>",
    "vision.quoteSub": "A world where anyone who loves baseball can make it their career.",
    "vision.p1": "In the United States, Japan, South Korea, and Taiwan, baseball players perform in front of huge crowds and can earn hundreds of millions of dollars. But in much of the rest of Asia and Europe, baseball exists yet loses ground to sports like cricket, or still has very few players.",
    "vision.p2": "I want to close that gap: a world where baseball thrives in almost every country and everyone who loves the game can make it their profession. I truly believe that world can be built.",
    "vision.stepsLabel": "Where baseball is today, and where it could be",
    "vision.s1t": "Where baseball is an industry",
    "vision.s1x": "The US, Japan, South Korea, and Taiwan. Players fill stadiums and can make a living from the game.",
    "vision.s2t": "Where baseball exists, but careers are hard",
    "vision.s2x": "Much of the rest of Asia and Europe. Other sports dominate the market, and few people play.",
    "vision.s3t": "A baseball career, in any country",
    "vision.s3x": "Baseball thrives almost everywhere, and anyone who loves it can build a life around it.",
    "vision.mission": "In the big picture, I want <strong>a career spreading baseball around the world</strong>.",
    "vision.bridge": "Writing code is one way to get there. Like <a href=\"#projects\">ABBS</a>, which aims to connect Asian players with Japan's independent leagues, I start by building working things with my own hands, while growing the skills to support baseball with technology and data.",

    "skills.title": "What I Work With",
    "skills.lead": "The languages and technologies I use day to day, plus the domain knowledge I bring.",

    "projects.title": "Things I've Built",
    "projects.lead": "Public apps, and something I hand to people. Grouped, and still filterable.",
    "nfc.front": "Front",
    "nfc.back": "Back",
    "filter.all": "All",
    "filter.baseball": "Baseball",
    "filter.ai": "AI",
    "filter.tools": "Tools",
    "projects.filters": "Filter projects",
    "projects.empty": "No projects in this category.",
    "card.viewSite": "View site",
    "card.github": "{title} GitHub repository",
    "card.shot": "Screenshot of {title}",
    "card.image": "Image for {title}",
    "card.play": "Watch video",
    "card.close": "Close",
    "card.playLabel": "Play the silent promo video for {title}",
    "card.videoLabel": "Promo video for {title}",
    "card.closeLabel": "Close the promo video",
    "card.watchPromo": "Watch promo",
    "card.watchPromoLabel": "Watch the full promo video for {title} ({duration}, with sound)",
    "modal.label": "{title} promo video",
    "modal.close": "Close",
    "modal.closeLabel": "Close the promo video",
    "modal.note": "{duration} · Sound on",

    "experience.title": "My Journey So Far",
    "experience.lead": "Learning and building across Japan, New Zealand, and Malaysia.",

    "contact.title": "Let's Talk",
    "contact.lead": "Whether it's a development project, sports and technology, or bringing baseball to more of the world, feel free to reach out by email or the form below. Japanese or English is fine.",
    "form.name": "Name",
    "form.namePh": "Your name",
    "form.email": "Email",
    "form.subject": "Subject",
    "form.subjectPh": "What's it about?",
    "form.message": "Message",
    "form.messagePh": "Feel free to say hello.",
    "form.send": "Send Message",
    "form.mailSubject": "Inquiry from your portfolio site",
    "form.bodyName": "Name: ",
    "form.bodyEmail": "Email: ",
    "form.ok": "Opening your email app. Please review and send. If it doesn't open, email me directly at {email}.",
    "form.ng": "Please check your name, email address, and message.",

    "footer.nav": "Footer navigation",

    "activity.title": "Days I Shipped",
    "activity.lead": "Days I pushed code to public repositories over the last year.",
    "activity.total": "{count} contributions in the last year",
    "activity.less": "Less",
    "activity.more": "More",
    "activity.profile": "View on GitHub",
    "activity.loading": "Loading the calendar",
    "activity.error": "The calendar didn't load. You can still view it on GitHub.",
    "activity.day": "{date} · {count}",
    "activity.dow1": "Mon",
    "activity.dow3": "Wed",
    "activity.dow5": "Fri",
  };

  /* --- main.js が使う文章（日本語） ------------------------------------------ */
  var JA = {
    "meta.title": "Fusuke Yasuda | Portfolio",
    "nav.open": "メニューを開く",
    "nav.close": "メニューを閉じる",
    "projects.empty": "該当するプロジェクトがありません。",
    "card.viewSite": "サイトを見る",
    "card.github": "{title} の GitHub リポジトリ",
    "card.shot": "{title} のスクリーンショット",
    "card.image": "{title} のイメージ画像",
    "card.play": "動画を見る",
    "card.close": "閉じる",
    "card.playLabel": "{title} の紹介動画を再生（無音）",
    "card.videoLabel": "{title} の紹介動画",
    "card.closeLabel": "紹介動画を閉じる",
    "card.watchPromo": "プロモ動画を見る",
    "card.watchPromoLabel": "{title} の紹介動画を見る（{duration}・音声あり）",
    "modal.label": "{title} の紹介動画",
    "modal.close": "閉じる",
    "modal.closeLabel": "紹介動画を閉じる",
    "modal.note": "{duration} · 音声あり",
    "form.mailSubject": "ポートフォリオサイトからのお問い合わせ",
    "form.bodyName": "お名前：",
    "form.bodyEmail": "メール：",
    "form.ok": "メールアプリを開きます。内容を確認して送信してください。開かない場合は {email} へ直接ご連絡ください。",
    "form.ng": "お名前・メールアドレス・メッセージをご確認ください。",
    "filter.all": "すべて",
    "filter.baseball": "野球",
    "filter.ai": "AI",
    "filter.tools": "ツール",
    "nfc.front": "おもて",
    "nfc.back": "うら",
    "activity.total": "この1年で {count} 回",
    "activity.less": "少ない",
    "activity.more": "多い",
    "activity.profile": "GitHubで見る",
    "activity.loading": "カレンダーを読み込んでいます",
    "activity.error": "カレンダーを読み込めませんでした。GitHubでは見られます。",
    "activity.day": "{date} · {count}回",
    "activity.dow1": "月",
    "activity.dow3": "水",
    "activity.dow5": "金",
  };

  /* --- data.js の英語版（日本語は data.js の元データ） ------------------------ */
  var DATA_EN = {
    PROFILE: { lead: "Turning real problems on the ground into working products." },
    STATS: [
      { suffix: "", label: "Countries lived in", note: "Japan · New Zealand · Malaysia" },
      { suffix: "+", label: "Public GitHub repos" },
      { suffix: "", label: "Languages spoken", note: "Japanese · English" },
    ],
    SKILLS: [
      { caption: "Programming" },
      { caption: "Frameworks & platforms" },
      { caption: "AI & dev tools" },
      { caption: "Domain knowledge",
        items: ["Data visualization", "Backtesting & automated monitoring", "Baseball analytics (OPS, FIP, run expectancy)"] },
    ],
    // PROJECTS は title で対応づけ
    PROJECTS: {
      "CampusRun": {
        status: "Live · MMU students only",
        description: "A student-to-student errand board for MMU Cyberjaya. Post what you need, where to buy it, and a tip, and an approved student runner delivers it on foot across campus. Sign-in is by email link, and order status updates in real time.",
      },
      "ABBS": {
        status: "Prototype · Live on the web",
        description: "A scouting dashboard that connects Asian baseball players with Japan's independent leagues, with player-data visualization and team management.",
      },
      "baseball_track": {
        status: "Prototype · Estimates are approximate",
        description: "A pitch-analysis tool that estimates velocity and movement from single-camera video, using perspective transformation and physics.",
      },
      "baseball.analyze": {
        status: "Built from my internship experience · Prototype",
        description: "A strategy-evaluation tool that measures how much each tactic contributes, based on changes in run expectancy. I built it drawing on my internship with the Wakayama Waves.",
      },
      "metrics": {
        status: "Prototype · Demo data",
        description: "An evaluation tool for contract negotiations that ranks players by weighted game stats.",
      },
      "indiebaseball": {
        status: "Prototype · Personal project",
        description: "A stats-tracking app designed for independent-league clubs. Enter each pitch and it automatically calculates metrics such as OPS, FIP, and WHIP.",
      },
      "pitch": {
        status: "Prototype · AI reports are for reference",
        description: "A tool for logging pitch counts and managing pitching schedules. It can also generate workload-analysis reports with the Gemini API.",
      },
      "rakuten": {
        status: "Personal prototype · Image uses sample data",
        description: "An automated stock-monitoring system based on the ConnorsRSI(2) strategy, with backtesting, notifications, and a Next.js dashboard.",
      },
      "NFC名刺": {
        status: "A real card · NFC sticker",
        description: "A business card I designed with my own character. An NFC sticker on the back lets a phone read it.",
        tags: ["Design", "NFC"],
      },
    },
    PROJECT_GROUPS: [
      {
        title: "Running on campus",
        lead: "The app I work on most. It has a spec, payments, delivery tracking, and end-to-end tests.",
      },
      {
        title: "On the baseball field",
        lead: "Tools that started with my internship at the Wakayama Waves: stats, strategy, pitching, and scouting.",
      },
      {
        title: "Something I hand to people",
        lead: "Not an app. I made it to give to people I meet.",
      },
      {
        title: "A monitor I run for myself",
        lead: "Separate from baseball. A personal system I keep running so I can check it every day.",
      },
    ],
    // EXPERIENCE は data.js と同じ順番
    EXPERIENCE: [
      { period: "6th grade", title: "Started programming with Python" },
      { period: "Junior high school", title: "Started programming with HSP", org: "Math Research Club" },
      {
        period: "Feb 2024 — Dec 2025",
        title: "High school graduation",
        org: "Hillcrest High School (New Zealand)",
        description: "Studied at a high school in New Zealand and graduated in December 2025. Learning and living in English became the foundation for what I do today.",
      },
      {
        period: "Feb — Mar 2026",
        title: "PR Intern",
        org: "Wakayama Waves (independent league)",
        description: "Handled PR as the club's first-ever intern. Seeing the challenges on the ground firsthand is what got me started building tools.",
        tags: ["PR", "Club's first intern"],
      },
      {
        period: "2026 —",
        title: "Independent web tool development",
        org: "Personal projects",
        description: "I plan, build, and publish web tools on my own, from baseball tools for player evaluation and pitch analysis to an automated stock-monitoring system.",
      },
      {
        period: "Oct 2026 —",
        title: "Computer Science major",
        org: "Multimedia University (Malaysia)",
        description: "Studying Computer Science at Multimedia University in Malaysia.",
      },
    ],
  };

  var lang = window.__lang === "en" ? "en" : "ja";
  var originals = { text: new Map(), attr: new Map() };
  var listeners = [];
  var metaJa = null;

  function fill(str, vars) {
    return String(str).replace(/\{(\w+)\}/g, function (m, k) { return vars && k in vars ? vars[k] : m; });
  }

  function t(key, vars) {
    var table = lang === "en" ? EN : JA;
    var v = key in table ? table[key] : (JA[key] != null ? JA[key] : key);
    return fill(v, vars);
  }

  function merge(base, over) {
    if (!over) return base;
    var out = {};
    Object.keys(base).forEach(function (k) { out[k] = base[k]; });
    Object.keys(over).forEach(function (k) { out[k] = over[k]; });
    return out;
  }

  /* データ（data.js）を今の言語で返す */
  function data(name) {
    var src = { PROFILE: PROFILE, STATS: STATS, SKILLS: SKILLS, PROJECTS: PROJECTS, PROJECT_GROUPS: PROJECT_GROUPS, EXPERIENCE: EXPERIENCE }[name];
    if (lang !== "en") return src;
    var en = DATA_EN[name];
    if (name === "PROFILE") return merge(src, en);
    if (name === "PROJECTS") return src.map(function (p) { return merge(p, en[p.title]); });
    return src.map(function (item, i) { return merge(item, en[i]); });
  }

  function applyStatic() {
    var root = document.documentElement;
    root.lang = lang;

    Array.prototype.forEach.call(document.querySelectorAll("[data-i18n]"), function (el) {
      if (!originals.text.has(el)) originals.text.set(el, el.innerHTML);
      var key = el.getAttribute("data-i18n");
      el.innerHTML = lang === "en" && key in EN ? EN[key] : originals.text.get(el);
      var langKey = el.getAttribute("data-i18n-lang");
      if (langKey) {
        if (!el.hasAttribute("data-i18n-lang-orig")) el.setAttribute("data-i18n-lang-orig", el.getAttribute("lang") || "");
        var l = lang === "en" && langKey in EN ? EN[langKey] : el.getAttribute("data-i18n-lang-orig");
        if (l) el.setAttribute("lang", l); else el.removeAttribute("lang");
      }
    });

    Array.prototype.forEach.call(document.querySelectorAll("[data-i18n-attr]"), function (el) {
      if (!originals.attr.has(el)) originals.attr.set(el, {});
      var store = originals.attr.get(el);
      el.getAttribute("data-i18n-attr").split(";").forEach(function (pair) {
        var bits = pair.split("=");
        var attr = (bits[0] || "").trim(), key = (bits[1] || "").trim();
        if (!attr || !key) return;
        if (!(attr in store)) store[attr] = el.getAttribute(attr);
        el.setAttribute(attr, lang === "en" && key in EN ? EN[key] : store[attr]);
      });
    });

    // タイトルと説明文
    var desc = document.querySelector('meta[name="description"]');
    if (!metaJa) metaJa = { title: document.title, desc: desc ? desc.getAttribute("content") : "" };
    document.title = lang === "en" ? EN["meta.title"] : metaJa.title;
    if (desc) desc.setAttribute("content", lang === "en" ? EN["meta.description"] : metaJa.desc);
    var ogLocale = document.querySelector('meta[property="og:locale"]');
    if (ogLocale) ogLocale.setAttribute("content", lang === "en" ? "en_US" : "ja_JP");

    // 切り替えボタン
    Array.prototype.forEach.call(document.querySelectorAll(".lang-switch__btn"), function (b) {
      var on = b.getAttribute("data-lang") === lang;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-pressed", String(on));
    });
  }

  function set(next, persist) {
    next = next === "en" ? "en" : "ja";
    if (persist) { try { window.localStorage.setItem(STORAGE_KEY, next); } catch (e) { /* noop */ } }
    if (next === lang) return;
    lang = next;
    applyStatic();
    listeners.forEach(function (fn) { try { fn(lang); } catch (e) { /* noop */ } });
  }

  function onChange(fn) { listeners.push(fn); }

  // 起動時：静的な文章をすぐ差し替え、ボタンを有効化
  applyStatic();
  document.addEventListener("click", function (event) {
    var b = event.target.closest && event.target.closest(".lang-switch__btn");
    if (!b) return;
    event.preventDefault();
    set(b.getAttribute("data-lang"), true);
  });

  return { t: t, data: data, set: set, onChange: onChange, get lang() { return lang; } };
})();
