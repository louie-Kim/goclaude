"use client";

import { useState } from "react";

const Icon = ({ d, size = 20 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const ICONS = {
  home:     "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
  chart:    "M18 20V10 M12 20V4 M6 20v-6",
  users:    "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",
  card:     "M21 4H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z M1 10h22",
  cog:      "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
  bell:     "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0",
  search:   "M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0",
  up:       "M12 19V5 M5 12l7-7 7 7",
  down:     "M12 5v14 M19 12l-7 7-7-7",
  menu:     "M3 12h18 M3 6h18 M3 18h18",
  x:        "M18 6L6 18 M6 6l12 12",
  zap:      "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  globe:    "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z",
  activity: "M22 12h-4l-3 9L9 3l-3 9H2",
  plus:     "M12 5v14 M5 12h14",
  mail:     "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6",
  shield:   "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  trash:    "M3 6h18 M8 6V4h8v2 M19 6l-1 14H6L5 6",
  edit:     "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
  download: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3",
};

const Badge = ({ label, variant = "purple" }: { label: string; variant?: string }) => {
  const styles: Record<string, string> = {
    purple:  "bg-purple-500/15 text-purple-300 border border-purple-500/25",
    indigo:  "bg-indigo-500/15 text-indigo-300 border border-indigo-500/25",
    green:   "bg-emerald-500/15 text-emerald-300 border border-emerald-500/25",
    gray:    "bg-white/5 text-gray-400 border border-white/10",
  };
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${styles[variant] ?? styles.purple}`}>{label}</span>;
};

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-[#0f0f12] border border-white/5 rounded-xl ${className}`}>{children}</div>
);

const SectionHeader = ({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) => (
  <div className="flex items-start justify-between px-5 py-4 border-b border-white/5">
    <div>
      <h2 className="text-sm font-semibold text-white">{title}</h2>
      {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);

const BARS = [40, 65, 50, 80, 70, 90, 75, 95, 85, 100, 88, 110];
const Sparkline = ({ color = "#a855f7" }: { color?: string }) => {
  const max = Math.max(...BARS);
  return (
    <div className="flex items-end gap-0.5 h-10">
      {BARS.map((v, i) => (
        <div key={i} style={{ height: `${(v / max) * 100}%`, backgroundColor: color, opacity: 0.3 + (i / BARS.length) * 0.7, width: 4, borderRadius: 2 }} />
      ))}
    </div>
  );
};

const SEGMENTS = [
  { pct: 45, color: "#a855f7", label: "Pro" },
  { pct: 30, color: "#6366f1", label: "Enterprise" },
  { pct: 15, color: "#d946ef", label: "Starter" },
  { pct: 10, color: "#374151", label: "Trial" },
];
const Donut = () => {
  const r = 38, cx = 50, cy = 50, circ = 2 * Math.PI * r;
  let cum = 0;
  return (
    <div className="flex items-center gap-6">
      <svg width="120" height="120" viewBox="0 0 100 100">
        {SEGMENTS.map((s, i) => {
          const offset = circ - (s.pct / 100) * circ;
          const rot = (cum / 100) * 360 - 90;
          cum += s.pct;
          return <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={s.color} strokeWidth="12" strokeDasharray={`${circ}`} strokeDashoffset={offset} transform={`rotate(${rot} ${cx} ${cy})`} />;
        })}
        <text x="50" y="46" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">38k</text>
        <text x="50" y="58" textAnchor="middle" fill="#9ca3af" fontSize="7">users</text>
      </svg>
      <div className="flex flex-col gap-2">
        {SEGMENTS.map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
            <span className="text-xs text-gray-400">{s.label}</span>
            <span className="text-xs text-white font-medium ml-auto pl-3">{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const MONTHS = ["Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan"];
const OVERVIEW_STATS = [
  { label: "Total Revenue",   value: "$124,592", change: +18.2, icon: ICONS.card,     color: "#a855f7" },
  { label: "Active Users",    value: "38,491",   change: +12.5, icon: ICONS.users,    color: "#6366f1" },
  { label: "Conversion Rate", value: "4.83%",    change: -2.1,  icon: ICONS.activity, color: "#d946ef" },
  { label: "Avg. Session",    value: "6m 42s",   change: +5.7,  icon: ICONS.globe,    color: "#8b5cf6" },
];
const RECENT_USERS = [
  { name: "Aria Chen",    email: "aria@nexus.io",     plan: "Pro",        status: "Active",  joined: "Feb 24" },
  { name: "Luca Moretti", email: "luca@velox.ai",     plan: "Enterprise", status: "Active",  joined: "Feb 23" },
  { name: "Zoe Nakamura", email: "zoe@synthai.com",   plan: "Starter",    status: "Trial",   joined: "Feb 22" },
  { name: "Kai Osei",     email: "kai@datastream.co", plan: "Pro",        status: "Active",  joined: "Feb 21" },
  { name: "Sofia Reyes",  email: "sofia@cloudx.dev",  plan: "Enterprise", status: "Churned", joined: "Feb 19" },
];
const STATUS_V: Record<string, string> = { Active: "purple", Trial: "indigo", Churned: "gray" };

function OverviewPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {OVERVIEW_STATS.map((s) => (
          <Card key={s.label} className="p-4 hover:border-purple-500/20 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                <p className="text-2xl font-bold">{s.value}</p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                <Icon d={s.icon} size={16} />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-medium flex items-center gap-0.5 ${s.change >= 0 ? "text-[#c27aff]" : "text-[#ff6467]"}`}>
                <Icon d={s.change >= 0 ? ICONS.up : ICONS.down} size={11} />
                {Math.abs(s.change)}% vs last mo.
              </span>
              <Sparkline color={s.color} />
            </div>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold">Revenue Over Time</h2>
              <p className="text-xs text-gray-500 mt-0.5">Monthly recurring revenue</p>
            </div>
            <select className="text-xs bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-gray-400 focus:outline-none cursor-pointer">
              <option>Last 12 months</option>
              <option>Last 6 months</option>
            </select>
          </div>
          <svg viewBox="0 0 600 140" className="w-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[0,1,2,3,4].map(i => <line key={i} x1="0" y1={i*30+5} x2="600" y2={i*30+5} stroke="#ffffff08" strokeWidth="1"/>)}
            <path d="M0,120 C50,110 100,90 150,70 C200,50 250,60 300,45 C350,30 400,55 450,35 C500,15 550,25 600,10 L600,135 L0,135 Z" fill="url(#revGrad)" />
            <path d="M0,120 C50,110 100,90 150,70 C200,50 250,60 300,45 C350,30 400,55 450,35 C500,15 550,25 600,10" fill="none" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="600" cy="10" r="4" fill="#a855f7" />
            <circle cx="600" cy="10" r="8" fill="#a855f7" fillOpacity="0.2" />
          </svg>
          <div className="flex justify-between mt-2">
            {MONTHS.map(m => <span key={m} className="text-xs text-gray-600">{m}</span>)}
          </div>
        </Card>
        <Card className="p-5">
          <h2 className="text-sm font-semibold mb-1">Plan Distribution</h2>
          <p className="text-xs text-gray-500 mb-4">User split by subscription</p>
          <Donut />
        </Card>
      </div>
      <Card>
        <SectionHeader title="Recent Sign-ups" sub="Latest users to join the platform"
          action={<button className="text-xs text-purple-400 hover:text-purple-300 font-medium">View all →</button>} />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {["Name","Plan","Status","Joined"].map(h => (
                  <th key={h} className="text-left text-xs text-gray-600 font-medium px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RECENT_USERS.map((u, i) => (
                <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-xs font-bold flex-shrink-0">{u.name[0]}</div>
                      <div>
                        <p className="text-sm font-medium">{u.name}</p>
                        <p className="text-xs text-gray-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs text-gray-300">{u.plan}</td>
                  <td className="px-5 py-3"><Badge label={u.status} variant={STATUS_V[u.status] ?? "gray"} /></td>
                  <td className="px-5 py-3 text-xs text-gray-500">{u.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5">
          <h2 className="text-sm font-semibold mb-3">Quick Actions</h2>
          <div className="flex flex-col gap-1">
            {[{label:"Invite Team Member",icon:ICONS.users},{label:"Create API Key",icon:ICONS.zap},{label:"View Audit Log",icon:ICONS.activity},{label:"Download Report",icon:ICONS.download}].map(a => (
              <button key={a.label} className="flex items-center gap-3 text-sm text-gray-400 hover:text-white hover:bg-white/5 px-3 py-2.5 rounded-lg transition-all text-left">
                <span className="text-purple-400"><Icon d={a.icon} size={15} /></span>{a.label}
              </button>
            ))}
          </div>
        </Card>
        <Card className="md:col-span-2 p-5">
          <h2 className="text-sm font-semibold mb-3">Activity Feed</h2>
          <div className="flex flex-col gap-3">
            {[
              {msg:"New Enterprise signup from Velox AI",time:"2m ago",dot:"#a855f7"},
              {msg:"Payment of $2,400 received from DataStream Co.",time:"18m ago",dot:"#6366f1"},
              {msg:"API rate limit warning triggered for User #4821",time:"1h ago",dot:"#d946ef"},
              {msg:"Backup completed successfully — 3.2 GB",time:"3h ago",dot:"#374151"},
              {msg:"5 trial accounts converted to Pro plan",time:"6h ago",dot:"#a855f7"},
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0" style={{backgroundColor:item.dot}} />
                <p className="flex-1 text-xs text-gray-300 leading-relaxed">{item.msg}</p>
                <span className="text-xs text-gray-600 flex-shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

const CHANNEL_DATA = [
  {label:"Organic Search",pct:42,color:"#a855f7"},
  {label:"Direct",pct:28,color:"#6366f1"},
  {label:"Referral",pct:18,color:"#d946ef"},
  {label:"Social",pct:12,color:"#8b5cf6"},
];
const COUNTRY_DATA = [
  {country:"United States",users:14820,share:38},
  {country:"United Kingdom",users:7240,share:19},
  {country:"Germany",users:5110,share:13},
  {country:"Japan",users:4380,share:11},
  {country:"Canada",users:3900,share:10},
  {country:"Other",users:2941,share:9},
];

function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[{label:"Page Views",value:"2.4M",change:+22},{label:"Unique Visitors",value:"381K",change:+14},{label:"Bounce Rate",value:"28.4%",change:-4.1},{label:"Pages/Session",value:"3.7",change:+8.2}].map(k => (
          <Card key={k.label} className="p-4">
            <p className="text-xs text-gray-500 mb-1">{k.label}</p>
            <p className="text-2xl font-bold mb-2">{k.value}</p>
            <span className={`text-xs font-medium flex items-center gap-0.5 ${k.change>=0?"text-[#c27aff]":"text-[#ff6467]"}`}>
              <Icon d={k.change>=0?ICONS.up:ICONS.down} size={11}/>{Math.abs(k.change)}% this month
            </span>
          </Card>
        ))}
      </div>
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold">Traffic Over Time</h2>
            <p className="text-xs text-gray-500 mt-0.5">Daily active users · last 30 days</p>
          </div>
        </div>
        <svg viewBox="0 0 700 160" className="w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.25"/><stop offset="100%" stopColor="#a855f7" stopOpacity="0"/>
            </linearGradient>
          </defs>
          {[0,1,2,3].map(i => <line key={i} x1="0" y1={i*40+10} x2="700" y2={i*40+10} stroke="#ffffff07" strokeWidth="1"/>)}
          <path d="M0,130 C30,120 60,100 90,80 C120,60 150,70 180,50 C210,30 240,45 270,35 C300,25 330,40 360,30 C390,20 420,50 450,40 C480,30 510,15 540,20 C570,25 600,10 630,15 C660,20 680,12 700,8 L700,150 L0,150 Z" fill="url(#g1)"/>
          <path d="M0,130 C30,120 60,100 90,80 C120,60 150,70 180,50 C210,30 240,45 270,35 C300,25 330,40 360,30 C390,20 420,50 450,40 C480,30 510,15 540,20 C570,25 600,10 630,15 C660,20 680,12 700,8" fill="none" stroke="#a855f7" strokeWidth="2"/>
          <path d="M0,145 C30,135 60,125 90,110 C120,95 150,105 180,90 C210,75 240,85 270,78 C300,71 330,82 360,72 C390,62 420,75 450,68 C480,61 510,52 540,58 C570,64 600,48 630,54 C660,60 680,44 700,50" fill="none" stroke="#6366f1" strokeWidth="2" strokeDasharray="4 2"/>
        </svg>
      </Card>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card className="p-5">
          <h2 className="text-sm font-semibold mb-5">Acquisition Channels</h2>
          <div className="flex flex-col gap-4">
            {CHANNEL_DATA.map(c => (
              <div key={c.label}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-gray-300">{c.label}</span>
                  <span className="text-gray-500">{c.pct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full" style={{width:`${c.pct}%`,backgroundColor:c.color}} />
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <SectionHeader title="Top Countries" sub="Users by geography" />
          <div className="divide-y divide-white/5">
            {COUNTRY_DATA.map(c => (
              <div key={c.country} className="flex items-center justify-between px-5 py-3">
                <span className="text-sm text-gray-300">{c.country}</span>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-1 rounded-full bg-white/5 overflow-hidden hidden sm:block">
                    <div className="h-full rounded-full bg-purple-500" style={{width:`${c.share}%`}} />
                  </div>
                  <span className="text-xs text-gray-500 w-12 text-right">{c.users.toLocaleString()}</span>
                  <span className="text-xs text-purple-400 w-8 text-right">{c.share}%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

const ALL_USERS = [
  {name:"Aria Chen",email:"aria@nexus.io",plan:"Pro",status:"Active",joined:"Feb 24",spend:"$240"},
  {name:"Luca Moretti",email:"luca@velox.ai",plan:"Enterprise",status:"Active",joined:"Feb 23",spend:"$960"},
  {name:"Zoe Nakamura",email:"zoe@synthai.com",plan:"Starter",status:"Trial",joined:"Feb 22",spend:"$0"},
  {name:"Kai Osei",email:"kai@datastream.co",plan:"Pro",status:"Active",joined:"Feb 21",spend:"$240"},
  {name:"Sofia Reyes",email:"sofia@cloudx.dev",plan:"Enterprise",status:"Churned",joined:"Feb 19",spend:"$480"},
  {name:"Ethan Park",email:"ethan@layers.io",plan:"Pro",status:"Active",joined:"Feb 17",spend:"$240"},
  {name:"Mia Larsson",email:"mia@nordic.dev",plan:"Starter",status:"Active",joined:"Feb 15",spend:"$49"},
  {name:"Omar Hassan",email:"omar@stackflow.ai",plan:"Enterprise",status:"Active",joined:"Feb 12",spend:"$960"},
  {name:"Priya Kapoor",email:"priya@devhub.io",plan:"Pro",status:"Trial",joined:"Feb 10",spend:"$0"},
  {name:"James Whitfield",email:"james@cloudnine.co",plan:"Starter",status:"Active",joined:"Feb 08",spend:"$49"},
];

function UsersPage() {
  const [search, setSearch] = useState("");
  const filtered = ALL_USERS.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[{label:"Total Users",value:"38,491"},{label:"Active",value:"31,204"},{label:"Trial",value:"4,820"},{label:"Churned (30d)",value:"467"}].map(s => (
          <Card key={s.label} className="p-4">
            <p className="text-xs text-gray-500 mb-1">{s.label}</p>
            <p className="text-2xl font-bold">{s.value}</p>
          </Card>
        ))}
      </div>
      <Card>
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <h2 className="text-sm font-semibold">All Users</h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500"><Icon d={ICONS.search} size={13}/></span>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search users..."
                className="bg-white/5 border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-gray-300 placeholder-gray-600 focus:outline-none focus:border-purple-500/50 w-48 transition-all"/>
            </div>
            <button className="flex items-center gap-1.5 text-xs bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded-lg transition-colors font-medium">
              <Icon d={ICONS.plus} size={13}/> Invite
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {["User","Plan","Status","Spend","Joined",""].map((h,i) => (
                  <th key={i} className="text-left text-xs text-gray-600 font-medium px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u,i) => (
                <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors group">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-xs font-bold flex-shrink-0">{u.name[0]}</div>
                      <div>
                        <p className="text-sm font-medium">{u.name}</p>
                        <p className="text-xs text-gray-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs text-gray-300">{u.plan}</td>
                  <td className="px-5 py-3"><Badge label={u.status} variant={STATUS_V[u.status]??"gray"}/></td>
                  <td className="px-5 py-3 text-xs text-gray-300">{u.spend}</td>
                  <td className="px-5 py-3 text-xs text-gray-500">{u.joined}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 rounded-md hover:bg-purple-500/20 text-gray-500 hover:text-purple-300 transition-colors"><Icon d={ICONS.edit} size={13}/></button>
                      <button className="p-1.5 rounded-md hover:bg-red-500/20 text-gray-500 hover:text-red-300 transition-colors"><Icon d={ICONS.trash} size={13}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

const INVOICES = [
  {id:"INV-2024-089",date:"Feb 01, 2026",amount:"$8,240",status:"Paid"},
  {id:"INV-2024-088",date:"Jan 01, 2026",amount:"$7,920",status:"Paid"},
  {id:"INV-2024-087",date:"Dec 01, 2025",amount:"$7,640",status:"Paid"},
  {id:"INV-2024-086",date:"Nov 01, 2025",amount:"$6,980",status:"Paid"},
  {id:"INV-2024-085",date:"Oct 01, 2025",amount:"$6,450",status:"Paid"},
];

function BillingPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[{label:"MRR",value:"$8,240",sub:"+$320 this month",color:"text-purple-400"},{label:"ARR",value:"$98,880",sub:"Annualized estimate",color:"text-indigo-400"},{label:"Next Invoice",value:"Mar 1",sub:"Estimated $8,560",color:"text-fuchsia-400"}].map(c => (
          <Card key={c.label} className="p-5">
            <p className="text-xs text-gray-500 mb-1">{c.label}</p>
            <p className={`text-3xl font-bold mb-1 ${c.color}`}>{c.value}</p>
            <p className="text-xs text-gray-500">{c.sub}</p>
          </Card>
        ))}
      </div>
      <Card className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-sm font-semibold mb-3">Current Plan</h2>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center">
                <Icon d={ICONS.zap} size={18}/>
              </div>
              <div>
                <p className="font-bold text-lg">Enterprise</p>
                <p className="text-xs text-gray-500">Unlimited seats · Priority support</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-purple-400">$960<span className="text-sm text-gray-500 font-normal">/mo</span></p>
            <button className="text-xs text-purple-400 hover:text-purple-300 mt-1">Manage plan →</button>
          </div>
        </div>
      </Card>
      <Card>
        <SectionHeader title="Invoice History" sub="Your recent billing history"
          action={<button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white border border-white/10 px-3 py-1.5 rounded-lg transition-colors"><Icon d={ICONS.download} size={13}/> Export</button>}/>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              {["Invoice","Date","Amount","Status",""].map((h,i) => <th key={i} className="text-left text-xs text-gray-600 font-medium px-5 py-3">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {INVOICES.map((inv,i) => (
              <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-3 text-sm font-mono text-gray-300">{inv.id}</td>
                <td className="px-5 py-3 text-xs text-gray-400">{inv.date}</td>
                <td className="px-5 py-3 text-sm font-medium">{inv.amount}</td>
                <td className="px-5 py-3"><Badge label={inv.status} variant="green"/></td>
                <td className="px-5 py-3"><button className="text-xs text-purple-400 hover:text-purple-300">Download</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} className={`w-9 h-5 rounded-full transition-colors flex items-center px-0.5 ${on?"bg-purple-600":"bg-white/10"}`}>
      <div className={`w-4 h-4 rounded-full bg-white transition-transform ${on?"translate-x-4":"translate-x-0"}`}/>
    </button>
  );
}

function SettingsPage() {
  const [toggles, setToggles] = useState<Record<string,boolean>>({emailAlerts:true,slackAlerts:false,mfa:true,apiLogs:true,weeklyDigest:false});
  const flip = (k:string) => setToggles(t=>({...t,[k]:!t[k]}));
  return (
    <div className="flex flex-col gap-4 max-w-2xl">
      <Card className="p-5">
        <h2 className="text-sm font-semibold mb-4">Profile</h2>
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-700 flex items-center justify-center text-xl font-bold">A</div>
          <div><p className="font-medium">Admin User</p><p className="text-xs text-gray-500">admin@nexusai.io</p></div>
          <button className="ml-auto text-xs text-purple-400 border border-purple-500/30 px-3 py-1.5 rounded-lg">Change photo</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[{label:"Full Name",value:"Admin User"},{label:"Email",value:"admin@nexusai.io"},{label:"Company",value:"NexusAI Inc."},{label:"Role",value:"Owner"}].map(f => (
            <div key={f.label}>
              <label className="text-xs text-gray-500 block mb-1">{f.label}</label>
              <input defaultValue={f.value} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-purple-500/50"/>
            </div>
          ))}
        </div>
        <button className="mt-4 text-sm bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg font-medium">Save Changes</button>
      </Card>
      <Card className="p-5">
        <h2 className="text-sm font-semibold mb-4">Notifications</h2>
        <div className="flex flex-col gap-3">
          {[{key:"emailAlerts",label:"Email Alerts",sub:"Receive alerts via email"},{key:"slackAlerts",label:"Slack Alerts",sub:"Push to Slack"},{key:"weeklyDigest",label:"Weekly Digest",sub:"Summary every Monday"}].map(n => (
            <div key={n.key} className="flex items-center justify-between py-1">
              <div><p className="text-sm text-gray-200">{n.label}</p><p className="text-xs text-gray-500">{n.sub}</p></div>
              <Toggle on={toggles[n.key]} onToggle={()=>flip(n.key)}/>
            </div>
          ))}
        </div>
      </Card>
      <Card className="p-5">
        <h2 className="text-sm font-semibold mb-4">Security</h2>
        <div className="flex flex-col gap-3">
          {[{key:"mfa",label:"Two-Factor Auth",sub:"TOTP required at login"},{key:"apiLogs",label:"API Access Logs",sub:"Log all API key usage"}].map(s => (
            <div key={s.key} className="flex items-center justify-between py-1">
              <div><p className="text-sm text-gray-200">{s.label}</p><p className="text-xs text-gray-500">{s.sub}</p></div>
              <Toggle on={toggles[s.key]} onToggle={()=>flip(s.key)}/>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-white/5">
          <button className="text-sm text-red-400 hover:text-red-300">Change password →</button>
        </div>
      </Card>
      <Card className="p-5 border-red-500/20">
        <h2 className="text-sm font-semibold text-red-400 mb-3">Danger Zone</h2>
        <div className="flex items-center justify-between">
          <div><p className="text-sm text-gray-300">Delete Organization</p><p className="text-xs text-gray-500">This action cannot be undone.</p></div>
          <button className="text-xs text-red-400 border border-red-500/30 hover:bg-red-500/10 px-3 py-1.5 rounded-lg">Delete</button>
        </div>
      </Card>
    </div>
  );
}

const NAV = [
  {id:"overview",label:"Overview",icon:ICONS.home},
  {id:"analytics",label:"Analytics",icon:ICONS.chart},
  {id:"users",label:"Users",icon:ICONS.users},
  {id:"billing",label:"Billing",icon:ICONS.card},
  {id:"settings",label:"Settings",icon:ICONS.cog},
];
const PAGE_META: Record<string,{title:string;sub:string}> = {
  overview:  {title:"Overview",  sub:"Welcome back — here's what's happening today."},
  analytics: {title:"Analytics", sub:"Traffic, acquisition, and engagement metrics."},
  users:     {title:"Users",     sub:"Manage your user base and subscriptions."},
  billing:   {title:"Billing",   sub:"Invoices, plans, and payment methods."},
  settings:  {title:"Settings",  sub:"Account preferences and security."},
};

export default function SaasDashboard() {
  const [active, setActive] = useState("overview");
  const [open, setOpen] = useState(true);
  const Page = active==="overview"?OverviewPage:active==="analytics"?AnalyticsPage:active==="users"?UsersPage:active==="billing"?BillingPage:SettingsPage;
  const {title,sub} = PAGE_META[active];

  return (
    <div className="flex h-screen bg-[#09090b] text-white overflow-hidden" style={{fontFamily:"var(--font-geist-sans,system-ui,sans-serif)"}}>
      <aside className={`${open?"w-60":"w-16"} transition-all duration-300 flex-shrink-0 flex flex-col bg-[#0d0d10] border-r border-white/5`}>
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
            <Icon d={ICONS.zap} size={15}/>
          </div>
          {open && <span className="font-bold text-sm tracking-wide">NexusAI</span>}
        </div>
        <nav className="flex-1 py-4 px-2 flex flex-col gap-0.5">
          {NAV.map(n => (
            <button key={n.id} onClick={()=>setActive(n.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all w-full text-left ${active===n.id?"bg-purple-600/15 text-purple-300 border border-purple-500/20":"text-gray-500 hover:text-gray-200 hover:bg-white/5"}`}>
              <span className="flex-shrink-0"><Icon d={n.icon} size={17}/></span>
              {open && <span>{n.label}</span>}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center text-xs font-bold flex-shrink-0">A</div>
            {open && <div className="truncate"><p className="text-xs font-medium truncate">Admin User</p><p className="text-xs text-gray-500 truncate">admin@nexusai.io</p></div>}
          </div>
        </div>
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#09090b] flex-shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={()=>setOpen(v=>!v)} className="text-gray-500 hover:text-white transition-colors">
              <Icon d={open?ICONS.x:ICONS.menu} size={19}/>
            </button>
            <div className="relative hidden md:flex items-center">
              <span className="absolute left-3 text-gray-500"><Icon d={ICONS.search} size={14}/></span>
              <input placeholder="Search…" className="bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-purple-500/50 w-56 transition-all"/>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative text-gray-500 hover:text-white p-1.5 rounded-lg hover:bg-white/5">
              <Icon d={ICONS.bell} size={17}/>
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-purple-500 rounded-full"/>
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center text-xs font-bold cursor-pointer">A</div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto px-6 py-6">
          <div className="mb-5">
            <h1 className="text-xl font-bold">{title}</h1>
            <p className="text-sm text-gray-500 mt-0.5">{sub}</p>
          </div>
          <Page/>
        </main>
      </div>
    </div>
  );
}
