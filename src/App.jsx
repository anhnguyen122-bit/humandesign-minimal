import React, { useMemo, useState, useEffect } from "react";

// ---------- Minimal data dictionaries ----------
const TYPES = [
  { key: "Generator", strategy: "Respond", blurb: "Ổn định, bền bỉ. Năng lượng Sacral mạnh khi làm việc bạn yêu thích. Hãy đáp lại cơ hội thay vì tự ép mình khởi xướng mọi thứ." },
  { key: "Manifesting Generator", strategy: "Respond → Inform", blurb: "Nhanh, linh hoạt. Kết hợp sức bền và khả năng tăng tốc. Đáp lại điều hấp dẫn, rồi thông báo cho người liên quan trước khi hành động." },
  { key: "Projector", strategy: "Wait for Invitation", blurb: "Nhìn thấy hệ thống và con người. Tỏa sáng khi được mời đúng việc. Quý trọng nghỉ ngơi và sự công nhận đúng." },
  { key: "Manifestor", strategy: "Inform", blurb: "Khởi xướng thay đổi. Bạn đi trước một nhịp. Hãy thông báo để giảm ma sát và nhận được hỗ trợ xung quanh." },
  { key: "Reflector", strategy: "Wait a Lunar Cycle", blurb: "Siêu nhạy với môi trường. Cần thời gian quan sát (khoảng một chu kỳ trăng) trước quyết định quan trọng." },
];

const AUTHORITIES = [
  { key: "Emotional", tip: "Đợi sóng cảm xúc lắng rồi hãy quyết." },
  { key: "Sacral", tip: "Lắng nghe phản ứng bụng: ‘uh‑huh’ / ‘uh‑uh’." },
  { key: "Splenic", tip: "Tin tín hiệu trực giác tức thời, khẽ và nhanh." },
  { key: "Ego", tip: "Hỏi: ‘Mình có thật sự muốn/đủ quyết tâm?’" },
  { key: "Self/Identity", tip: "Đi theo tiếng gọi hướng đi/giọng nói chân thật của mình." },
  { key: "Mental/Environment", tip: "Nói chuyện ở môi trường đúng để nghe rõ suy nghĩ." },
  { key: "Lunar (Reflector)", tip: "Chờ chu kỳ trăng để rõ ràng." },
];

const PROFILES = [
  { key: "1/3", gist: "Điều tra viên / Thử nghiệm" },
  { key: "2/4", gist: "Ẩn sĩ / Cơ hội" },
  { key: "3/5", gist: "Thử nghiệm / Dị nhân giải pháp" },
  { key: "4/6", gist: "Cơ hội / Hình mẫu" },
  { key: "5/1", gist: "Dị nhân giải pháp / Điều tra" },
  { key: "6/2", gist: "Hình mẫu / Ẩn sĩ" },
];

const GATES = [
  1, 2, 3, 5, 7, 10, 14, 15, 20, 24, 27, 28, 29, 30, 34, 37, 39, 41, 43, 44,
  45, 46, 47, 49, 50, 52, 53, 54, 55, 57, 58, 59, 61, 63,
];

const GATE_HINTS = {
  1: "Sáng tạo, biểu đạt bản thân.",
  2: "Hướng đi, định hướng cuộc đời.",
  3: "Vượt hỗn loạn ban đầu, khởi động.",
  5: "Nhịp điệu, tính đều đặn.",
  7: "Lãnh đạo từ phía sau.",
  10: "Tự yêu, sống đúng mình.",
  14: "Sức mạnh biến nguồn lực thành dòng chảy.",
  15: "Khiêm nhường, biên độ nhịp sống rộng.",
  20: "Hiện diện, ‘bây giờ’.",
  24: "Chiêm niệm, quay lại ý tưởng.",
  27: "Chăm sóc, nuôi dưỡng.",
  28: "Ý nghĩa, đối diện thử thách.",
  29: "Cam kết, nói ‘vâng’ đúng việc.",
  30: "Khát khao trải nghiệm cảm xúc.",
  34: "Sức mạnh hành động thuần túy.",
  37: "Tình thân, gia đình/cộng đồng.",
  39: "Kích hoạt, chọc để khai mở cảm xúc.",
  41: "Tưởng tượng, hạt giống trải nghiệm.",
  43: "Đột phá tinh thần, ‘biết’ bất ngờ.",
  44: "Ký ức bản năng, nhận diện khuôn mẫu.",
  45: "Tiếng nói của bộ tộc, phân phối nguồn lực.",
  46: "Tận hưởng cơ thể và số phận.",
  47: "Suy ngẫm, sắp nghĩa trải nghiệm.",
  49: "Cách mạng, quy tắc và ranh giới cảm xúc.",
  50: "Giá trị, bảo toàn, trách nhiệm.",
  52: "Tĩnh tại tập trung, neo sự chú ý.",
  53: "Khởi đầu chu kỳ, bắt đầu đúng.",
  54: "Thăng tiến, tham vọng được gọt giũa.",
  55: "Dồi dào cảm xúc, tinh thần tự do.",
  57: "Trực giác tức thì, rõ như tia chớp.",
  58: "Hân hoan, hoàn thiện, vui trong cải tiến.",
  59: "Gần gũi, mở cổng thân mật/kết nối.",
  61: "Huyền nhiệm, câu hỏi lớn bên trong.",
  63: "Nghi vấn, kiểm định.",
};

function calcSeed({ dateStr, timeStr }) {
  try {
    const [y, m, d] = dateStr.split("-").map((x) => parseInt(x, 10));
    const [hh, mm] = (timeStr || "00:00").split(":").map((x) => parseInt(x, 10));
    const val = y * 10000 + m * 100 + d;
    const seed = (val * 397 + hh * 23 + mm * 7) >>> 0;
    return seed;
  } catch (e) {
    return 123456789;
  }
}

function rng(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick(arr, r) {
  return arr[Math.floor(r() * arr.length)];
}

function sampleUnique(arr, count, r) {
  const copy = [...arr];
  const out = [];
  for (let i = 0; i < count && copy.length; i++) {
    const idx = Math.floor(r() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}

function computeReading({ dateStr, timeStr }) {
  const seed = calcSeed({ dateStr, timeStr });
  const r = rng(seed);

  const typeDeck = [TYPES[0], TYPES[0], TYPES[1], TYPES[2], TYPES[1], TYPES[3], TYPES[0], TYPES[4]];
  const type = pick(typeDeck, r);

  let authority = type.key === "Reflector" ? AUTHORITIES[6] : pick(AUTHORITIES.slice(0, 6), r);
  const profile = pick(PROFILES, r);
  const gateCount = 3 + Math.floor(r() * 3);
  const gates = sampleUnique(GATES, gateCount, r).sort((a, b) => a - b);

  return {
    type: type.key,
    strategy: type.strategy,
    authority: authority.key,
    authorityTip: authority.tip,
    profile: profile.key,
    profileGist: profile.gist,
    gates,
  };
}

export default function App() {
  const [dateStr, setDateStr] = useState("");
  const [timeStr, setTimeStr] = useState("");
  const [place, setPlace] = useState("");
  const [reading, setReading] = useState(null);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const d = p.get("date") || "";
    const t = p.get("time") || "";
    const pl = p.get("place") || "";
    setDateStr(d);
    setTimeStr(t);
    setPlace(pl);
    if (d) setReading(computeReading({ dateStr: d, timeStr: t }));
  }, []);

  const updateURL = (d, t, pl) => {
    const p = new URLSearchParams();
    if (d) p.set("date", d);
    if (t) p.set("time", t);
    if (pl) p.set("place", pl);
    const q = p.toString();
    const url = q ? `?${q}` : window.location.pathname;
    window.history.replaceState({}, "", url);
  };

  const onGenerate = (e) => {
    e.preventDefault();
    if (!dateStr) return;
    const res = computeReading({ dateStr, timeStr });
    setReading(res);
    updateURL(dateStr, timeStr, place);
  };

  const shareText = useMemo(() => {
    if (!reading) return "";
    return (
      `Human Design (demo)\n` +
      `Date: ${dateStr || ""} ${timeStr || ""} ${place ? "- " + place : ""}\n` +
      `Type: ${reading.type}\n` +
      `Strategy: ${reading.strategy}\n` +
      `Authority: ${reading.authority}\n` +
      `Profile: ${reading.profile}\n` +
      `Gates: ${reading.gates.join(", ")}`
    );
  }, [reading, dateStr, timeStr, place]);

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#0a0f1f] via-[#0b1630] to-[#0a0f1f]" />
      <Stars />

      <div className="mx-auto max-w-3xl px-6 py-12">
        <header className="mb-10">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            HumanDesign • Minimal Universe
          </h1>
          <p className="mt-2 text-sm/relaxed text-white/70">
            Nhập ngày sinh & giờ sinh để tạo một bản đọc Human Design mang tính tham khảo (demo). Thiết kế tối giản, lấy cảm hứng vũ trụ.
          </p>
        </header>

        <form onSubmit={onGenerate} className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm shadow-lg">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="mb-2 block text-xs uppercase tracking-widest text-white/60">Ngày sinh (YYYY-MM-DD)</label>
              <input type="date" value={dateStr} onChange={(e) => setDateStr(e.target.value)} className="w-full rounded-xl bg-white/10 px-3 py-2 outline-none ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-indigo-400" required />
            </div>
            <div>
              <label className="mb-2 block text-xs uppercase tracking-widest text-white/60">Giờ sinh (HH:MM)</label>
              <input type="time" value={timeStr} onChange={(e) => setTimeStr(e.target.value)} className="w-full rounded-xl bg-white/10 px-3 py-2 outline-none ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-indigo-400" />
            </div>
            <div>
              <label className="mb-2 block text-xs uppercase tracking-widest text-white/60">Nơi sinh (tùy chọn)</label>
              <input type="text" placeholder="Hà Nội, Việt Nam" value={place} onChange={(e) => setPlace(e.target.value)} className="w-full rounded-xl bg-white/10 px-3 py-2 outline-none ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-indigo-400" />
            </div>
          </div>
          <div className="mt-5 flex items-center gap-3">
            <button type="submit" className="rounded-xl bg-indigo-500/90 px-4 py-2 text-sm font-medium hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300">Tạo bản đọc</button>
            <span className="text-xs text-white/60">*Bản đọc chỉ nhằm mục đích tham khảo & thiết kế giao diện.</span>
          </div>
        </form>

        {reading && (
          <section className="mt-8 space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm shadow-lg">
              <h2 className="text-lg font-semibold tracking-tight">Kết quả</h2>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-5">
                <InfoRow label="Type" value={reading.type} />
                <InfoRow label="Strategy" value={reading.strategy} />
                <InfoRow label="Authority" value={reading.authority} helper={reading.authorityTip} />
                <InfoRow label="Profile" value={reading.profile} helper={reading.profileGist} />
                <InfoRow label="Gates" value={reading.gates.join(", ")} helper={reading.gates.map(g => `Gate ${g}: ${GATE_HINTS[g] || ""}`).join(" \n ")} />
              </div>
            </div>
            <ShareBlock text={shareText} />
          </section>
        )}

        <footer className="mt-10 text-center text-xs text-white/50">© {new Date().getFullYear()} HumanDesign • Minimal Universe · Demo UI</footer>
      </div>
    </div>
  );
}

function InfoRow({ label, value, helper }) {
  return (
    <div className="rounded-xl bg-white/5 p-4 ring-1 ring-inset ring-white/10">
      <div className="text-[11px] uppercase tracking-widest text-white/60">{label}</div>
      <div className="mt-1 text-sm font-medium">{value}</div>
      {helper && <div className="mt-1 text-xs text-white/60 whitespace-pre-wrap">{helper}</div>}
    </div>
  );
}

function ShareBlock({ text }) {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Đã copy kết quả vào clipboard ✨");
    } catch (e) {
      alert("Không copy được. Hãy bôi đen & Ctrl/Cmd+C.");
    }
  };
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm shadow-lg">
      <div className="flex items-center justify-between gap-4">
        <h4 className="text-sm font-semibold">Chia sẻ kết quả</h4>
        <button onClick={copy} className="rounded-lg bg-white/10 px-3 py-1.5 text-xs hover:bg-white/20">Copy</button>
      </div>
      <pre className="mt-3 max-h-56 overflow-auto rounded-lg bg-black/30 p-3 text-[11px] leading-relaxed text-white/80">{text}</pre>
    </div>
  );
}

// Starry minimal background canvas
function Stars() {
  return (
    <svg className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-60" aria-hidden="true">
      <defs>
        <radialGradient id="g" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.25" />
          <stop offset="70%" stopColor="#1e1b4b" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#0b1120" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="15%" cy="20%" r="420" fill="url(#g)" />
      <circle cx="85%" cy="30%" r="360" fill="url(#g)" />
      <circle cx="50%" cy="80%" r="380" fill="url(#g)" />
      {Array.from({ length: 180 }).map((_, i) => (
        <circle
          key={i}
          cx={((Math.sin(i * 12.9898) * 43758.5453) % 1) * 100 + "%"}
          cy={((Math.sin(i * 78.233) * 12345.6789) % 1) * 100 + "%"}
          r={i % 7 === 0 ? 0.9 : 0.6}
          fill="#c7d2fe"
          opacity={i % 9 === 0 ? 0.9 : 0.6}
        />
      ))}
    </svg>
  );
}
