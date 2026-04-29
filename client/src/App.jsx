import { useState, useEffect, useRef } from "react";
import {
  Search, User, Sun, Moon, Menu, X, Calendar, Award, Star, Home,
  TrendingUp, Users, Zap, ChevronRight, Bell, Settings,
  LogOut, Heart, MapPin, Clock, ArrowRight, Sparkles,
  BookOpen, Trophy, Target, BarChart3, Globe, Shield,
  ExternalLink, Filter, ChevronDown, Check, AlertCircle, Eye, EyeOff,
  Mail, Phone
} from "lucide-react";

// ============================================================
// DATA
// ============================================================
const EVENTS = [
  {
    id: 1,
    title: "ICICST - 2026",
    category: "Conference",
    date: "Oct 9, 2026",
    time: "10:00 AM",
    location: "CSIBER Auditorium",
    attendees: 150,
    maxAttendees: 500,
    description: "International Conference on Innovations in Computer Science and Technology. Exploring AI, Blockchain, and IoT.",
    tags: ["Research", "Innovation", "Tech"],
    color: "#3b82f6",
    gradient: "linear-gradient(135deg, #3b82f6, #6366f1)",
    featured: true,
  },
  {
    id: 2,
    title: "Webinar: Career Pathways",
    category: "Webinar",
    date: "May 12, 2026",
    time: "11:00 AM",
    location: "Online (Zoom)",
    attendees: 85,
    maxAttendees: 200,
    description: "Expert talk on navigating career paths in Data Science and Software Engineering.",
    tags: ["Career", "Mentorship"],
    color: "#8b5cf6",
    gradient: "linear-gradient(135deg, #8b5cf6, #a855f7)",
    featured: true,
  },
  {
    id: 3,
    title: "HR Analytics Workshop",
    category: "Workshop",
    date: "Jun 5, 2026",
    time: "2:00 PM",
    location: "MBA Lab 1",
    attendees: 45,
    maxAttendees: 60,
    description: "Hands-on session on using data for human resource management and decision making.",
    tags: ["HR", "Analytics", "Data"],
    color: "#06b6d4",
    gradient: "linear-gradient(135deg, #06b6d4, #0891b2)",
    featured: true,
  },
  {
    id: 4,
    title: "MCA Entrance Guidance",
    category: "Seminar",
    date: "May 20, 2026",
    time: "10:30 AM",
    location: "Seminar Hall 2",
    attendees: 120,
    maxAttendees: 150,
    description: "In-depth guidance for MAH-MCA-CET and other entrance examinations.",
    tags: ["Admissions", "MCA", "Education"],
    color: "#f59e0b",
    gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
    featured: false,
  },
  {
    id: 5,
    title: "Tech-SIBER Hackathon",
    category: "Hackathon",
    date: "Aug 15, 2026",
    time: "9:00 AM",
    location: "IT Lab Complex",
    attendees: 30,
    maxAttendees: 100,
    description: "24-hour internal hackathon to solve campus-specific problems using modern tech stacks.",
    tags: ["Coding", "Competition"],
    color: "#10b981",
    gradient: "linear-gradient(135deg, #10b981, #059669)",
    featured: false,
  },
  {
    id: 6,
    title: "Cultural Fest: SIBERIAN",
    category: "Festival",
    date: "Feb 10, 2027",
    time: "5:00 PM",
    location: "Open Ground",
    attendees: 0,
    maxAttendees: 1000,
    description: "The grand annual cultural festival of CSIBER. Music, dance, and tech exhibitions.",
    tags: ["Culture", "Music", "Fest"],
    color: "#f43f5e",
    gradient: "linear-gradient(135deg, #f43f5e, #e11d48)",
    featured: false,
  },
];

const LEADERBOARD = [
  { rank: 1, name: "Sneha Kapoor", avatar: "SK", events: 24, wins: 18, points: 2840, trend: "+12%" },
  { rank: 2, name: "Keshav Sharma", avatar: "KS", events: 22, wins: 16, points: 2650, trend: "+8%" },
  { rank: 3, name: "Loveleen Kaur", avatar: "LK", events: 20, wins: 15, points: 2430, trend: "+15%" },
  { rank: 4, name: "Sunil Mehta", avatar: "SM", events: 19, wins: 13, points: 2210, trend: "+5%" },
  { rank: 5, name: "Radhika Patel", avatar: "RP", events: 17, wins: 12, points: 2080, trend: "+10%" },
  { rank: 6, name: "Arjun Reddy", avatar: "AR", events: 16, wins: 11, points: 1950, trend: "+7%" },
  { rank: 7, name: "Priya Singh", avatar: "PS", events: 15, wins: 10, points: 1820, trend: "+3%" },
];

const COMMUNITIES = [
  { name: "CodeCraft", members: 340, icon: "💻", color: "#3b82f6" },
  { name: "AI Explorers", members: 210, icon: "🤖", color: "#8b5cf6" },
  { name: "Design Guild", members: 185, icon: "🎨", color: "#f43f5e" },
  { name: "Startup Hub", members: 156, icon: "🚀", color: "#f59e0b" },
];

// ============================================================
// COMPONENTS
// ============================================================

/* ---------- Toast Notification ---------- */
function Toast({ message, type = "info", onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <Check size={18} color="var(--accent-emerald)" />,
    error: <AlertCircle size={18} color="var(--accent-rose)" />,
    info: <Sparkles size={18} color="var(--accent-blue)" />,
  };

  return (
    <div className={`toast toast-${type}`}>
      {icons[type]}
      <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)" }}>{message}</span>
      <button onClick={onClose} style={{ marginLeft: "auto", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
        <X size={14} />
      </button>
    </div>
  );
}

/* ---------- Event Detail Modal ---------- */
function EventDetailModal({ event, onClose, onJoin, isJoined }) {
  if (!event) return null;

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div
        className="glass-strong animate-fade-in-scale"
        onClick={e => e.stopPropagation()}
        style={{
          width: "90%",
          maxWidth: 800,
          borderRadius: "var(--radius-xl)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          maxHeight: "90vh"
        }}
      >
        {/* Banner */}
        <div style={{ height: 240, background: event.gradient, position: "relative" }}>
          <button
            onClick={onClose}
            style={{
              position: "absolute", top: 20, right: 20,
              width: 36, height: 36, borderRadius: "50%",
              background: "rgba(0,0,0,0.3)", backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.1)", color: "white",
              display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
            }}
          >
            <X size={20} />
          </button>
          <div style={{ position: "absolute", bottom: 24, left: 32 }}>
            <span className="badge" style={{ background: "rgba(0,0,0,0.4)", color: "white", marginBottom: 12 }}>{event.category}</span>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: "white", fontFamily: "var(--font-display)" }}>{event.title}</h2>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: 40, overflowY: "auto", display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 40 }}>
          <div>
            <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: "var(--text-primary)" }}>About this Event</h4>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 24 }}>{event.description}</p>

            <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: "var(--text-primary)" }}>Topics Covered</h4>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {event.tags.map(tag => (
                <span key={tag} className="badge badge-blue">{tag}</span>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div className="card" style={{ padding: 20, background: "rgba(255,255,255,0.02)" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Calendar size={18} color="var(--accent-blue)" />
                  <div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Date</div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{event.date}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Clock size={18} color="var(--accent-purple)" />
                  <div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Time</div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{event.time}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <MapPin size={18} color="var(--accent-emerald)" />
                  <div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Location</div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{event.location}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: 20, textAlign: "center" }}>
              <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 12 }}>
                {event.attendees} / {event.maxAttendees} slots filled
              </div>
              <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3, marginBottom: 20, overflow: "hidden" }}>
                <div style={{ width: `${(event.attendees / event.maxAttendees) * 100}%`, height: "100%", background: event.gradient }} />
              </div>
              <button
                className={isJoined ? "btn-outline" : "btn-primary"}
                onClick={() => onJoin(event)}
                style={{ width: "100%", padding: 12 }}
              >
                {isJoined ? "Already Registered" : "Register Now"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


/* ---------- Animated Counter ---------- */
function AnimatedCounter({ target, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const step = Math.ceil(target / (duration / 16));
          const id = setInterval(() => {
            start += step;
            if (start >= target) {
              setCount(target);
              clearInterval(id);
            } else {
              setCount(start);
            }
          }, 16);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

/* ---------- Progress Ring ---------- */
function ProgressRing({ percent, size = 48, strokeWidth = 4, color = "#3b82f6" }) {
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;

  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={strokeWidth}
        strokeDasharray={c} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1.5s ease-out" }} />
    </svg>
  );
}

/* ---------- Sidebar ---------- */
function Sidebar({ page, setPage, collapsed, setCollapsed, setShowAuth, user, setUser, setJoinedEvents }) {
  const navItems = user?.role === "admin"
    ? [
        { id: "admin-dashboard", label: "Dashboard", icon: <BarChart3 size={20} /> },
        { id: "admin-events", label: "Manage Events", icon: <Calendar size={20} /> },
        { id: "admin-registrations", label: "Registrations", icon: <Users size={20} /> },
        { id: "admin-attendance", label: "Attendance", icon: <Check size={20} /> },
        { id: "admin-profile", label: "Profile", icon: <User size={20} /> },
      ]
    : [
        { id: "home", label: "Home", icon: <Home size={20} /> },
        { id: "dashboard", label: "Dashboard", icon: <BarChart3 size={20} /> },
        { id: "explore", label: "Explore", icon: <Globe size={20} /> },
        { id: "events", label: "My Events", icon: <Calendar size={20} /> },
        { id: "leaderboard", label: "Leaderboard", icon: <Trophy size={20} /> },
        { id: "communities", label: "Communities", icon: <Users size={20} /> },
      ];

  return (
    <aside
      id="sidebar"
      style={{
        width: collapsed ? 72 : 260,
        minWidth: collapsed ? 72 : 260,
        background: "var(--bg-secondary)",
        borderRight: "1px solid var(--border-subtle)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: collapsed ? "20px 10px" : "20px 16px",
        transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
        position: "relative",
        zIndex: 20,
        overflow: "hidden",
      }}
    >
      <div>
        {/* Logo */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          marginBottom: 36, padding: "0 4px",
        }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: "var(--accent-blue)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18,
            flexShrink: 0, color: "white"
          }}>
            CF
          </div>
          {!collapsed && (
            <span style={{
              fontFamily: "var(--font-display)", fontWeight: 700,
              fontSize: 20, whiteSpace: "nowrap",
              color: "var(--text-primary)",
            }}>
              CampusFlux Portal
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => setPage(item.id)}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: collapsed ? "12px 0" : "11px 14px",
                justifyContent: collapsed ? "center" : "flex-start",
                borderRadius: "var(--radius-md)",
                border: "none", cursor: "pointer",
                background: page === item.id
                  ? "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.1))"
                  : "transparent",
                color: page === item.id ? "#a5b4fc" : "var(--text-secondary)",
                fontSize: 14, fontWeight: page === item.id ? 600 : 500,
                transition: "all 0.2s ease",
                whiteSpace: "nowrap",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                if (page !== item.id) e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              }}
              onMouseLeave={(e) => {
                if (page !== item.id) e.currentTarget.style.background = "transparent";
              }}
            >
              {page === item.id && (
                <div style={{
                  position: "absolute", left: collapsed ? "50%" : 0,
                  top: collapsed ? "auto" : "50%",
                  bottom: collapsed ? 0 : "auto",
                  transform: collapsed ? "translateX(-50%)" : "translateY(-50%)",
                  width: collapsed ? 20 : 3,
                  height: collapsed ? 3 : 20,
                  background: "var(--gradient-primary)",
                  borderRadius: "var(--radius-full)",
                }} />
              )}
              {item.icon}
              {!collapsed && item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Bottom area */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {!collapsed && !user && (
          <>
            <button
              onClick={() => { setShowAuth(true); }}
              className="btn-primary"
              style={{
                width: "100%", padding: "10px", fontSize: 13,
                borderRadius: "var(--radius-md)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
            >
              Get Started
            </button>
          </>
        )}
        {!collapsed && user?.role === "admin" && (
          <button
            onClick={() => { setUser(null); setJoinedEvents([]); setPage("home"); }}
            className="btn-outline"
            style={{
              width: "100%", padding: "10px", fontSize: 13,
              borderRadius: "var(--radius-md)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              color: "var(--accent-rose)", borderColor: "var(--accent-rose)40"
            }}
          >
            <LogOut size={16} /> Sign Out
          </button>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: "transparent", border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-sm)", padding: 8, cursor: "pointer",
            color: "var(--text-muted)", display: "flex", alignItems: "center",
            justifyContent: "center", marginTop: 4, transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--border-accent)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-subtle)"; }}
        >
          <ChevronRight size={16} style={{
            transition: "transform 0.3s ease",
            transform: collapsed ? "rotate(0deg)" : "rotate(180deg)",
          }} />
        </button>
      </div>
    </aside>
  );
}

/* ---------- Top Bar ---------- */
function TopBar({ page, setPage, setShowAuth, searchQuery, setSearchQuery, user, theme, toggleTheme }) {
  const pageNames = {
    home: "Welcome",
    dashboard: "Dashboard",
    explore: "Explore Events",
    events: "My Events",
    leaderboard: "Leaderboard",
    communities: "Communities",
    profile: "My Profile",
    admin: "Admin Dashboard",
  };
  return (
    <header
      id="topbar"
      className="glass"
      style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "12px 28px",
        position: "sticky", top: 0, zIndex: 15,
        borderRadius: 0,
        borderBottom: "1px solid var(--border-subtle)",
        borderTop: "none", borderLeft: "none", borderRight: "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <h1 style={{
          fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700,
          margin: 0,
        }}>
          {pageNames[page] || "Dashboard"}
        </h1>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Search */}
        <div style={{
          display: "flex", alignItems: "center",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-full)", padding: "7px 16px",
          transition: "all 0.3s ease", minWidth: 220,
        }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "var(--accent-indigo)"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border-subtle)"; }}
        >
          <Search size={15} color="var(--text-muted)" />
          <input
            id="search-input"
            type="text"
            placeholder="Search events, people..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: "transparent", border: "none", outline: "none",
              color: "var(--text-primary)", marginLeft: 8, fontSize: 13,
              fontFamily: "var(--font-sans)", width: "100%",
            }}
          />
        </div>


        {/* Profile */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={toggleTheme}
            style={{
              width: 36, height: 36, borderRadius: "var(--radius-full)",
              background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-subtle)",
              cursor: "pointer", color: "var(--text-primary)",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s ease",
            }}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            id="profile-btn"
            onClick={() => {
              if (user) {
                setPage("profile");
              } else {
                setShowAuth(true);
              }
            }}
            style={{
              width: 36, height: 36, borderRadius: "var(--radius-full)",
              background: "var(--gradient-primary)", border: "none",
              cursor: "pointer", color: "white", fontSize: 14, fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s ease",
              boxShadow: "var(--shadow-glow)",
            }}
          >
            {user ? (user.fullName ? user.fullName.charAt(0).toUpperCase() : "U") : <User size={16} />}
          </button>
        </div>
      </div>
    </header>
  );
}

/* ---------- Stat Card ---------- */
function StatCard({ icon, label, value, trend, color, delay = 0 }) {
  return (
    <div className="card" style={{
      padding: 22, position: "relative", overflow: "hidden",
      animation: `fadeIn 0.6s ease-out ${delay}s forwards`,
      opacity: 0,
    }}>
      {/* Background glow */}
      <div style={{
        position: "absolute", top: -20, right: -20,
        width: 80, height: 80, borderRadius: "50%",
        background: color, opacity: 0.06, filter: "blur(20px)",
      }} />
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 16,
      }}>
        <div style={{
          width: 42, height: 42, borderRadius: "var(--radius-md)",
          background: `${color}15`, display: "flex",
          alignItems: "center", justifyContent: "center",
          border: `1px solid ${color}25`,
        }}>
          {icon}
        </div>
        {trend && (
          <span style={{
            fontSize: 12, fontWeight: 600, color: "#34d399",
            display: "flex", alignItems: "center", gap: 2,
          }}>
            <TrendingUp size={13} /> {trend}
          </span>
        )}
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, fontFamily: "var(--font-display)", lineHeight: 1.1 }}>
        <AnimatedCounter target={value} />
      </div>
      <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>{label}</div>
    </div>
  );
}

/* ---------- Event Card ---------- */
function EventCard({ event, onClick, delay = 0 }) {
  const fillPercent = Math.round((event.attendees / event.maxAttendees) * 100);
  return (
    <div
      className="card"
      onClick={onClick}
      style={{
        cursor: "pointer", overflow: "hidden",
        animation: `fadeIn 0.6s ease-out ${delay}s forwards`, opacity: 0,
      }}
    >
      {/* Gradient header */}
      <div style={{
        height: 140, background: event.gradient,
        position: "relative", display: "flex", alignItems: "flex-end",
        padding: 16,
      }}>
        {event.featured && (
          <span className="badge" style={{
            position: "absolute", top: 12, right: 12,
            background: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(10px)",
            color: "#fbbf24", border: "1px solid rgba(251,191,36,0.3)",
          }}>
            <Star size={10} /> Featured
          </span>
        )}
        <span className="badge" style={{
          background: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(10px)",
          color: "white", border: "none",
        }}>
          {event.category}
        </span>
      </div>

      <div style={{ padding: "16px 18px 20px" }}>
        <h3 style={{
          fontSize: 17, fontWeight: 700, marginBottom: 8,
          fontFamily: "var(--font-display)",
        }}>
          {event.title}
        </h3>
        <p style={{
          fontSize: 13, color: "var(--text-muted)", marginBottom: 14,
          lineHeight: 1.5,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>
          {event.description}
        </p>

        {/* Meta */}
        <div style={{
          display: "flex", flexWrap: "wrap", gap: 12,
          fontSize: 12, color: "var(--text-secondary)", marginBottom: 14,
        }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Calendar size={13} /> {event.date}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Clock size={13} /> {event.time}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <MapPin size={13} /> {event.location}
          </span>
        </div>

        {/* Capacity bar */}
        <div style={{ marginBottom: 14 }}>
          <div style={{
            display: "flex", justifyContent: "space-between",
            fontSize: 11, color: "var(--text-muted)", marginBottom: 5,
          }}>
            <span>{event.attendees} joined</span>
            <span>{fillPercent}% full</span>
          </div>
          <div style={{
            height: 4, background: "rgba(255,255,255,0.06)",
            borderRadius: "var(--radius-full)", overflow: "hidden",
          }}>
            <div style={{
              height: "100%", width: `${fillPercent}%`,
              background: event.gradient, borderRadius: "var(--radius-full)",
              transition: "width 1.5s ease-out",
            }} />
          </div>
        </div>

        {/* Tags */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {event.tags.map((tag) => (
            <span key={tag} style={{
              fontSize: 11, padding: "3px 8px",
              borderRadius: "var(--radius-full)",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-secondary)",
            }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Home Page ---------- */
function HomePage({ setPage, setShowAuth, stats }) {
  return (
    <div className="animate-fade-in" style={{
      minHeight: "100%",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      overflow: "hidden"
    }}>
      <div className="mesh-bg" />
      {/* Hero Section */}
      <section style={{
        padding: "80px 40px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Clean Hero */}

        <div className="badge animate-fade-in-scale" style={{ marginBottom: 20, background: "rgba(255,255,255,0.05)", border: "1px solid var(--border-subtle)" }}>
          Discover Your Campus
        </div>

        <h1 className="gradient-text-hero animate-slide-in-up" style={{
          fontSize: "clamp(40px, 8vw, 72px)",
          fontWeight: 800,
          lineHeight: 1.1,
          marginBottom: 24,
          maxWidth: 900,
          fontFamily: "var(--font-display)"
        }}>
          College Event Hub
        </h1>

        <p className="animate-slide-in-up" style={{
          fontSize: 18,
          color: "var(--text-secondary)",
          maxWidth: 700,
          marginBottom: 40,
          animationDelay: "0.2s",
          lineHeight: 1.6
        }}>
          Your all-in-one gateway to campus events, local opportunities, and everything in between. <br />
          <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>Register. Attend. Earn Certificates.</span> All in one place.
        </p>

        <div className="animate-slide-in-up" style={{ display: "flex", gap: 16, animationDelay: "0.3s" }}>
          <button className="btn-primary" onClick={() => setPage("explore")} style={{
            padding: "14px 32px",
            fontSize: 16,
            display: "flex",
            alignItems: "center",
            gap: 8
          }}>
            Explore Events <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ padding: "40px 20px", maxWidth: 1000, margin: "0 auto", width: "100%" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 24
        }} className="stagger-children">
          <div className="card" style={{ padding: 32, textAlign: "center" }}>
            <div style={{ fontSize: 40, fontWeight: 800, color: "var(--accent-blue)", fontFamily: "var(--font-display)" }}>
              <AnimatedCounter target={stats?.activeStudents || 2500} />+
            </div>
            <div style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 4 }}>Active Students</div>
          </div>
          <div className="card" style={{ padding: 32, textAlign: "center" }}>
            <div style={{ fontSize: 40, fontWeight: 800, color: "var(--accent-purple)", fontFamily: "var(--font-display)" }}>
              <AnimatedCounter target={stats?.annualEvents || 120} />+
            </div>
            <div style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 4 }}>Annual Events</div>
          </div>
          <div className="card" style={{ padding: 32, textAlign: "center" }}>
            <div style={{ fontSize: 40, fontWeight: 800, color: "var(--accent-emerald)", fontFamily: "var(--font-display)" }}>
              <AnimatedCounter target={stats?.dynamicCommunities || 15} />+
            </div>
            <div style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 4 }}>Dynamic Communities</div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section style={{ padding: "80px 40px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, fontFamily: "var(--font-display)", marginBottom: 12 }}>
            Everything in One Place
          </h2>
          <p style={{ color: "var(--text-secondary)" }}>Designed for students who want more from their campus experience.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
          {[
            { icon: <Calendar size={24} />, title: "Easy Registration", desc: "One-click registration for all campus events. No more messy forms or long queues.", color: "var(--accent-blue)" },
            { icon: <Users size={24} />, title: "Attend & Participate", desc: "Show up, engage in activities, and build your professional presence on campus.", color: "var(--accent-purple)" },
            { icon: <Award size={24} />, title: "Earn Certificates", desc: "Automatically receive verifiable certificates for workshops and events you complete.", color: "var(--accent-emerald)" },
          ].map((feat, i) => (
            <div key={i} className="card" style={{ padding: 40, display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16,
                background: `${feat.color}15`, color: feat.color,
                display: "flex", alignItems: "center", justifyContent: "center",
                border: `1px solid ${feat.color}30`
              }}>
                {feat.icon}
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, fontFamily: "var(--font-display)" }}>{feat.title}</h3>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer / Final CTA */}
      <section style={{
        marginTop: "auto",
        padding: "60px 40px",
        background: "rgba(255,255,255,0.02)",
        borderTop: "1px solid var(--border-subtle)",
        textAlign: "center"
      }}>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
          © 2026 CSIBER Flux • Developed with ❤️ for the student community
        </p>
      </section>
    </div>
  );
}

/* ---------- Dashboard Page ---------- */
function DashboardPage({ setPage, onEventClick }) {
  return (
    <div className="animate-fade-in" style={{ padding: "28px 32px" }}>
      {/* Hero Welcome */}
      <div className="card" style={{
        padding: 0, marginBottom: 28, overflow: "hidden",
        position: "relative", border: "none",
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #172554 100%)",
      }}>
        {/* Floating orbs */}
        <div style={{
          position: "absolute", top: -40, right: -20,
          width: 200, height: 200, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.2), transparent 70%)",
          animation: "float 8s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", bottom: -30, left: "30%",
          width: 150, height: 150, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139,92,246,0.15), transparent 70%)",
          animation: "float 6s ease-in-out infinite 1s",
        }} />

        <div style={{ padding: "40px 36px", position: "relative", zIndex: 1 }}>
          <span className="badge badge-purple" style={{ marginBottom: 14 }}>
            <Sparkles size={10} /> Welcome Back
          </span>
          <h2 style={{
            fontFamily: "var(--font-display)", fontSize: 32,
            fontWeight: 800, lineHeight: 1.2, marginBottom: 10,
          }}>
            Discover What's <br />
            <span className="gradient-text-hero">Happening at CSIBER</span>
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: 15, maxWidth: 480, marginBottom: 24 }}>
            Stay connected with events, hackathons, workshops, and communities.
            Your campus experience, supercharged.
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            <button className="btn-primary" onClick={() => setPage("explore")}
              style={{ display: "flex", alignItems: "center", gap: 8 }}>
              Browse Events <ArrowRight size={16} />
            </button>
            <button className="btn-outline" onClick={() => setPage("leaderboard")}>
              View Leaderboard
            </button>
          </div>
        </div>
      </div>



      {/* Two Column Section */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
        {/* Upcoming Events */}
        <div>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            marginBottom: 16,
          }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700 }}>
              Upcoming Events
            </h3>
            <button className="btn-ghost" onClick={() => setPage("explore")}
              style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 4 }}>
              View All <ChevronRight size={14} />
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }} className="stagger-children">
            {EVENTS.slice(0, 4).map((ev) => (
              <div
                key={ev.id}
                className="card"
                onClick={() => onEventClick(ev)}
                style={{
                  padding: "14px 16px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer"
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: "var(--radius-md)",
                  background: ev.gradient, display: "flex",
                  alignItems: "center", justifyContent: "center",
                  flexShrink: 0, fontSize: 18,
                }}>
                  {ev.category === "Hackathon" ? "⚡" : ev.category === "Workshop" ? "🔧" : ev.category === "Talk" ? "🎤" : "🏆"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{ev.title}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", display: "flex", gap: 10 }}>
                    <span>{ev.date}</span>
                    <span>{ev.time}</span>
                  </div>
                </div>
                <span className={`badge ${ev.category === "Hackathon" ? "badge-blue" : ev.category === "Workshop" ? "badge-purple" : ev.category === "Talk" ? "badge-emerald" : "badge-amber"}`}>
                  {ev.category}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats / Activity */}
        <div>
          <h3 style={{
            fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700,
            marginBottom: 16,
          }}>
            Activity Overview
          </h3>
          <div className="card" style={{ padding: 24 }}>
            {/* Mini chart representation */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 120, marginBottom: 20 }}>
              {[35, 55, 40, 75, 60, 85, 70, 90, 65, 80, 95, 72].map((h, i) => (
                <div key={i} style={{
                  flex: 1, height: `${h}%`,
                  background: i === 10
                    ? "var(--gradient-primary)"
                    : "rgba(59,130,246,0.15)",
                  borderRadius: "4px 4px 0 0",
                  transition: "height 0.6s ease-out",
                  transitionDelay: `${i * 0.05}s`,
                  position: "relative",
                }}>
                  {i === 10 && (
                    <div style={{
                      position: "absolute", top: -8,
                      left: "50%", transform: "translateX(-50%)",
                      width: 6, height: 6, borderRadius: "50%",
                      background: "#3b82f6",
                      boxShadow: "0 0 10px rgba(59,130,246,0.5)",
                    }} />
                  )}
                </div>
              ))}
            </div>
            <div style={{
              display: "flex", justifyContent: "space-between",
              fontSize: 11, color: "var(--text-muted)",
            }}>
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span>
              <span>May</span><span>Jun</span><span>Jul</span><span>Aug</span>
              <span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
            </div>

            <div style={{
              marginTop: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12,
            }}>
              <div style={{
                padding: 14, borderRadius: "var(--radius-md)",
                background: "rgba(59,130,246,0.06)",
                border: "1px solid rgba(59,130,246,0.1)",
              }}>
                <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "var(--font-display)" }}>92%</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Attendance Rate</div>
              </div>
              <div style={{
                padding: 14, borderRadius: "var(--radius-md)",
                background: "rgba(139,92,246,0.06)",
                border: "1px solid rgba(139,92,246,0.1)",
              }}>
                <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "var(--font-display)" }}>Top 5%</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Campus Rank</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Communities */}
      <div style={{ marginBottom: 32 }}>
        <h3 style={{
          fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700,
          marginBottom: 16,
        }}>
          Your Communities
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }} className="stagger-children">
          {COMMUNITIES.map((c) => (
            <div key={c.name} className="card" style={{
              padding: 20, textAlign: "center",
            }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>{c.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{c.name}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{c.members} members</div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div className="animate-fade-in" style={{ marginTop: 40, animationDelay: '0.4s' }}>
        <h3 style={{
          fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700,
          marginBottom: 16,
        }}>
          Contact Us
        </h3>
        <div className="card" style={{
          padding: 24,
          display: "flex",
          flexDirection: "column",
          gap: 20,
          background: "linear-gradient(160deg, rgba(59,130,246,0.05), rgba(139,92,246,0.05))",
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{
                width: 48, height: 48, borderRadius: "var(--radius-md)",
                background: "rgba(59,130,246,0.1)", display: "flex",
                alignItems: "center", justifyContent: "center",
                color: "#3b82f6", border: "1px solid rgba(59,130,246,0.2)",
              }}>
                <Mail size={20} />
              </div>
              <div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 2 }}>Official Email</div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>director@siberindia.edu.in</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{
                width: 48, height: 48, borderRadius: "var(--radius-md)",
                background: "rgba(139,92,246,0.1)", display: "flex",
                alignItems: "center", justifyContent: "center",
                color: "#8b5cf6", border: "1px solid rgba(139,92,246,0.2)",
              }}>
                <Phone size={20} />
              </div>
              <div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 2 }}>Contact Number</div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>+91 0231 2535706/07</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ---------- Explore Page ---------- */
function ExplorePage({ searchQuery, onEventClick }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const categories = ["All", "Hackathon", "Workshop", "Talk", "Competition", "Festival"];

  const filtered = EVENTS.filter((e) => {
    const matchCat = selectedCategory === "All" || e.category === selectedCategory;
    const matchSearch = !searchQuery ||
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="animate-fade-in" style={{ padding: "28px 32px" }}>
      {/* Category filters */}
      <div style={{
        display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap",
      }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: "8px 18px", borderRadius: "var(--radius-full)",
              border: selectedCategory === cat ? "none" : "1px solid var(--border-subtle)",
              background: selectedCategory === cat ? "var(--gradient-primary)" : "transparent",
              color: selectedCategory === cat ? "white" : "var(--text-secondary)",
              fontSize: 13, fontWeight: 500, cursor: "pointer",
              transition: "all 0.25s ease",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Featured events banner */}
      {selectedCategory === "All" && (
        <div style={{ marginBottom: 32 }}>
          <h3 style={{
            fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700,
            marginBottom: 16, display: "flex", alignItems: "center", gap: 8,
          }}>
            <Star size={18} color="#fbbf24" /> Featured Events
          </h3>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18,
          }}>
            {EVENTS.filter(e => e.featured).map((event, i) => (
              <EventCard key={event.id} event={event} delay={i * 0.15} onClick={() => onEventClick(event)} />
            ))}
          </div>
        </div>
      )}

      {/* All events */}
      <h3 style={{
        fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700,
        marginBottom: 16,
      }}>
        {selectedCategory === "All" ? "All Events" : selectedCategory}
        <span style={{
          fontSize: 13, fontWeight: 400, color: "var(--text-muted)", marginLeft: 10,
        }}>
          {filtered.length} events
        </span>
      </h3>
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18,
      }}>
        {filtered.map((event, i) => (
          <EventCard key={event.id} event={event} delay={i * 0.1} onClick={() => onEventClick(event)} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{
          textAlign: "center", padding: 60, color: "var(--text-muted)",
        }}>
          <Search size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
          <p>No events found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}

/* ---------- My Events Page ---------- */
function MyEventsPage({ user, joinedIds = [], onEventClick, setPage, setShowAuth }) {
  if (!user) {
    return (
      <div style={{ padding: "60px 32px", textAlign: "center" }}>
        <Calendar size={64} color="var(--text-muted)" style={{ margin: "0 auto 24px", opacity: 0.2 }} />
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, marginBottom: 16 }}>
          Please Sign In
        </h3>
        <p style={{ color: "var(--text-muted)", marginBottom: 24, maxWidth: 400, margin: "0 auto 24px" }}>
          You need to be signed in to view and manage your registered events.
        </p>
        <button className="btn-primary" onClick={() => setShowAuth(true)}>Sign In Now</button>
      </div>
    );
  }

  const myEvents = EVENTS.filter(ev => joinedIds.includes(ev.id.toString()) || joinedIds.includes(ev.id));

  return (
    <div className="animate-fade-in" style={{ padding: "28px 32px" }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: 24,
      }}>
        <div>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700 }}>
            My Registered Events
          </h3>
          <p style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 4 }}>
            Track and manage your event registrations
          </p>
        </div>
        <span className="badge badge-blue" style={{ fontSize: 12 }}>
          {myEvents.length} Events
        </span>
      </div>

      {myEvents.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }} className="stagger-children">
          {myEvents.map((ev, i) => (
            <div
              key={ev.id}
              className="card"
              onClick={() => onEventClick(ev)}
              style={{
                padding: "20px 24px", display: "flex", alignItems: "center", gap: 20, cursor: "pointer"
              }}
            >
              <div style={{
                width: 56, height: 56, borderRadius: "var(--radius-md)",
                background: ev.gradient, display: "flex",
                alignItems: "center", justifyContent: "center",
                flexShrink: 0, fontSize: 24,
              }}>
                {ev.category === "Hackathon" ? "⚡" : ev.category === "Workshop" ? "🔧" : "🎤"}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4, fontFamily: "var(--font-display)" }}>
                  {ev.title}
                </div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", display: "flex", gap: 16 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Calendar size={13} /> {ev.date}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Clock size={13} /> {ev.time}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <MapPin size={13} /> {ev.location}
                  </span>
                </div>
              </div>
              <span className="badge badge-emerald">
                <Check size={10} /> Registered
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ padding: 60, textAlign: "center", background: "rgba(255,255,255,0.02)" }}>
          <Calendar size={48} color="var(--text-muted)" style={{ margin: "0 auto 20px", opacity: 0.3 }} />
          <h4 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>No registrations yet</h4>
          <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>You haven't registered for any events. Start exploring!</p>
          <button className="btn-primary" onClick={() => window.location.hash = "#explore"}>Browse Events</button>
        </div>
      )}

      {/* Suggestion */}
      {myEvents.length > 0 && (
        <div className="card" style={{
          marginTop: 28, padding: 32, textAlign: "center",
          background: "var(--gradient-card)",
        }}>
          <Sparkles size={28} color="#8b5cf6" style={{ margin: "0 auto 12px" }} />
          <h4 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 600, marginBottom: 6 }}>
            Explore More Events
          </h4>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}>
            Check out upcoming hackathons, workshops, and more!
          </p>
          <button className="btn-outline" style={{ fontSize: 13 }}>
            <Globe size={14} style={{ marginRight: 6 }} /> Discover Events
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------- Leaderboard Page ---------- */
function LeaderboardPage() {
  return (
    <div className="animate-fade-in" style={{ padding: "28px 32px" }}>
      {/* Top 3 Podium */}
      <div style={{
        display: "flex", justifyContent: "center", alignItems: "flex-end",
        gap: 20, marginBottom: 40, paddingTop: 20,
      }}>
        {[LEADERBOARD[1], LEADERBOARD[0], LEADERBOARD[2]].map((p, idx) => {
          const height = idx === 1 ? 200 : idx === 0 ? 170 : 150;
          const rank = idx === 1 ? 1 : idx === 0 ? 2 : 3;
          const colors = ["#c0c0c0", "#fbbf24", "#cd7f32"];
          const ringColor = colors[rank - 1];
          return (
            <div key={p.name} style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              animation: `slideInUp 0.7s ease-out ${idx * 0.2}s forwards`,
              opacity: 0,
            }}>
              {/* Avatar */}
              <div style={{
                width: rank === 1 ? 80 : 64, height: rank === 1 ? 80 : 64,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${ringColor}, ${ringColor}aa)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: rank === 1 ? 24 : 20, fontWeight: 800,
                fontFamily: "var(--font-display)",
                boxShadow: `0 0 25px ${ringColor}40`,
                marginBottom: 10, position: "relative",
              }}>
                {p.avatar}
                {rank === 1 && (
                  <div style={{
                    position: "absolute", top: -12,
                    fontSize: 22,
                  }}>👑</div>
                )}
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>{p.name}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 10 }}>
                {p.points.toLocaleString()} pts
              </div>
              {/* Podium bar */}
              <div style={{
                width: rank === 1 ? 120 : 100, height: height,
                background: rank === 1
                  ? "linear-gradient(180deg, rgba(251,191,36,0.2), rgba(251,191,36,0.05))"
                  : rank === 2
                    ? "linear-gradient(180deg, rgba(192,192,192,0.15), rgba(192,192,192,0.03))"
                    : "linear-gradient(180deg, rgba(205,127,50,0.15), rgba(205,127,50,0.03))",
                borderRadius: "var(--radius-md) var(--radius-md) 0 0",
                border: `1px solid ${ringColor}25`,
                borderBottom: "none",
                display: "flex", alignItems: "flex-start", justifyContent: "center",
                paddingTop: 16, fontFamily: "var(--font-display)",
                fontSize: 28, fontWeight: 800, color: `${ringColor}cc`,
              }}>
                #{rank}
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Leaderboard Table */}
      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{
          padding: "18px 24px",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700 }}>
            Full Rankings
          </h3>
          <span className="badge badge-purple">{LEADERBOARD.length} Participants</span>
        </div>
        <table style={{
          width: "100%", borderCollapse: "collapse",
          fontSize: 14,
        }}>
          <thead>
            <tr style={{
              borderBottom: "1px solid var(--border-subtle)",
              color: "var(--text-muted)", fontSize: 12,
              textTransform: "uppercase", letterSpacing: "0.05em",
            }}>
              <th style={{ padding: "12px 24px", textAlign: "left" }}>Rank</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Participant</th>
              <th style={{ padding: "12px", textAlign: "center" }}>Events</th>
              <th style={{ padding: "12px", textAlign: "center" }}>Wins</th>
              <th style={{ padding: "12px", textAlign: "center" }}>Points</th>
              <th style={{ padding: "12px 24px", textAlign: "right" }}>Trend</th>
            </tr>
          </thead>
          <tbody>
            {LEADERBOARD.map((p, i) => (
              <tr key={i} style={{
                borderBottom: "1px solid var(--border-subtle)",
                transition: "background 0.2s",
                cursor: "pointer",
              }}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                <td style={{ padding: "14px 24px", fontWeight: 700, fontFamily: "var(--font-display)" }}>
                  <span style={{
                    color: p.rank <= 3
                      ? p.rank === 1 ? "#fbbf24" : p.rank === 2 ? "#c0c0c0" : "#cd7f32"
                      : "var(--text-secondary)",
                  }}>
                    #{p.rank}
                  </span>
                </td>
                <td style={{ padding: "14px 12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: "50%",
                      background: "var(--gradient-primary)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 700, flexShrink: 0,
                    }}>
                      {p.avatar}
                    </div>
                    <span style={{ fontWeight: 600 }}>{p.name}</span>
                  </div>
                </td>
                <td style={{ padding: "14px 12px", textAlign: "center", color: "var(--text-secondary)" }}>
                  {p.events}
                </td>
                <td style={{ padding: "14px 12px", textAlign: "center", color: "var(--text-secondary)" }}>
                  {p.wins}
                </td>
                <td style={{ padding: "14px 12px", textAlign: "center", fontWeight: 700, fontFamily: "var(--font-display)" }}>
                  {p.points.toLocaleString()}
                </td>
                <td style={{ padding: "14px 24px", textAlign: "right" }}>
                  <span style={{
                    color: "#34d399", fontSize: 12, fontWeight: 600,
                    display: "inline-flex", alignItems: "center", gap: 2,
                  }}>
                    <TrendingUp size={12} /> {p.trend}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- Communities Page ---------- */
function CommunitiesPage() {
  const allCommunities = [
    { name: "CodeCraft", members: 340, icon: "💻", color: "#3b82f6", desc: "Competitive programming, DSA challenges, and code reviews." },
    { name: "AI Explorers", members: 210, icon: "🤖", color: "#8b5cf6", desc: "Machine learning, deep learning, NLP, and AI ethics." },
    { name: "Design Guild", members: 185, icon: "🎨", color: "#f43f5e", desc: "UI/UX design, Figma workshops, and design critiques." },
    { name: "Startup Hub", members: 156, icon: "🚀", color: "#f59e0b", desc: "Entrepreneurship, business model canvas, and pitch practice." },
    { name: "Cyber Sentinels", members: 130, icon: "🛡️", color: "#06b6d4", desc: "Cybersecurity, CTF challenges, and ethical hacking." },
    { name: "Data Driven", members: 98, icon: "📊", color: "#10b981", desc: "Data science, analytics, visualization, and Kaggle competitions." },
  ];

  return (
    <div className="animate-fade-in" style={{ padding: "28px 32px" }}>
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700 }}>
          Campus Communities
        </h3>
        <p style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 4 }}>
          Join communities to connect with like-minded peers
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }} className="stagger-children">
        {allCommunities.map((c) => (
          <div key={c.name} className="card" style={{ padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
              <div style={{
                width: 50, height: 50, borderRadius: "var(--radius-md)",
                background: `${c.color}15`, display: "flex",
                alignItems: "center", justifyContent: "center",
                fontSize: 24, border: `1px solid ${c.color}25`,
              }}>
                {c.icon}
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "var(--font-display)" }}>{c.name}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{c.members} members</div>
              </div>
            </div>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 16, lineHeight: 1.5 }}>
              {c.desc}
            </p>
            <button className="btn-outline" style={{
              width: "100%", padding: 9, fontSize: 13,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}>
              <Users size={14} /> Join Community
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}



/* ---------- Admin Page ---------- */
/* ---------- Admin Dashboard ---------- */
function AdminDashboard({ stats }) {
  return (
    <div className="animate-fade-in" style={{ padding: 40 }}>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, fontFamily: "var(--font-display)", marginBottom: 8 }}>Admin Dashboard</h2>
        <p style={{ color: "var(--text-secondary)" }}>Overview of campus event activities and registrations.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, marginBottom: 40 }}>
        <StatCard icon={<Users size={20} />} label="Total Students" value={stats?.totalUsers || 0} color="#3b82f6" />
        <StatCard icon={<Calendar size={20} />} label="Total Events" value={stats?.totalEvents || 0} color="#8b5cf6" />
        <StatCard icon={<Zap size={20} />} label="Registrations" value={stats?.totalRegistrations || 0} color="#f59e0b" />
        <StatCard icon={<Check size={20} />} label="Attendance" value={stats?.totalAttendance || 0} color="#10b981" />
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontSize: 18, fontWeight: 700 }}>Recent Registrations</h3>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid var(--border-subtle)", fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase" }}>
              <th style={{ padding: "14px 24px", textAlign: "left" }}>Student</th>
              <th style={{ padding: "14px 24px", textAlign: "left" }}>Event</th>
              <th style={{ padding: "14px 24px", textAlign: "left" }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {stats?.recentRegistrations?.map((reg, i) => (
              <tr key={i} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                <td style={{ padding: "14px 24px", fontWeight: 600 }}>{reg.userId?.fullName}</td>
                <td style={{ padding: "14px 24px" }}>{reg.eventId?.title}</td>
                <td style={{ padding: "14px 24px", color: "var(--text-muted)", fontSize: 13 }}>{new Date(reg.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- Admin Manage Events ---------- */
function AdminManageEvents({ events, onEdit, onDelete, onAdd }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "", category: "Workshop", date: "", time: "", location: "", maxAttendees: "", description: "", tags: "", featured: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await onAdd(formData);
    if (success) {
      setShowAddForm(false);
      setFormData({ title: "", category: "Workshop", date: "", time: "", location: "", maxAttendees: "", description: "", tags: "", featured: false });
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: 40 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 800, fontFamily: "var(--font-display)", marginBottom: 8 }}>Manage Events</h2>
          <p style={{ color: "var(--text-secondary)" }}>Create, edit, or remove campus events.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? "View All Events" : "+ Create New Event"}
        </button>
      </div>

      {showAddForm ? (
        <div className="card" style={{ maxWidth: 800, padding: 40 }}>
          <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <label className="form-label">Event Title</label>
              <input required className="form-input" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            <div>
              <label className="form-label">Category</label>
              <select className="form-input" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                <option>Workshop</option><option>Hackathon</option><option>Conference</option><option>Seminar</option><option>Webinar</option><option>Festival</option>
              </select>
            </div>
            <div>
              <label className="form-label">Max Participants</label>
              <input required type="number" className="form-input" value={formData.maxAttendees} onChange={e => setFormData({...formData, maxAttendees: e.target.value})} />
            </div>
            <div>
              <label className="form-label">Date</label>
              <input required type="text" placeholder="Oct 15, 2026" className="form-input" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
            </div>
            <div>
              <label className="form-label">Time</label>
              <input required type="text" placeholder="10:00 AM" className="form-input" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label className="form-label">Location</label>
              <input required className="form-input" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label className="form-label">Description</label>
              <textarea required rows={4} className="form-input" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ resize: "none" }} />
            </div>
            <button type="submit" className="btn-primary" style={{ gridColumn: "1 / -1", padding: 14 }}>Publish Event</button>
          </form>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid var(--border-subtle)", fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase" }}>
                <th style={{ padding: "14px 24px", textAlign: "left" }}>Event Name</th>
                <th style={{ padding: "14px 24px", textAlign: "left" }}>Date & Time</th>
                <th style={{ padding: "14px 24px", textAlign: "left" }}>Venue</th>
                <th style={{ padding: "14px 24px", textAlign: "left" }}>Registered</th>
                <th style={{ padding: "14px 24px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((ev) => (
                <tr key={ev._id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <td style={{ padding: "14px 24px", fontWeight: 600 }}>{ev.title}</td>
                  <td style={{ padding: "14px 24px" }}>
                    <div style={{ fontSize: 14 }}>{ev.date}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{ev.time}</div>
                  </td>
                  <td style={{ padding: "14px 24px" }}>{ev.location}</td>
                  <td style={{ padding: "14px 24px" }}>{ev.attendees} / {ev.maxAttendees}</td>
                  <td style={{ padding: "14px 24px", textAlign: "right" }}>
                    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                      <button className="btn-ghost" style={{ color: "var(--accent-blue)" }}><Settings size={16} /></button>
                      <button className="btn-ghost" style={{ color: "var(--accent-rose)" }} onClick={() => onDelete(ev._id)}><X size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ---------- Admin Registrations ---------- */
function AdminRegistrations({ events }) {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRegistrations = async (eventId) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/admin/registrations/${eventId}`);
      const data = await res.json();
      setRegistrations(data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleSelectEvent = (ev) => {
    setSelectedEvent(ev);
    fetchRegistrations(ev._id);
  };

  return (
    <div className="animate-fade-in" style={{ padding: 40 }}>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, fontFamily: "var(--font-display)", marginBottom: 8 }}>Registrations</h2>
        <p style={{ color: "var(--text-secondary)" }}>View student lists for each event.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 24 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {events.map(ev => (
            <div key={ev._id} className="card" onClick={() => handleSelectEvent(ev)} 
              style={{ padding: 16, cursor: "pointer", border: selectedEvent?._id === ev._id ? "1px solid var(--accent-blue)" : "1px solid var(--border-subtle)", background: selectedEvent?._id === ev._id ? "rgba(59,130,246,0.05)" : "transparent" }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{ev.title}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{ev.attendees} Registrations</div>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: 0 }}>
          {!selectedEvent ? (
            <div style={{ padding: 60, textAlign: "center", color: "var(--text-muted)" }}>
              <Users size={48} style={{ opacity: 0.2, marginBottom: 16 }} />
              <p>Select an event to view registrations</p>
            </div>
          ) : (
            <>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border-subtle)" }}>
                <h3 style={{ fontSize: 18, fontWeight: 700 }}>{selectedEvent.title}</h3>
                <p style={{ fontSize: 13, color: "var(--text-muted)" }}>List of registered students</p>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid var(--border-subtle)", fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase" }}>
                    <th style={{ padding: "14px 24px", textAlign: "left" }}>Student Name</th>
                    <th style={{ padding: "14px 24px", textAlign: "left" }}>Email</th>
                    <th style={{ padding: "14px 24px", textAlign: "left" }}>Dept / Year</th>
                    <th style={{ padding: "14px 24px", textAlign: "right" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="4" style={{ padding: 40, textAlign: "center" }}>Loading...</td></tr>
                  ) : registrations.map((reg, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                      <td style={{ padding: "14px 24px", fontWeight: 600 }}>{reg.userId?.fullName}</td>
                      <td style={{ padding: "14px 24px" }}>{reg.userId?.email}</td>
                      <td style={{ padding: "14px 24px" }}>{reg.userId?.department} - Year {reg.userId?.year}</td>
                      <td style={{ padding: "14px 24px", textAlign: "right" }}>
                        <span className="badge badge-blue">Registered</span>
                      </td>
                    </tr>
                  ))}
                  {!loading && registrations.length === 0 && (
                    <tr><td colSpan="4" style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>No registrations found</td></tr>
                  )}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Admin Attendance ---------- */
function AdminAttendance({ events }) {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRegistrations = async (eventId) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/admin/registrations/${eventId}`);
      const data = await res.json();
      setRegistrations(data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleSelectEvent = (ev) => {
    setSelectedEvent(ev);
    fetchRegistrations(ev._id);
  };

  const toggleAttendance = async (regId, currentStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/attendance`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationId: regId, attended: !currentStatus })
      });
      if (res.ok) {
        setRegistrations(registrations.map(r => r._id === regId ? { ...r, attended: !currentStatus } : r));
      }
    } catch (err) { console.error(err); }
  };

  return (
    <div className="animate-fade-in" style={{ padding: 40 }}>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, fontFamily: "var(--font-display)", marginBottom: 8 }}>Attendance Tracking</h2>
        <p style={{ color: "var(--text-secondary)" }}>Mark student attendance for events.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 24 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {events.map(ev => (
            <div key={ev._id} className="card" onClick={() => handleSelectEvent(ev)} 
              style={{ padding: 16, cursor: "pointer", border: selectedEvent?._id === ev._id ? "1px solid var(--accent-emerald)" : "1px solid var(--border-subtle)", background: selectedEvent?._id === ev._id ? "rgba(16,185,129,0.05)" : "transparent" }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{ev.title}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{ev.date} • {ev.time}</div>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: 0 }}>
          {!selectedEvent ? (
            <div style={{ padding: 60, textAlign: "center", color: "var(--text-muted)" }}>
              <Check size={48} style={{ opacity: 0.2, marginBottom: 16 }} />
              <p>Select an event to track attendance</p>
            </div>
          ) : (
            <>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 700 }}>{selectedEvent.title}</h3>
                  <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Check the boxes to mark attendance</p>
                </div>
                <div className="badge badge-emerald">
                  {registrations.filter(r => r.attended).length} / {registrations.length} Attended
                </div>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid var(--border-subtle)", fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase" }}>
                    <th style={{ padding: "14px 24px", textAlign: "left" }}>Student Name</th>
                    <th style={{ padding: "14px 24px", textAlign: "left" }}>Department</th>
                    <th style={{ padding: "14px 24px", textAlign: "center" }}>Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="3" style={{ padding: 40, textAlign: "center" }}>Loading...</td></tr>
                  ) : registrations.map((reg, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid var(--border-subtle)", background: reg.attended ? "rgba(16,185,129,0.02)" : "transparent" }}>
                      <td style={{ padding: "14px 24px", fontWeight: 600 }}>{reg.userId?.fullName}</td>
                      <td style={{ padding: "14px 24px" }}>{reg.userId?.department}</td>
                      <td style={{ padding: "14px 24px", textAlign: "center" }}>
                        <button 
                          onClick={() => toggleAttendance(reg._id, reg.attended)}
                          style={{ 
                            width: 32, height: 32, borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)",
                            background: reg.attended ? "var(--accent-emerald)" : "transparent",
                            color: reg.attended ? "white" : "transparent",
                            cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s"
                          }}
                        >
                          <Check size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {!loading && registrations.length === 0 && (
                    <tr><td colSpan="3" style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>No registrations found</td></tr>
                  )}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Admin Profile Page ---------- */
function AdminProfilePage({ user, setUser, setPage, stats }) {
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`http://localhost:5000/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password })
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setMessage("✅ Profile updated successfully!");
        setPassword("");
      } else {
        setMessage("❌ " + data.message);
      }
    } catch (err) { setMessage("❌ Connection error"); }
    setLoading(false);
  };

  return (
    <div className="animate-fade-in" style={{ padding: 40, maxWidth: 1000 }}>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, fontFamily: "var(--font-display)", marginBottom: 8 }}>Admin Profile</h2>
        <p style={{ color: "var(--text-secondary)" }}>Manage your account settings and view your activity.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: 32 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Basic Info & Settings */}
          <div className="card" style={{ padding: 32 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
              <Settings size={20} color="var(--accent-blue)" /> Account Settings
            </h3>
            <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <label className="form-label">Full Name</label>
                <input className="form-input" value={fullName} onChange={e => setFullName(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Email Address</label>
                <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div>
                <label className="form-label">New Password (leave blank to keep current)</label>
                <input className="form-input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
              </div>
              <button type="submit" disabled={loading} className="btn-primary" style={{ padding: 12, marginTop: 10 }}>
                {loading ? "Updating..." : "Save Changes"}
              </button>
              {message && <p style={{ fontSize: 14, textAlign: "center", color: message.includes("✅") ? "#10b981" : "#ef4444" }}>{message}</p>}
            </form>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Overview Stats */}
          <div className="card" style={{ padding: 24, background: "linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))" }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Activity Overview</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 14, color: "var(--text-secondary)" }}>Events Created</span>
                <span style={{ fontWeight: 700 }}>{stats?.totalEvents || 0}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 14, color: "var(--text-secondary)" }}>Registrations</span>
                <span style={{ fontWeight: 700 }}>{stats?.totalRegistrations || 0}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 14, color: "var(--text-secondary)" }}>Attendance Marked</span>
                <span style={{ fontWeight: 700 }}>{stats?.totalAttendance || 0}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Quick Actions</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button className="btn-ghost" onClick={() => setPage("admin-events")} style={{ justifyContent: "flex-start", gap: 12, width: "100%", padding: "10px 14px" }}>
                <Calendar size={18} /> Add New Event
              </button>
              <button className="btn-ghost" onClick={() => setPage("admin-registrations")} style={{ justifyContent: "flex-start", gap: 12, width: "100%", padding: "10px 14px" }}>
                <Users size={18} /> View Registrations
              </button>
              <button className="btn-ghost" onClick={() => setPage("admin-attendance")} style={{ justifyContent: "flex-start", gap: 12, width: "100%", padding: "10px 14px" }}>
                <Check size={18} /> Manage Attendance
              </button>
              <hr style={{ border: "none", borderTop: "1px solid var(--border-subtle)", margin: "10px 0" }} />
              <button className="btn-ghost" onClick={() => { setUser(null); setPage("home"); }} style={{ justifyContent: "flex-start", gap: 12, width: "100%", padding: "10px 14px", color: "var(--accent-rose)" }}>
                <LogOut size={18} /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Admin Page Main Wrapper ---------- */
function AdminPage({ adminPage, user, setUser, setPage }) {
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, eventsRes] = await Promise.all([
        fetch("http://localhost:5000/api/admin/dashboard-stats"),
        fetch("http://localhost:5000/api/events")
      ]);
      const statsData = await statsRes.json();
      const eventsData = await eventsRes.json();
      setStats(statsData);
      setEvents(eventsData);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { fetchAdminData(); }, []);

  const handleAddEvent = async (formData) => {
    try {
      const res = await fetch("http://localhost:5000/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          maxAttendees: parseInt(formData.maxAttendees),
          tags: formData.tags.split(",").map(t => t.trim()).filter(t => t)
        })
      });
      if (res.ok) {
        fetchAdminData();
        return true;
      }
    } catch (err) { console.error(err); }
    return false;
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/events/${id}`, { method: "DELETE" });
      if (res.ok) fetchAdminData();
    } catch (err) { console.error(err); }
  };

  if (loading) return <div style={{ padding: 100, textAlign: "center" }}>Initializing Admin Portal...</div>;

  return (
    <>
      {adminPage === "admin-dashboard" && <AdminDashboard stats={stats} />}
      {adminPage === "admin-events" && <AdminManageEvents events={events} onAdd={handleAddEvent} onDelete={handleDeleteEvent} />}
      {adminPage === "admin-registrations" && <AdminRegistrations events={events} />}
      {adminPage === "admin-attendance" && <AdminAttendance events={events} />}
      {adminPage === "admin-profile" && <AdminProfilePage user={user} setUser={setUser} setPage={setPage} stats={stats} />}
    </>
  );
}



/* ---------- Auth Modal ---------- */
function AuthModal({ show, onClose, isLogin, setIsLogin, setUser, setJoinedEvents, setPage }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"

  const handleSubmit = async () => {
    if (!email || !password || (!isLogin && (!fullName || !department || !year))) {
      setMessage("Please fill in all fields");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const endpoint = isLogin ? "/api/login" : "/api/signup";
      const payload = isLogin
        ? { email, password }
        : { fullName, email, password, department, year };

      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.message.toLowerCase().includes("successful") || data.message.toLowerCase().includes("success")) {
        setMessage(data.message);
        setMessageType("success");
        if (data.user) {
          setUser(data.user);
          if (typeof setJoinedEvents === "function") {
            setJoinedEvents(data.user.joinedEvents || []);
          }
          if (data.user.role === "admin") {
            setPage("admin");
          } else {
            setPage("dashboard");
          }
        }
        setTimeout(() => {
          onClose();
          setFullName("");
          setEmail("");
          setPassword("");
          setDepartment("");
          setYear("");
          setMessage("");
        }, 1500);
      } else {
        setMessage(data.message);
        setMessageType("error");
      }
    } catch (err) {
      setMessage("Server not reachable. Make sure the backend is running.");
      setMessageType("error");
    }

    setLoading(false);
  };

  if (!show) return null;

  return (
    <div
      id="auth-overlay"
      onClick={(e) => { if (e.target.id === "auth-overlay") onClose(); }}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 100,
      }}
    >
      <div className="glass-strong animate-fade-in-scale" style={{
        width: 400, borderRadius: "var(--radius-xl)", padding: "36px 32px",
        position: "relative",
      }}>
        {/* Close button */}
        <button onClick={onClose} style={{
          position: "absolute", top: 16, right: 16,
          background: "transparent", border: "none",
          color: "var(--text-muted)", cursor: "pointer",
          transition: "color 0.2s",
        }}
          onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-primary)"}
          onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
        >
          <X size={20} />
        </button>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: "var(--gradient-primary)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 14px", fontFamily: "var(--font-display)",
            fontWeight: 800, fontSize: 22,
            boxShadow: "var(--shadow-glow)",
          }}>CS</div>
          <h2 style={{
            fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700,
            marginBottom: 4,
          }}>
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
            {isLogin ? "Sign in to continue to CSIBER Flux" : "Join CSIBER Flux and discover campus events"}
          </p>
        </div>

        {/* Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Full Name (Sign Up only) */}
          {!isLogin && (
            <div>
              <label style={{
                fontSize: 12, fontWeight: 600, color: "var(--text-secondary)",
                display: "block", marginBottom: 6,
              }}>Full Name</label>
              <input
                id="auth-fullname"
                type="text"
                placeholder="Enter Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={{
                  width: "100%", padding: "11px 14px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-md)",
                  color: "var(--text-primary)", fontSize: 14,
                  fontFamily: "var(--font-sans)",
                  transition: "border-color 0.2s",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => e.target.style.borderColor = "var(--accent-blue)"}
                onBlur={(e) => e.target.style.borderColor = "var(--border-subtle)"}
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label style={{
              fontSize: 12, fontWeight: 600, color: "var(--text-secondary)",
              display: "block", marginBottom: 6,
            }}>Email</label>
            <input
              id="auth-email"
              type="email"
              placeholder="Enter Email"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%", padding: "11px 14px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                color: "var(--text-primary)", fontSize: 14,
                fontFamily: "var(--font-sans)",
                transition: "border-color 0.2s",
                boxSizing: "border-box",
              }}
              onFocus={(e) => e.target.style.borderColor = "var(--accent-blue)"}
              onBlur={(e) => e.target.style.borderColor = "var(--border-subtle)"}
            />
          </div>

          {/* Department (Sign Up only) */}
          {!isLogin && (
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
              <div>
                <label style={{
                  fontSize: 12, fontWeight: 600, color: "var(--text-secondary)",
                  display: "block", marginBottom: 6,
                }}>Department</label>
                <select
                  id="auth-department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  style={{
                    width: "100%", padding: "11px 14px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-md)",
                    color: "var(--text-primary)", fontSize: 14,
                    fontFamily: "var(--font-sans)",
                    transition: "border-color 0.2s",
                    boxSizing: "border-box",
                    cursor: "pointer",
                    appearance: "none",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "var(--accent-blue)"}
                  onBlur={(e) => e.target.style.borderColor = "var(--border-subtle)"}
                >
                  <option value="" disabled style={{ background: "#1e1b4b" }}>Select Dept</option>
                  <option value="MCA" style={{ background: "#1e1b4b" }}>MCA</option>
                  <option value="MSC Cyber security" style={{ background: "#1e1b4b" }}>MSC Cyber security</option>
                  <option value="BCA" style={{ background: "#1e1b4b" }}>BCA</option>
                  <option value="BSC" style={{ background: "#1e1b4b" }}>BSC</option>
                </select>
              </div>
              <div>
                <label style={{
                  fontSize: 12, fontWeight: 600, color: "var(--text-secondary)",
                  display: "block", marginBottom: 6,
                }}>Year</label>
                <select
                  id="auth-year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  style={{
                    width: "100%", padding: "11px 14px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-md)",
                    color: "var(--text-primary)", fontSize: 14,
                    fontFamily: "var(--font-sans)",
                    transition: "border-color 0.2s",
                    boxSizing: "border-box",
                    cursor: "pointer",
                    appearance: "none",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "var(--accent-blue)"}
                  onBlur={(e) => e.target.style.borderColor = "var(--border-subtle)"}
                >
                  <option value="" disabled style={{ background: "#1e1b4b" }}>Year</option>
                  <option value="I" style={{ background: "#1e1b4b" }}>I</option>
                  <option value="II" style={{ background: "#1e1b4b" }}>II</option>
                  <option value="III" style={{ background: "#1e1b4b" }}>III</option>
                </select>
              </div>
            </div>
          )}

          {/* Password */}
          <div>
            <label style={{
              fontSize: 12, fontWeight: 600, color: "var(--text-secondary)",
              display: "block", marginBottom: 6,
            }}>Password</label>
            <div style={{ position: "relative" }}>
              <input
                id="auth-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
                style={{
                  width: "100%", padding: "11px 44px 11px 14px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-md)",
                  color: "var(--text-primary)", fontSize: 14,
                  fontFamily: "var(--font-sans)",
                  transition: "border-color 0.2s",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => e.target.style.borderColor = "var(--accent-blue)"}
                onBlur={(e) => e.target.style.borderColor = "var(--border-subtle)"}
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer",
                  color: "var(--text-muted)",
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div style={{
            marginTop: 14, padding: "10px 14px",
            borderRadius: "var(--radius-sm)",
            fontSize: 13, display: "flex", alignItems: "center", gap: 8,
            background: messageType === "success" ? "rgba(16,185,129,0.1)" : "rgba(244,63,94,0.1)",
            border: `1px solid ${messageType === "success" ? "rgba(16,185,129,0.2)" : "rgba(244,63,94,0.2)"}`,
            color: messageType === "success" ? "#34d399" : "#fb7185",
          }}>
            {messageType === "success" ? <Check size={14} /> : <AlertCircle size={14} />}
            {message}
          </div>
        )}

        {/* Submit */}
        <button
          id="auth-submit"
          className="btn-primary"
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%", padding: 12, marginTop: 18,
            fontSize: 14, fontWeight: 600,
            opacity: loading ? 0.7 : 1,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}
        >
          {loading ? (
            <div style={{
              width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)",
              borderTopColor: "white", borderRadius: "50%",
              animation: "rotate 0.6s linear infinite",
            }} />
          ) : (
            <>
              {isLogin ? "Sign In" : "Create Account"}
              <ArrowRight size={16} />
            </>
          )}
        </button>

        {/* Toggle mode */}
        <p style={{
          textAlign: "center", fontSize: 13, color: "var(--text-muted)", marginTop: 18,
        }}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span
            onClick={() => { setIsLogin(!isLogin); setMessage(""); }}
            style={{
              color: "var(--accent-blue)", marginLeft: 6,
              cursor: "pointer", fontWeight: 600,
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = "#60a5fa"}
            onMouseLeave={(e) => e.currentTarget.style.color = "var(--accent-blue)"}
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </span>
        </p>
      </div>
    </div>
  );
}

/* ---------- Profile Page ---------- */
function ProfilePage({ user, setPage, setUser, setJoinedEvents, joinedIds = [] }) {
  const [attendedEvents, setAttendedEvents] = useState([]);
  const [loadingAttended, setLoadingAttended] = useState(true);

  useEffect(() => {
    const fetchAttended = async () => {
      if (!user?.id) return;
      try {
        const res = await fetch(`http://localhost:5000/api/users/${user.id}/attended`);
        const data = await res.json();
        setAttendedEvents(data);
      } catch (err) { console.error(err); }
      setLoadingAttended(false);
    };
    fetchAttended();
  }, [user]);

  if (!user) {
    return (
      <div style={{ padding: "60px 32px", textAlign: "center" }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, marginBottom: 16 }}>
          Please Sign In
        </h3>
        <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>You must be signed in to view your profile.</p>
        <button className="btn-primary" onClick={() => setPage("dashboard")}>Go to Dashboard</button>
      </div>
    );
  }

  return (

    <div className="animate-fade-in" style={{ padding: "28px 32px" }}>
      {/* Profile Header */}
      <div className="card" style={{ padding: 32, marginBottom: 24, display: "flex", alignItems: "center", gap: 24 }}>
        <div style={{
          width: 80, height: 80, borderRadius: "var(--radius-full)",
          background: "var(--gradient-primary)", display: "flex",
          alignItems: "center", justifyContent: "center", fontSize: 32,
          fontWeight: 700, fontFamily: "var(--font-display)", color: "white",
          boxShadow: "var(--shadow-glow)"
        }}>
          {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, marginBottom: 4 }}>
            {user.fullName || "Student User"}
          </h2>
          <div style={{ display: "flex", gap: 16, color: "var(--text-secondary)", fontSize: 14 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><MapPin size={16} /> {user.department || "No Department"}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Clock size={16} /> Year {user.year || "N/A"}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><User size={16} /> {user.email}</span>
          </div>
        </div>
        <button className="btn-outline" onClick={() => { setUser(null); setJoinedEvents([]); setPage("dashboard"); }} style={{ color: "var(--accent-rose)", borderColor: "var(--accent-rose)", display: "flex", alignItems: "center", gap: 8 }}>
          <LogOut size={16} /> Sign Out
        </button>
      </div>

      {/* Portfolio Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Participation Info */}
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <Calendar size={20} color="#3b82f6" /> Event Participation
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {joinedIds.length > 0 ? (
              EVENTS.filter(ev => joinedIds.includes(ev.id)).map(ev => (
                <div key={ev.id} style={{ padding: 12, background: "rgba(255,255,255,0.04)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{ev.title}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Registered for {ev.date}</div>
                </div>
              ))
            ) : (
              <div style={{ padding: 12, color: "var(--text-muted)", fontSize: 13, textAlign: "center" }}>
                No events joined yet.
              </div>
            )}
          </div>
        </div>

        {/* Certificates & Achievements */}
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <Award size={20} color="#8b5cf6" /> Certificates & Achievements
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {loadingAttended ? (
              <div style={{ padding: 12, color: "var(--text-muted)", fontSize: 13, textAlign: "center" }}>Loading certificates...</div>
            ) : attendedEvents.length > 0 ? (
              attendedEvents.map((ev, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, background: "rgba(139,92,246,0.1)", borderRadius: "var(--radius-md)", border: "1px solid rgba(139,92,246,0.2)" }}>
                  <Award size={24} color="#8b5cf6" />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#a5b4fc" }}>Participation - {ev.title}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Issued by CampusFlux • {ev.date}</div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: 12, color: "var(--text-muted)", fontSize: 13, textAlign: "center" }}>
                Attend events to earn certificates!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
function App() {
  const [page, setPage] = useState("home");
  const [collapsed, setCollapsed] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ activeStudents: 2500, annualEvents: 120, dynamicCommunities: 15 });
  const [theme, setTheme] = useState("dark");
  const [toasts, setToasts] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [joinedEvents, setJoinedEvents] = useState([]); // Empty initially

  const addToast = (message, type = "info") => {
    const id = Date.now();
    setToasts([...toasts, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(toasts.filter(t => t.id !== id));
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const handleJoinEvent = async (event) => {
    if (!user) {
      setShowAuth(true);
      addToast("Please sign in to register for events", "info");
      return;
    }
    if (joinedEvents.includes(event.id.toString()) || joinedEvents.includes(event.id)) {
      addToast("You are already registered for this event", "info");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/users/${user.id}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: event.id.toString() }),
      });
      const data = await res.json();
      if (res.ok) {
        setJoinedEvents(data.joinedEvents);
        addToast(`Successfully registered for ${event.title}!`, "success");
        setSelectedEvent(null);
      } else {
        addToast(data.message || "Failed to register", "error");
      }
    } catch (err) {
      addToast("Connection error", "error");
    }
  };

  useEffect(() => {
    if (user?.role === "admin" && (page === "home" || page === "dashboard")) {
      setPage("admin");
    }
  }, [user, page]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/stats");
        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
    };
    fetchStats();
  }, []);


  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar
        page={page}
        setPage={setPage}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        setShowAuth={setShowAuth}
        user={user}
        setUser={setUser}
        setJoinedEvents={setJoinedEvents}
      />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <TopBar
          page={page}
          setPage={setPage}
          setShowAuth={setShowAuth}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          user={user}
          theme={theme}
          toggleTheme={toggleTheme}
        />

        <main style={{ flex: 1, overflowY: "auto" }}>
          {user?.role === "admin" ? (
            <AdminPage adminPage={page} user={user} setUser={setUser} setPage={setPage} />
          ) : (
            <>
              {page === "home" && <HomePage setPage={setPage} setShowAuth={setShowAuth} stats={stats} />}
              {page === "profile" && <ProfilePage user={user} setPage={setPage} setUser={setUser} setJoinedEvents={setJoinedEvents} joinedIds={joinedEvents} />}
              {page === "dashboard" && <DashboardPage setPage={setPage} onEventClick={setSelectedEvent} />}
              {page === "explore" && <ExplorePage searchQuery={searchQuery} onEventClick={setSelectedEvent} />}
              {page === "events" && <MyEventsPage user={user} joinedIds={joinedEvents} onEventClick={setSelectedEvent} setPage={setPage} setShowAuth={setShowAuth} />}
              {page === "leaderboard" && <LeaderboardPage />}
              {page === "communities" && <CommunitiesPage />}
            </>
          )}
        </main>
      </div>

      {/* Overlays */}
      <div className="toast-container">
        {toasts.map(t => (
          <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
        ))}
      </div>

      <EventDetailModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onJoin={handleJoinEvent}
        isJoined={selectedEvent && joinedEvents.includes(selectedEvent.id)}
      />



      <AuthModal
        show={showAuth}
        onClose={() => setShowAuth(false)}
        isLogin={isLogin}
        setIsLogin={setIsLogin}
        setUser={setUser}
        setJoinedEvents={setJoinedEvents}
        setPage={setPage}
      />
    </div>
  );
}

export default App;
