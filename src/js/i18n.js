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
    "hero.social": "Social profiles",
    "hero.social.instagram": "Instagram (opens in a new tab)",
    "hero.social.github": "GitHub (opens in a new tab)",
    "hero.social.linkedin": "LinkedIn (opens in a new tab)",
    "hero.social.facebook": "Facebook (opens in a new tab)",
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
    "card.more": "Read more",
    "card.less": "Show less",
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

  /* --- 作成中セクションと PitchLab ページ（英語） --- */
  var EN_PAGES = {
      "pl.00": "← Back to portfolio",
      "pl.01": "Projects / In progress",
      "pl.02": "A research tool for finding new pitches by physically simulating a pitcher's whole body. It isn't finished. Right now I'm checking whether it can throw a realistic fastball.",
      "pl.03": "<span>Status</span>In progress (Stage 1: testing the fastball)",
      "pl.04": "<span>Physics engine</span>MuJoCo",
      "pl.05": "<span>Motion</span>Research motion-capture data",
      "pl.06": "<span>Real-world use</span>None (no team uses it)",
      "pl.07": "Trial f4 fastball (full body, slow motion). Left: side view. Right: from behind the pitcher. 39.0 m/s, 1,929 rpm, spin axis 1:06.",
      "pl.08": "<a href=\"#purpose\">Purpose</a><a href=\"#how\">How it works</a><a href=\"#criteria\">Pass criteria</a><a href=\"#status\">Status</a><a href=\"#videos\">Videos</a><a href=\"#next\">Next steps</a><a href=\"#stack\">Tech</a><a href=\"#roadmap\">Roadmap</a><a href=\"#learned\">What I learned</a>",
      "pl.09": "<span>01</span>Purpose: finding new pitches",
      "pl.10": "Small differences in grip, wrist angle and how the fingers come off the ball can turn one pitch into a completely different one. But trying a new grip for real takes a lot of throwing, which puts strain on the shoulder and elbow.",
      "pl.11": "PitchLab is meant to let you try that inside a computer, with the whole body involved. Starting from full-body motion, not just the arm, it physically calculates how the fingertips touch the ball and the spin and speed it leaves with. The end goal is to narrow down candidates for pitches that don't exist yet, before a pitcher ever has to throw them.",
      "pl.12": "For now I'm testing the prerequisite: can it reproduce an ordinary fastball correctly? It hasn't found a single new pitch yet.",
      "pl.13": "<span>02</span>How it works",
      "pl.14": "Full-body physics simulation",
      "pl.15": "A full-body pitcher model built on the MuJoCo physics engine. From the stride to the release, every joint torque and contact is computed as physics.",
      "pl.16": "Driven by research motion capture",
      "pl.17": "The body tracks pitching motion-capture data recorded for research. Instead of hand-animating the motion, it follows how real pitchers move.",
      "pl.18": "Shoulder blades and a segmented spine",
      "pl.19": "A shoulder doesn't rotate from the arm socket alone. The shoulder blades move independently and the spine is split into several segments, so the trunk's whip carries into the arm.",
      "pl.20": "Five fingers, wrist, seams and friction",
      "pl.21": "The hand has jointed fingers and a wrist, and the ball has seams. Spin comes from friction between the fingers and the leather, so this is the part that matters most for spin rate.",
      "pl.22": "Ball specs (NPB and MLB)",
      "pl.23": "Size, weight and other ball properties come from the official ball of Japan's pro league (NPB). Only where I couldn't find public Japanese data do I substitute MLB values, and every substitute is clearly marked in the code and notes.",
      "pl.24": "<span>03</span>Pass criteria, stage by stage",
      "pl.25": "So it doesn't stop at \"looks about right,\" I set numeric pass criteria up front and don't move on until they're met.",
      "pl.26": "Stage 1 · Current",
      "pl.27": "Fastball",
      "pl.28": "Release angle within the range of real pitchers",
      "pl.29": "Velocity 135–150 km/h",
      "pl.30": "Spin rate 2,100–2,500 rpm",
      "pl.31": "Shoulder, elbow and other joint loads within 1.5× published research values",
      "pl.32": "Stage 2 · Not started",
      "pl.33": "Breaking balls",
      "pl.34": "Reproduce existing breaking balls with spin within ±15% of measured values",
      "pl.35": "Only after that, move on to searching for new grips",
      "pl.36": "<span>04</span>Status and findings",
      "pl.37": "To be honest, Stage 1 hasn't passed yet. One result I thought was a success turned out to be wrong.",
      "pl.38": "The earlier ~2,000 rpm was fake",
      "pl.39": "An early trial reached about 2,000 rpm, but frame-by-frame footage showed the fingers were just slapping the ball at release to spin it. Real pitchers don't use their fingers that way, so I threw that number out.",
      "pl.40": "Results of the main trials",
      "pl.41": "<tr><th>Trial</th><th>Velocity</th><th>Spin rate</th><th>Spin axis</th><th>Release angle</th></tr>",
      "pl.42": "<td>Fingers stay on the ball through release (no slap)</td><td>41.4 m/s<small> (≈149 km/h)</small></td><td>1,075 rpm</td><td>12:48</td><td>5.1° down</td>",
      "pl.43": "<td>f4</td><td>39.0 m/s<small> (≈140 km/h)</small></td><td>1,929 rpm</td><td>1:06</td><td>6.3° down</td>",
      "pl.44": "<td>Stage 1 pass criteria</td><td>135–150 km/h</td><td>2,100–2,500 rpm</td><td>—</td><td>Range of real pitchers</td>",
      "pl.45": "km/h values are converted from m/s for reference.",
      "pl.46": "<strong>Velocity is getting into range.</strong> Both trials fall within 135–150 km/h.",
      "pl.47": "<strong>Spin rate is too low.</strong> With a proper release (no slapping), it's 1,075 rpm. f4 got up to 1,929 rpm, but that's still short of 2,100 rpm.",
      "pl.48": "<strong>Joint loads are too high.</strong> Shoulder and elbow loads are about 1.6–2× the research values, over the 1.5× limit.",
      "pl.49": "<strong>The thumb isn't touching the ball at release.</strong> In a real fastball the thumb helps support the ball, so I think this is one reason the spin is low.",
      "pl.50": "<span>05</span>Videos",
      "pl.51": "All clips are raw simulation output, exported as is (slow motion).",
      "pl.52": "<b>f4 fastball (full body)</b> 39.0 m/s, 1,929 rpm, spin axis 1:06, 6.3° down.",
      "pl.53": "<b>f4 release (close-up of the hand)</b> The moment the ball leaves, with the fingers on the seams.",
      "pl.54": "<b>Fingers-on-the-ball fastball (full body)</b> A release without slapping. 41.4 m/s, 1,075 rpm, spin axis 12:48, 5.1° down.",
      "pl.55": "<b>Fingers-on-the-ball fastball (release close-up)</b> The fingers stay in contact until the ball leaves.",
      "pl.56": "<span>06</span>Next steps",
      "pl.57": "<strong>Match skin-on-leather friction to measured values.</strong> Using Yamaguchi's (2020, 2022) measurements: 1.12 dry, 0.76 with rosin, 0.42 wet.",
      "pl.58": "<strong>Add a CMC joint (the base joint) to the thumb.</strong> So the thumb can support the ball through release.",
      "pl.59": "<strong>Once Stage 1 passes, move on to Stage 2 (breaking balls).</strong>",
      "pl.60": "<span>07</span>Tech stack",
      "pl.61": "<li>MuJoCo</li><li>Python</li><li>Motion capture (research data)</li><li>Contact and friction models</li><li>FFmpeg (video export)</li>",
      "pl.62": "<span>08</span>Roadmap",
      "pl.63": "<b>Done</b>Full-body model (shoulder blades, segmented spine, five fingers, wrist) and a ball with seams",
      "pl.64": "<b>Done</b>Drive the whole body with motion capture and make it able to throw",
      "pl.65": "<b>Now</b>Stage 1: get the fastball within the pass criteria (spin rate and joint loads not met yet)",
      "pl.66": "<b>Next</b>Stage 2: reproduce existing breaking balls with spin within ±15%",
      "pl.67": "<b>Later</b>Search new grips and releases to propose candidate pitches",
      "pl.68": "<span>09</span>What I learned",
      "pl.69": "<strong>Be most suspicious of good numbers.</strong> About 2,000 rpm looked close to passing, but the footage showed the fingers were just slapping the ball. Now I check the motion itself, not just the numbers.",
      "pl.70": "<strong>Set the pass criteria first.</strong> Having the bar in place up front means I can say clearly that it isn't there yet.",
      "pl.71": "<strong>Don't hide substituted values.</strong> Where there's no Japanese data I use MLB values and say so. If you can't tell which values are solid, you can't trust the results either.",
      "pl.72": "<strong>Spin isn't decided by the fingertips alone.</strong> Small details like thumb support and skin-on-leather friction turn out to have a big effect on spin rate.",
      "pl.showcaseCap": "PitchLab showcase video (about 30 seconds)",
      "pl.tocLabel": "On this page",
      "pl.meta.title": "PitchLab (in progress) | Fusuke Yasuda",
      "pl.meta.description": "PitchLab: a full-body physics simulation for finding new pitches. Research motion capture runs in MuJoCo, with fingers, wrist, seams and friction modeled. Currently testing whether it can reproduce a fastball.",
      "wip.title": "In progress",
      "wip.lead": "Projects that aren't finished and are still being tested. Where results aren't there yet, I say so.",
      "wip.status": "Testing · Stage 1 (fastball) not yet passed",
      "wip.text": "A full-body physics simulation for finding new pitches. It drives research motion-capture data in MuJoCo, models the fingers, wrist, seams and friction, and is starting by checking whether it can reproduce a fastball.",
      "wip.more": "Peek inside the project",
      "wip.alt": "PitchLab full-body simulation (trial f4 fastball)",
      "plate.status": "In progress · Public on GitHub",
      "plate.text": "A pitch viewer that recreates a single Statcast pitch in 3D with Three.js. It draws the pitch trajectory, arrival point, and batted ball using a coordinate transform with the tip of home plate as the origin, and loads a stadium model built in Blender. Choosing a pitcher, batter, pitch type, and location reproduces one plate appearance, and the batter's decision is handled by a model built on the FastAPI side from 2024 real data. Across the 100 pitches bundled as samples, the calculated arrival point differs from the Statcast record by 0.120 cm on average.",
      "plate.alt": "Plate Tip pitch viewer: a Judge vs. Skubal at-bat recreated in 3D",

      /* --- Local Secretary 詳細ページ --- */
      "ls.00": "← Back to portfolio",
      "ls.01": "Projects / In progress",
      "ls.02": "A personal AI secretary built around an LLM that runs on my own laptop. It brings my life and coursework into one place, keeps the data off the cloud, and works without being asked, watching the schedule and risks ahead.",
      "ls.03": "<span>Status</span>In progress (foundation running; secretary features designed and being built)",
      "ls.04": "<span>Runs on</span>One laptop (Intel Core Ultra 5 228V, Arc integrated GPU, 32GB shared memory)",
      "ls.05": "<span>Core model</span>Qwen3.8-27B (OpenVINO Model Server)",
      "ls.06": "<span>Where the data lives</span>Entirely local (Markdown in Obsidian)",
      "ls.07": "<a href=\"#about\">Overview</a><a href=\"#done\">What works</a><a href=\"#next\">What's next</a><a href=\"#design\">Design</a><a href=\"#stack\">Tech</a><a href=\"#roadmap\">Roadmap</a>",
      "ls.08": "<span>01</span>Overview",
      "ls.09": "A personal project: a 27B-class LLM running all the time on a laptop (Intel Core Ultra 5 228V, Intel Arc integrated GPU, 32GB shared memory), raised into a secretary.",
      "ls.10": "Not a chatbot. I'm aiming for a secretary that does the following.",
      "ls.11": "Pulls lectures, email and schedule into one place automatically",
      "ls.12": "Keeps promises and deadlines in a ledger and tracks them until they're closed",
      "ls.13": "Predicts attendance and deadline trajectories and warns before things get worse",
      "ls.14": "Runs processing and memory tidying in batches overnight",
      "ls.15": "Everything runs locally. Not sending coursework or personal data to outside services is the premise of the design.",
      "ls.16": "<span>02</span>What already works",
      "ls.17": "The foundation already runs every day. The secretary features are what I'm building on top of it.",
      "ls.18": "Local AI foundation",
      "ls.19": "Qwen3.8-27B runs continuously on OpenVINO Model Server, with automatic startup, a health check every five minutes with automatic recovery, and one preventive restart a day.",
      "ls.20": "Switching modes by task",
      "ls.21": "Qwen (the secretary), LM Studio (lecture processing), or everything stopped: I built the operating layer that switches between them without fighting over shared GPU memory.",
      "ls.22": "Lecture pipeline",
      "ls.23": "Drop in a lecture recording and it transcribes and summarises it automatically, then generates an Obsidian note.",
      "ls.24": "What it's connected to",
      "ls.25": "MMU BeeBoard, my calendar, GitHub, and this portfolio site. The entry points where daily information arrives are already in place.",
      "ls.26": "<span>03</span>What's next",
      "ls.27": "<strong>The secretary's ledger and memory.</strong> Build the state files for schedule, promises and long-term memory in Obsidian, so the secretary has something to read and write.",
      "ls.28": "<strong>The proactive engine.</strong> Jobs that run without being asked: a morning check, a nightly reconciliation batch, and automatic deadline extraction from lecture notes.",
      "ls.29": "<strong>The future radar.</strong> Spot attendance dropping below 80% or deadlines colliding ahead of time, then work backwards to schedule the preparation tasks.",
      "ls.30": "<strong>Automatic email sorting.</strong> Classify, summarise and plainly explain official emails, so only what matters comes to the front.",
      "ls.31": "<strong>My own platform.</strong> A phone-friendly dashboard that gathers every notification and every instruction to the secretary in one place.",
      "ls.32": "<strong>Growing the memory.</strong> Merge daily records weekly, then move on to features that come from accumulation, like per-subject mistake trends and generated drills.",
      "ls.33": "<span>04</span>Design decisions",
      "ls.34": "A local 27B model is slow compared with cloud models, and there's no spare GPU memory. The design assumes those limits instead of fighting them.",
      "ls.35": "<strong>Working within ~22GB of shared GPU memory.</strong> To keep a 27B model resident and stable, I updated drivers, tuned the memory budget, and added exclusive control over which model is loaded.",
      "ls.36": "<strong>Assuming the server dies silently.</strong> I saw the inference server stop without leaving a log, so health checks, automatic recovery and preventive restarts keep it running.",
      "ls.37": "<strong>Not treating a slow local LLM as an autonomous agent.</strong> Fixed scripts are the hands, the LLM only makes single decisions, and heavy work runs as a nightly batch.",
      "ls.38": "<strong>Keeping the source of truth human-readable.</strong> The truth lives in Markdown (Obsidian); screens and databases are only copies. If the system breaks, the memory survives.",
      "ls.39": "<span>05</span>Tech stack",
      "ls.40": "<li>OpenVINO Model Server</li><li>Qwen3.8-27B</li><li>Python</li><li>FastAPI</li><li>Obsidian</li><li>Windows Task Scheduler</li><li>Tailscale</li>",
      "ls.41": "<span>06</span>Roadmap",
      "ls.42": "<b>Done</b>Local AI foundation (27B model always on, health checks, automatic recovery)",
      "ls.43": "<b>Done</b>Mode switching by task, and the lecture transcription and summary pipeline",
      "ls.44": "<b>Now</b>The secretary's ledger and memory (state files in Obsidian)",
      "ls.45": "<b>Next</b>The proactive engine (morning check, nightly batch, automatic deadline extraction)",
      "ls.46": "<b>Later</b>Future radar, automatic email sorting, a dedicated dashboard, and growing the memory",
      "ls.tocLabel": "On this page",
      "ls.archSrc": "assets/localsecretary/architecture-en.svg",
      "ls.archHref": "assets/localsecretary/architecture-en.svg",
      "ls.archAlt": "System architecture of Local Secretary: inputs (lecture recordings, email, schedules and deadlines, notes) gather into the ledger and memory, the secretary engine processes them, and the platform sends instructions back.",
      "ls.archCap": "System architecture: inputs, ledger, secretary engine and platform, all on a single laptop (click the image to enlarge).",
      "ls.meta.title": "Local Secretary (in progress) | Fusuke Yasuda",
      "ls.meta.description": "Local Secretary: a personal AI secretary built around a local LLM (Qwen3.8-27B) that keeps my life and coursework in one place. Nothing goes to the cloud; it works on its own and watches the schedule and risks ahead.",
      "ls.status": "In progress · Foundation running",
      "ls.text": "A personal AI secretary built around an LLM (Qwen3.8-27B) running on my own laptop. It keeps my life and coursework in one place, keeps the data off the cloud, and works on its own, watching the schedule and risks ahead."
  };
  Object.keys(EN_PAGES).forEach(function (k) { EN[k] = EN_PAGES[k]; });

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
    "card.more": "続きを読む",
    "card.less": "閉じる",
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
      "MMU BeeBoard": {
        status: "Live · Public version available",
        description: "A timetable and study-support web app I built for students at Multimedia University. It brings the timetable, assessments (quiz and test weightings and pass marks), deadlines, attendance, and study log onto one screen, and works backwards from my grades to the score I need on the final exam. Data is stored in the browser in a local-first design, and it is a PWA that opens offline. It works in both Japanese and English, and I publish a separate public version with personal information removed so other students can use it.",
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
      "Baseball Trajectory Sim 3D": {
        status: "Prototype · 2025 · Simplified physics",
        description: "A simulator that computes batted-ball and pitch trajectories with gravity, drag and spin-induced lift, and draws them in a 3D ballpark. You can change exit velocity, spin rate and release point and see what happens.",
      },
      "Ballpark Buzz": {
        status: "Prototype · 2025 · No public demo",
        description: "A prototype location-based social app for baseball fans. Pick your team and post a short message from where you are; posts show up on a map as bubbles in team colors and sync in real time through Firestore.",
      },
      "Emotional Hue": {
        status: "Prototype · 2025 · Entries saved on your device",
        description: "An app for logging your mood by picking one of eight colors, with an optional short note. A chart shows how often each mood came up over the past 7 days. Entries are stored only in the browser (localStorage). Japanese/English UI, and it can be added to the home screen like an app (PWA manifest).",
      },
    },
    PROJECT_GROUPS: [
      {
        title: "Running on campus",
        lead: "Apps built for student life at MMU: an errand board with a spec, payments, delivery tracking, and end-to-end tests, and a study board for my timetable and grades.",
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
      {
        title: "Small apps I've built",
        lead: "Small personal prototypes, from a baseball physics simulator to a mood-logging app.",
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
    var page = root.getAttribute("data-i18n-page");
    var mp = page ? page + ".meta." : "meta.";
    document.title = lang === "en" ? EN[mp + "title"] : metaJa.title;
    if (desc) desc.setAttribute("content", lang === "en" ? EN[mp + "description"] : metaJa.desc);
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
