// 진료과목 상세페이지 12개를 공통 템플릿(PRD 9장 9단계)으로 생성한다.
// 사용: node tools/build-subjects.js
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const subjects = require("./subjects.data.js");
const DURATION = subjects.DURATION;

// 공통 아이콘 세트는 index.html에서 그대로 가져온다 (한 곳에서만 관리)
const index = fs.readFileSync(path.join(root, "index.html"), "utf8");
const sprite = index.match(/<svg width="0"[\s\S]*?<\/svg>/)[0];

const LINKS = {
  booking: "https://booking.naver.com/booking/13/bizes/1227770",
  talk: "https://talk.naver.com/ct/wgcrt8j",
  reviews: "https://jejuclinic.imweb.me/46",
};

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function page(s) {
  const title = `${s.name} | 제주 노형동 한의원 유광한의원`;
  const desc = `제주 노형동 유광한의원의 ${s.name} 안내. ${s.intro}`;
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}">
  <link rel="stylesheet" href="../css/tokens.css">
  <link rel="stylesheet" href="../css/base.css">
  <link rel="stylesheet" href="../css/components.css">
  <link rel="stylesheet" href="../css/main.css">
  <link rel="stylesheet" href="../css/subject.css">
</head>
<body>
  ${sprite}

  <header class="site-header">
    <div class="site-header__inner">
      <a class="logo" href="../index.html">유광한의원</a>
      <a class="btn btn--point" href="${LINKS.booking}" target="_blank" rel="noopener">예약</a>
      <button class="menu-toggle" type="button" aria-label="메뉴 열기" aria-controls="site-nav" aria-expanded="false">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
      </button>
      <nav class="site-nav" id="site-nav" aria-label="주요 메뉴">
        <ul>
          <li><a href="../index.html#symptoms">진료과목</a></li>
          <li><a href="../index.html#about">원장 이야기</a></li>
          <li><a href="../index.html#first-visit">첫 방문 안내</a></li>
          <li><a href="../index.html#faq">자주 묻는 질문</a></li>
          <li><a href="../index.html#location">오시는 길</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <main>
    <div class="wrap wrap--narrow subject">
      <p class="back"><a href="../index.html#symptoms">← 진료과목 전체</a></p>

      <!-- 1. 과목명 + 한 줄 소개 -->
      <header class="subject__head">
        <svg class="subject__icon" aria-hidden="true"><use href="#${s.icon}"/></svg>
        <h1>${esc(s.name)}</h1>
        ${s.sub ? `<p class="caption">${esc(s.sub)}</p>` : ""}
        <p class="subject__intro">${esc(s.intro)}</p>
      </header>

${s.symptoms && s.symptoms.length ? `      <!-- 2. 이런 증상이 있으세요? -->
      <section class="block" aria-labelledby="sx">
        <h2 id="sx">이런 증상이 있으세요?</h2>
        <ul class="checklist">
${s.symptoms.map((x) => `          <li>${esc(x)}</li>`).join("\n")}
        </ul>
      </section>
` : ""}
${s.cause ? `      <!-- 3. 왜 생기나요 -->
      <section class="block" aria-labelledby="cause">
        <h2 id="cause">${esc(s.causeTitle || "왜 생기나요?")}</h2>
        <p>${esc(s.cause)}</p>
      </section>
` : ""}

      <!-- 4. 유광한의원의 치료 -->
      <section class="block" aria-labelledby="tx">
        <h2 id="tx">유광한의원의 치료</h2>
        <ul class="tx-list">
${s.treatments.map(([n, d]) => `          <li class="card"><h3>${esc(n)}</h3>${d ? `<p>${esc(d)}</p>` : ""}</li>`).join("\n")}
        </ul>
      </section>

      <!-- 5. 치료 기간·횟수 -->
      <section class="block" aria-labelledby="dur">
        <h2 id="dur">치료 기간과 횟수</h2>
        <p>${esc(s.duration || DURATION)}</p>
      </section>

${s.tips && s.tips.length ? `      <!-- 6. 생활 관리 -->
      <section class="block" aria-labelledby="tips">
        <h2 id="tips">생활 관리</h2>
        <ul class="tips">
${s.tips.map((x) => `          <li>${esc(x)}</li>`).join("\n")}
        </ul>
      </section>
` : ""}
      <!-- 7. 과목별 자주 묻는 질문 -->
      <section class="block" aria-labelledby="faq">
        <h2 id="faq">자주 묻는 질문</h2>
        <div class="faq">
${s.faqs.map(([q, a]) => `          <details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("\n")}
        </div>
      </section>

      <!-- 8. 관련 후기 (로그인 후 열람) -->
      <section class="block" aria-labelledby="rv">
        <h2 id="rv">후기</h2>
        <p class="caption">후기는 로그인 후에 볼 수 있어요.</p>
        <a class="btn btn--outline" href="${LINKS.reviews}" target="_blank" rel="noopener">후기 목록 보기</a>
      </section>

      <!-- 9. 예약·전화 -->
      <section class="block cta card" id="reserve" aria-labelledby="cta">
        <h2 id="cta">궁금한 점은 편하게 물어보세요</h2>
        <div class="cta__btns">
          <a class="btn btn--point" href="${LINKS.booking}" target="_blank" rel="noopener">예약하기</a>
          <a class="btn" href="tel:" data-tel>전화하기</a>
        </div>
      </section>
    </div>
  </main>

  <footer class="site-footer">
    <div class="wrap">
      <p class="site-footer__name">유광한의원</p>
      <p class="caption">제주 노형동 노형타워 2층</p>
      <p class="caption"><a href="tel:" data-tel data-tel-text></a></p>
    </div>
  </footer>

  <nav class="bottom-bar" aria-label="빠른 연락">
    <a class="btn" href="${LINKS.talk}" target="_blank" rel="noopener">톡톡</a>
    <a class="btn btn--point" href="${LINKS.booking}" target="_blank" rel="noopener">예약</a>
    <a class="btn" href="tel:" data-tel>전화</a>
  </nav>

  <script src="../js/main.js"></script>
</body>
</html>
`;
}

fs.mkdirSync(path.join(root, "subjects"), { recursive: true });
for (const s of subjects) {
  fs.writeFileSync(path.join(root, "subjects", `${s.slug}.html`), page(s));
}

console.log(`${subjects.length}개 페이지 생성 완료`);
