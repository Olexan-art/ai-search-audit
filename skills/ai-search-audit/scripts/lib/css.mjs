// The report's stylesheet: the approved Lite design (dark and light tokens, the page map, the charts,
// the grids), inline because the report loads nothing. The two decorations come from the Vectorscope
// skill's sprites, so the ornaments are the same bytes.
import { CORNER, ORNAMENT } from "../vendor/vectorscope/sprites.mjs";

export const CSS = `
/* 2.103: the summary-first layout; light is still the default
   2.102: light is the default whatever the system prefers; dark comes only from the toggle or
   #theme=dark. Every text and UI pair passes WCAG AA in both themes (tools/contrast.mjs). */
:root{
  --brand:#14468f;
  --bg:#f3f6fa;--bg-2:#eaf0f6;--panel:#ffffff;--panel-2:#f6f9fc;--line:#d6dfea;--line-2:#c3d0df;--control:#6b7c91;
  --text:#0b1626;--muted:#46566b;--faint:#56677c;
  --accent:#0b6a85;--accent-ink:#ffffff;--accent-soft:rgba(11,106,133,.09);--glow:0 0 0 1px rgba(11,106,133,.10),0 6px 24px rgba(11,22,38,.06);
  --amber:#9a4a06;--amber-soft:rgba(154,74,6,.10);
  --red:#b91c1c;--red-soft:rgba(185,28,28,.08);--green:#047857;--green-soft:rgba(4,120,87,.09);
  --empty:#eef3f8;
  --lm:#0b6a85;--lm-soft:rgba(11,106,133,.08);--ld:#6d28d9;--ld-soft:rgba(109,40,217,.07);--lj:#be185d;--lj-soft:rgba(190,24,93,.07);--gone:#768aa0;
  --deco:.2;--deco-filter:none;--deco-mark:.5;
  --red-ink:#ffffff;--amber-ink:#ffffff;--pin-low:#0369a1;--hatch:rgba(75,92,114,.38);
  --pop:0 10px 30px rgba(11,22,38,.14);
  --est:#6d28d9;--est-soft:rgba(109,40,217,.08);--sel-soft:rgba(11,106,133,.07);
  color-scheme:light;
}
:root[data-theme="dark"]{
  --brand:#4d7dff;
  --bg:#060b14;--bg-2:#08101d;--panel:#0a1424;--panel-2:#0d1a2e;--line:#1b2b42;--line-2:#24395a;--control:#6b7f9b;
  --text:#e6eef8;--muted:#a3b3c7;--faint:#8b9cb2;
  --accent:#22d3ee;--accent-ink:#04121a;--accent-soft:rgba(34,211,238,.12);--glow:0 0 0 1px rgba(34,211,238,.18),0 0 32px rgba(34,211,238,.10);
  --amber:#f5a524;--amber-soft:rgba(245,165,36,.14);
  --red:#f87171;--red-soft:rgba(248,113,113,.13);--green:#34d399;--green-soft:rgba(52,211,153,.12);
  --empty:#0f1d33;
  --lm:#22d3ee;--lm-soft:rgba(34,211,238,.10);--ld:#a78bfa;--ld-soft:rgba(167,139,250,.12);--lj:#f472b6;--lj-soft:rgba(244,114,182,.12);--gone:#6b7f9b;
  --deco:.15;--deco-filter:brightness(2.6) saturate(.55);--deco-mark:.42;
  --red-ink:#1a0606;--amber-ink:#1a1200;--pin-low:#7dd3fc;--hatch:rgba(143,161,184,.42);
  --pop:0 10px 30px rgba(0,0,0,.35);
  --est:#b69cfb;--est-soft:rgba(182,156,251,.13);--sel-soft:rgba(34,211,238,.08);
  color-scheme:dark;
}
.l-uk,.l-pl{display:none}
:root[data-lang="uk"] .l-en,:root[data-lang="pl"] .l-en{display:none}
:root[data-lang="uk"] .l-uk,:root[data-lang="pl"] .l-pl{display:inline}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%;background:var(--bg)}
body{margin:0;background:var(--bg);color:var(--text);font:16px/1.65 ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;overflow-wrap:anywhere}
a{color:var(--accent)}
a:focus-visible,button:focus-visible,summary:focus-visible,[tabindex]:focus-visible{outline:3px solid var(--accent);outline-offset:2px;border-radius:4px}
.mono,.code,.mod{font-family:ui-monospace,"SF Mono","Cascadia Mono",Menlo,Consolas,monospace}
.wrap{max-width:1120px;margin:0 auto;padding-block:20px 32px;padding-left:max(16px, env(safe-area-inset-left, 0px));padding-right:max(16px, env(safe-area-inset-right, 0px));position:relative;color:var(--text)}
.corner{position:absolute;width:132px;height:134px;background:url("${CORNER}") center/contain no-repeat;opacity:var(--deco);filter:var(--deco-filter);pointer-events:none}
.corner--br{right:0;bottom:0}
.corner--tl{left:0;top:0;transform:rotate(180deg)}
@media (max-width:640px){.corner{display:none}}
.top{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:14px}
.toggles{display:flex;gap:8px;flex-wrap:wrap}
.eyebrow{font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:var(--accent);font-weight:700}
.toggle{display:inline-flex;border:1px solid var(--control);border-radius:10px;padding:3px;background:var(--panel)}
.toggle button{font:inherit;font-size:14px;color:var(--text);background:none;border:0;border-radius:7px;padding:6px 14px;min-height:32px;cursor:pointer}
.toggle button[aria-pressed="true"]{background:var(--accent);color:var(--accent-ink);font-weight:700}
h1{font-size:clamp(26px,4.2vw,42px);line-height:1.08;letter-spacing:-.02em;margin:8px 0 8px;font-weight:800}
h2{font-size:22px;line-height:1.3;margin:0;letter-spacing:-.01em}
h3{font-size:17px;margin:0}
.url{display:inline-block;font-size:14px;margin-bottom:12px;word-break:break-all}
.panel{background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:20px;margin-top:22px;box-shadow:var(--glow);min-width:0}
.panel-head{display:flex;align-items:baseline;gap:6px 12px;flex-wrap:wrap;margin-bottom:14px}
.panel-head .sub{color:var(--muted);font-size:14px;margin-left:auto}
.tablewrap{overflow-x:auto;border:1px solid var(--line);border-radius:12px;background:var(--panel-2);margin-top:14px}
table{border-collapse:collapse;width:100%;font-size:14.5px}
th,td{text-align:left;padding:8px 12px;border-bottom:1px solid var(--line);vertical-align:top}
th{font-size:13.5px;letter-spacing:.01em;color:var(--muted);font-weight:700;white-space:nowrap}
tr:last-child td{border-bottom:0}
/* counters, waterfall */
.counters{display:grid;grid-template-columns:repeat(auto-fit,minmax(176px,1fr));gap:12px;margin-top:4px}
.wf{display:block;width:100%;overflow:visible}
.wf .lab{fill:var(--text);font-size:14px;font-weight:600}
.wf .val{fill:var(--text);font-size:14px;font-weight:700;font-variant-numeric:tabular-nums}
.wf .track{fill:var(--empty)}
.wf .b-raw{fill:var(--line-2)}
.wf .b-kept{fill:var(--accent)}
.wf .b-gone{fill:var(--gone)}
.wf .b-cap{fill:var(--amber)}
.wf .guide{stroke:var(--line-2);stroke-width:1;stroke-dasharray:3 3}
/* footer */
.deco{height:26px;margin:6px 0 2px;background:url("${ORNAMENT}") center/contain no-repeat;opacity:var(--deco);filter:var(--deco-filter);pointer-events:none}
.deco--foot{margin:30px 0 -14px}
.motanka{width:30px;height:auto;opacity:var(--deco-mark);filter:var(--deco-filter);flex:none}
.foot-made{display:flex;align-items:center;gap:12px;max-width:600px}
.foot{margin-top:28px;border-top:1px solid var(--line);padding:18px 0 4px;color:var(--muted);font-size:14px;display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px 24px;align-items:center}
.foot p{margin:0;max-width:560px}
.links{display:flex;flex-wrap:wrap;gap:8px;margin:0;padding:0;list-style:none}
.links a{display:inline-flex;align-items:center;gap:7px;color:var(--text);text-decoration:none;border:1px solid var(--control);border-radius:999px;padding:6px 13px 6px 10px;background:var(--panel);font-size:14px}
.links a:hover{color:var(--text);border-color:var(--line-2)}
.links svg{width:15px;height:15px;flex:none}
@media (max-width:720px){
  .panel{padding:16px}
  .panel-head .sub{margin-left:0}}
@media (prefers-reduced-motion:reduce){*,*::before,*::after{transition:none!important;animation:none!important;scroll-behavior:auto!important}}

input[type="checkbox"]:focus-visible,a:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.pageid{display:flex;flex-wrap:wrap;gap:2px 12px;align-items:baseline;margin:4px 0 6px;font-size:14.5px;color:var(--muted)}
.pageid .url{font-size:14px;margin:0}
.pageid .pt{color:var(--muted)}
.verdict h1{font-size:clamp(23px,3.1vw,34px);line-height:1.2;letter-spacing:-.015em;margin:2px 0 8px;max-width:980px;font-weight:800}
.tiles{list-style:none;margin:18px 0 0;padding:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
.tile{border:1px solid var(--line);border-top:4px solid var(--st);border-radius:12px;padding:11px 13px 12px;background:var(--panel);min-width:0;display:flex;flex-direction:column;gap:7px}
.tile.ok{--st:var(--green);--sts:var(--green-soft)}
.tile.prob{--st:var(--amber);--sts:var(--amber-soft)}
.tile.block{--st:var(--red);--sts:var(--red-soft)}
.tile h2{font-size:16px;line-height:1.3;letter-spacing:0}
.state{display:inline-flex;align-items:center;gap:6px;align-self:flex-start;font-weight:800;font-size:13.5px;letter-spacing:.02em;color:var(--st);background:var(--sts);border:1px solid var(--st);border-radius:999px;padding:1px 10px 1px 5px}
.state svg{width:16px;height:16px;flex:none}
.tile p{margin:0;font-size:14.5px;line-height:1.45;color:var(--text)}
.tile .tc{margin-top:auto;font-size:14px;color:var(--muted)}
.mk{--mc:var(--muted);--ms:transparent;display:inline-flex;align-items:center;gap:7px;font-size:13px;font-weight:700;letter-spacing:.01em;color:var(--mc);white-space:nowrap;align-self:start;padding-top:1px}
.mk i{font-style:normal;display:inline-grid;place-items:center;width:20px;height:20px;border-radius:50%;border:1.5px solid var(--mc);background:var(--ms);font-size:12px;line-height:1;letter-spacing:0;flex:none}
.mk.pass{--mc:var(--green);--ms:var(--green-soft)}
.mk.fail{--mc:var(--red);--ms:var(--red-soft)}
.mk.warn{--mc:var(--amber);--ms:var(--amber-soft)}
.mk.na{--mc:var(--muted)}
.mk.na i{border-style:dashed}
@media (max-width:820px){.tiles{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:640px){
  .tiles{grid-template-columns:1fr;gap:8px}
  .tile{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:4px 10px;padding:10px 12px}
  .tile h2{grid-column:1}.tile .state{grid-column:2;grid-row:1}
  .tile p,.tile .tc{grid-column:1/-1}}

/* one severity palette, matching the map markers: blocking red · high amber filled · medium amber outline · low blue */
.pill.sev-high{color:var(--amber-ink);border-color:var(--amber);background:var(--amber)}
.vh{position:absolute!important;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap}
.top-l{display:flex;align-items:center;flex-wrap:wrap;gap:6px 14px;min-width:0}
.hit{box-shadow:0 0 0 2px var(--accent)!important;transition:box-shadow .2s}
/* page map */
.pmap{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(0,1fr);gap:16px;align-items:start}
.pm-pagecol{min-width:0;display:flex;justify-content:center}
.pm-svg{display:block;width:100%;height:auto;overflow:visible}
.pm-page{max-width:600px}
.pm-side{display:grid;gap:14px;min-width:0;justify-items:center}
.pm-side .pm-svg{max-width:440px}
.pm-svg .z{fill:var(--panel-2);stroke:var(--line-2);stroke-width:1}
.pm-svg .z.js{fill:var(--bg-2);stroke:var(--muted);stroke-width:1.5;stroke-dasharray:7 5}
.pm-svg .zl{fill:var(--text);font:600 14.5px ui-sans-serif,-apple-system,"Segoe UI",Roboto,sans-serif}
.pm-svg .zl.mono,.pm-svg .zk,.pm-svg .zv{font-family:ui-monospace,"SF Mono","Cascadia Mono",Menlo,Consolas,monospace}
.pm-svg .zk{fill:var(--text);font-size:13px;font-weight:600}
.pm-svg .zv{fill:var(--muted);font-size:12.5px}
.pm-svg .ht{fill:var(--text);font:700 13px ui-sans-serif,-apple-system,"Segoe UI",Roboto,sans-serif}
.pm-svg .halo{paint-order:stroke;stroke:var(--panel-2);stroke-width:5px;stroke-linejoin:round}
.pm-svg .ln{fill:var(--line-2)}
.pm-svg .ln.strong{fill:var(--muted);opacity:.6}
.pm-svg .ln.faint{fill:var(--line-2);opacity:.7}
.pm-svg .hid{fill:url(#pm-hatch);stroke:var(--muted);stroke-width:1.2;stroke-dasharray:4 3}
.pm-svg .hb,.pm-hatch-bg{fill:var(--bg-2)}
.pm-svg .hl{stroke:var(--hatch);stroke-width:2.2}
.pm-svg .sep{stroke:var(--line);stroke-width:1}
.pm-svg .okm circle{fill:var(--green-soft);stroke:var(--green);stroke-width:1.5}
.pm-svg .okm path{fill:none;stroke:var(--green);stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
.pin text{font:800 14px ui-sans-serif,system-ui,sans-serif;text-anchor:middle}
.pin.blocking .sh{fill:var(--red)}.pin.blocking text{fill:var(--red-ink)}
.pin.high .sh{fill:var(--amber)}.pin.high text{fill:var(--amber-ink)}
.pin.medium .sh{fill:var(--panel);stroke:var(--amber);stroke-width:2.6}.pin.medium text{fill:var(--amber)}
.pin.low .sh{fill:var(--panel);stroke:var(--pin-low);stroke-width:1.6}.pin.low text{fill:var(--pin-low);font-size:13px}
.pin .ring{fill:none;stroke:var(--accent);stroke-width:3;opacity:0}
.pm-a{cursor:pointer}
.pm-a:focus{outline:none}
.pm-a:hover .ring,.pm-a:focus-visible .ring{opacity:1}
.pi{flex:none;display:inline-block;vertical-align:middle;overflow:visible}
.pm-legend{display:flex;flex-wrap:wrap;gap:6px 16px;margin:14px 0 0;padding:0;list-style:none;font-size:14px;color:var(--text);align-items:center}
.pm-legend li{display:inline-flex;align-items:center;gap:6px}
.pm-legend .pm-un a{color:var(--text);font-weight:600}
.sw-hatch,.sw-js{width:22px;height:14px;border-radius:3px;flex:none;display:inline-block}
.sw-hatch{border:1.2px dashed var(--muted);background:repeating-linear-gradient(45deg,var(--hatch) 0 2px,var(--bg-2) 2px 6px)}
.sw-js{border:1.5px dashed var(--muted);background:var(--bg-2)}
.pm-key{list-style:none;margin:14px 0 0;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:6px 10px}
.pm-key li{display:flex;align-items:center;gap:8px;border:1px solid var(--line);border-radius:10px;padding:5px 10px 5px 6px;background:var(--panel-2);font-size:14.5px;font-weight:600;min-width:0;scroll-margin-top:12px}
.pk-l{min-width:0;flex:1}
.own{display:inline-flex;align-items:center;flex:none;color:var(--accent)}
.own svg{width:15px;height:15px}
/* lite */
.lite-verdict h1{font-size:clamp(26px,4vw,40px);line-height:1.12;letter-spacing:-.02em;margin:2px 0 6px;font-weight:800}
.lite-meta{margin:0;font-size:15px;color:var(--muted);display:flex;flex-wrap:wrap;gap:2px 8px}
.sevw{font-size:13px;letter-spacing:.02em;font-weight:800;color:var(--sc)}
.sevw.blocking{--sc:var(--red)}.sevw.high,.sevw.medium{--sc:var(--amber)}.sevw.low{--sc:var(--pin-low)}
.fav{vertical-align:-3px;border-radius:3px;flex:none}
.lcharts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 16px}
.lcharts .panel{margin-top:16px}
.lcharts .wide{grid-column:1/-1}
.unit{font-size:14px;color:var(--muted);font-weight:500}
.sbars{list-style:none;margin:0;padding:0;display:grid;gap:9px}
.sbars li{display:grid;grid-template-columns:128px minmax(0,1fr) 44px;gap:10px;align-items:center;font-size:14.5px}
.sbars .sl{display:inline-flex;align-items:center;gap:7px;font-weight:600;white-space:nowrap}
.sbars .st{height:14px;border-radius:4px;background:var(--empty);position:relative;overflow:hidden}
.sbars .sb{position:absolute;inset:0 auto 0 0;border-radius:4px;background:var(--c)}
.sbars .sb.medium{opacity:.55}
.sbars .sn{font-weight:800;font-variant-numeric:tabular-nums;text-align:right}
.bots{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(176px,1fr));gap:8px}
.bots li{display:grid;grid-template-columns:18px minmax(0,1fr) auto;gap:2px 8px;align-items:center;border:1px solid var(--line);border-radius:10px;padding:7px 10px;background:var(--panel-2);min-width:0}
.bots li.no{border-color:var(--red);background:var(--red-soft)}
.bots .fav{width:16px;height:16px;border-radius:3px}
.bots .bn{font-family:ui-monospace,"SF Mono",Menlo,Consolas,monospace;font-size:13.5px;font-weight:700;min-width:0}
.bots .bp{grid-column:2/-1;font-size:13px;color:var(--muted)}
.bots .mk{padding:0}
.cg{list-style:none;margin:0;padding:0 0 38px;display:grid;grid-template-columns:repeat(auto-fill,minmax(84px,1fr));gap:6px;position:relative}
.cg li{display:flex;flex-direction:column;align-items:center;gap:4px;border:1px solid var(--line);border-radius:9px;padding:7px 3px 5px;background:var(--panel-2);cursor:default;min-width:0}
.cg li.fail{border-color:var(--red)}.cg li.warn{border-color:var(--amber)}
.cg li:focus{outline:none}
.cg li:focus-visible,.cg li:hover{box-shadow:0 0 0 2px var(--accent)}
.cg .mk i{width:22px;height:22px;font-size:12.5px}
.cg .cs{font-size:12.5px;line-height:1.25;color:var(--text);text-align:center;max-width:100%;overflow-wrap:anywhere}
.cg .tip{display:none;position:absolute;left:0;right:0;bottom:0;font-size:14px;color:var(--text);background:var(--panel);border:1px solid var(--line-2);border-radius:8px;padding:4px 10px;pointer-events:none}
.cg li:hover .tip,.cg li:focus .tip{display:block}
.cg-sum{display:flex;flex-wrap:wrap;gap:4px 14px;margin:0 0 10px;padding:0;list-style:none;font-size:14.5px}
.cg-sum li{display:inline-flex;align-items:center;gap:6px}
.lgrid{width:100%;border-collapse:collapse;font-size:14px}
.lgrid th,.lgrid td{text-align:center;padding:7px 6px;border-bottom:1px solid var(--line)}
.lgrid th{font-size:13px}
.lgrid th:first-child,.lgrid td:first-child{text-align:left;font-family:ui-monospace,"SF Mono",Menlo,Consolas,monospace;font-weight:700}
.lgrid .mk{justify-content:center;padding:0}
.lgrid tr:last-child td{border-bottom:0}
.mkey{display:flex;flex-wrap:wrap;gap:4px 14px;margin:10px 0 0;padding:0;list-style:none;font-size:13.5px;color:var(--muted)}
.mkey li{display:inline-flex;align-items:center;gap:5px}
.mkey .mk i{width:16px;height:16px;font-size:10px}
.cannot-lite{list-style:none;margin:0;padding:0;display:grid;gap:6px}
.cannot-lite li{display:flex;gap:10px;align-items:center;font-size:14.5px;border:1px solid var(--line);border-radius:10px;padding:7px 12px;background:var(--panel-2);flex-wrap:wrap}
.cannot-lite svg{width:18px;height:18px;color:var(--muted);flex:none}
.cannot-lite .cl-t{flex:1;min-width:180px}
.cannot-lite a{font-size:14px;white-space:nowrap}
.fulllink{margin:22px 0 0;font-size:17px;font-weight:800}
.fulllink a{text-decoration:none;border-bottom:2px solid var(--accent)}
@media (max-width:860px){.pmap{grid-template-columns:1fr}.pm-side{grid-template-columns:repeat(auto-fit,minmax(260px,1fr))}}
@media (max-width:720px){.lcharts{grid-template-columns:1fr}.sbars li{grid-template-columns:104px minmax(0,1fr) 34px}}
`;

/** States and blocks the real reports need beyond the prototype: a tile with one language version, "not on this page" cells, cap notes, the refusal. */
export const CSS_EXTRA = `
.pm-svg .zn{fill:var(--text);font:700 12px ui-sans-serif,-apple-system,"Segoe UI",Roboto,sans-serif}
.tile.na{--st:var(--muted);--sts:transparent}
.tile.na .state{border-style:dashed}
.mk.none{--mc:var(--faint)}
.mk.none i{border-style:dotted}
.cg li.na,.cg li.none{border-style:dashed}
.capnote{margin:10px 0 0;font-size:14px;color:var(--muted)}
.capnote.bad{color:var(--red);font-weight:600}
.caps{margin:10px 0 0;padding:0 0 0 16px;font-size:14px;color:var(--muted);display:grid;gap:2px}
.none-found{margin:0;font-size:14.5px;color:var(--muted)}
.lgrid .self{font-family:ui-sans-serif,-apple-system,"Segoe UI",Roboto,sans-serif;font-weight:500;font-size:12.5px;color:var(--muted);margin-left:4px}
.refusal{margin-top:18px;border:1.5px solid var(--red);border-left-width:4px;background:var(--panel);border-radius:14px;padding:18px 20px;box-shadow:var(--glow)}
.refusal-head{display:flex;align-items:center;gap:12px;margin-bottom:10px}
.refusal-head svg{width:30px;height:30px;color:var(--red);flex:none}
.refusal-head h2{font-size:clamp(20px,3.4vw,26px);color:var(--text);margin:0}
.refusal .lead{margin:0 0 14px;font-size:15.5px;max-width:860px}
.refusal ul{margin:0;padding-left:20px;max-width:860px}
.refusal>div>ul>li{margin:0 0 12px}
.refusal li ul{margin-top:6px}
.refusal li li{margin:0 0 6px}
.refusal p,.refusal li{font-size:14.5px;line-height:1.55;overflow-wrap:anywhere}
.refusal b{font-weight:700;color:var(--text)}
.refusal .src-link{white-space:nowrap;margin-left:4px;font-size:13px}
.refusal .sanctions{margin:14px 0 0;padding-top:12px;border-top:1px solid var(--line);max-width:860px}
.refusal .why{margin:-6px 0 14px;font-weight:600;color:var(--text)}
.lb-uk,.lb-pl{display:none}
:root[data-lang="uk"] .lb-en,:root[data-lang="pl"] .lb-en{display:none}
:root[data-lang="uk"] .lb-uk,:root[data-lang="pl"] .lb-pl{display:block}
@media (max-width:480px){.refusal{padding:14px 14px}.refusal ul{padding-left:16px}}
/* the judgement badge and the one-model note */
.lyr{display:inline-flex;align-items:center;gap:4px;font-weight:600;font-size:12px;line-height:1.5;letter-spacing:.01em;border-radius:999px;padding:0 7px;border:1px solid var(--c);color:var(--c);background:var(--cs);white-space:nowrap;max-width:100%;overflow:hidden;text-overflow:ellipsis}
.lyr::before{content:"";width:6px;height:6px;border-radius:50%;background:var(--c);flex:none}
.lyr.judgement{--c:var(--lj);--cs:var(--lj-soft)}
.pm-key li.jd{flex-wrap:wrap}
.pm-key li.jd .lyr{text-transform:none;letter-spacing:.01em;font-size:12px;white-space:normal;overflow:visible;line-height:1.35;padding:1px 8px}
.pm-key li.jd .lyr{flex-basis:100%;margin:0 0 2px;width:fit-content;max-width:100%}
.honest{margin:0 0 12px;font-size:14.5px;color:var(--text);border:1px solid var(--line-2);border-left:3px solid var(--lj);border-radius:10px;padding:8px 12px;background:var(--lj-soft)}
/* 2.103 layout: header, headline, cards, the first three, the places, all checks, notes, footer */
.wrap{max-width:1160px}
.top{display:flex;align-items:center;gap:12px 18px;flex-wrap:nowrap;margin:2px 0 22px}
.top-l{flex:none;gap:10px 14px}
.brand{display:inline-flex;align-items:center;gap:9px;font-weight:800;letter-spacing:-.01em;color:var(--text)}
.gll-mark{width:56px;height:30px;flex:none;display:block}
.gll-loop{color:var(--brand)}
/* The mark in the brand blue that suits the surface: #14468f on light, #4d7dff on dark. */
.gll-on-dark{display:none!important}
:root[data-theme="dark"] .gll-on-light{display:none!important}
:root[data-theme="dark"] .gll-on-dark{display:block!important}
.links .gll-ico{width:28px;height:15px;flex:none}
/* The split-signal mark; its signal fault is drawn by LOGO_GLITCH_JS (glitch.mjs), at random moments. */
.gll-glitch{position:relative;display:inline-grid;place-items:center;flex:none}
.brand--top .gll-word{font-size:18px}
.divider{width:1px;height:22px;background:var(--line-2);flex:none}
.product{font-size:16px;font-weight:700;color:var(--accent)}
.deco--top{flex:1;min-width:40px;height:22px;margin:0;background-size:auto 22px}
.toggles{flex:none}
.pageid{display:block;margin:0 0 2px;font-size:15px}
.url{display:inline-flex;align-items:center;gap:6px;margin:0;font-size:15px;font-weight:600;text-decoration:none;word-break:break-all}
.url:hover{text-decoration:underline}
.url .ext{width:15px;height:15px;flex:none}
.lite-meta{font-size:15px;margin:0 0 12px;gap:2px 8px}
.lite-meta .pt{max-width:60ch;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.lite-verdict h1{font-size:clamp(30px,5vw,52px);line-height:1.08;letter-spacing:-.025em;margin:0 0 10px;max-width:1000px}
.lede{margin:0 0 14px;font-size:clamp(16px,1.9vw,19px);line-height:1.5;color:var(--muted);max-width:820px}
.sevrow{list-style:none;margin:0 0 20px;padding:0;display:flex;flex-wrap:wrap;gap:6px 26px;font-size:16px;color:var(--text)}
.sevrow li{display:inline-flex;align-items:center;gap:8px}
.cta-row{margin:0}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;font:inherit;font-weight:700;font-size:16px;line-height:1.2;text-decoration:none;border-radius:10px;padding:11px 22px;min-height:44px;cursor:pointer;border:1.5px solid var(--accent);white-space:nowrap}
.btn-primary{background:var(--accent);color:var(--accent-ink)}
.btn-primary:hover{filter:brightness(1.08)}
.btn-out{background:var(--panel);color:var(--accent)}
.btn-out:hover{background:var(--accent-soft)}
.btn-sm{font-size:14px;padding:7px 14px;min-height:36px;border-radius:9px}
.btn .chev{width:16px;height:16px;flex:none;transition:transform .15s}
.sum{margin-top:34px}
.sum>h2,.sum-head h2{font-size:clamp(22px,2.6vw,28px);letter-spacing:-.015em;margin:0 0 14px}
.sum-head{display:flex;align-items:baseline;justify-content:space-between;gap:4px 16px;flex-wrap:wrap}
.sum-head .sub{font-size:14px;color:var(--muted)}
/* the three cards */
.cards{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0}
.card{display:flex;align-items:center;gap:16px;padding:6px 22px;min-width:0;--st:var(--green)}
.card+.card{border-left:1px solid var(--line-2)}
.card:first-child{padding-left:0}
.card.prob{--st:var(--amber)}.card.block{--st:var(--red)}.card.na{--st:var(--muted)}
.card-i{flex:none;width:52px;height:52px;border-radius:50%;border:2px solid var(--st);color:var(--st);display:grid;place-items:center}
.card.na .card-i{border-style:dashed}
.card-i svg{width:26px;height:26px}
.card-t{display:flex;flex-direction:column;gap:3px;min-width:0}
.card h3{font-size:16.5px;line-height:1.3}
.card-s{font-size:14.5px;color:var(--st);font-weight:600;line-height:1.35}
.cards-note{margin:12px 0 0;font-size:13.5px;color:var(--muted)}
/* the first three */
.trows{list-style:none;margin:0;padding:0;border-top:1px solid var(--line)}
.tr{border-bottom:1px solid var(--line);scroll-margin-top:24px}
.tr-m{display:grid;grid-template-columns:40px minmax(0,1fr) auto minmax(0,190px) auto;align-items:center;gap:8px 16px;padding:10px 0}
summary.tr-m{cursor:pointer;list-style:none}
summary.tr-m::-webkit-details-marker{display:none}
.tn{width:36px;height:36px;border-radius:50%;border:2px solid var(--sc,var(--amber));display:grid;place-items:center;font-weight:800;font-size:16px;color:var(--text)}
.tn.blocking{--sc:var(--red)}.tn.high,.tn.medium{--sc:var(--amber)}.tn.low{--sc:var(--pin-low)}
.tl{font-weight:700;font-size:16.5px;line-height:1.3;min-width:0}
.tp{display:flex;gap:8px;flex-wrap:wrap}
.tloc{font-size:14.5px;color:var(--muted);min-width:0;overflow-wrap:anywhere}
.tr-b{justify-self:end}
.tr-d[open] .tr-b .chev{transform:rotate(180deg)}
.tr-x{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);gap:10px 24px;margin:0 0 12px;padding:14px 18px;border:1px solid var(--line-2);border-radius:12px;background:var(--panel-2)}
.qx{margin:0;padding-left:18px;display:grid;gap:4px;font-size:14.5px}
.qx li::marker{color:var(--pin-low)}
.tr-model{margin:0;font-size:14.5px;display:flex;flex-direction:column;gap:2px;border-left:1px solid var(--line-2);padding-left:20px}
.tr-model>span{color:var(--muted)}
.pill{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:600;line-height:1.2;border:1px solid var(--line-2);border-radius:999px;padding:4px 11px;background:var(--panel);color:var(--text);white-space:nowrap}
.pill .pi{width:12px;height:12px}
.lp::before{content:"";width:8px;height:8px;flex:none}
.lp.ms::before{border-radius:50%;background:var(--lm)}
.lp.est{border-color:var(--est);color:var(--est);background:var(--est-soft)}
.lp.est::before{border:2px solid var(--est);transform:rotate(45deg);width:6px;height:6px}
/* where on the page */
.pmap{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);gap:18px;align-items:start}
.places{list-style:none;margin:0;padding:0 0 0 24px;position:relative;display:grid;gap:8px}
.places::before{content:"";position:absolute;left:7px;top:14px;bottom:14px;width:2px;background:var(--line-2)}
.pl{position:relative;scroll-margin-top:24px}
.pl::before{content:"";position:absolute;left:-21px;top:50%;width:10px;height:10px;margin-top:-5px;border-radius:50%;background:var(--control);border:2px solid var(--bg)}
.pl.sel::before{background:var(--accent)}
.pr{all:unset;box-sizing:border-box;display:grid;grid-template-columns:minmax(0,1fr) minmax(40px,30%) auto;align-items:center;gap:6px 12px;width:100%;min-height:44px;padding:7px 12px 7px 16px;border:1px solid var(--control);border-radius:10px;background:var(--panel);cursor:pointer;font-size:15px;color:var(--text)}
.pr:hover{border-color:var(--accent)}
.pr:focus-visible{outline:3px solid var(--accent);outline-offset:2px}
.pl.sel .pr{border:2px solid var(--accent);background:var(--sel-soft);padding:6px 11px 6px 15px;font-weight:700}
.pl.file .pr-l{font-family:ui-monospace,"SF Mono","Cascadia Mono",Menlo,Consolas,monospace;font-size:14px}
.pl.js .pr{border-style:dashed}
.pr-l{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.pr-bar{display:block;height:8px;border-radius:4px;background:var(--line);justify-self:start}
.pr-n{font-size:13px;color:var(--muted);font-weight:500}
.pl.hid .pr{background:repeating-linear-gradient(45deg,var(--hatch) 0 2px,var(--bg-2) 2px 7px);border-style:dashed;border-color:var(--muted)}
.pr-hid{justify-self:end;font-size:13px;font-weight:600;color:var(--text);background:var(--panel);border:1px solid var(--line-2);border-radius:6px;padding:2px 8px;white-space:nowrap}
.pr-pins{display:inline-flex;gap:4px;align-items:center;justify-self:end;min-height:24px}
.pr-more{font-size:13px;font-weight:700;color:var(--text)}
.pm-side{display:block;justify-items:stretch;position:sticky;top:12px}
.pd{border:1px solid var(--line-2);border-radius:14px;background:var(--panel);padding:18px 20px;box-shadow:var(--glow)}
.pd h3{font-size:18px;line-height:1.3;margin:0 0 12px}
.pd-f{margin:0 0 6px;font-weight:700;font-size:15px}
.pd-f.none{font-weight:500;color:var(--muted)}
.pd-list{list-style:none;margin:0 0 14px;padding:0;display:grid;gap:10px}
.pd-list li{display:grid;grid-template-columns:24px minmax(0,1fr);gap:4px 10px;align-items:center}
.pd-l{font-size:15.5px;font-weight:600;min-width:0}
.pd-p{grid-column:2;display:flex;gap:8px;flex-wrap:wrap}
.pd-rows{list-style:none;margin:0 0 14px;padding:0;display:grid;gap:0;border:1px solid var(--line);border-radius:10px;background:var(--panel-2)}
.pd-rows li{display:grid;grid-template-columns:minmax(80px,auto) minmax(0,1fr) auto;gap:4px 12px;align-items:center;padding:6px 12px;border-bottom:1px solid var(--line);font-size:13.5px}
.pd-rows li:last-child{border-bottom:0}
.pd-rows .rk{font-family:ui-monospace,"SF Mono",Menlo,Consolas,monospace;font-weight:700}
.pd-rows .rv{color:var(--muted);min-width:0;overflow-wrap:anywhere}
.pd-rows .rs{display:inline-flex;gap:3px}
.pd-rows .mk{padding:0}
.pd-rows .mk i{width:18px;height:18px;font-size:11px}
.exact>summary{list-style:none;width:fit-content}
.exact>summary::-webkit-details-marker{display:none}
.exact[open]>summary .chev{transform:rotate(180deg)}
.ex-box{margin-top:12px;border:1px solid var(--line-2);border-radius:10px;padding:10px 12px;background:var(--panel-2);display:grid;gap:8px}
.ex-l{margin:0;font-size:14px;color:var(--muted)}
.ex-row{display:flex;gap:8px;align-items:center}
.ex-c{flex:1;min-width:0;font-family:ui-monospace,"SF Mono","Cascadia Mono",Menlo,Consolas,monospace;font-size:13.5px;background:var(--panel);border:1px solid var(--line);border-radius:6px;padding:6px 10px;overflow-wrap:anywhere;color:var(--text)}
.copy{flex:none;display:grid;place-items:center;width:36px;height:36px;border-radius:8px;border:1px solid var(--control);background:var(--panel);color:var(--text);cursor:pointer}
.copy svg{width:17px;height:17px}
.copy.done{border-color:var(--green);color:var(--green)}
.copy.sel-text{border-color:var(--accent);color:var(--accent)}
.pm-legend{margin-top:14px}
/* all checks */
.allc{margin-top:30px;border:1px solid var(--line-2);border-radius:14px;background:var(--panel);box-shadow:var(--glow)}
.allc-s{display:flex;align-items:center;gap:16px;padding:16px 22px;cursor:pointer;list-style:none;border-radius:14px}
.allc-s::-webkit-details-marker{display:none}
.allc-i{flex:none;width:40px;height:40px;display:grid;place-items:center;color:var(--accent)}
.allc-i svg{width:30px;height:30px}
.allc-t{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}
.allc-t h2{font-size:19px}
.allc-t .sub{font-size:14.5px;color:var(--muted)}
.allc-s>.chev{width:22px;height:22px;flex:none;color:var(--accent);transition:transform .15s}
.allc[open]>.allc-s>.chev{transform:rotate(180deg)}
.allc[open]>.allc-s{border-bottom:1px solid var(--line);border-radius:14px 14px 0 0}
.allc-b{padding:4px 20px 22px}
.allc-b .panel{box-shadow:none}
.areas{grid-template-columns:repeat(3,minmax(0,1fr))}
.areas .tile h3{font-size:15.5px;line-height:1.3}
.strips{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
.strip h3{font-size:15px;margin:0 0 8px}
.strip .pd-rows{margin:0}
.strip .rs a{display:inline-flex}
.pk-l{display:flex;flex-direction:column}
.pk-w{font-size:13px;font-weight:500;color:var(--muted);overflow-wrap:anywhere}
/* notes, the full version, the footer */
.info{margin-top:26px;display:grid;grid-template-columns:minmax(0,1.4fr) auto auto;align-items:center;gap:14px 26px;padding:14px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.info-n{margin:0;display:flex;gap:12px;align-items:center;font-size:13.5px;color:var(--muted);line-height:1.45}
.info-n svg{width:26px;height:26px;flex:none;color:var(--muted)}
.info-l{list-style:none;margin:0;padding:0;display:flex;gap:10px 22px;flex-wrap:wrap;font-size:13.5px}
.info-l li{display:flex;gap:8px;align-items:baseline}
.info-l li>span:last-child{display:flex;flex-direction:column;color:var(--muted)}
.info-l b{color:var(--text);font-weight:600}
.lyr-k{width:10px;height:10px;flex:none;position:relative;top:1px}
.lyr-k.ms{border-radius:50%;background:var(--lm)}
.lyr-k.est{border:2px solid var(--est);transform:rotate(45deg);width:8px;height:8px}
.fulllink{margin:0;font-size:16px}
.fulllink a{text-decoration:none;border-bottom-width:1.5px}
.foot{margin-top:20px;border-top:0;padding:8px 0 4px;align-items:center}
.foot-brand{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.brand--foot .gll-word{font-size:16px;font-weight:700}
.tagline{font-size:15px;color:var(--muted)}
.foot-made{flex-basis:100%;max-width:none;font-size:13px}
.foot-made p{max-width:760px}
.links a{font-size:13.5px;padding:5px 12px 5px 9px}
.corner--br{width:110px;height:112px}
@media (max-width:900px){
  .top{flex-wrap:wrap}.deco--top{display:none}
  .cards{grid-template-columns:1fr;gap:12px}
  .card,.card:first-child{padding:0}.card+.card{border-left:0}
  .tr-m{grid-template-columns:40px minmax(0,1fr) auto;gap:6px 12px}
  .tr-m .tp{grid-column:2/-1}.tr-m .tloc{grid-column:2}.tr-m .tr-b{grid-column:3;grid-row:1}
  .tr-x{grid-template-columns:1fr}.tr-model{border-left:0;padding-left:0;border-top:1px solid var(--line-2);padding-top:8px}
  .pmap{grid-template-columns:1fr}.pm-side{position:static}
  .areas,.strips{grid-template-columns:1fr}
  .info{grid-template-columns:1fr}}
@media (max-width:560px){
  .top-l .divider,.top-l .product{display:none}
  .tr-m{grid-template-columns:36px minmax(0,1fr)}
  .tr-m .tr-b{grid-column:2;grid-row:auto;justify-self:start}
  .pr{grid-template-columns:minmax(0,1fr) auto}.pr-bar{display:none}.pr-hid{grid-column:1/-1;justify-self:start;white-space:normal}
  .allc-s{padding:14px}.allc-b{padding:4px 10px 16px}
  .btn{white-space:normal}}
`;
