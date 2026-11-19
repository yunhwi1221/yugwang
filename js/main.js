// 진료시간 설정 — 원장님 확인 후 값만 바꾸면 돼요.
// 0=일요일 … 6=토요일. null이면 휴진. 시간은 24시간제 "HH:MM".
const CLINIC = {
  phone: "064-756-1113",
  // 출처: 실제 홈페이지 진료시간 안내 이미지. 0=일요일 … 6=토요일, null=휴진. "HH:MM"
  hours: { 0: null, 1: ["09:00", "19:00"], 2: ["09:00", "19:00"], 3: ["09:00", "19:00"], 4: ["09:00", "19:00"], 5: ["09:00", "19:00"], 6: ["09:00", "17:00"] },
  holiday: ["09:00", "15:00"],      // 공휴일 (자동 판별은 안 함, 시간표에만 표시)
  lunch: ["13:00", "14:00"],        // 월~금 점심시간
  lunchDays: [1, 2, 3, 4, 5],
};

const DAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"];
const toMin = (t) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };

function renderToday(now = new Date()) {
  const box = document.getElementById("today");
  if (!box) return;
  const badge = box.querySelector(".today__badge");
  const time = box.querySelector(".today__time");
  const note = box.querySelector(".today__note");

  const day = now.getDay();
  const range = CLINIC.hours[day];
  const cur = now.getHours() * 60 + now.getMinutes();
  let state = "closed";

  if (!range) {
    badge.textContent = "오늘 휴진";
    time.textContent = `${DAY_NAMES[day]}요일은 쉬어요`;
    note.textContent = "내일 진료시간을 확인해 보세요.";
  } else {
    const [open, close] = range.map(toMin);
    const [ls, le] = CLINIC.lunch.map(toMin);
    time.textContent = `${range[0]} - ${range[1]}`;
    const hasLunch = CLINIC.lunchDays.includes(day);
    note.textContent = hasLunch ? `점심시간 ${CLINIC.lunch[0]} - ${CLINIC.lunch[1]}` : "";
    if (cur < open) { badge.textContent = "진료 전"; }
    else if (cur >= close) { badge.textContent = "진료 종료"; }
    else if (hasLunch && cur >= ls && cur < le) { badge.textContent = "점심시간"; state = "lunch"; }
    else { badge.textContent = "진료 중"; state = "open"; }
  }
  box.dataset.state = state;
}

// 진료시간표: 월~일 순서, 오늘 요일 강조
function renderHoursTable(now = new Date()) {
  const body = document.querySelector("#hours-table tbody");
  if (!body) return;
  const today = now.getDay();
  body.innerHTML = "";
  [1, 2, 3, 4, 5, 6, 0].forEach((d) => {
    const r = CLINIC.hours[d];
    const tr = document.createElement("tr");
    if (d === today) tr.className = "is-today";
    const th = document.createElement("th");
    th.scope = "row";
    th.textContent = DAY_NAMES[d];
    const td = document.createElement("td");
    if (r) td.textContent = `${r[0]} - ${r[1]}`;
    else { td.textContent = "휴진"; td.className = "off"; }
    tr.append(th, td);
    body.append(tr);
  });
  const note = document.getElementById("hours-note");
  if (note) note.textContent = `평일 점심시간 ${CLINIC.lunch[0]} - ${CLINIC.lunch[1]} · 공휴일 ${CLINIC.holiday[0]} - ${CLINIC.holiday[1]}`;
}

function setupMenu() {
  const btn = document.querySelector(".menu-toggle");
  const nav = document.getElementById("site-nav");
  if (!btn || !nav) return;
  btn.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    btn.setAttribute("aria-expanded", String(open));
  });
}

function setupPhone() {
  document.querySelectorAll("[data-tel]").forEach((a) => {
    a.href = `tel:${CLINIC.phone.replace(/-/g, "")}`;
    if (a.hasAttribute("data-tel-text")) a.textContent = `전화 ${CLINIC.phone}`;
  });
}

renderHoursTable();
renderToday();
setInterval(renderToday, 60 * 1000);
setupMenu();
setupPhone();
