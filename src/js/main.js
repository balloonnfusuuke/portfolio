/* ==========================================================================
   main.js — 表示のロジック（ライブラリなし）
   data.js の内容を読み取って各セクションを組み立てます。
   ========================================================================== */

/* --- オープニングの設定（数字を変えるだけで調整できます） -------------------
   秒数は動画の再生位置（秒）、位置・大きさは「画面に描画された映像の枠」に対する割合です。 */
const OPENING = {
  videoSrc: "assets/opening.mp4",              // デスクトップ用（1280×720）
  videoSrcMobile: "assets/opening-mobile.mp4", // スマホ用（854×480・軽量）
  mobileMaxWidth: 900,                         // 画面の短辺がこの px 以下ならスマホ用を使う

  // 都市ラベル：show 秒でフェードイン開始 → hide 秒でフェードアウト完了（動画の再生位置で制御）
  // x / y は映像枠の左上を 0、右下を 1 とした位置。同じ位置に出すので、次の show は前の hide 以降にすること（重なり防止）
  // 地球儀は映像枠の x 0.30–0.69 / y 0.13–0.87（影込み）に収まる → ラベルは地球儀の右横（x 0.845）に置く
  // 飛行機：日本→NZ 0.4–2.0s ／ NZ→日本 2.05–3.65s ／ 日本→マレーシア 3.7–5.3s
  cityFade: 0.35,                         // フェードの長さ（秒）
  cities: [
    { name: "Osaka",     sub: "Japan",       show: 0.2,  hide: 1.8,  x: 0.845, y: 0.5 },  // 出発
    { name: "Hamilton",  sub: "New Zealand", show: 1.8,  hide: 3.5,  x: 0.845, y: 0.5 },  // NZ 到着
    { name: "Osaka",     sub: "Japan",       show: 3.5,  hide: 4.3,  x: 0.845, y: 0.5 },  // 日本へ戻る
    { name: "Cyberjaya", sub: "Malaysia",    show: 4.9,  hide: 6.4,  x: 0.845, y: 0.5 },  // マレーシア到着
  ],
  // 縦長の画面（スマホ縦など）：映像の下に余白が cityBelowMin px 以上あれば、ラベルは映像の「下」の余白に出す
  // 位置は映像の下端から「余白 × cityBelowRatio」（cityBelowOffsetMin〜Max px に収める）
  cityBelowMin: 140,
  cityBelowRatio: 0.3,
  cityBelowOffsetMin: 56,
  cityBelowOffsetMax: 120,

  // 最終フレームのボール：中心位置（映像枠の幅・高さに対する割合）と見えている直径（映像枠の「幅」に対する割合）
  // opening.mp4 の最終フレームから円フィットで計測（中心 648.1, 358.1 px／直径 402.8 px @1280×720）
  ballCenterX: 0.5063,
  ballCenterY: 0.4974,
  ballDiameter: 0.3147,
  ballSvgCircle: 0.98,                    // SVG の円（外周）が viewBox に占める割合（r46 + 線3 = 49/50）

  // ボールが名前の「.」へ飛ぶ動き（FLIP）
  flipDuration: 900,                      // ms
  flipEasing: "cubic-bezier(.16,1,.3,1)",
  flipSpin: 720,                          // 飛ぶ間の回転量（deg）

  overlayFade: 900,                       // オーバーレイが消える時間（ms）
  fallbackTimeout: 5000,                  // この時間（ms）たっても再生が始まらなければヒーローへ
  storageKey: "fy-opening-seen",          // 2回目以降はスキップ（localStorage）
};

(function () {
  "use strict";

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  };

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /* ======================================================================
     1. 画面の組み立て
     ====================================================================== */

  function renderText() {
    var lead = $("#heroLead");
    if (lead) lead.textContent = I18N.data("PROFILE").lead;

    var contacts = CONTACTS || {};
    var email = $("#contactEmail");
    var github = $("#contactGithub");
    var linkedin = $("#contactLinkedin");

    if (email) {
      email.href = "mailto:" + contacts.email;
      var emailValue = email.querySelector("[data-contact]");
      if (emailValue) emailValue.textContent = contacts.email;
    }
    if (github) {
      github.href = contacts.github;
      var githubValue = github.querySelector("[data-contact]");
      if (githubValue) githubValue.textContent = contacts.github.replace(/^https?:\/\/(www\.)?/, "");
    }
    if (linkedin) {
      linkedin.href = contacts.linkedin;
      var linkedinValue = linkedin.querySelector("[data-contact]");
      if (linkedinValue) linkedinValue.textContent = contacts.linkedin.replace(/^https?:\/\/(www\.)?/, "");
    }

    var year = $("#year");
    if (year) year.textContent = new Date().getFullYear();
  }

  function renderStats() {
    var list = $("#statsList");
    if (!list) return;

    list.innerHTML = I18N.data("STATS").map(function (stat) {
      return (
        '<li class="stats__item">' +
          '<span class="stats__value" data-target="' + Number(stat.value) + '">0</span>' +
          '<span class="stats__suffix">' + escapeHtml(stat.suffix || "") + "</span>" +
          '<span class="stats__label">' + escapeHtml(stat.label) + "</span>" +
          (stat.note ? '<span class="stats__note">' + escapeHtml(stat.note) + "</span>" : "") +
        "</li>"
      );
    }).join("");
  }

  function renderSkills() {
    var grid = $("#skillsGrid");
    if (!grid) return;

    grid.innerHTML = I18N.data("SKILLS").map(function (group) {
      var list = (group.items || []).map(function (item) {
        return typeof item === "string" ? { name: item } : item;
      });
      var hasLevel = list.some(function (item) { return typeof item.level === "number"; });

      // level が無いグループはタグ表示
      if (!hasLevel) {
        var chips = list.map(function (item) {
          return '<li class="skill-chip">' + escapeHtml(item.name) + "</li>";
        }).join("");

        return (
          '<article class="skill-card" data-reveal>' +
            '<header class="skill-card__head">' +
              '<h3 class="skill-card__title">' + escapeHtml(group.title) + "</h3>" +
              '<span class="skill-card__caption">' + escapeHtml(group.caption || "") + "</span>" +
            "</header>" +
            '<ul class="skill-card__chips">' + chips + "</ul>" +
          "</article>"
        );
      }

      var items = list.map(function (item) {
        var level = Math.max(0, Math.min(100, Number(item.level) || 0));
        return (
          '<li class="skill">' +
            '<div class="skill__top">' +
              '<span class="skill__name">' + escapeHtml(item.name) + "</span>" +
              '<span class="skill__level">' + level + "</span>" +
            "</div>" +
            '<div class="skill__track">' +
              '<span class="skill__bar" style="--val: ' + level + '%"></span>' +
            "</div>" +
          "</li>"
        );
      }).join("");

      return (
        '<article class="skill-card" data-reveal>' +
          '<header class="skill-card__head">' +
            '<h3 class="skill-card__title">' + escapeHtml(group.title) + "</h3>" +
            '<span class="skill-card__caption">' + escapeHtml(group.caption || "") + "</span>" +
          "</header>" +
          '<ul class="skill-card__list">' + items + "</ul>" +
        "</article>"
      );
    }).join("");
  }

  function categoriesOf(project) {
    return project.categories || (project.category ? [project.category] : []);
  }

  function projectCard(project, index) {
    var cats = categoriesOf(project);
    var badge = cats.map(function (c) { return I18N.t("filter." + c); }).join(" · ");
    var initial = (project.title || "?").trim().charAt(0).toUpperCase();
    var tags = (project.tags || []).map(function (tag) {
      return "<li>" + escapeHtml(tag) + "</li>";
    }).join("");

    var pair = project.images && project.images.length > 1;
    var thumb = pair
      ? '<div class="project-card__pair">' +
          '<div class="project-card__spin">' +
          project.images.map(function (shot, faceIndex) {
            return '<figure class="project-card__face' + (faceIndex === 0 ? "" : " is-rear") + '">' +
              '<img src="' + escapeHtml(shot.src) + '" alt="' + escapeHtml(I18N.t(shot.labelKey)) + '" width="1024" height="645" loading="lazy" decoding="async">' +
              '<figcaption>' + escapeHtml(I18N.t(shot.labelKey)) + '</figcaption>' +
            '</figure>';
          }).join("") +
          '</div></div>'
      : project.image
      ? '<img class="project-card__img" src="' + escapeHtml(project.image) + '" alt="' +
          escapeHtml(I18N.t(project.live ? "card.shot" : "card.image", { title: project.title })) +
          '" width="1280" height="800" loading="lazy" decoding="async">'
      : "";

    var links = "";
    if (project.live) {
      links += '<a class="project-card__link project-card__link--ext" href="' + escapeHtml(project.live) +
        '" target="_blank" rel="noopener noreferrer">' + escapeHtml(I18N.t("card.viewSite")) + '</a>';
    }
    if (project.github) {
      links += '<a class="project-card__link project-card__link--ext project-card__link--sub" href="' +
        escapeHtml(project.github) + '" target="_blank" rel="noopener noreferrer"' +
        ' aria-label="' + escapeHtml(I18N.t("card.github", { title: project.title })) + '">GitHub</a>';
    }

    return (
      '<article class="project-card' + (project.featured ? " project-card--lead" : "") + '" style="transition-delay: ' + (index % 3) * 70 + 'ms">' +
        '<div class="project-card__thumb' + (thumb ? " has-image" : "") + (pair ? " has-pair" : "") + '">' +
          '<span class="project-card__badge">' + escapeHtml(badge) + "</span>" +
          '<span class="project-card__initial" aria-hidden="true">' + escapeHtml(initial) + "</span>" +
          thumb +
          (project.promo && project.promoModal
            ? '<button class="project-card__play project-card__play--modal" type="button" data-promo="' + escapeHtml(project.promo) + '"' +
              ' data-modal="1" aria-haspopup="dialog"' +
              ' aria-label="' + escapeHtml(I18N.t("card.watchPromoLabel", { title: project.title, duration: project.promoDuration || "" })) + '"' +
              ' data-title="' + escapeHtml(project.title) + '" data-duration="' + escapeHtml(project.promoDuration || "") + '">' +
              '<span class="project-card__play-icon" aria-hidden="true"></span><span class="project-card__play-text">' + escapeHtml(I18N.t("card.watchPromo")) + '</span>' +
              (project.promoDuration ? '<span class="project-card__play-time">' + escapeHtml(project.promoDuration) + '</span>' : "") +
              '</button>'
            : project.promo
            ? '<button class="project-card__play" type="button" data-promo="' + escapeHtml(project.promo) + '"' +
              ' aria-label="' + escapeHtml(I18N.t("card.playLabel", { title: project.title })) + '"' +
              ' data-title="' + escapeHtml(project.title) + '">' +
              '<span class="project-card__play-icon" aria-hidden="true"></span><span class="project-card__play-text">' + escapeHtml(I18N.t("card.play")) + '</span></button>'
            : "") +
        "</div>" +
        '<div class="project-card__body">' +
          '<div class="project-card__head">' +
            '<h4 class="project-card__title">' + escapeHtml(project.title) + "</h4>" +
            (project.year ? '<span class="project-card__year">' + escapeHtml(project.year) + "</span>" : "") +
          "</div>" +
          (project.status ? '<p class="project-card__status">' + escapeHtml(project.status) + "</p>" : "") +
          '<p class="project-card__text">' + escapeHtml(project.description) + "</p>" +
          '<ul class="project-card__tags">' + tags + "</ul>" +
          (links ? '<div class="project-card__links">' + links + "</div>" : "") +
        "</div>" +
      "</article>"
    );
  }

  var currentFilter = "all";

  function projectMatches(project, filter) {
    return !filter || filter === "all" || categoriesOf(project).indexOf(filter) !== -1;
  }

  function renderProjects(filter) {
    var grid = $("#projectsGrid");
    if (!grid) return;

    currentFilter = filter || "all";
    var byTitle = {};
    I18N.data("PROJECTS").forEach(function (project) { byTitle[project.title] = project; });

    var shown = 0;
    var html = (I18N.data("PROJECT_GROUPS") || []).map(function (group) {
      var list = (group.titles || []).map(function (title) {
        return byTitle[title];
      }).filter(function (project) {
        return project && projectMatches(project, currentFilter);
      });
      if (!list.length) return "";
      shown += list.length;
      return (
        '<section class="project-group">' +
          '<header class="project-group__head">' +
            '<h3 class="project-group__title">' + escapeHtml(group.title) + "</h3>" +
            (group.lead ? '<p class="project-group__lead">' + escapeHtml(group.lead) + "</p>" : "") +
          "</header>" +
          '<div class="projects">' +
            list.map(projectCard).join("") +
          "</div>" +
        "</section>"
      );
    }).join("");

    grid.innerHTML = shown
      ? html
      : '<p class="projects__empty">' + escapeHtml(I18N.t("projects.empty")) + "</p>";

    // 画像が読めなかったときは、元のイニシャル表示に戻す
    $$(".project-card__img", grid).forEach(function (img) {
      img.addEventListener("error", function () {
        if (img.parentNode) img.parentNode.classList.remove("has-image");
        img.remove();
      });
    });

    observe($$(".project-card", grid));
    $$(".project-card__thumb", grid).forEach(setupPromo);
  }

  function renderExperience() {
    var timeline = $("#timeline");
    if (!timeline) return;

    timeline.innerHTML = I18N.data("EXPERIENCE").map(function (item) {
      var tags = (item.tags || []).map(function (tag) {
        return "<li>" + escapeHtml(tag) + "</li>";
      }).join("");

      return (
        '<li class="timeline__item">' +
          '<span class="timeline__dot" aria-hidden="true"></span>' +
          '<span class="timeline__period">' + escapeHtml(item.period) + "</span>" +
          '<div class="timeline__card">' +
            '<h3 class="timeline__title">' + escapeHtml(item.title) + "</h3>" +
            (item.org ? '<p class="timeline__org">' + escapeHtml(item.org) + "</p>" : "") +
            (item.description ? '<p class="timeline__text">' + escapeHtml(item.description) + "</p>" : "") +
            (tags ? '<ul class="timeline__tags">' + tags + "</ul>" : "") +
          "</div>" +
        "</li>"
      );
    }).join("");
  }

  /* ======================================================================
     2. スクロールでの出現（IntersectionObserver）
     ====================================================================== */

  var revealObserver = null;

  function observe(elements) {
    var targets = elements || $$("[data-reveal]");
    if (!targets.length) return;

    if (reduced || !("IntersectionObserver" in window)) {
      targets.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    if (!revealObserver) {
      revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          el.classList.add("is-visible");
          revealObserver.unobserve(el);

          // 順番待ちのディレイがホバーにも効いてしまうので、終わったら外す
          if (el.style.transitionDelay) {
            window.setTimeout(function () { el.style.transitionDelay = ""; }, 1000);
          }
        });
      }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });
    }

    targets.forEach(function (el) { revealObserver.observe(el); });
  }

  /* 経歴は順番に少し遅らせて出す */
  function stampTimeline() {
    $$(".timeline__item").forEach(function (item, index) {
      var delay = Math.min(index * 90, 360);
      if (delay) item.style.transitionDelay = delay + "ms";
    });
    observe($$(".timeline__item"));
  }

  /* 同じ親に並ぶ要素は、少しずつ時差で表示する（最大 4 段階） */
  function stampStagger() {
    var gap = 90;

    $$("[data-reveal]").forEach(function (el) {
      var parent = el.parentNode;
      if (!parent) return;

      var siblings = Array.prototype.filter.call(parent.children, function (child) {
        return child.hasAttribute && child.hasAttribute("data-reveal");
      });

      var index = siblings.indexOf(el);
      if (index < 1) return;

      var delay = Math.min(index * gap, gap * 4);
      el.style.transitionDelay = delay + "ms";
    });
  }

  /* ======================================================================
     3. About の数字をカウントアップ
     ====================================================================== */

  function countUp(el, target) {
    if (reduced) {
      el.textContent = target.toLocaleString();
      return;
    }

    var duration = 1500;
    var start = null;

    function step(now) {
      if (start === null) start = now;
      var progress = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      el.textContent = Math.round(target * eased).toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  function setupCounters() {
    var values = $$(".stats__value");
    if (!values.length) return;

    if (reduced || !("IntersectionObserver" in window)) {
      values.forEach(function (el) { countUp(el, Number(el.dataset.target)); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        countUp(entry.target, Number(entry.target.dataset.target));
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.6 });

    values.forEach(function (el) { observer.observe(el); });
  }

  /* ======================================================================
     4. 肩書きの切り替え
     ====================================================================== */

  function setupRoleRotation() {
    var el = $("#roleText");
    var roles = (PROFILE.roles || []).filter(Boolean);
    if (!el || roles.length < 2) return;

    el.textContent = roles[0];
    var index = 0;

    window.setInterval(function () {
      index = (index + 1) % roles.length;

      if (reduced) {
        el.textContent = roles[index];
        return;
      }

      el.classList.add("is-hiding");
      window.setTimeout(function () {
        el.textContent = roles[index];
        el.classList.remove("is-hiding");
      }, 350);
    }, 2800);
  }

  /* ======================================================================
     5. 進捗バー・ナビ・現在地
     ====================================================================== */

  function setupScrollUI() {
    var nav = $("#nav");
    var bar = $("#progressBar");
    var ticking = false;

    function update() {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      var height = document.documentElement.scrollHeight - window.innerHeight;

      if (bar) {
        var ratio = height > 0 ? Math.min(scrollTop / height, 1) : 0;
        bar.style.width = (ratio * 100) + "%";
      }

      if (nav) nav.classList.toggle("is-scrolled", scrollTop > 20);
      ticking = false;
    }

    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }, { passive: true });

    window.addEventListener("resize", update);
    update();
  }

  // 現在地のナビ：画面上部 40% のラインを越えた最後のセクションを強調。
  // ヒーロー（ナビにないセクション）にいる間は、どのリンクも強調しない。
  function setupActiveLink() {
    var links = $$(".nav__link");
    if (!links.length) return;
    var hero = $("#hero");
    var sections = links
      .map(function (link) { return $(link.getAttribute("href")); })
      .filter(Boolean);
    if (hero) sections.unshift(hero);
    if (!sections.length) return;

    var current = null;
    var ticking = false;

    function update() {
      ticking = false;
      var line = window.innerHeight * 0.4;
      var active = null;
      sections.forEach(function (section) {
        if (section.getBoundingClientRect().top <= line) active = section;
      });
      // ページ最下部では最後のセクション（Contact）を強調
      var doc = document.documentElement;
      if (window.innerHeight + (window.pageYOffset || doc.scrollTop) >= doc.scrollHeight - 2 && (window.pageYOffset || doc.scrollTop) > 0) {
        active = sections[sections.length - 1];
      }
      var id = active && active !== hero ? active.id : null;
      if (id === current) return;
      current = id;
      links.forEach(function (link) {
        var on = id !== null && link.getAttribute("href") === "#" + id;
        link.classList.toggle("is-active", on);
        if (on) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      });
    }

    function request() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }

    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    window.addEventListener("load", request);
    update();
  }

  function setupMobileNav() {
    var toggle = $("#navToggle");
    var links = $("#navLinks");
    if (!toggle || !links) return;

    function close() {
      links.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", I18N.t("nav.open"));
    }

    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", I18N.t(open ? "nav.close" : "nav.open"));
    });

    $$(".nav__link", links).forEach(function (link) {
      link.addEventListener("click", close);
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 760) close();
    });
  }

  /* ======================================================================
     6. プロジェクトの絞り込み（切り替え時にフェード）
     ====================================================================== */

  function setupFilters() {
    var wrap = $("#projectFilters");
    var grid = $("#projectsGrid");
    if (!wrap || !grid) return;

    wrap.addEventListener("click", function (event) {
      var button = event.target.closest(".filter");
      if (!button || button.classList.contains("is-active")) return;

      $$(".filter", wrap).forEach(function (el) { el.classList.remove("is-active"); });
      button.classList.add("is-active");

      var filter = button.dataset.filter;
      var delay = reduced ? 0 : 260;

      grid.classList.add("is-fading");
      window.setTimeout(function () {
        renderProjects(filter);
        grid.classList.remove("is-fading");
      }, delay);
    });
  }


  /* ======================================================================
     6b. プロジェクトの紹介動画
     - マウス操作の端末：サムネイルにホバーすると短いループ（無音）を再生
     - クリック／タップ：「動画を見る」で約16秒の紹介動画（無音・コントロール付き）
     - 動画はすべて操作されてから読み込む（ページ表示時には読み込まない）
     ====================================================================== */
  var PROMO_DIR = "assets/promo/";
  var canHover = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var promoObserver = null;

  function makeVideo(className, src, poster, loop) {
    var v = document.createElement("video");
    v.className = className;
    v.muted = true;
    v.defaultMuted = true;
    v.playsInline = true;
    v.setAttribute("muted", "");
    v.setAttribute("playsinline", "");
    v.setAttribute("webkit-playsinline", "");
    v.preload = "none";
    if (loop) v.loop = true;
    if (poster) v.poster = poster;
    v.src = src;
    return v;
  }

  function pausePromoWhenHidden(video) {
    if (!("IntersectionObserver" in window)) return;
    if (!promoObserver) {
      promoObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting && !entry.target.paused) entry.target.pause();
        });
      }, { threshold: 0.1 });
    }
    promoObserver.observe(video);
  }

  function setupPromo(thumb) {
    var button = thumb.querySelector(".project-card__play");
    if (!button) return;
    var name = button.getAttribute("data-promo");
    var img = thumb.querySelector(".project-card__img");
    var poster = img ? img.getAttribute("src") : PROMO_DIR + name + "-poster.jpg";
    var loopVideo = null;
    var fullVideo = null;

    function play(v) {
      var r = v.play();
      if (r && typeof r.catch === "function") r.catch(function () { /* 自動再生不可でも何もしない */ });
    }

    // ホバー：短いループ
    if (canHover && !reduced) {
      thumb.addEventListener("mouseenter", function () {
        if (fullVideo) return;
        if (!loopVideo) {
          loopVideo = makeVideo("project-card__video project-card__video--loop", PROMO_DIR + name + "-loop.mp4", poster, true);
          loopVideo.setAttribute("aria-hidden", "true");
          loopVideo.tabIndex = -1;
          loopVideo.addEventListener("playing", function () { loopVideo.classList.add("is-on"); });
          thumb.insertBefore(loopVideo, button);
        }
        play(loopVideo);
        if (loopVideo.readyState > 2) loopVideo.classList.add("is-on");
      });
      thumb.addEventListener("mouseleave", function () {
        if (!loopVideo) return;
        loopVideo.classList.remove("is-on");
        loopVideo.pause();
      });
    }

    function closeFull() {
      if (!fullVideo) return;
      fullVideo.pause();
      fullVideo.remove();
      fullVideo = null;
      thumb.classList.remove("is-playing");
      button.setAttribute("aria-label", I18N.t("card.playLabel", { title: button.getAttribute("data-title") }));
      button.querySelector(".project-card__play-text").textContent = I18N.t("card.play");
    }

    button.addEventListener("click", function (event) {
      event.preventDefault();
      if (button.hasAttribute("data-modal")) {
        if (loopVideo) { loopVideo.classList.remove("is-on"); loopVideo.pause(); }
        openPromoModal(name, button.getAttribute("data-title"), button.getAttribute("data-duration"), button);
        return;
      }
      if (fullVideo) { closeFull(); return; }
      if (loopVideo) { loopVideo.classList.remove("is-on"); loopVideo.pause(); }
      fullVideo = makeVideo("project-card__video project-card__video--full is-on", PROMO_DIR + name + ".mp4",
        PROMO_DIR + name + "-poster.jpg", false);
      fullVideo.preload = "auto";
      fullVideo.controls = true;
      fullVideo.setAttribute("aria-label", I18N.t("card.videoLabel", { title: button.getAttribute("data-title") }));
      fullVideo.addEventListener("ended", closeFull);
      thumb.insertBefore(fullVideo, button);
      thumb.classList.add("is-playing");
      button.setAttribute("aria-label", I18N.t("card.closeLabel"));
      button.querySelector(".project-card__play-text").textContent = I18N.t("card.close");
      pausePromoWhenHidden(fullVideo);
      play(fullVideo);
    });
  }

  /* ----------------------------------------------------------------------
     6c. 紹介動画のモーダル（promoModal: true のプロジェクト）
     - 長い・音声ありの動画を大きく表示。ユーザーの操作で開くので音声オンで再生できる
     - 閉じる：×ボタン／背景クリック／Esc。閉じたら停止して読み込みを解除
     ---------------------------------------------------------------------- */
  var promoModal = null;

  function openPromoModal(name, title, duration, opener) {
    closePromoModal();
    var wrap = document.createElement("div");
    wrap.className = "promo-modal";
    wrap.setAttribute("role", "dialog");
    wrap.setAttribute("aria-modal", "true");
    wrap.setAttribute("aria-label", I18N.t("modal.label", { title: title }));
    wrap.innerHTML =
      '<div class="promo-modal__backdrop" data-close="1"></div>' +
      '<div class="promo-modal__panel">' +
        '<div class="promo-modal__head">' +
          '<p class="promo-modal__title">' + escapeHtml(title) +
            (duration ? ' <span class="promo-modal__note">' + escapeHtml(I18N.t("modal.note", { duration: duration })) + "</span>" : "") +
          "</p>" +
          '<button class="promo-modal__close" type="button" data-close="1" aria-label="' + escapeHtml(I18N.t("modal.closeLabel")) + '">' +
            '<span aria-hidden="true">×</span><span class="promo-modal__close-text">' + escapeHtml(I18N.t("modal.close")) + "</span></button>" +
        "</div>" +
        '<div class="promo-modal__frame"></div>' +
      "</div>";

    var video = document.createElement("video");
    video.className = "promo-modal__video";
    video.controls = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    video.preload = "auto";
    video.poster = PROMO_DIR + name + "-poster.jpg";
    video.src = PROMO_DIR + name + ".mp4";
    video.setAttribute("aria-label", I18N.t("card.videoLabel", { title: title }));
    wrap.querySelector(".promo-modal__frame").appendChild(video);

    function onKey(event) {
      if (event.key === "Escape") { event.preventDefault(); closePromoModal(); }
      if (event.key === "Tab") {
        // フォーカスをモーダル内にとどめる（×ボタン ⇄ 動画）
        var items = [wrap.querySelector(".promo-modal__close"), video];
        var i = items.indexOf(document.activeElement);
        event.preventDefault();
        items[(i + (event.shiftKey ? items.length - 1 : 1)) % items.length].focus();
      }
    }
    wrap.addEventListener("click", function (event) {
      if (event.target.closest("[data-close]")) closePromoModal();
    });
    document.addEventListener("keydown", onKey);

    document.body.appendChild(wrap);
    document.documentElement.classList.add("has-promo-modal");
    promoModal = { el: wrap, video: video, onKey: onKey, opener: opener };
    window.requestAnimationFrame(function () { wrap.classList.add("is-open"); });
    wrap.querySelector(".promo-modal__close").focus();

    var r = video.play();
    if (r && typeof r.catch === "function") r.catch(function () { /* 再生がブロックされたら、コントロールから再生してもらう */ });
  }

  function closePromoModal() {
    if (!promoModal) return;
    var m = promoModal;
    promoModal = null;
    document.removeEventListener("keydown", m.onKey);
    try { m.video.pause(); } catch (e) { /* noop */ }
    m.video.removeAttribute("src");
    try { m.video.load(); } catch (e) { /* noop */ }
    m.el.remove();
    document.documentElement.classList.remove("has-promo-modal");
    if (m.opener && document.contains(m.opener)) m.opener.focus();
  }

  /* ======================================================================
     7. フォーム（送信するとメールアプリを開く：mailto）
     ====================================================================== */

  function setupForm() {
    var form = $("#contactForm");
    var note = $("#formNote");
    if (!form) return;

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var name = form.elements.name.value.trim();
      var email = form.elements.email.value.trim();
      var message = form.elements.message.value.trim();
      var valid = name && /.+@.+\..+/.test(email) && message;

      if (valid) {
        var to = (CONTACTS && CONTACTS.email) || "";
        var subject = form.elements.subject.value.trim() || I18N.t("form.mailSubject");
        var body = message + "\n\n――――――――\n" + I18N.t("form.bodyName") + name + "\n" + I18N.t("form.bodyEmail") + email;
        window.location.href = "mailto:" + to +
          "?subject=" + encodeURIComponent(subject) +
          "&body=" + encodeURIComponent(body);
      }

      if (!note) return;

      note.textContent = valid
        ? I18N.t("form.ok", { email: (CONTACTS && CONTACTS.email) || "" })
        : I18N.t("form.ng");
      note.classList.add("is-shown");

      window.clearTimeout(note._timer);
      note._timer = window.setTimeout(function () {
        note.classList.remove("is-shown");
      }, valid ? 9000 : 4200);
    });
  }

  /* ======================================================================
     8. オープニング（動画 → ボールが名前の「.」へ飛ぶ）
     設定はファイル先頭の OPENING にまとめてあります。
     ====================================================================== */

  // スマホ判定：画面幅が狭い、またはタッチ端末で短辺が小さい場合だけ軽量版
  // （デスクトップは画面の高さが 900px 以下でも通常版を使う）
  function pickOpeningSrc() {
    if (!OPENING.videoSrcMobile) return OPENING.videoSrc;
    var max = OPENING.mobileMaxWidth;
    var vw = window.innerWidth || document.documentElement.clientWidth || 0;
    if (vw && vw <= max) return OPENING.videoSrcMobile;
    var touch = window.matchMedia && window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    var s = window.screen || {};
    var shortSide = Math.min(s.width || vw, s.height || vw);
    if (touch && shortSide <= max) return OPENING.videoSrcMobile;
    return OPENING.videoSrc;
  }

  function setupOpening() {
    var root = document.documentElement;
    var overlay = $("#opening");
    var frame = $("#openingFrame");
    var video = $("#openingVideo");
    var cityWrap = $("#openingCities");
    var skip = $("#openingSkip");
    var ball = $("#openingBall");
    var heroDot = $("#heroDot");

    if (window.__openingFailsafe) window.clearTimeout(window.__openingFailsafe);

    // オープニングなし（2回目以降・reduced-motion・ページ途中へのリンク・JSのみ失敗など）
    if (!root.classList.contains("is-opening") || !overlay || !video || !ball || !heroDot) {
      root.classList.remove("is-opening");
      if (overlay) overlay.remove();
      if (ball) ball.remove();
      return;
    }

    var state = { playing: false, finished: false, loadTimer: 0, stallTimer: 0, raf: 0 };
    overlay.style.transitionDuration = OPENING.overlayFade + "ms";

    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    // スマホでのスクロールを止める（overflow: hidden だけでは iOS で動くため）
    function blockTouch(event) {
      if (!event.target.closest || !event.target.closest(".opening__skip")) event.preventDefault();
    }
    overlay.addEventListener("touchmove", blockTouch, { passive: false });

    /* --- 都市ラベル --- */
    var labels = (OPENING.cities || []).map(function (city) {
      var el = document.createElement("span");
      el.className = "opening__city";
      el.innerHTML =
        '<span class="opening__city-name">' + escapeHtml(city.name) + "</span>" +
        (city.sub ? '<span class="opening__city-sub">' + escapeHtml(city.sub) + "</span>" : "");
      cityWrap.appendChild(el);
      return { el: el, show: city.show, hide: city.hide, x: city.x, y: city.y };
    });

    // ラベルの置き場所：横長 → 地球儀の右横（city.x / city.y）、縦長 → 映像の下の余白
    function placeCities(w, h, vh) {
      var space = (vh - h) / 2;
      var below = space >= OPENING.cityBelowMin;
      cityWrap.classList.toggle("is-below", below);
      var offset = Math.max(OPENING.cityBelowOffsetMin,
        Math.min(OPENING.cityBelowOffsetMax, space * OPENING.cityBelowRatio));
      labels.forEach(function (label) {
        label.el.style.left = below ? "50%" : (label.x * 100) + "%";
        label.el.style.top = below ? (h + offset) + "px" : (label.y * 100) + "%";
      });
    }

    // 再生位置から不透明度を直接計算（show〜show+fade で出現、hide-fade〜hide で消える）
    function cityOpacity(t, label) {
      var fade = Math.max(0.01, OPENING.cityFade || 0.35);
      if (t <= label.show || t >= label.hide) return 0;
      return Math.min(1, (t - label.show) / fade, (label.hide - t) / fade);
    }

    function tickCities() {
      if (state.finished) return;
      var t = video.currentTime || 0;
      labels.forEach(function (label) {
        var o = cityOpacity(t, label);
        var eased = o * o * (3 - 2 * o); // smoothstep
        label.el.style.opacity = eased.toFixed(3);
        label.el.style.transform = "translate(-50%, -50%) translateY(" + ((1 - eased) * 10).toFixed(2) + "px)";
        label.el.classList.toggle("is-shown", o > 0);
      });
      state.raf = window.requestAnimationFrame(tickCities);
    }

    function hideCities() {
      window.cancelAnimationFrame(state.raf);
      labels.forEach(function (label) {
        label.el.style.transition = "opacity 300ms ease";
        label.el.style.opacity = "0";
        label.el.classList.remove("is-shown");
      });
    }

    /* --- 映像の枠（object-fit: contain で実際に描画される範囲）に合わせる --- */
    function layoutFrame() {
      var vw = overlay.clientWidth || window.innerWidth;
      var vh = overlay.clientHeight || window.innerHeight;
      var ratio = video.videoWidth && video.videoHeight ? video.videoWidth / video.videoHeight : 16 / 9;
      var w = Math.min(vw, vh * ratio);
      var h = w / ratio;
      frame.style.width = w + "px";
      frame.style.height = h + "px";
      frame.style.setProperty("--fw", w + "px");
      placeCities(w, h, vh);
    }
    layoutFrame();
    window.addEventListener("resize", layoutFrame);
    video.addEventListener("loadedmetadata", layoutFrame);

    function markSeen() {
      try { window.localStorage.setItem(OPENING.storageKey, "1"); } catch (e) { /* noop */ }
    }

    function clearTimers() {
      window.clearTimeout(state.loadTimer);
      window.clearTimeout(state.stallTimer);
    }

    function cleanup() {
      window.removeEventListener("resize", layoutFrame);
      document.removeEventListener("keydown", onKey);
      try { video.pause(); } catch (e) { /* noop */ }
      video.removeAttribute("src");
      try { video.load(); } catch (e) { /* noop */ }
      overlay.remove();
      ball.remove();
      root.classList.remove("is-opening", "is-landing");
      if ("scrollRestoration" in history) history.scrollRestoration = "auto";
    }

    /* --- 失敗時：映像なしで、そのままヒーローへ --- */
    function goStraightToHero() {
      if (state.finished) return;
      state.finished = true;
      clearTimers();
      hideCities();
      try { video.pause(); } catch (e) { /* noop */ }

      root.classList.add("is-landing");
      root.classList.remove("is-opening");
      overlay.classList.add("is-leaving");
      window.setTimeout(cleanup, OPENING.overlayFade);
    }

    /* --- 映像の終わり／Skip：ボールに差し替えて「.」へ飛ばす（FLIP） --- */
    function flyToHero() {
      if (state.finished) return;

      // First：映像の最終フレーム上のボール位置
      var box = frame.getBoundingClientRect();
      var size = box.width * OPENING.ballDiameter / (OPENING.ballSvgCircle || 1);
      var cx = box.left + box.width * OPENING.ballCenterX;
      var cy = box.top + box.height * OPENING.ballCenterY;

      // Last：ヒーローの「.」（この時点ではまだ透明・transform なしなので最終位置そのもの）
      var dot = heroDot.getBoundingClientRect();
      if (!dot.width || !size) { goStraightToHero(); return; }

      state.finished = true;
      clearTimers();
      hideCities();
      markSeen();

      ball.style.width = size + "px";
      ball.style.height = size + "px";
      ball.style.left = (cx - size / 2) + "px";
      ball.style.top = (cy - size / 2) + "px";
      ball.style.transition = "none";
      ball.style.transform = "translate(0px, 0px) rotate(0deg) scale(1)";
      ball.classList.add("is-visible");

      // SVGのボールを重ねた同じフレームで映像を隠す → 切り替えが見えない
      video.style.visibility = "hidden";
      try { video.pause(); } catch (e) { /* noop */ }

      var dx = dot.left + dot.width / 2 - cx;
      var dy = dot.top + dot.height / 2 - cy;
      var scale = dot.width / size;

      ball.getBoundingClientRect(); // 開始位置を確定させる

      // Invert → Play：回転しながら縮んで「.」へ
      // 外周線（--ball-edge）も同時に「.」用の太さへ（CSS の @property で補間）
      ball.classList.add("is-flying");
      ball.style.transition = ["transform", "--ball-edge", "--ball-edge-o"].map(function (prop) {
        return prop + " " + OPENING.flipDuration + "ms " + OPENING.flipEasing;
      }).join(", ");
      ball.style.transform =
        "translate(" + dx + "px, " + dy + "px) rotate(" + OPENING.flipSpin + "deg) scale(" + scale + ")";

      // 同時に：オーバーレイが消え、名前・肩書き・ボタンが順に出る
      root.classList.add("is-landing", "has-intro");
      root.classList.remove("is-opening");
      overlay.classList.add("is-leaving");

      var landed = false;
      function land() {
        if (landed) return;
        landed = true;
        cleanup(); // 「.」が表示され、ゆっくり回転を始める
      }
      ball.addEventListener("transitionend", function (event) {
        if (event.propertyName === "transform") land();
      });
      window.setTimeout(land, Math.max(OPENING.flipDuration, OPENING.overlayFade) + 200);
    }

    function onKey(event) {
      if (event.key === "Escape") flyToHero();
    }

    skip.addEventListener("click", flyToHero);
    document.addEventListener("keydown", onKey);

    /* --- 再生 --- */
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");

    video.addEventListener("playing", function () {
      state.playing = true;
      window.clearTimeout(state.loadTimer);
      window.clearTimeout(state.stallTimer);
      overlay.classList.add("is-playing");
      window.cancelAnimationFrame(state.raf);
      tickCities();
    });
    video.addEventListener("waiting", function () {
      // 途中で読み込みが止まったまま fallbackTimeout を超えたらヒーローへ
      window.clearTimeout(state.stallTimer);
      state.stallTimer = window.setTimeout(goStraightToHero, OPENING.fallbackTimeout);
    });
    video.addEventListener("ended", flyToHero);
    video.addEventListener("error", goStraightToHero);

    // 読み込みが遅い・自動再生がブロックされた → fallbackTimeout 後にヒーローへ
    state.loadTimer = window.setTimeout(function () {
      if (!state.playing) goStraightToHero();
    }, OPENING.fallbackTimeout);

    video.src = pickOpeningSrc();
    var playing = video.play();
    if (playing && typeof playing.catch === "function") {
      playing.catch(function () {
        if (!state.finished) goStraightToHero(); // 自動再生ブロック・形式非対応など
      });
    }
  }

  /* ======================================================================
     8b. GitHub のコントリビューション（公開プロフィールのカレンダー）
     ====================================================================== */

  var contribState = "loading";
  var contribData = null;

  function setupContrib() {
    var root = $("#contrib");
    if (!root) return;
    contribState = "loading";
    drawContrib();
    fetch("https://github-contributions-api.jogruber.de/v4/balloonnfusuuke?y=last")
      .then(function (res) {
        if (!res.ok) throw new Error("status");
        return res.json();
      })
      .then(function (data) {
        if (!data || !data.contributions || !data.contributions.length) throw new Error("empty");
        contribData = data;
        contribState = "ready";
        drawContrib();
      })
      .catch(function () {
        contribState = "error";
        drawContrib();
      });
  }

  function contribWeeks(days) {
    var first = new Date(days[0].date + "T00:00:00");
    var cells = [];
    var pad = first.getDay();
    var i;
    for (i = 0; i < pad; i++) cells.push(null);
    days.forEach(function (day) { cells.push(day); });
    while (cells.length % 7 !== 0) cells.push(null);
    var weeks = [];
    for (i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
    return weeks;
  }

  function monthName(date) {
    var month = date.getMonth();
    if (I18N.lang === "en") {
      return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][month];
    }
    return (month + 1) + "月";
  }

  function drawContrib() {
    var root = $("#contrib");
    if (!root) return;
    var profile = (typeof CONTACTS !== "undefined" && CONTACTS.github) || "https://github.com/balloonnfusuuke";

    if (contribState === "loading") {
      root.innerHTML = '<p class="contrib__status">' + escapeHtml(I18N.t("activity.loading")) + "</p>";
      return;
    }

    if (contribState !== "ready" || !contribData) {
      root.innerHTML =
        '<p class="contrib__status">' + escapeHtml(I18N.t("activity.error")) +
        ' <a class="contrib__profile" href="' + escapeHtml(profile) + '" target="_blank" rel="noopener noreferrer">' +
        escapeHtml(I18N.t("activity.profile")) + "</a></p>";
      return;
    }

    var days = contribData.contributions;
    var total = contribData.total && typeof contribData.total.lastYear === "number"
      ? contribData.total.lastYear
      : days.reduce(function (sum, day) { return sum + (Number(day.count) || 0); }, 0);
    var weeks = contribWeeks(days);
    var today = days[days.length - 1] ? days[days.length - 1].date : "";
    var lastLabel = -99;

    var months = weeks.map(function (week, index) {
      var head = null;
      week.forEach(function (day) { if (!head && day) head = day; });
      if (!head) return "<span></span>";
      var date = new Date(head.date + "T00:00:00");
      var show = index === 0 || (date.getDate() <= 7 && index - lastLabel >= 3);
      if (!show) return "<span></span>";
      lastLabel = index;
      return "<span>" + escapeHtml(monthName(date)) + "</span>";
    }).join("");

    var grid = weeks.map(function (week) {
      var cells = "";
      for (var row = 0; row < 7; row++) {
        var day = week[row];
        if (!day) {
          cells += '<span class="contrib__day contrib__day--empty"></span>';
          continue;
        }
        var level = Math.max(0, Math.min(4, Number(day.level) || 0));
        cells += '<span class="contrib__day" data-level="' + level + '"' +
          (day.date === today ? ' data-today="1"' : "") +
          ' title="' + escapeHtml(I18N.t("activity.day", { date: day.date, count: day.count })) + '"></span>';
      }
      return '<div class="contrib__week">' + cells + "</div>";
    }).join("");

    var legend = [0, 1, 2, 3, 4].map(function (level) {
      return '<span class="contrib__day" data-level="' + level + '"></span>';
    }).join("");

    root.innerHTML =
      '<figure class="contrib">' +
        '<div class="contrib__scroll">' +
          '<div class="contrib__chart" role="img" aria-label="' +
            escapeHtml(I18N.t("activity.total", { count: total.toLocaleString() })) + '">' +
            '<div class="contrib__months" aria-hidden="true">' + months + "</div>" +
            '<div class="contrib__body">' +
              '<div class="contrib__dows" aria-hidden="true">' +
                "<span></span><span>" + escapeHtml(I18N.t("activity.dow1")) + "</span>" +
                "<span></span><span>" + escapeHtml(I18N.t("activity.dow3")) + "</span>" +
                "<span></span><span>" + escapeHtml(I18N.t("activity.dow5")) + "</span><span></span>" +
              "</div>" +
              '<div class="contrib__grid" aria-hidden="true">' + grid + "</div>" +
            "</div>" +
          "</div>" +
        "</div>" +
        '<figcaption class="contrib__foot">' +
          '<a class="contrib__profile" href="' + escapeHtml(profile) + '" target="_blank" rel="noopener noreferrer">' +
            escapeHtml(I18N.t("activity.profile")) + "</a>" +
          '<p class="contrib__total">' + escapeHtml(I18N.t("activity.total", { count: total.toLocaleString() })) + "</p>" +
          '<p class="contrib__legend">' +
            "<span>" + escapeHtml(I18N.t("activity.less")) + "</span>" + legend +
            "<span>" + escapeHtml(I18N.t("activity.more")) + "</span>" +
          "</p>" +
        "</figcaption>" +
      "</figure>";
  }

  /* ======================================================================
     8b. ヒーローの自作キャラクター（透明webmを順に再生）
     ====================================================================== */

  function setupCast() {
    var cast = document.querySelector(".hero__cast");
    var video = $("#castVideo");
    if (!cast || !video) return;

    var picks = $$(".hero__cast-picks .filter");
    var index = 0;
    var alphaChecked = false;

    function showFaces() {
      cast.classList.add("is-still");
      video.pause();
      video.removeAttribute("src");
      video.load();
    }

    function mark(i) {
      picks.forEach(function (btn, n) {
        var on = n === i;
        btn.classList.toggle("is-active", on);
        btn.setAttribute("aria-pressed", on ? "true" : "false");
      });
    }

    function play(i) {
      if (!picks[i]) return;
      index = i;
      mark(i);
      if (cast.classList.contains("is-still")) return;
      var clip = picks[i].getAttribute("data-clip");
      if (video.getAttribute("src") !== clip) video.src = clip;
      var pending = video.play();
      if (pending && pending.catch) pending.catch(function () { /* 自動再生が止まったときはボタンで再生 */ });
    }

    video.addEventListener("ended", function () {
      play((index + 1) % picks.length);
    });

    video.addEventListener("playing", function () {
      if (alphaChecked) return;
      alphaChecked = true;
      try {
        var canvas = document.createElement("canvas");
        canvas.width = 4;
        canvas.height = 4;
        var ctx = canvas.getContext("2d", { willReadFrequently: true });
        ctx.drawImage(video, 0, 0, 4, 4);
        var px = ctx.getImageData(0, 0, 1, 1).data;
        // 透明が落ちて黒背景になると、クリームの上に四角が残る
        if (px[3] > 200 && px[0] < 16 && px[1] < 16 && px[2] < 16) showFaces();
      } catch (e) { /* 判定できないブラウザでは映像のまま */ }
    });

    picks.forEach(function (btn, n) {
      btn.addEventListener("click", function () {
        if (n === index && video.getAttribute("src")) {
          video.currentTime = 0;
          var pending = video.play();
          if (pending && pending.catch) pending.catch(function () {});
          return;
        }
        play(n);
      });
    });

    if (reduced) {
      showFaces();
      return;
    }
    mark(0);
    play(0);
  }

  /* ======================================================================
     9. 起動
     ====================================================================== */

  function init() {
    renderText();
    renderOpeningSafe();
    renderStats();
    renderSkills();
    renderProjects("all");
    renderExperience();
    setupContrib();

    stampStagger();       // 並ぶ要素は少しずつ時差で
    observe();            // [data-reveal]（スキルカード含む）
    stampTimeline();      // タイムラインは順番に
    setupCounters();

    setupRoleRotation();
    setupCast();
    setupScrollUI();
    setupActiveLink();
    setupMobileNav();
    setupFilters();
    setupForm();
    setupLanguage();
  }

  /* 言語を切り替えたら、data.js から作る部分を作り直す（アニメーションはせず、そのまま表示） */
  function setupLanguage() {
    if (!window.I18N || !I18N.onChange) return;
    I18N.onChange(function () {
      renderText();
      renderStats();
      renderSkills();
      renderProjects(currentFilter);
      renderExperience();
      drawContrib();
      $$("#statsList .stats__value").forEach(function (el) {
        el.textContent = Number(el.dataset.target).toLocaleString();
      });
      $$("#skillsGrid [data-reveal], #projectsGrid .project-card, #timeline .timeline__item, #statsList").forEach(function (el) {
        el.style.transitionDelay = "";
        el.classList.add("is-visible");
      });
      var toggle = $("#navToggle");
      if (toggle) toggle.setAttribute("aria-label", I18N.t(toggle.getAttribute("aria-expanded") === "true" ? "nav.close" : "nav.open"));
    });
  }

  // オープニングで何か失敗しても、サイト本体は必ず表示する
  function renderOpeningSafe() {
    try {
      setupOpening();
    } catch (e) {
      document.documentElement.classList.remove("is-opening", "is-landing");
      var overlay = $("#opening");
      if (overlay) overlay.remove();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
