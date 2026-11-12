/* ==========================================================================
   data.js — サイトの内容はすべてここにまとめてあります。
   テキストを差し替えるだけで表示が変わります（HTMLは触らなくてOK）。
   ========================================================================== */

/* --- プロフィール ---------------------------------------------------------- */
const PROFILE = {
  nameJa: "安田 風介",
  nameEn: "Fusuke Yasuda",
  // ヒーローで数秒ごとに切り替わる肩書き
  roles: ["CS Student", "Product Builder", "AI Developer"],
  lead: "現場の「困った」を、動くプロダクトに。",
};

/* --- About の数字（スクロールでカウントアップ） ----------------------------
   note は数字の下に小さく出る補足（なくてもOK）。                           */
const STATS = [
  { value: 3, suffix: "か国", label: "暮らした国", note: "日本・ニュージーランド・マレーシア" },
  { value: 20, suffix: "+", label: "GitHubの公開リポジトリ" },
  { value: 2, suffix: "言語", label: "使える言語", note: "日本語・英語" },
];

/* --- スキル ----------------------------------------------------------------
   items は名前の一覧（タグとして表示します）。
   { name: "...", level: 80 } のように level（0〜100）を書くと、従来どおりバー表示になります。 */
const SKILLS = [
  {
    title: "Languages",
    caption: "言語",
    items: ["TypeScript", "JavaScript", "Python", "HTML", "CSS"],
  },
  {
    title: "Frameworks",
    caption: "フレームワーク・基盤",
    items: ["React", "Next.js", "Firebase", "Vercel", "Capacitor"],
  },
  {
    title: "AI",
    caption: "AI・開発ツール",
    items: ["Gemini API", "MediaPipe", "Cursor", "OpenCode"],
  },
  {
    title: "Others",
    caption: "その他",
    items: ["データ可視化", "バックテスト・自動監視", "野球の統計指標（OPS、FIP、得点期待値）"],
  },
];

/* --- プロジェクト ----------------------------------------------------------
   categories は "baseball" | "ai" | "tools" の組み合わせ（フィルターに使います）。
   image は assets/projects/ のスクリーンショット（1280×800）。
   live を空にすると「サイトを見る」ボタンは表示されません。
   promo は assets/promo/ の紹介動画の名前（無音・約16秒）。空にすると動画ボタンは出ません。
   promoModal: true にすると、「動画を見る」でモーダルを開き、音声つき・コントロール付きで再生します（長い動画向け。promoDuration は表示用の長さ）。
   status はカード上部に出る短い状況メモ（試作・デモデータなど。誇張しない表現で）。 */
const PROJECTS = [
  {
    id: "campusrun",
    title: "CampusRun",
    promo: "campusrun", // assets/promo/campusrun.mp4（紹介動画・2:13・音声あり）・campusrun-loop.mp4（ホバー用）・campusrun-poster.jpg
    promoModal: true, // 長い・音声ありの紹介動画は、カード内ではなくモーダル（全画面に近い表示・音声オン・コントロール付き）で再生
    promoDuration: "2:13", // ボタンに出す長さ
    featured: true, // グループ内で横長の先頭カードにする
    status: "公開中 · MMU学生限定",
    categories: ["tools"],
    image: "assets/projects/campusrun.png", // 紹介動画のワンシーン（依頼者とランナーの2画面）
    description:
      "MMU サイバージャヤの学生どうしで「おつかい」を頼み合える依頼ボード。品物・お店・チップを投稿すると、承認された学生ランナーがキャンパス内を徒歩で届けます。ログインはメールのリンクで、進捗はリアルタイムで共有されます。",
    tags: ["Next.js", "TypeScript", "Supabase"],
    live: "https://campusrun-eight.vercel.app",
    github: "https://github.com/balloonnfusuuke/campusrun-ai",
  },
  {
    id: "mmu-beeboard",
    title: "MMU BeeBoard",
    promo: "beeboard", // assets/promo/beeboard.mp4（紹介動画・1:00・音声あり）・beeboard-loop.mp4（ホバー用）・beeboard-poster.jpg
    promoModal: true, // 長い・音声ありの紹介動画はモーダルで再生
    promoDuration: "1:00", // ボタンに出す長さ
    status: "公開中 · 公開版あり",
    categories: ["tools"],
    image: "assets/projects/beeboard.png", // 折り紙蜂のアイコンを16:10に置いた画像
    description:
      "Multimedia University の学生向けに自作した、時間割と学習支援の Web アプリです。時間割・評価（クイズやテストの配点と合格ライン）・締切・出席・学習ログを 1 画面に集約し、自分の成績から最終試験で必要な点数を逆算できます。データはブラウザ内に保存する local-first 設計で、オフラインでも開ける PWA。日英 2 言語対応。他の学生も使えるよう、個人情報を除いた公開版を別に公開しています。",
    tags: ["HTML", "CSS", "JavaScript", "PWA"],
    live: "https://mmu-beeboard.vercel.app/",
    github: "",
  },
  {
    id: "abbs",
    title: "ABBS",
    promo: "abbs", // assets/promo/abbs.mp4（紹介動画）・abbs-loop.mp4（ホバー用）・abbs-poster.jpg
    status: "試作 · Webで公開中",
    categories: ["baseball"],
    image: "assets/projects/abbs.png",
    description:
      "日本の独立リーグとアジアの野球選手をつなぐ、スカウト向けのダッシュボード。選手データの可視化とチーム管理ができます。",
    tags: ["TypeScript", "Firebase"],
    live: "https://abbs-sage.vercel.app",
    github: "https://github.com/balloonnfusuuke/ABBS",
  },
  {
    id: "baseball-track",
    title: "baseball_track",
    promo: "baseball_track", // assets/promo/baseball_track.mp4（紹介動画）・baseball_track-loop.mp4（ホバー用）・baseball_track-poster.jpg
    status: "試作 · 推定値は参考値",
    categories: ["baseball", "ai"],
    image: "assets/projects/baseball_track.png",
    description:
      "単一カメラの映像から、射影変換と物理計算で球速と変化量を推定する投球解析ツールです。",
    tags: ["TypeScript"],
    live: "https://baseball-track.vercel.app",
    github: "https://github.com/balloonnfusuuke/baseball_track",
  },
  {
    id: "baseball-analyze",
    title: "baseball.analyze",
    promo: "baseball-analyze", // assets/promo/baseball-analyze.mp4（紹介動画）・baseball-analyze-loop.mp4（ホバー用）・baseball-analyze-poster.jpg
    status: "インターン経験をもとに開発 · 試作",
    categories: ["baseball"],
    image: "assets/projects/baseball-analyze.png",
    description:
      "得点期待値の変化から作戦ごとの貢献度を算出する作戦評価ツール。和歌山ウェイブスでのインターン経験をもとに開発しました。",
    tags: ["TypeScript"],
    live: "https://baseball-analyze.vercel.app",
    github: "https://github.com/balloonnfusuuke/baseball.analyze",
  },
  {
    id: "metrics",
    title: "metrics",
    promo: "metrics", // assets/promo/metrics.mp4（紹介動画）・metrics-loop.mp4（ホバー用）・metrics-poster.jpg
    status: "試作 · デモデータ",
    categories: ["baseball"],
    image: "assets/projects/metrics.png",
    description:
      "試合成績に重み付けをして選手をランキングする、契約交渉向けの評価ツールです。",
    tags: ["TypeScript"],
    live: "https://metrics-one-lake.vercel.app",
    github: "https://github.com/balloonnfusuuke/metrics",
  },
  {
    id: "indiebaseball",
    title: "indiebaseball",
    promo: "indiebaseball", // assets/promo/indiebaseball.mp4（紹介動画）・indiebaseball-loop.mp4（ホバー用）・indiebaseball-poster.jpg
    status: "試作 · 個人開発",
    categories: ["baseball"],
    image: "assets/projects/indiebaseball.png",
    description:
      "独立リーグ球団向けの成績管理アプリ。一球ごとの入力から、OPS・FIP・WHIPなどの指標を自動で計算します。",
    tags: ["TypeScript"],
    live: "https://indiebaseball.vercel.app",
    github: "https://github.com/balloonnfusuuke/indiebaseball",
  },
  {
    id: "pitch",
    title: "pitch",
    promo: "pitch", // assets/promo/pitch.mp4（紹介動画）・pitch-loop.mp4（ホバー用）・pitch-poster.jpg
    status: "試作 · AIレポートは参考用",
    categories: ["baseball", "ai"],
    image: "assets/projects/pitch.png",
    description:
      "投球数の記録と登板スケジュールの管理ツール。Gemini APIによる負荷分析レポートも出力できます。",
    tags: ["TypeScript", "Gemini API"],
    live: "https://pitch-liart-eta.vercel.app",
    github: "https://github.com/balloonnfusuuke/pitch",
  },
  {
    id: "rakuten",
    title: "rakuten",
    promo: "rakuten", // assets/promo/rakuten.mp4（紹介動画）・rakuten-loop.mp4（ホバー用）・rakuten-poster.jpg
    status: "個人用の試作 · 画像はサンプルデータ",
    categories: ["tools"],
    image: "assets/projects/rakuten-dashboard.png",
    description:
      "ConnorsRSI(2)戦略にもとづく株式の自動監視システム。バックテスト、通知、Next.jsのダッシュボードを備えています。",
    tags: ["Python", "Next.js"],
    live: "https://rakuten-alpha.vercel.app",
    github: "https://github.com/balloonnfusuuke/rakuten",
  },
  {
    id: "nfc-card",
    title: "NFC名刺",
    featured: true,
    status: "実物 · NFCシール付き",
    categories: ["baseball"],
    images: [
      { src: "assets/projects/nfc-card-back.jpg", labelKey: "nfc.back" },
      { src: "assets/projects/nfc-card-front.jpg", labelKey: "nfc.front" },
    ],
    description:
      "自分のキャラクターでデザインした名刺です。裏面にNFCシールを貼って、スマホをかざすと読めるようにしています。",
    tags: ["デザイン", "NFC"],
    live: "",
    github: "",
  },
  {
    id: "baseball-sim3d",
    title: "Baseball Trajectory Sim 3D",
    status: "試作 · 2025年 · 物理モデルは簡易版",
    categories: ["baseball"],
    image: "assets/projects/baseball-sim3d.png",
    promo: "baseball-sim3d", // 操作デモ動画（ローカル実行を録画）
    description:
      "打球と投球の軌道を、重力・空気抵抗・回転による揚力で計算し、3Dの球場に描くシミュレーター。打球速度や回転数、リリース位置を変えて試せます。",
    tags: ["TypeScript", "React Three Fiber", "three.js"],
    live: "",
    github: "https://github.com/balloonnfusuuke/baseball1.github.io",
  },
  {
    id: "ballpark-buzz",
    title: "Ballpark Buzz",
    status: "試作 · 2025年 · 公開デモなし",
    categories: ["baseball"],
    image: "assets/projects/ballpark-buzz.png",
    promo: "ballpark-buzz", // 操作デモ動画（ローカル実行を録画）
    description:
      "野球ファンが応援チームを選び、今いる場所から短く投稿できる位置情報SNSの試作。投稿はチームカラーの吹き出しとして地図に並び、Firestoreでリアルタイムに共有されます。",
    tags: ["TypeScript", "React", "Leaflet", "Firebase"],
    live: "",
    github: "https://github.com/balloonnfusuuke/baloowanns.github.io",
  },
  {
    id: "emotional-hue",
    title: "Emotional Hue",
    status: "試作 · 2025年 · 記録は端末内に保存",
    categories: ["tools"],
    image: "assets/projects/emotional-hue.png",
    promo: "emotional-hue", // 操作デモ動画（ローカル実行を録画）
    description:
      "その時の気分を8つの色から選び、ひとことメモと一緒に記録するアプリ。過去7日間の気分の頻度をグラフで振り返れます。記録はブラウザ内（localStorage）だけに保存。日本語・英語に対応し、ホーム画面に追加してアプリのように使えます（PWAマニフェスト対応）。",
    tags: ["TypeScript", "React", "Recharts", "PWA"],
    live: "",
    github: "https://github.com/balloonnfusuuke/Emotional-Hue",
  },
];

/* --- プロジェクトのまとまり ------------------------------------------------
   titles は PROJECTS の title と対応。ここに書いた順で表示します。
   フラットに並べず、完成度と中身のまとまりで分けています。               */
const PROJECT_GROUPS = [
  {
    id: "campus",
    title: "キャンパスで動いているもの",
    lead: "MMU の学生生活のために作ったアプリです。仕様・決済・配達の追跡・E2Eテストまで入れた依頼ボードと、時間割と成績をまとめる学習ボード。",
    titles: ["CampusRun", "MMU BeeBoard"],
  },
  {
    id: "baseball",
    title: "野球の現場",
    lead: "和歌山ウェイブスのインターンから作り始めた道具です。成績、作戦、投球、スカウト。",
    titles: ["indiebaseball", "baseball.analyze", "baseball_track", "ABBS", "metrics", "pitch"],
  },
  {
    id: "card",
    title: "手で渡しているもの",
    lead: "アプリとは別に、会った人に渡すために作りました。",
    titles: ["NFC名刺"],
  },
  {
    id: "monitor",
    title: "自分用の自動監視",
    lead: "野球とは別に、自分で毎日見るために動かしているシステムです。",
    titles: ["rakuten"],
  },
  {
    id: "early",
    title: "これまでに作った小さなアプリ",
    lead: "野球の物理シミュレーションや、気分を記録するアプリなど、個人で作った小さな試作です。",
    titles: ["Baseball Trajectory Sim 3D", "Ballpark Buzz", "Emotional Hue"],
  },
];

/* --- 経歴（タイムライン） -------------------------------------------------- */
const EXPERIENCE = [
  {
    period: "小学6年",
    title: "Pythonを始める",
  },
  {
    period: "中学",
    title: "HSPを始める",
    org: "数学研究部",
  },
  {
    period: "2024年2月 — 2025年12月",
    title: "高校卒業",
    org: "Hillcrest High School（ニュージーランド）",
    description:
      "ニュージーランドの高校で学び、2025年12月に卒業しました。英語で学び、暮らした経験が今の土台になっています。",
    tags: ["New Zealand", "English"],
  },
  {
    period: "2026年2月 — 3月",
    title: "広報インターン",
    org: "和歌山ウェイブス（独立リーグ）",
    description:
      "球団初のインターンとして広報を担当。現場の課題に直接ふれたこの経験が、ツールを作り始めるきっかけになりました。",
    tags: ["広報", "球団初のインターン"],
  },
  {
    period: "2026年 —",
    title: "Webツールの個人開発",
    org: "個人プロジェクト",
    description:
      "選手評価や投球解析などの野球向けツールから、株式の自動監視システムまで、Webツールを個人で企画・開発・公開しています。",
    tags: ["TypeScript", "Python", "Firebase", "Vercel"],
  },
  {
    period: "2026年10月 —",
    title: "コンピュータサイエンス専攻",
    org: "Multimedia University（マレーシア）",
    description:
      "マレーシアの Multimedia University で、コンピュータサイエンスを学びます。",
    tags: ["Computer Science", "Malaysia"],
  },
];

/* --- 連絡先 ---------------------------------------------------------------- */
const CONTACTS = {
  email: "yasudafusuke@gmail.com",
  github: "https://github.com/balloonnfusuuke",
  linkedin: "https://www.linkedin.com/in/fusuke-yasuda-0286a839b",
};
