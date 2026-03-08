import { useState, useRef, useEffect } from "react";

const COLORS = [
  ["#1a0a12", "#e91e8c"],
  ["#0a1a18", "#00bcd4"],
  ["#1a0a12", "#f06292"],
  ["#0a1418", "#26c6da"],
  ["#160816", "#ec407a"],
  ["#081412", "#00acc1"],
  ["#1a0a10", "#f48fb1"],
  ["#061210", "#4dd0e1"],
];

function getContrastColor(hex) {
  return "#fff";
}

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function describeSlice(cx, cy, r, startAngle, endAngle) {
  const s = polarToCartesian(cx, cy, r, startAngle);
  const e = polarToCartesian(cx, cy, r, endAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M${cx},${cy} L${s.x},${s.y} A${r},${r} 0 ${largeArc} 1 ${e.x},${e.y} Z`;
}

function WelcomeScreen({ onEnter }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background:
          "radial-gradient(ellipse at 20% 20%, #1a0518 0%, #050a0e 50%, #020608 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Playfair Display', Georgia, serif",
        cursor: "pointer",
        animation: "none",
      }}
      onClick={onEnter}
    >
      <div style={{ textAlign: "center", padding: "0 20px" }}>
        <div
          style={{
            fontSize: "0.8rem",
            letterSpacing: "0.4em",
            color: "rgba(244,143,177,0.5)",
            textTransform: "uppercase",
            marginBottom: 24,
          }}
        >
          ✦ &nbsp; Welcome to &nbsp; ✦
        </div>
        <h1
          style={{
            fontSize: "clamp(3rem, 10vw, 6rem)",
            fontWeight: 700,
            fontStyle: "italic",
            margin: "0 0 8px",
            background:
              "linear-gradient(135deg, #f48fb1 0%, #e91e8c 40%, #00bcd4 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            animation: "glowPulse 3s ease-in-out infinite",
          }}
        >
          The Wheel
        </h1>
        <h1
          style={{
            fontSize: "clamp(3rem, 10vw, 6rem)",
            fontWeight: 700,
            fontStyle: "italic",
            margin: "0 0 32px",
            background: "linear-gradient(135deg, #00bcd4 0%, #e91e8c 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          of Doom & Fortune
        </h1>
        <div
          style={{
            width: 120,
            height: 1,
            background:
              "linear-gradient(90deg, transparent, #e91e8c, transparent)",
            margin: "0 auto 40px",
          }}
        />
        <div
          style={{
            fontSize: "0.85rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "rgba(244,143,177,0.6)",
            animation: "fadeUpDown 2s ease-in-out infinite",
          }}
        >
          Click anywhere to enter
        </div>
      </div>

      {/* Decorative rings */}
      <div
        style={{
          position: "absolute",
          width: 300,
          height: 300,
          borderRadius: "50%",
          border: "1px solid rgba(233,30,140,0.1)",
          animation: "spinSlow 20s linear infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 450,
          height: 450,
          borderRadius: "50%",
          border: "1px solid rgba(0,188,212,0.07)",
          animation: "spinSlow 30s linear infinite reverse",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          border: "1px solid rgba(233,30,140,0.04)",
          animation: "spinSlow 40s linear infinite",
        }}
      />

      <style>{`
        @keyframes glowPulse {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.3) drop-shadow(0 0 20px rgba(233,30,140,0.5)); }
        }
        @keyframes fadeUpDown {
          0%, 100% { opacity: 0.4; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(-6px); }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes dramaticExit {
          0% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(2); }
        }
      `}</style>
    </div>
  );
}

export default function SpinningWheel() {
  const [entered, setEntered] = useState(false);
  function handleEnter() {
    setEntered(true);
  }
  const [inputValue, setInputValue] = useState("");
  const [choices, setChoices] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValue, setEditValue] = useState("");
  const wheelRef = useRef(null);
  const animRef = useRef(null);
  const startRotRef = useRef(0);
  const targetRotRef = useRef(0);
  const startTimeRef = useRef(null);
  const durationRef = useRef(4000);

  const n = choices.length;
  const sliceAngle = n > 0 ? 360 / n : 0;
  const cx = 200,
    cy = 200,
    r = 185;

  function easeOut(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function spin() {
    if (spinning || choices.length < 2) return;
    setShowResult(false);
    setResult(null);
    const extraSpins = 5 + Math.floor(Math.random() * 5);
    const randomAngle = Math.random() * 360;
    const totalDelta = extraSpins * 360 + randomAngle;
    startRotRef.current = rotation % 360;
    targetRotRef.current = rotation + totalDelta;
    durationRef.current = 3500 + Math.random() * 1500;
    startTimeRef.current = null;
    setSpinning(true);

    function animate(timestamp) {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / durationRef.current, 1);
      const eased = easeOut(progress);
      const current =
        startRotRef.current +
        (targetRotRef.current - startRotRef.current) * eased;
      setRotation(current);

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        setRotation(targetRotRef.current);
        setSpinning(false);
        // Determine winner: pointer at top (0 deg), wheel rotated by `current`
        const finalAngle = ((targetRotRef.current % 360) + 360) % 360;
        const pointerAngle = (360 - finalAngle) % 360;
        const winnerIndex = Math.floor((pointerAngle / 360) * n) % n;
        setResult(choices[winnerIndex]);
        setTimeout(() => setShowResult(true), 200);
      }
    }
    animRef.current = requestAnimationFrame(animate);
  }

  function addChoice() {
    const trimmed = inputValue.trim();
    if (!trimmed || choices.length >= 12) return;
    setChoices([...choices, trimmed]);
    setInputValue("");
  }

  function removeChoice(i) {
    setChoices(choices.filter((_, idx) => idx !== i));
    setShowResult(false);
    setResult(null);
  }

  function startEdit(i) {
    setEditingIndex(i);
    setEditValue(choices[i]);
  }

  function saveEdit(i) {
    if (editValue.trim()) {
      const updated = [...choices];
      updated[i] = editValue.trim();
      setChoices(updated);
    }
    setEditingIndex(null);
  }

  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(ellipse at 20% 20%, #1a0518 0%, #050a0e 50%, #020608 100%)",
        fontFamily: "'Playfair Display', Georgia, serif",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "32px 16px 48px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {!entered && <WelcomeScreen onEnter={handleEnter} />}
      {/* Background shimmer */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          background:
            "radial-gradient(circle at 80% 10%, rgba(233,30,140,0.07) 0%, transparent 50%), radial-gradient(circle at 10% 90%, rgba(0,188,212,0.07) 0%, transparent 50%)",
        }}
      />

      {/* Title */}
      <div style={{ textAlign: "center", marginBottom: 36, zIndex: 1 }}>
        <h1
          style={{
            fontSize: "clamp(2rem, 5vw, 3.2rem)",
            fontWeight: 700,
            letterSpacing: "0.05em",
            margin: 0,
            background:
              "linear-gradient(135deg, #f48fb1 0%, #e91e8c 40%, #00bcd4 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textShadow: "none",
            fontStyle: "italic",
          }}
        >
          The Wheel of Doom & Fortune
        </h1>
        <p
          style={{
            color: "rgba(244,143,177,0.6)",
            fontSize: "0.95rem",
            marginTop: 6,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          Spin if u Dare
        </p>
        <div
          style={{
            width: 80,
            height: 1,
            background:
              "linear-gradient(90deg, transparent, #e91e8c, transparent)",
            margin: "10px auto 0",
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 40,
          justifyContent: "center",
          alignItems: "flex-start",
          zIndex: 1,
          width: "100%",
          maxWidth: 1000,
        }}
      >
        {/* Wheel Section */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
          }}
        >
          {/* Wheel container */}
          <div style={{ position: "relative", width: 400, height: 400 }}>
            {/* Glow */}
            <div
              style={{
                position: "absolute",
                inset: -20,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(233,30,140,0.18) 0%, rgba(0,188,212,0.08) 60%, transparent 100%)",
                filter: "blur(8px)",
              }}
            />
            {/* Pointer */}
            <div
              style={{
                position: "absolute",
                top: -8,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 10,
                filter: "drop-shadow(0 0 8px #e91e8c)",
              }}
            >
              <svg width="28" height="40" viewBox="0 0 28 40">
                <polygon
                  points="14,38 2,4 26,4"
                  fill="#e91e8c"
                  stroke="#f48fb1"
                  strokeWidth="1.5"
                />
                <circle
                  cx="14"
                  cy="6"
                  r="4"
                  fill="#fff"
                  stroke="#e91e8c"
                  strokeWidth="1.5"
                />
              </svg>
            </div>

            {/* SVG Wheel */}
            <svg
              ref={wheelRef}
              width="400"
              height="400"
              viewBox="0 0 400 400"
              style={{
                transform: `rotate(${rotation}deg)`,
                willChange: "transform",
                display: "block",
              }}
            >
              {/* Outer decorative ring */}
              <circle
                cx={cx}
                cy={cy}
                r={r + 8}
                fill="none"
                stroke="rgba(233,30,140,0.25)"
                strokeWidth="2"
              />
              <circle
                cx={cx}
                cy={cy}
                r={r + 14}
                fill="none"
                stroke="rgba(0,188,212,0.12)"
                strokeWidth="1"
              />

              {n === 0 ? (
                <circle
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill="#1a0a12"
                  stroke="#333"
                  strokeWidth="2"
                />
              ) : (
                choices.map((choice, i) => {
                  const startA = i * sliceAngle;
                  const endA = (i + 1) * sliceAngle;
                  const midA = startA + sliceAngle / 2;
                  const [bg, accent] = COLORS[i % COLORS.length];
                  const textR = r * 0.62;
                  const textPos = polarToCartesian(cx, cy, textR, midA);
                  const textAngle = midA - 90;
                  const maxLen = 10;
                  const label =
                    choice.length > maxLen
                      ? choice.slice(0, maxLen) + "…"
                      : choice;
                  return (
                    <g key={i}>
                      <path
                        d={describeSlice(cx, cy, r, startA, endA)}
                        fill={bg}
                        stroke="rgba(255,255,255,0.06)"
                        strokeWidth="1.5"
                      />
                      {/* Accent arc */}
                      <path
                        d={describeSlice(cx, cy, r, startA, endA)}
                        fill="none"
                        stroke={accent}
                        strokeWidth="1"
                        opacity="0.5"
                      />
                      {/* Radial divider */}
                      <line
                        x1={cx}
                        y1={cy}
                        x2={polarToCartesian(cx, cy, r, startA).x}
                        y2={polarToCartesian(cx, cy, r, startA).y}
                        stroke="rgba(255,255,255,0.08)"
                        strokeWidth="1"
                      />
                      {/* Dot on edge */}
                      <circle
                        cx={polarToCartesian(cx, cy, r - 6, midA).x}
                        cy={polarToCartesian(cx, cy, r - 6, midA).y}
                        r="3"
                        fill={accent}
                        opacity="0.7"
                      />
                      {/* Label */}
                      <text
                        x={textPos.x}
                        y={textPos.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        transform={`rotate(${textAngle}, ${textPos.x}, ${textPos.y})`}
                        fill="#fff"
                        fontSize={n > 8 ? "11" : "13"}
                        fontFamily="'Playfair Display', Georgia, serif"
                        fontWeight="600"
                        style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}
                      >
                        {label}
                      </text>
                    </g>
                  );
                })
              )}

              {/* Center cap */}
              <circle
                cx={cx}
                cy={cy}
                r="22"
                fill="#050a0e"
                stroke="#e91e8c"
                strokeWidth="2"
              />
              <circle cx={cx} cy={cy} r="14" fill="url(#centerGrad)" />
              <defs>
                <radialGradient id="centerGrad" cx="50%" cy="50%">
                  <stop offset="0%" stopColor="#f48fb1" />
                  <stop offset="100%" stopColor="#e91e8c" />
                </radialGradient>
              </defs>
            </svg>
          </div>

          {/* Spin Button */}
          <button
            onClick={spin}
            disabled={spinning || choices.length < 2}
            style={{
              padding: "14px 52px",
              fontSize: "1.1rem",
              fontFamily: "'Playfair Display', Georgia, serif",
              fontWeight: 700,
              fontStyle: "italic",
              letterSpacing: "0.08em",
              background:
                spinning || choices.length < 2
                  ? "rgba(60,20,40,0.5)"
                  : "linear-gradient(135deg, #e91e8c 0%, #c2185b 50%, #00bcd4 100%)",
              color:
                spinning || choices.length < 2
                  ? "rgba(255,255,255,0.3)"
                  : "#fff",
              border: "1px solid rgba(233,30,140,0.4)",
              borderRadius: 4,
              cursor:
                spinning || choices.length < 2 ? "not-allowed" : "pointer",
              boxShadow:
                spinning || choices.length < 2
                  ? "none"
                  : "0 0 24px rgba(233,30,140,0.4), 0 0 8px rgba(0,188,212,0.2)",
              transition: "all 0.3s ease",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {spinning ? "Spinning…" : "✦ Spin the Wheel ✦"}
          </button>

          {/* Result */}
          <div
            style={{
              minHeight: 72,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            {showResult && result && (
              <div
                style={{
                  padding: "18px 36px",
                  background:
                    "linear-gradient(135deg, rgba(233,30,140,0.12), rgba(0,188,212,0.08))",
                  border: "1px solid rgba(233,30,140,0.35)",
                  borderRadius: 4,
                  animation: "fadeIn 0.5s ease",
                }}
              >
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "rgba(244,143,177,0.7)",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    marginBottom: 6,
                  }}
                >
                  The Wheel Hath Spoken
                </div>
                <div
                  style={{
                    fontSize: "1.6rem",
                    fontWeight: 700,
                    fontStyle: "italic",
                    background: "linear-gradient(135deg, #f48fb1, #00bcd4)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {result}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Controls Panel */}
        <div
          style={{
            width: 280,
            background: "rgba(10,6,14,0.7)",
            border: "1px solid rgba(233,30,140,0.18)",
            borderRadius: 8,
            padding: "28px 22px",
            backdropFilter: "blur(12px)",
          }}
        >
          <h2
            style={{
              margin: "0 0 6px",
              fontSize: "1.2rem",
              fontStyle: "italic",
              fontWeight: 700,
              color: "#f48fb1",
              letterSpacing: "0.05em",
            }}
          >
            ✦ Your Choices
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.3)",
              fontSize: "0.78rem",
              margin: "0 0 20px",
              letterSpacing: "0.1em",
            }}
          >
            {choices.length}/12 entries
          </p>

          {/* Add input */}
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addChoice()}
              placeholder="Add a choice…"
              maxLength={30}
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(233,30,140,0.25)",
                borderRadius: 4,
                padding: "10px 12px",
                color: "#fff",
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "0.9rem",
                outline: "none",
              }}
            />
            <button
              onClick={addChoice}
              disabled={choices.length >= 12}
              style={{
                background: "linear-gradient(135deg, #e91e8c, #00bcd4)",
                border: "none",
                borderRadius: 4,
                color: "#fff",
                fontWeight: 700,
                fontSize: "1.2rem",
                width: 38,
                cursor: choices.length >= 12 ? "not-allowed" : "pointer",
                opacity: choices.length >= 12 ? 0.4 : 1,
                flexShrink: 0,
              }}
            >
              +
            </button>
          </div>

          {/* List */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              maxHeight: 360,
              overflowY: "auto",
            }}
          >
            {choices.map((choice, i) => {
              const [, accent] = COLORS[i % COLORS.length];
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 10px",
                    background: "rgba(255,255,255,0.03)",
                    border: `1px solid ${accent}28`,
                    borderLeft: `3px solid ${accent}`,
                    borderRadius: 4,
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: accent,
                      flexShrink: 0,
                    }}
                  />
                  {editingIndex === i ? (
                    <input
                      autoFocus
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={() => saveEdit(i)}
                      onKeyDown={(e) => e.key === "Enter" && saveEdit(i)}
                      maxLength={30}
                      style={{
                        flex: 1,
                        background: "transparent",
                        border: "none",
                        borderBottom: `1px solid ${accent}`,
                        color: "#fff",
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: "0.88rem",
                        outline: "none",
                        padding: "2px 0",
                      }}
                    />
                  ) : (
                    <span
                      onClick={() => startEdit(i)}
                      style={{
                        flex: 1,
                        fontSize: "0.88rem",
                        cursor: "text",
                        color: "rgba(255,255,255,0.85)",
                        letterSpacing: "0.02em",
                      }}
                      title="Click to edit"
                    >
                      {choice}
                    </span>
                  )}
                  <button
                    onClick={() => removeChoice(i)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "rgba(233,30,140,0.5)",
                      cursor: "pointer",
                      fontSize: "1rem",
                      lineHeight: 1,
                      padding: "2px 4px",
                      flexShrink: 0,
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => (e.target.style.color = "#e91e8c")}
                    onMouseLeave={(e) =>
                      (e.target.style.color = "rgba(233,30,140,0.5)")
                    }
                    title="Remove"
                  >
                    ×
                  </button>
                </div>
              );
            })}
            {choices.length === 0 && (
              <div
                style={{
                  color: "rgba(255,255,255,0.2)",
                  fontSize: "0.85rem",
                  textAlign: "center",
                  padding: "24px 0",
                  fontStyle: "italic",
                }}
              >
                Add at least 2 choices to spin
              </div>
            )}
          </div>

          <div
            style={{
              marginTop: 20,
              borderTop: "1px solid rgba(255,255,255,0.06)",
              paddingTop: 14,
            }}
          >
            <p
              style={{
                color: "rgba(255,255,255,0.25)",
                fontSize: "0.72rem",
                margin: 0,
                letterSpacing: "0.08em",
                lineHeight: 1.6,
              }}
            >
              Click a name to edit · × to remove · Press Enter to add
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&display=swap');
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        input::placeholder { color: rgba(255,255,255,0.2); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(233,30,140,0.3); border-radius: 2px; }
      `}</style>
    </div>
  );
}
