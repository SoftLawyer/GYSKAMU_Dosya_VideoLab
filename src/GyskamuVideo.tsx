import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import timelineData from "./timeline.json";

const { fontFamily: playfairFamily } = loadPlayfair("normal", {
  weights: ["400", "600", "700"],
  subsets: ["latin", "latin-ext"],
});
const { fontFamily: playfairItalicFamily } = loadPlayfair("italic", {
  weights: ["400", "600"],
  subsets: ["latin", "latin-ext"],
});
const { fontFamily: monoFamily } = loadJetBrains("normal", {
  weights: ["400", "500", "700"],
  subsets: ["latin", "latin-ext"],
});

const COLORS = {
  bg: "#F3EEE4",
  grid: "rgba(150, 132, 102, 0.11)",
  maroonDark: "#2B0F12",
  maroon: "#4A1C1F",
  maroonSoft: "#6E3538",
  goldDark: "#8C6D32",
  gold: "#B6924C",
  goldBright: "#E5C882",
  goldLight: "#D4BE8D",
  creamCard: "#FAF6EE",
  creamDark: "#EAE1D0",
  textMuted: "#7E6F61",
  divider: "#DED5C5",
  crimson: "#A6262F",
  subActive: "#FAF6EE",
  subMuted: "#C49D8F",
};

// ============================================================================
// ARTICULATED FULL-BODY EDITORIAL CHARACTER (Tailored Suit & Pistol Support)
// Origin (x, y) is the ground contact point between the feet. Total height ~245px.
// ============================================================================
const FullBodyCharacter: React.FC<{
  x: number;
  y: number;
  coatColor: string;
  accentColor: string;
  trouserColor?: string;
  aimDirection?: "left" | "right" | "none";
  armRaiseProg?: number; // 0 (down) -> 1 (aimed horizontally)
  muzzleFlash?: number; // 0..1 intensity
  handsUp?: boolean;
  kneeBend?: number; // 0..1
  fallAngleDeg?: number; // 0 upright -> 90 fallen right
  visor?: boolean;
  scale?: number;
}> = ({
  x,
  y,
  coatColor,
  accentColor,
  trouserColor = "#241719",
  aimDirection = "none",
  armRaiseProg = 1,
  muzzleFlash = 0,
  handsUp = false,
  kneeBend = 0,
  fallAngleDeg = 0,
  visor = true,
  scale = 1,
}) => {
  const dropOffset = kneeBend * 22;
  const armDeg =
    aimDirection === "right"
      ? interpolate(armRaiseProg, [0, 1], [65, 0])
      : aimDirection === "left"
      ? interpolate(armRaiseProg, [0, 1], [-65, 0])
      : 0;

  return (
    <g
      transform={`translate(${x}, ${y}) scale(${scale}) rotate(${fallAngleDeg}, 0, -10)`}
    >
      {/* Ground Contact Shadow */}
      {fallAngleDeg < 20 ? (
        <ellipse
          cx={0}
          cy={2}
          rx={38}
          ry={7}
          fill="rgba(43, 15, 18, 0.14)"
        />
      ) : null}

      {/* Shoes */}
      <ellipse cx={-15} cy={-3} rx={13} ry={6} fill="#1A0B0C" />
      <ellipse cx={15} cy={-3} rx={13} ry={6} fill="#1A0B0C" />

      {/* Articulated Trousers / Legs */}
      <path
        d={`M -22 ${-98 + dropOffset} L -6 ${-98 + dropOffset} L ${
          -9 - kneeBend * 14
        } ${-48 + dropOffset * 0.5} L -10 -4 L -22 -4 L ${
          -24 - kneeBend * 14
        } ${-48 + dropOffset * 0.5} Z`}
        fill={trouserColor}
        stroke={COLORS.maroonDark}
        strokeWidth={2.5}
      />
      <path
        d={`M 6 ${-98 + dropOffset} L 22 ${-98 + dropOffset} L ${
          24 - kneeBend * 10
        } ${-48 + dropOffset * 0.5} L 22 -4 L 10 -4 L ${
          9 - kneeBend * 10
        } ${-48 + dropOffset * 0.5} Z`}
        fill={trouserColor}
        stroke={COLORS.maroonDark}
        strokeWidth={2.5}
      />

      {/* Upper Body Group (shifts down if knees bend) */}
      <g transform={`translate(0, ${dropOffset})`}>
        {/* Tailored Suit Jacket Torso */}
        <path
          d="M -30 -174 C -30 -186 -16 -192 0 -192 C 16 -192 30 -186 30 -174 L 26 -92 L -26 -92 Z"
          fill={coatColor}
          stroke={COLORS.maroonDark}
          strokeWidth={3}
        />
        {/* Crisp White Dress Shirt & Tie */}
        <polygon points="-11,-190 11,-190 0,-138" fill={COLORS.creamCard} />
        <polygon points="-4,-188 4,-188 5,-144 0,-134 -5,-144" fill={accentColor} />
        {/* Lapels */}
        <polyline
          points="-18,-188 -7,-148 -10,-120"
          fill="none"
          stroke={COLORS.creamCard}
          strokeWidth={1.6}
          opacity={0.55}
        />
        <polyline
          points="18,-188 7,-148 10,-120"
          fill="none"
          stroke={COLORS.creamCard}
          strokeWidth={1.6}
          opacity={0.55}
        />
        {/* Gold Button */}
        <circle cx={0} cy={-114} r={2.5} fill={COLORS.goldBright} />

        {/* Back/Passive Arm */}
        {aimDirection === "none" ? (
          <>
            <g
              transform={`translate(-28, -178) rotate(${handsUp ? 132 : 8})`}
            >
              <rect
                x={-6}
                y={0}
                width={13}
                height={70}
                rx={6}
                fill={coatColor}
                stroke={COLORS.maroonDark}
                strokeWidth={2.5}
              />
              <circle
                cx={0}
                cy={74}
                r={7}
                fill={COLORS.creamCard}
                stroke={COLORS.maroonDark}
                strokeWidth={2.2}
              />
            </g>
            <g
              transform={`translate(28, -178) rotate(${handsUp ? -132 : -8})`}
            >
              <rect
                x={-7}
                y={0}
                width={13}
                height={70}
                rx={6}
                fill={coatColor}
                stroke={COLORS.maroonDark}
                strokeWidth={2.5}
              />
              <circle
                cx={0}
                cy={74}
                r={7}
                fill={COLORS.creamCard}
                stroke={COLORS.maroonDark}
                strokeWidth={2.2}
              />
            </g>
          </>
        ) : (
          /* Passive rear arm slightly bent at side */
          <g
            transform={`translate(${
              aimDirection === "right" ? -26 : 26
            }, -176) rotate(${aimDirection === "right" ? 12 : -12})`}
          >
            <rect
              x={-6}
              y={0}
              width={13}
              height={66}
              rx={6}
              fill={coatColor}
              stroke={COLORS.maroonDark}
              strokeWidth={2.5}
            />
            <circle
              cx={0}
              cy={70}
              r={6.5}
              fill={COLORS.creamCard}
              stroke={COLORS.maroonDark}
              strokeWidth={2.2}
            />
          </g>
        )}

        {/* Neck */}
        <rect
          x={-8}
          y={-205}
          width={16}
          height={16}
          rx={5}
          fill={COLORS.creamDark}
          stroke={COLORS.maroonDark}
          strokeWidth={2.2}
        />

        {/* Sculpted Head */}
        <path
          d="M -21 -228 C -21 -246 -12 -254 0 -254 C 12 -254 21 -246 21 -228 C 21 -210 12 -200 0 -200 C -12 -200 -21 -210 -21 -228 Z"
          fill={COLORS.creamCard}
          stroke={COLORS.maroonDark}
          strokeWidth={2.8}
        />
        {/* Styled Hair */}
        <path
          d="M -20 -231 C -19 -247 -10 -254 2 -254 C 14 -254 21 -245 20 -232 C 12 -238 2 -239 -8 -237 C -14 -235 -18 -233 -20 -231 Z"
          fill={coatColor}
        />
        {/* Face Details */}
        {visor ? (
          <g>
            <rect
              x={-15}
              y={-231}
              width={12}
              height={7}
              rx={2.5}
              fill={COLORS.maroonDark}
            />
            <rect
              x={3}
              y={-231}
              width={12}
              height={7}
              rx={2.5}
              fill={COLORS.maroonDark}
            />
            <line
              x1={-3}
              y1={-228}
              x2={3}
              y2={-228}
              stroke={COLORS.maroonDark}
              strokeWidth={2}
            />
          </g>
        ) : (
          <g>
            <circle cx={-7} cy={-228} r={2.5} fill={COLORS.maroonDark} />
            <circle cx={7} cy={-228} r={2.5} fill={COLORS.maroonDark} />
          </g>
        )}

        {/* Active Aiming Arm & Sleek Automatic Pistol */}
        {aimDirection === "right" ? (
          <g transform={`translate(20, -176) rotate(${armDeg})`}>
            <rect
              x={0}
              y={-7}
              width={66}
              height={14}
              rx={7}
              fill={coatColor}
              stroke={COLORS.maroonDark}
              strokeWidth={2.5}
            />
            {/* Hand */}
            <circle
              cx={68}
              cy={0}
              r={6.5}
              fill={COLORS.creamCard}
              stroke={COLORS.maroonDark}
              strokeWidth={2.2}
            />
            {/* Pistol */}
            <rect
              x={68}
              y={-12}
              width={30}
              height={9}
              rx={2}
              fill={COLORS.maroonDark}
            />
            <rect
              x={68}
              y={-4}
              width={10}
              height={15}
              rx={2}
              fill={COLORS.maroonDark}
            />
            {/* Muzzle Flash */}
            {muzzleFlash > 0.05 ? (
              <g transform="translate(102, -8)" opacity={muzzleFlash}>
                <polygon
                  points="0,0 24,-13 15,-3 34,0 15,3 24,13"
                  fill={COLORS.goldBright}
                  stroke={COLORS.crimson}
                  strokeWidth={1.8}
                />
                <circle
                  cx={10}
                  cy={0}
                  r={12 * (1.4 - 0.4 * muzzleFlash)}
                  fill="none"
                  stroke={COLORS.gold}
                  strokeWidth={2}
                  opacity={0.7}
                />
              </g>
            ) : null}
          </g>
        ) : null}

        {aimDirection === "left" ? (
          <g transform={`translate(-20, -176) rotate(${armDeg})`}>
            <rect
              x={-66}
              y={-7}
              width={66}
              height={14}
              rx={7}
              fill={coatColor}
              stroke={COLORS.maroonDark}
              strokeWidth={2.5}
            />
            {/* Hand */}
            <circle
              cx={-68}
              cy={0}
              r={6.5}
              fill={COLORS.creamCard}
              stroke={COLORS.maroonDark}
              strokeWidth={2.2}
            />
            {/* Pistol */}
            <rect
              x={-98}
              y={-12}
              width={30}
              height={9}
              rx={2}
              fill={COLORS.maroonDark}
            />
            <rect
              x={-78}
              y={-4}
              width={10}
              height={15}
              rx={2}
              fill={COLORS.maroonDark}
            />
            {/* Muzzle Flash */}
            {muzzleFlash > 0.05 ? (
              <g transform="translate(-102, -8)" opacity={muzzleFlash}>
                <polygon
                  points="0,0 -24,-13 -15,-3 -34,0 -15,3 -24,13"
                  fill={COLORS.goldBright}
                  stroke={COLORS.crimson}
                  strokeWidth={1.8}
                />
                <circle
                  cx={-10}
                  cy={0}
                  r={12 * (1.4 - 0.4 * muzzleFlash)}
                  fill="none"
                  stroke={COLORS.gold}
                  strokeWidth={2}
                  opacity={0.7}
                />
              </g>
            ) : null}
          </g>
        ) : null}
      </g>
    </g>
  );
};

// Reusable Fallen Victim Editorial Silhouette (lying flat on ground)
const FallenVictimEditorial: React.FC<{
  x: number;
  y: number;
  scale?: number;
}> = ({ x, y, scale = 1 }) => (
  <g transform={`translate(${x}, ${y}) scale(${scale})`}>
    {/* Subtle Ground Shadow */}
    <ellipse cx={0} cy={6} rx={112} ry={11} fill="rgba(43, 15, 18, 0.14)" />
    {/* Chalk / Forensic Outline */}
    <ellipse
      cx={0}
      cy={-12}
      rx={118}
      ry={34}
      fill="none"
      stroke={COLORS.gold}
      strokeWidth={2}
      strokeDasharray="7 6"
      opacity={0.75}
    />
    {/* Trousers / Legs (left side) */}
    <path
      d="M -18 -24 L -94 -28 L -96 -14 L -18 -10 Z"
      fill="#241719"
      stroke={COLORS.maroonDark}
      strokeWidth={2.5}
    />
    <path
      d="M -18 -12 L -88 -2 L -84 10 L -16 0 Z"
      fill="#241719"
      stroke={COLORS.maroonDark}
      strokeWidth={2.5}
    />
    {/* Suit Jacket Body */}
    <rect
      x={-24}
      y={-32}
      width={78}
      height={34}
      rx={14}
      fill="#4D2D31"
      stroke={COLORS.maroonDark}
      strokeWidth={2.8}
    />
    {/* Dropped Arm */}
    <path
      d="M 18 -30 L -6 -44 L -24 -38"
      fill="none"
      stroke="#4D2D31"
      strokeWidth={11}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Head */}
    <circle
      cx={74}
      cy={-16}
      r={20}
      fill={COLORS.creamCard}
      stroke={COLORS.maroonDark}
      strokeWidth={2.8}
    />
    {/* Hair arc */}
    <path
      d="M 74 -36 A 20 20 0 0 1 94 -16"
      fill="none"
      stroke="#3B282B"
      strokeWidth={6}
      strokeLinecap="round"
    />
  </g>
);

// ============================================================================
// SCENE 0 (0.00s -> 11.84s): FULL-BODY CROSSFIRE SHOOTING & VICTIM COLLAPSE
// ============================================================================
const Scene0Hook: React.FC<{ t: number; fps: number }> = ({ t, fps }) => {
  // 1. Shooters raise pistols smoothly (0.2s -> 1.9s)
  const armRaiseProg = interpolate(t, [0.25, 1.85], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 2. Muzzle flashes & flying bullets during "İki tetik aynı anda çekiliyor" (2.45s -> 4.60s)
  const flash1 = interpolate(t, [2.48, 2.55, 2.82], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const flash2 = interpolate(t, [3.05, 3.12, 3.4], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const muzzleFlash = Math.max(flash1, flash2);

  // Bullets streak inward from x=237 & x=651 to x=444
  const bulletFlight = interpolate(t, [2.52, 4.55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bulletsVisible = t >= 2.52 && t <= 4.65;

  // 3. Victim impact & collapse (4.55s -> 5.75s)
  const impactShakeDecay = interpolate(t, [4.55, 4.95], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shakeX =
    t >= 4.55 && t <= 4.95 ? Math.sin(t * 95) * 6 * impactShakeDecay : 0;
  const shakeY =
    t >= 4.55 && t <= 4.95 ? Math.cos(t * 110) * 4 * impactShakeDecay : 0;

  const kneeBend = interpolate(t, [4.6, 5.1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fallAngle = interpolate(t, [4.85, 5.65], [0, 88], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const isFallenFlat = t >= 5.65;

  // 4. Subtle cinematic camera zoom during shooting
  const camZoom = interpolate(t, [1.8, 3.2, 6.2, 7.2], [1, 1.04, 1.04, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 5. Ballistic trajectories & callout badges (7.33s+)
  const traceAProg = spring({
    fps,
    frame: Math.max(0, Math.floor((t - 7.35) * fps)),
    config: { damping: 14, stiffness: 135 },
  });
  const traceBProg = spring({
    fps,
    frame: Math.max(0, Math.floor((t - 8.35) * fps)),
    config: { damping: 14, stiffness: 135 },
  });
  const vefatPop = spring({
    fps,
    frame: Math.max(0, Math.floor((t - 5.7) * fps)),
    config: { damping: 13, stiffness: 150 },
  });

  const bulletAX = interpolate(bulletFlight, [0, 1], [238, 424]);
  const bulletBX = interpolate(bulletFlight, [0, 1], [650, 464]);

  return (
    <svg width={888} height={650} viewBox="0 0 888 650">
      {/* Main Tactical Crime Scene Frame */}
      <rect
        x={14}
        y={16}
        width={860}
        height={616}
        rx={22}
        fill={COLORS.creamCard}
        stroke={COLORS.maroon}
        strokeWidth={3}
      />
      {/* Corner Gold Brackets */}
      <path
        d="M 34 54 V 36 H 52 M 854 54 V 36 H 836 M 34 594 V 612 H 52 M 854 594 V 612 H 836"
        fill="none"
        stroke={COLORS.gold}
        strokeWidth={3}
        strokeLinecap="round"
      />

      {/* Top Stage Header */}
      <text
        x={444}
        y={58}
        textAnchor="middle"
        fill={COLORS.textMuted}
        fontFamily={monoFamily}
        fontSize={16}
        fontWeight={700}
        letterSpacing="0.16em"
      >
        OLAY YERİ SİMÜLASYONU · ÇAPRAZ ATEŞ
      </text>
      <line
        x1={56}
        y1={76}
        x2={832}
        y2={76}
        stroke={COLORS.divider}
        strokeWidth={2}
      />

      {/* Camera Transform Group */}
      <g
        transform={`translate(${444 + shakeX}, ${335 + shakeY}) scale(${camZoom}) translate(-444, -335)`}
      >
        {/* Ground Floor Line */}
        <line
          x1={46}
          y1={496}
          x2={842}
          y2={496}
          stroke={COLORS.maroonDark}
          strokeWidth={3.5}
          strokeLinecap="round"
        />

        {/* Left Shooter (FAİL A) */}
        <FullBodyCharacter
          x={135}
          y={496}
          coatColor={COLORS.maroon}
          accentColor={COLORS.gold}
          aimDirection="right"
          armRaiseProg={armRaiseProg}
          muzzleFlash={muzzleFlash}
          scale={0.96}
        />

        {/* Right Shooter (FAİL B) */}
        <FullBodyCharacter
          x={753}
          y={496}
          coatColor={COLORS.goldDark}
          accentColor={COLORS.maroon}
          aimDirection="left"
          armRaiseProg={armRaiseProg}
          muzzleFlash={muzzleFlash}
          scale={0.96}
        />

        {/* Flying Bullets with Motion Streaks */}
        {bulletsVisible ? (
          <g>
            {/* Bullet A Streak & Tip */}
            <line
              x1={Math.max(236, bulletAX - 56)}
              y1={320}
              x2={bulletAX}
              y2={320}
              stroke={COLORS.crimson}
              strokeWidth={4}
              strokeLinecap="round"
              opacity={0.75}
            />
            <circle cx={bulletAX} cy={320} r={6} fill={COLORS.maroonDark} />
            <circle cx={bulletAX} cy={320} r={3} fill={COLORS.goldBright} />

            {/* Bullet B Streak & Tip */}
            <line
              x1={Math.min(652, bulletBX + 56)}
              y1={320}
              x2={bulletBX}
              y2={320}
              stroke={COLORS.goldDark}
              strokeWidth={4}
              strokeLinecap="round"
              opacity={0.75}
            />
            <circle cx={bulletBX} cy={320} r={6} fill={COLORS.maroonDark} />
            <circle cx={bulletBX} cy={320} r={3} fill={COLORS.goldBright} />
          </g>
        ) : null}

        {/* Center Victim: Standing -> Impact Ring -> Buckling/Falling -> Fallen Outline */}
        {!isFallenFlat ? (
          <g>
            <FullBodyCharacter
              x={444}
              y={496}
              coatColor="#3E2A2D"
              accentColor={COLORS.maroonSoft}
              aimDirection="none"
              handsUp={t >= 1.6 && t < 4.75}
              kneeBend={kneeBend}
              fallAngleDeg={fallAngle}
              visor={false}
              scale={0.96}
            />
            {/* Impact Flash Ring on Chest */}
            {t >= 4.52 && t <= 5.05 ? (
              <circle
                cx={444}
                cy={345}
                r={interpolate(t, [4.52, 5.05], [10, 48])}
                fill="none"
                stroke={COLORS.crimson}
                strokeWidth={5}
                opacity={interpolate(t, [4.52, 5.05], [1, 0])}
              />
            ) : null}
          </g>
        ) : (
          <FallenVictimEditorial x={444} y={482} scale={1.0} />
        )}

        {/* ECG Flatline Badge once victim falls */}
        {isFallenFlat ? (
          <g
            transform={`translate(444, 248) scale(${0.85 + 0.15 * vefatPop})`}
            opacity={vefatPop}
          >
            <rect
              x={-140}
              y={-34}
              width={280}
              height={68}
              rx={12}
              fill={COLORS.maroonDark}
              stroke={COLORS.goldBright}
              strokeWidth={2.5}
            />
            <text
              x={0}
              y={-9}
              textAnchor="middle"
              fill={COLORS.creamCard}
              fontFamily={monoFamily}
              fontSize={13.5}
              fontWeight={700}
              letterSpacing="0.1em"
            >
              OLAY YERİNDE VEFAT
            </text>
            <path
              d="M -112 14 L -70 14 L -62 1 L -52 24 L -42 6 L -34 14 L 112 14"
              fill="none"
              stroke={COLORS.goldBright}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        ) : null}

        {/* Ballistic Dashed Vectors & Uncertainty Callouts */}
        {t >= 7.33 ? (
          <g opacity={traceAProg}>
            <line
              x1={238}
              y1={320}
              x2={238 + (424 - 238) * traceAProg}
              y2={320 + (454 - 320) * traceAProg}
              stroke={COLORS.crimson}
              strokeWidth={3.2}
              strokeDasharray="7 6"
            />
            <g transform={`translate(238, 150) scale(${0.85 + 0.15 * traceAProg})`}>
              <rect
                x={-155}
                y={-32}
                width={310}
                height={64}
                rx={12}
                fill={COLORS.maroon}
                stroke={COLORS.goldBright}
                strokeWidth={2}
              />
              <text
                x={0}
                y={-5}
                textAnchor="middle"
                fill={COLORS.goldBright}
                fontFamily={monoFamily}
                fontSize={14}
                fontWeight={700}
                letterSpacing="0.08em"
              >
                MERMİ #A
              </text>
              <text
                x={0}
                y={20}
                textAnchor="middle"
                fill={COLORS.creamCard}
                fontFamily={playfairFamily}
                fontSize={21}
                fontWeight={700}
              >
                Öldürücü mü? — Belirsiz (?)
              </text>
            </g>
          </g>
        ) : null}

        {t >= 8.33 ? (
          <g opacity={traceBProg}>
            <line
              x1={650}
              y1={320}
              x2={650 - (650 - 464) * traceBProg}
              y2={320 + (454 - 320) * traceBProg}
              stroke={COLORS.goldDark}
              strokeWidth={3.2}
              strokeDasharray="7 6"
            />
            <g transform={`translate(650, 150) scale(${0.85 + 0.15 * traceBProg})`}>
              <rect
                x={-155}
                y={-32}
                width={310}
                height={64}
                rx={12}
                fill={COLORS.creamDark}
                stroke={COLORS.maroonDark}
                strokeWidth={2.5}
              />
              <text
                x={0}
                y={-5}
                textAnchor="middle"
                fill={COLORS.maroon}
                fontFamily={monoFamily}
                fontSize={14}
                fontWeight={700}
                letterSpacing="0.08em"
              >
                MERMİ #B
              </text>
              <text
                x={0}
                y={20}
                textAnchor="middle"
                fill={COLORS.maroonDark}
                fontFamily={playfairFamily}
                fontSize={21}
                fontWeight={700}
              >
                Öldürücü mü? — Belirsiz (?)
              </text>
            </g>
          </g>
        ) : null}

        {/* Ground Plates below Shooters */}
        <g transform="translate(135, 536)">
          <rect
            x={-68}
            y={-18}
            width={136}
            height={36}
            rx={8}
            fill={COLORS.maroonDark}
            stroke={COLORS.gold}
            strokeWidth={2}
          />
          <text
            x={0}
            y={6}
            textAnchor="middle"
            fill={COLORS.goldBright}
            fontFamily={monoFamily}
            fontSize={16}
            fontWeight={700}
            letterSpacing="0.08em"
          >
            FAİL A
          </text>
        </g>

        <g transform="translate(753, 536)">
          <rect
            x={-68}
            y={-18}
            width={136}
            height={36}
            rx={8}
            fill={COLORS.goldDark}
            stroke={COLORS.maroonDark}
            strokeWidth={2}
          />
          <text
            x={0}
            y={6}
            textAnchor="middle"
            fill={COLORS.creamCard}
            fontFamily={monoFamily}
            fontSize={16}
            fontWeight={700}
            letterSpacing="0.08em"
          >
            FAİL B
          </text>
        </g>

        {/* Bottom Status Telemetry Strip */}
        <rect
          x={235}
          y={518}
          width={418}
          height={36}
          rx={8}
          fill="rgba(74, 28, 31, 0.08)"
          stroke={COLORS.divider}
          strokeWidth={1.5}
        />
        <text
          x={444}
          y={542}
          textAnchor="middle"
          fill={COLORS.maroonDark}
          fontFamily={monoFamily}
          fontSize={15}
          fontWeight={700}
          letterSpacing="0.06em"
        >
          {t >= 5.65 ? "2 ATEŞ · 1 VEFAT · KATİL BELİRSİZ" : "AYNI ANDA ÇAPRAZ ATEŞ"}
        </text>
      </g>
    </svg>
  );
};

// ============================================================================
// SCENE 1 (11.84s -> 17.60s): INTERROGATION BOOTHS, KATİL STAMPS & CONFLICT SEAL
// ============================================================================
const Scene1Mugshots: React.FC<{ t: number; fps: number }> = ({ t, fps }) => {
  const showStamps = t >= 13.05 && t < 14.35;
  const stampPop = spring({
    fps,
    frame: Math.max(0, Math.floor((t - 13.05) * fps)),
    config: { damping: 12, stiffness: 180 },
  });
  const showQuestion = t >= 14.3;
  const questionPop = spring({
    fps,
    frame: Math.max(0, Math.floor((t - 14.3) * fps)),
    config: { damping: 12, stiffness: 160 },
  });

  const renderBooth = (
    bx: number,
    code: string,
    coatColor: string,
    accentColor: string,
    stampAngle: number
  ) => (
    <g transform={`translate(${bx}, 32)`}>
      {/* Folder Tab */}
      <path
        d="M 0 36 L 0 14 Q 0 0 14 0 L 170 0 L 195 36 Z"
        fill={coatColor}
      />
      <text
        x={92}
        y={24}
        textAnchor="middle"
        fill={COLORS.creamCard}
        fontFamily={monoFamily}
        fontSize={14}
        fontWeight={700}
        letterSpacing="0.08em"
      >
        SORGU KABİNİ #{code}
      </text>

      {/* Main Booth Frame */}
      <rect
        x={0}
        y={32}
        width={384}
        height={530}
        rx={18}
        fill={COLORS.creamCard}
        stroke={COLORS.maroon}
        strokeWidth={3.2}
      />

      {/* Height Scale Backdrop */}
      {[190, 180, 170, 160, 150, 140].map((cm, idx) => {
        const ly = 100 + idx * 54;
        return (
          <g key={cm}>
            <line
              x1={26}
              y1={ly}
              x2={358}
              y2={ly}
              stroke="#E3D9C7"
              strokeWidth={1.8}
            />
            <text
              x={32}
              y={ly - 6}
              fill="#A59684"
              fontFamily={monoFamily}
              fontSize={13}
            >
              {cm}
            </text>
          </g>
        );
      })}

      {/* Full-Body Suspect standing inside booth */}
      <FullBodyCharacter
        x={192}
        y={422}
        coatColor={coatColor}
        accentColor={accentColor}
        scale={1.08}
      />

      {/* Bottom Suspect Verdict Label */}
      <rect
        x={32}
        y={442}
        width={320}
        height={92}
        rx={12}
        fill="#EFE8DA"
        stroke={COLORS.divider}
        strokeWidth={2}
      />
      <text
        x={192}
        y={474}
        textAnchor="middle"
        fill={COLORS.maroonDark}
        fontFamily={monoFamily}
        fontSize={19}
        fontWeight={700}
        letterSpacing="0.08em"
      >
        ŞÜPHELİ {code}
      </text>
      <text
        x={192}
        y={506}
        textAnchor="middle"
        fill={COLORS.textMuted}
        fontFamily={monoFamily}
        fontSize={15}
        fontWeight={600}
      >
        {showQuestion ? "MÜEBBET İÇİN VARSAYIM YETMEZ" : "SİLAHLI ATEŞ · ÖLDÜRME KASTI"}
      </text>

      {/* KATİL Stamp */}
      {showStamps ? (
        <g
          transform={`translate(192, 232) rotate(${stampAngle}) scale(${
            1.35 - 0.35 * stampPop
          })`}
          opacity={stampPop}
        >
          <rect
            x={-124}
            y={-48}
            width={248}
            height={96}
            rx={12}
            fill={COLORS.maroonDark}
            stroke={COLORS.goldBright}
            strokeWidth={4}
          />
          <text
            x={0}
            y={14}
            textAnchor="middle"
            fill={COLORS.goldBright}
            fontFamily={monoFamily}
            fontSize={42}
            fontWeight={700}
            letterSpacing="0.14em"
          >
            KATİL
          </text>
        </g>
      ) : null}
    </g>
  );

  return (
    <svg width={888} height={650} viewBox="0 0 888 650">
      {renderBooth(26, "A", COLORS.maroon, COLORS.gold, -9)}
      {renderBooth(478, "B", COLORS.goldDark, COLORS.maroon, 9)}

      {/* Center Rotating / Pulsing Legal Conflict Medallion */}
      {showQuestion ? (
        <g
          transform={`translate(444, 290) scale(${questionPop})`}
          opacity={questionPop}
        >
          <circle
            cx={0}
            cy={0}
            r={92}
            fill={COLORS.maroonDark}
            stroke={COLORS.goldBright}
            strokeWidth={5}
          />
          <circle
            cx={0}
            cy={0}
            r={78}
            fill="none"
            stroke={COLORS.gold}
            strokeWidth={2}
            strokeDasharray="6 5"
          />
          <text
            x={0}
            y={20}
            textAnchor="middle"
            fill={COLORS.goldBright}
            fontFamily={playfairFamily}
            fontSize={92}
            fontWeight={700}
          >
            ?
          </text>
          <text
            x={0}
            y={52}
            textAnchor="middle"
            fill={COLORS.creamCard}
            fontFamily={monoFamily}
            fontSize={12.5}
            fontWeight={700}
            letterSpacing="0.1em"
          >
            VARSAYIM YASAK
          </text>
        </g>
      ) : null}
    </svg>
  );
};

// ============================================================================
// SCENE 2 (17.60s -> 25.30s): ISOLATED SHOOTERS & ANIMATED BARRIER SLAM
// ============================================================================
const Scene2Kavram: React.FC<{ t: number; fps: number }> = ({ t, fps }) => {
  const wallProg = spring({
    fps,
    frame: Math.max(0, Math.floor((t - 21.0) * fps)),
    config: { damping: 14, stiffness: 150 },
  });
  const bannerPop = spring({
    fps,
    frame: Math.max(0, Math.floor((t - 22.8) * fps)),
    config: { damping: 13, stiffness: 150 },
  });

  const renderPlanBlueprint = (cx: number, label: string, color: string) => (
    <g transform={`translate(${cx}, 102)`}>
      <rect
        x={-135}
        y={-44}
        width={270}
        height={88}
        rx={12}
        fill="#F1EAD9"
        stroke={color}
        strokeWidth={2.5}
      />
      {/* Bullseye target icon */}
      <circle cx={-92} cy={0} r={24} fill={COLORS.creamCard} stroke={color} strokeWidth={2.5} />
      <circle cx={-92} cy={0} r={12} fill="none" stroke={color} strokeWidth={2} />
      <circle cx={-92} cy={0} r={4} fill={color} />
      <text
        x={22}
        y={-6}
        textAnchor="middle"
        fill={color}
        fontFamily={monoFamily}
        fontSize={14}
        fontWeight={700}
        letterSpacing="0.06em"
      >
        {label}
      </text>
      <text
        x={22}
        y={18}
        textAnchor="middle"
        fill={COLORS.textMuted}
        fontFamily={monoFamily}
        fontSize={12.5}
        fontWeight={600}
      >
        BAĞIMSIZ KAST
      </text>
    </g>
  );

  return (
    <svg width={888} height={650} viewBox="0 0 888 650">
      <rect
        x={16}
        y={20}
        width={856}
        height={600}
        rx={22}
        fill={COLORS.creamCard}
        stroke={COLORS.maroon}
        strokeWidth={3}
      />

      {/* Left & Right Individual Blueprints */}
      {renderPlanBlueprint(195, "BİREYSEL PLAN #A", COLORS.maroon)}
      {renderPlanBlueprint(693, "BİREYSEL PLAN #B", COLORS.goldDark)}

      {/* Ground Line */}
      <line
        x1={56}
        y1={465}
        x2={832}
        y2={465}
        stroke={COLORS.divider}
        strokeWidth={3}
      />

      {/* Full-Body Fail A & Fail B standing separated */}
      <FullBodyCharacter
        x={195}
        y={465}
        coatColor={COLORS.maroon}
        accentColor={COLORS.gold}
        aimDirection="none"
        scale={0.95}
      />
      <FullBodyCharacter
        x={693}
        y={465}
        coatColor={COLORS.goldDark}
        accentColor={COLORS.maroon}
        aimDirection="none"
        scale={0.95}
      />

      {/* Severed Dashed Connection Lines */}
      <line
        x1={245}
        y1={315}
        x2={395}
        y2={315}
        stroke={COLORS.maroon}
        strokeWidth={3.5}
        strokeDasharray="8 6"
      />
      <line
        x1={493}
        y1={315}
        x2={643}
        y2={315}
        stroke={COLORS.goldDark}
        strokeWidth={3.5}
        strokeDasharray="8 6"
      />

      {/* Animated Vertical Isolation Barrier Slamming Down */}
      {t >= 20.95 ? (
        <g opacity={wallProg}>
          <rect
            x={436}
            y={interpolate(wallProg, [0, 1], [52, 52])}
            width={16}
            height={interpolate(wallProg, [0, 1], [20, 420])}
            rx={8}
            fill={COLORS.maroonDark}
            stroke={COLORS.goldBright}
            strokeWidth={2.5}
          />
          <g
            transform={`translate(444, 315) scale(${0.6 + 0.4 * wallProg})`}
          >
            <circle
              cx={0}
              cy={0}
              r={54}
              fill={COLORS.maroonDark}
              stroke={COLORS.goldBright}
              strokeWidth={4}
            />
            <line
              x1={-20}
              y1={-20}
              x2={20}
              y2={20}
              stroke={COLORS.goldBright}
              strokeWidth={6}
              strokeLinecap="round"
            />
            <line
              x1={20}
              y1={-20}
              x2={-20}
              y2={20}
              stroke={COLORS.goldBright}
              strokeWidth={6}
              strokeLinecap="round"
            />
          </g>
        </g>
      ) : null}

      {/* Bottom Legal Principle Banner */}
      <g
        transform={`translate(64, 495) scale(${0.92 + 0.08 * bannerPop})`}
        opacity={t >= 22.7 ? bannerPop : 0.7}
      >
        <rect
          x={0}
          y={0}
          width={760}
          height={86}
          rx={14}
          fill={COLORS.maroonDark}
          stroke={COLORS.goldBright}
          strokeWidth={2.5}
        />
        <text
          x={380}
          y={34}
          textAnchor="middle"
          fill={COLORS.goldBright}
          fontFamily={monoFamily}
          fontSize={16}
          fontWeight={700}
          letterSpacing="0.12em"
        >
          ORTAK PLAN YOK ➔ YAN YANA FAİLLİK (TCK m. 37)
        </text>
        <text
          x={380}
          y={64}
          textAnchor="middle"
          fill={COLORS.creamCard}
          fontFamily={playfairFamily}
          fontSize={20}
          fontWeight={600}
        >
          Habersiz hareket eden failler yalnızca kendi kanıtlanan fiilinden sorumludur.
        </text>
      </g>
    </svg>
  );
};

// ============================================================================
// LUXURY ORNATE SCALES OF JUSTICE COMPONENT
// ============================================================================
const LuxuryBalanceScale: React.FC<{
  tiltDeg: number;
  leftLabel: string;
  rightLabel: string;
  leftFill: string;
  rightFill: string;
}> = ({ tiltDeg, leftLabel, rightLabel, leftFill, rightFill }) => {
  const pivotX = 444;
  const pivotY = 165;
  const armHalf = 235;
  const rad = (tiltDeg * Math.PI) / 180;

  const leftTopX = pivotX - armHalf * Math.cos(rad);
  const leftTopY = pivotY + armHalf * Math.sin(rad);
  const rightTopX = pivotX + armHalf * Math.cos(rad);
  const rightTopY = pivotY - armHalf * Math.sin(rad);

  const renderLuxuryPan = (
    tx: number,
    ty: number,
    label: string,
    fill: string
  ) => {
    const panY = ty + 140;
    return (
      <g>
        <line
          x1={tx}
          y1={ty}
          x2={tx - 102}
          y2={panY}
          stroke={COLORS.goldDark}
          strokeWidth={3}
        />
        <line
          x1={tx}
          y1={ty}
          x2={tx}
          y2={panY}
          stroke={COLORS.goldDark}
          strokeWidth={1.8}
          strokeDasharray="4 4"
        />
        <line
          x1={tx}
          y1={ty}
          x2={tx + 102}
          y2={panY}
          stroke={COLORS.goldDark}
          strokeWidth={3}
        />
        <rect
          x={tx - 118}
          y={panY - 4}
          width={236}
          height={8}
          rx={4}
          fill={COLORS.gold}
          stroke={COLORS.maroonDark}
          strokeWidth={2}
        />
        <path
          d={`M ${tx - 114} ${panY + 4} Q ${tx} ${panY + 92} ${tx + 114} ${
            panY + 4
          } Z`}
          fill={fill}
          stroke={COLORS.maroonDark}
          strokeWidth={3.5}
        />
        <text
          x={tx}
          y={panY + 34}
          textAnchor="middle"
          fill={fill === COLORS.maroonDark ? COLORS.goldBright : COLORS.maroonDark}
          fontFamily={monoFamily}
          fontSize={16.5}
          fontWeight={700}
          letterSpacing="0.05em"
        >
          {label}
        </text>
      </g>
    );
  };

  return (
    <g>
      <rect
        x={314}
        y={496}
        width={260}
        height={22}
        rx={8}
        fill={COLORS.maroonDark}
        stroke={COLORS.gold}
        strokeWidth={2.5}
      />
      <rect
        x={354}
        y={476}
        width={180}
        height={20}
        rx={6}
        fill={COLORS.maroon}
        stroke={COLORS.gold}
        strokeWidth={2}
      />
      <rect
        x={428}
        y={155}
        width={32}
        height={322}
        rx={6}
        fill={COLORS.maroonDark}
        stroke={COLORS.gold}
        strokeWidth={2.5}
      />
      <line
        x1={444}
        y1={175}
        x2={444}
        y2={465}
        stroke={COLORS.gold}
        strokeWidth={2}
        opacity={0.55}
      />

      {renderLuxuryPan(leftTopX, leftTopY, leftLabel, leftFill)}
      {renderLuxuryPan(rightTopX, rightTopY, rightLabel, rightFill)}

      <g transform={`translate(${pivotX}, ${pivotY}) rotate(${-tiltDeg})`}>
        <rect
          x={-armHalf - 14}
          y={-10}
          width={(armHalf + 14) * 2}
          height={20}
          rx={10}
          fill={COLORS.maroonDark}
          stroke={COLORS.goldBright}
          strokeWidth={3}
        />
        <circle cx={-armHalf} cy={0} r={7} fill={COLORS.goldBright} />
        <circle cx={armHalf} cy={0} r={7} fill={COLORS.goldBright} />
      </g>

      <circle
        cx={pivotX}
        cy={pivotY}
        r={26}
        fill={COLORS.maroonDark}
        stroke={COLORS.goldBright}
        strokeWidth={4}
      />
      <circle cx={pivotX} cy={pivotY} r={12} fill={COLORS.gold} />
    </g>
  );
};

// ============================================================================
// SCENE 3 (25.30s -> 34.33s): FORENSIC LASER SCAN -> LUXURY SCALES OF JUSTICE
// ============================================================================
const Scene3Ispat: React.FC<{ t: number; fps: number }> = ({ t, fps }) => {
  const showScale = t >= 29.35;
  const scanX = interpolate(
    (t - 25.3) % 2.2,
    [0, 1.1, 2.2],
    [130, 758, 130]
  );
  const stampPop = spring({
    fps,
    frame: Math.max(0, Math.floor((t - 27.65) * fps)),
    config: { damping: 12, stiffness: 180 },
  });
  const scaleTilt = interpolate(t, [29.55, 31.3], [0, 12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const badgePop = spring({
    fps,
    frame: Math.max(0, Math.floor((t - 32.45) * fps)),
    config: { damping: 13, stiffness: 160 },
  });

  if (!showScale) {
    return (
      <svg width={888} height={650} viewBox="0 0 888 650">
        <rect
          x={44}
          y={25}
          width={800}
          height={585}
          rx={22}
          fill={COLORS.creamCard}
          stroke={COLORS.maroon}
          strokeWidth={3.2}
        />
        <rect
          x={44}
          y={25}
          width={800}
          height={68}
          rx={20}
          fill={COLORS.maroonDark}
        />
        <text
          x={444}
          y={67}
          textAnchor="middle"
          fill={COLORS.goldBright}
          fontFamily={monoFamily}
          fontSize={20}
          fontWeight={700}
          letterSpacing="0.14em"
        >
          ADLİ TIP · OTOPSİ &amp; BALİSTİK İNCELEME
        </text>

        {/* Fallen Victim Diagram on Autopsy Bed */}
        <FallenVictimEditorial x={444} y={168} scale={0.78} />

        {/* Bullet A & B Examination Table */}
        <g transform="translate(88, 250)">
          <rect
            x={0}
            y={0}
            width={325}
            height={195}
            rx={16}
            fill="#F1EAD9"
            stroke={COLORS.maroon}
            strokeWidth={2.5}
          />
          <text
            x={162}
            y={38}
            textAnchor="middle"
            fill={COLORS.maroon}
            fontFamily={monoFamily}
            fontSize={16}
            fontWeight={700}
          >
            MERMİ ÇEKİRDEĞİ #A
          </text>
          <g transform="translate(82, 66)">
            <rect
              x={0}
              y={0}
              width={90}
              height={42}
              rx={4}
              fill={COLORS.gold}
              stroke={COLORS.maroonDark}
              strokeWidth={3}
            />
            <path
              d="M 90 0 L 146 6 Q 172 21 146 36 L 90 42 Z"
              fill={COLORS.maroon}
              stroke={COLORS.maroonDark}
              strokeWidth={3}
            />
          </g>
          <text
            x={162}
            y={152}
            textAnchor="middle"
            fill={COLORS.textMuted}
            fontFamily={monoFamily}
            fontSize={14}
          >
            ÇAP: 9x19mm · ÖLDÜRÜCÜ İZ: ?
          </text>
        </g>

        <g transform="translate(475, 250)">
          <rect
            x={0}
            y={0}
            width={325}
            height={195}
            rx={16}
            fill="#F1EAD9"
            stroke={COLORS.goldDark}
            strokeWidth={2.5}
          />
          <text
            x={162}
            y={38}
            textAnchor="middle"
            fill={COLORS.maroon}
            fontFamily={monoFamily}
            fontSize={16}
            fontWeight={700}
          >
            MERMİ ÇEKİRDEĞİ #B
          </text>
          <g transform="translate(82, 66)">
            <rect
              x={0}
              y={0}
              width={90}
              height={42}
              rx={4}
              fill={COLORS.goldLight}
              stroke={COLORS.maroonDark}
              strokeWidth={3}
            />
            <path
              d="M 90 0 L 146 6 Q 172 21 146 36 L 90 42 Z"
              fill={COLORS.goldDark}
              stroke={COLORS.maroonDark}
              strokeWidth={3}
            />
          </g>
          <text
            x={162}
            y={152}
            textAnchor="middle"
            fill={COLORS.textMuted}
            fontFamily={monoFamily}
            fontSize={14}
          >
            ÇAP: 9x19mm · ÖLDÜRÜCÜ İZ: ?
          </text>
        </g>

        {/* Moving Forensic Gold Laser Scanner Beam (before stamp) */}
        {t < 27.65 ? (
          <g>
            <rect
              x={scanX - 24}
              y={112}
              width={48}
              height={342}
              fill="rgba(229, 200, 130, 0.22)"
            />
            <line
              x1={scanX}
              y1={112}
              x2={scanX}
              y2={454}
              stroke={COLORS.crimson}
              strokeWidth={3.5}
            />
          </g>
        ) : null}

        {/* Bottom Lab Conclusion */}
        <rect
          x={88}
          y={476}
          width={712}
          height={86}
          rx={14}
          fill="rgba(74, 28, 31, 0.07)"
          stroke={COLORS.maroon}
          strokeWidth={2}
        />
        <text
          x={444}
          y={525}
          textAnchor="middle"
          fill={COLORS.maroonDark}
          fontFamily={playfairFamily}
          fontSize={18.5}
          fontWeight={700}
        >
          Ölümcül yaranın hangi silahtan çıktığı bilimsel olarak kanıtlanamıyor.
        </text>

        {/* İSPATLANAMADI Stamp */}
        {t >= 27.65 ? (
          <g
            transform={`translate(444, 330) rotate(-6) scale(${
              1.35 - 0.35 * stampPop
            })`}
            opacity={stampPop}
          >
            <rect
              x={-235}
              y={-52}
              width={470}
              height={104}
              rx={14}
              fill={COLORS.maroonDark}
              stroke={COLORS.goldBright}
              strokeWidth={5}
            />
            <text
              x={0}
              y={14}
              textAnchor="middle"
              fill={COLORS.goldBright}
              fontFamily={monoFamily}
              fontSize={38}
              fontWeight={700}
              letterSpacing="0.12em"
            >
              İSPATLANAMADI
            </text>
          </g>
        ) : null}
      </svg>
    );
  }

  return (
    <svg width={888} height={650} viewBox="0 0 888 650">
      <LuxuryBalanceScale
        tiltDeg={scaleTilt}
        leftLabel="ŞÜPHE"
        rightLabel="SANIK LEHİNE"
        leftFill={COLORS.maroonDark}
        rightFill={COLORS.goldLight}
      />
      {t >= 32.45 ? (
        <g
          transform={`translate(444, 586) scale(${badgePop})`}
          opacity={badgePop}
        >
          <rect
            x={-330}
            y={-34}
            width={660}
            height={68}
            rx={14}
            fill={COLORS.maroonDark}
            stroke={COLORS.goldBright}
            strokeWidth={3}
          />
          <text
            x={0}
            y={8}
            textAnchor="middle"
            fill={COLORS.goldBright}
            fontFamily={monoFamily}
            fontSize={18}
            fontWeight={700}
            letterSpacing="0.09em"
          >
            IN DUBIO PRO REO · ŞÜPHEDEN SANIK YARARLANIR
          </text>
        </g>
      ) : null}
    </svg>
  );
};

// ============================================================================
// SCENE 4 (34.33s -> 43.34s): VERDICT DOCUMENT, SENTENCE DROP & SLAMMING PRISON BARS
// ============================================================================
const Scene4Sonuc: React.FC<{ t: number; fps: number }> = ({ t, fps }) => {
  const strikeProg = interpolate(t, [35.65, 36.45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const showBanner = t >= 37.8;
  const bannerPop = spring({
    fps,
    frame: Math.max(0, Math.floor((t - 37.8) * fps)),
    config: { damping: 14, stiffness: 160 },
  });
  const showPrison = t >= 39.9;
  const barsSlamProg = spring({
    fps,
    frame: Math.max(0, Math.floor((t - 40.35) * fps)),
    config: { damping: 12, stiffness: 170 },
  });

  const renderPrisonCell = (
    cx: number,
    label: string,
    coatColor: string,
    accentColor: string
  ) => (
    <g transform={`translate(${cx}, 365)`}>
      {/* Cell Frame */}
      <rect
        x={0}
        y={0}
        width={372}
        height={252}
        rx={16}
        fill={COLORS.creamCard}
        stroke={COLORS.maroonDark}
        strokeWidth={3}
      />
      {/* Left: Full-body Suspect inside Cell with Animated Slamming Prison Bars */}
      <g>
        <rect
          x={18}
          y={18}
          width={154}
          height={216}
          rx={10}
          fill="#EFE8DA"
          stroke={COLORS.divider}
          strokeWidth={2}
        />
        <FullBodyCharacter
          x={95}
          y={222}
          coatColor={coatColor}
          accentColor={accentColor}
          scale={0.76}
        />
        {/* Slamming Steel Prison Bars */}
        <g
          transform={`translate(0, ${interpolate(
            barsSlamProg,
            [0, 1],
            [-210, 0]
          )})`}
          opacity={barsSlamProg}
        >
          <rect
            x={18}
            y={18}
            width={154}
            height={10}
            rx={3}
            fill={COLORS.maroonDark}
          />
          {[38, 66, 95, 124, 152].map((bx) => (
            <line
              key={bx}
              x1={bx}
              y1={20}
              x2={bx}
              y2={232}
              stroke={COLORS.maroonDark}
              strokeWidth={6}
              strokeLinecap="round"
            />
          ))}
        </g>
      </g>

      {/* Right Verdict Telemetry */}
      <text
        x={270}
        y={68}
        textAnchor="middle"
        fill={COLORS.textMuted}
        fontFamily={monoFamily}
        fontSize={16}
        fontWeight={700}
        letterSpacing="0.06em"
      >
        {label}
      </text>
      <text
        x={270}
        y={124}
        textAnchor="middle"
        fill={COLORS.maroonDark}
        fontFamily={playfairFamily}
        fontSize={36}
        fontWeight={700}
      >
        13–20 Yıl
      </text>
      <rect
        x={192}
        y={152}
        width={156}
        height={38}
        rx={9}
        fill={coatColor}
      />
      <text
        x={270}
        y={177}
        textAnchor="middle"
        fill={COLORS.goldBright}
        fontFamily={monoFamily}
        fontSize={13.5}
        fontWeight={700}
      >
        TEŞEBBÜS CEZASI
      </text>
    </g>
  );

  return (
    <svg width={888} height={650} viewBox="0 0 888 650">
      {/* Top Verdict Card */}
      <g transform="translate(54, 18)">
        <rect
          x={0}
          y={0}
          width={780}
          height={210}
          rx={18}
          fill={COLORS.creamCard}
          stroke={COLORS.maroon}
          strokeWidth={3.2}
        />
        <rect
          x={0}
          y={0}
          width={780}
          height={48}
          rx={16}
          fill={COLORS.maroonDark}
        />
        <text
          x={390}
          y={31}
          textAnchor="middle"
          fill={COLORS.goldBright}
          fontFamily={monoFamily}
          fontSize={16.5}
          fontWeight={700}
          letterSpacing="0.14em"
        >
          MAHKEME HÜKMÜ · SUÇ VASFI DEĞİŞİKLİĞİ
        </text>

        <text
          x={390}
          y={108}
          textAnchor="middle"
          fill={COLORS.maroon}
          opacity={1 - 0.55 * strikeProg}
          fontFamily={playfairFamily}
          fontSize={42}
          fontWeight={700}
        >
          Kasten Öldürme (Müebbet)
        </text>
        {strikeProg > 0 ? (
          <line
            x1={115}
            y1={94}
            x2={115 + 550 * strikeProg}
            y2={94}
            stroke={COLORS.crimson}
            strokeWidth={6}
            strokeLinecap="round"
          />
        ) : null}

        {strikeProg > 0.2 ? (
          <g
            opacity={interpolate(strikeProg, [0.2, 1], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })}
          >
            <rect
              x={110}
              y={132}
              width={560}
              height={58}
              rx={12}
              fill="rgba(182, 146, 76, 0.18)"
              stroke={COLORS.goldDark}
              strokeWidth={2}
            />
            <text
              x={390}
              y={172}
              textAnchor="middle"
              fill={COLORS.maroonDark}
              fontFamily={playfairItalicFamily}
              fontStyle="italic"
              fontSize={36}
              fontWeight={600}
            >
              Kasten Öldürmeye Teşebbüs
            </text>
          </g>
        ) : null}
      </g>

      {/* Sentence Reduction Gauge Banner */}
      {showBanner ? (
        <g
          transform={`translate(54, 246) scale(${0.92 + 0.08 * bannerPop})`}
          opacity={bannerPop}
        >
          <rect
            x={0}
            y={0}
            width={780}
            height={98}
            rx={16}
            fill={COLORS.maroonDark}
            stroke={COLORS.goldBright}
            strokeWidth={3}
          />
          <text
            x={390}
            y={34}
            textAnchor="middle"
            fill={COLORS.goldLight}
            fontFamily={monoFamily}
            fontSize={14.5}
            fontWeight={700}
            letterSpacing="0.14em"
          >
            TCK m.81 &amp; m.35/2 UYARINCA HÜKMEDİLEN CEZA
          </text>
          <text
            x={390}
            y={76}
            textAnchor="middle"
            fill={showPrison ? COLORS.goldBright : COLORS.creamCard}
            fontFamily={playfairFamily}
            fontSize={34}
            fontWeight={700}
            letterSpacing="0.04em"
          >
            {showPrison
              ? "MÜEBBET YERİNE  ➔  13 – 20 YIL HAPİS"
              : "MÜEBBET HAPİS"}
          </text>
        </g>
      ) : null}

      {/* Two Prison Cells with Full-Body Characters & Slamming Bars */}
      {showPrison ? (
        <>
          {renderPrisonCell(54, "SANIK A", COLORS.maroon, COLORS.gold)}
          {renderPrisonCell(462, "SANIK B", COLORS.goldDark, COLORS.maroon)}
        </>
      ) : null}
    </svg>
  );
};

// ============================================================================
// SCENE 5 (43.34s -> 47.97s): CRIME SCENE SPOTLIGHT + 1 vs 0 PARADOX CARDS
// ============================================================================
const Scene5Paradoks: React.FC<{ t: number; fps: number }> = ({ t, fps }) => {
  const card1Pop = spring({
    fps,
    frame: Math.max(0, Math.floor((t - 43.45) * fps)),
    config: { damping: 14, stiffness: 150 },
  });
  const card2Pop = spring({
    fps,
    frame: Math.max(0, Math.floor((t - 45.4) * fps)),
    config: { damping: 14, stiffness: 150 },
  });

  return (
    <svg width={888} height={650} viewBox="0 0 888 650">
      {/* Top Crime Scene Spotlight Card */}
      <g transform="translate(44, 20)">
        <rect
          x={0}
          y={0}
          width={800}
          height={235}
          rx={20}
          fill={COLORS.creamCard}
          stroke={COLORS.maroon}
          strokeWidth={3}
        />
        {/* Dramatic Gold Spotlight Cone */}
        <polygon
          points="330,2 470,2 620,233 180,233"
          fill="rgba(229, 200, 130, 0.25)"
        />
        <text
          x={400}
          y={40}
          textAnchor="middle"
          fill={COLORS.textMuted}
          fontFamily={monoFamily}
          fontSize={16}
          fontWeight={700}
          letterSpacing="0.14em"
        >
          OLAY YERİ VE DOSYA BİLANÇOSU
        </text>
        {/* Fallen Victim inside Spotlight */}
        <FallenVictimEditorial x={400} y={168} scale={0.92} />

        {/* Yellow/Gold Forensic Evidence Tent Markers [1] & [2] */}
        <g transform="translate(175, 182)">
          <polygon
            points="-22,22 0,-18 22,22"
            fill={COLORS.goldBright}
            stroke={COLORS.maroonDark}
            strokeWidth={2.5}
          />
          <text
            x={0}
            y={15}
            textAnchor="middle"
            fill={COLORS.maroonDark}
            fontFamily={monoFamily}
            fontSize={16}
            fontWeight={700}
          >
            1
          </text>
        </g>
        <g transform="translate(625, 182)">
          <polygon
            points="-22,22 0,-18 22,22"
            fill={COLORS.goldBright}
            stroke={COLORS.maroonDark}
            strokeWidth={2.5}
          />
          <text
            x={0}
            y={15}
            textAnchor="middle"
            fill={COLORS.maroonDark}
            fontFamily={monoFamily}
            fontSize={16}
            fontWeight={700}
          >
            2
          </text>
        </g>
      </g>

      {/* Left Stat Card: 1 CENAZE */}
      <g
        transform={`translate(44, 282) scale(${0.88 + 0.12 * card1Pop})`}
        opacity={card1Pop}
      >
        <rect
          x={0}
          y={0}
          width={380}
          height={335}
          rx={22}
          fill={COLORS.creamCard}
          stroke={COLORS.maroon}
          strokeWidth={3.5}
        />
        <rect
          x={24}
          y={22}
          width={332}
          height={48}
          rx={10}
          fill="#EFE7D6"
        />
        <text
          x={190}
          y={53}
          textAnchor="middle"
          fill={COLORS.maroon}
          fontFamily={monoFamily}
          fontSize={18}
          fontWeight={700}
          letterSpacing="0.1em"
        >
          MADDİ GERÇEK
        </text>
        <text
          x={190}
          y={212}
          textAnchor="middle"
          fill={COLORS.maroonDark}
          fontFamily={playfairFamily}
          fontSize={152}
          fontWeight={700}
        >
          1
        </text>
        <text
          x={190}
          y={282}
          textAnchor="middle"
          fill={COLORS.maroon}
          fontFamily={monoFamily}
          fontSize={22}
          fontWeight={700}
          letterSpacing="0.08em"
        >
          CENAZE
        </text>
        <text
          x={190}
          y={310}
          textAnchor="middle"
          fill={COLORS.textMuted}
          fontFamily={monoFamily}
          fontSize={14.5}
        >
          Olay yerinde vefat gerçekleşti
        </text>
      </g>

      {/* Right Stat Card: 0 CİNAYET CEZASI */}
      {t >= 45.3 ? (
        <g
          transform={`translate(464, 282) scale(${0.88 + 0.12 * card2Pop})`}
          opacity={card2Pop}
        >
          <rect
            x={0}
            y={0}
            width={380}
            height={335}
            rx={22}
            fill={COLORS.maroonDark}
            stroke={COLORS.goldBright}
            strokeWidth={3.5}
          />
          <rect
            x={24}
            y={22}
            width={332}
            height={48}
            rx={10}
            fill="rgba(229, 200, 130, 0.14)"
          />
          <text
            x={190}
            y={53}
            textAnchor="middle"
            fill={COLORS.goldBright}
            fontFamily={monoFamily}
            fontSize={18}
            fontWeight={700}
            letterSpacing="0.1em"
          >
            HUKUKİ KARAR
          </text>
          <text
            x={190}
            y={212}
            textAnchor="middle"
            fill={COLORS.goldBright}
            fontFamily={playfairFamily}
            fontSize={152}
            fontWeight={700}
          >
            0
          </text>
          <text
            x={190}
            y={282}
            textAnchor="middle"
            fill={COLORS.creamCard}
            fontFamily={monoFamily}
            fontSize={22}
            fontWeight={700}
            letterSpacing="0.08em"
          >
            CİNAYET CEZASI
          </text>
          <text
            x={190}
            y={310}
            textAnchor="middle"
            fill={COLORS.goldLight}
            fontFamily={monoFamily}
            fontSize={14.5}
          >
            Yalnızca teşebbüs hükmü kuruldu
          </text>
        </g>
      ) : null}
    </svg>
  );
};

// ============================================================================
// SCENE 6 (47.97s -> 55.64s): SCALE, COMMENT CALLOUT & @hukukla.app CTA
// ============================================================================
const Scene6Sence: React.FC<{ t: number; fps: number }> = ({ t, fps }) => {
  const scaleTilt = interpolate(t, [48.0, 49.4], [0, 9], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bubblePop = spring({
    fps,
    frame: Math.max(0, Math.floor((t - 51.05) * fps)),
    config: { damping: 13, stiffness: 160 },
  });
  const ctaPop = spring({
    fps,
    frame: Math.max(0, Math.floor((t - 52.55) * fps)),
    config: { damping: 13, stiffness: 150 },
  });

  return (
    <svg width={888} height={650} viewBox="0 0 888 650">
      <LuxuryBalanceScale
        tiltDeg={scaleTilt}
        leftLabel="ADİL"
        rightLabel="ADALETSİZ"
        leftFill={COLORS.goldLight}
        rightFill={COLORS.creamCard}
      />

      {t >= 51.0 ? (
        <g
          transform={`translate(625, 468) scale(${bubblePop})`}
          opacity={bubblePop}
        >
          <path
            d="M -185 -38 H 185 A 14 14 0 0 1 199 -24 V 20 A 14 14 0 0 1 185 34 H -65 L -102 60 L -88 34 H -185 A 14 14 0 0 1 -199 20 V -24 A 14 14 0 0 1 -185 -38 Z"
            fill={COLORS.creamCard}
            stroke={COLORS.maroonDark}
            strokeWidth={3.5}
            strokeLinejoin="round"
          />
          <text
            x={0}
            y={6}
            textAnchor="middle"
            fill={COLORS.maroonDark}
            fontFamily={playfairFamily}
            fontSize={24}
            fontWeight={700}
          >
            Hükmünü yorumlara yaz
          </text>
        </g>
      ) : null}

      {t >= 52.5 ? (
        <g
          transform={`translate(444, 588) scale(${ctaPop})`}
          opacity={ctaPop}
        >
          <rect
            x={-290}
            y={-48}
            width={580}
            height={96}
            rx={22}
            fill={COLORS.maroonDark}
            stroke={COLORS.goldBright}
            strokeWidth={3}
          />
          <rect
            x={-266}
            y={-32}
            width={64}
            height={64}
            rx={16}
            fill={COLORS.creamCard}
            stroke={COLORS.gold}
            strokeWidth={2}
          />
          <line
            x1={-234}
            y1={-18}
            x2={-234}
            y2={18}
            stroke={COLORS.maroonDark}
            strokeWidth={3}
            strokeLinecap="round"
          />
          <line
            x1={-250}
            y1={-8}
            x2={-218}
            y2={-8}
            stroke={COLORS.maroonDark}
            strokeWidth={2.8}
            strokeLinecap="round"
          />
          <path
            d="M -255 5 Q -250 13 -245 5 Z"
            fill={COLORS.gold}
            stroke={COLORS.maroonDark}
            strokeWidth={2}
          />
          <path
            d="M -223 5 Q -218 13 -213 5 Z"
            fill={COLORS.gold}
            stroke={COLORS.maroonDark}
            strokeWidth={2}
          />
          <line
            x1={-244}
            y1={18}
            x2={-224}
            y2={18}
            stroke={COLORS.maroonDark}
            strokeWidth={3}
            strokeLinecap="round"
          />

          <text
            x={28}
            y={-6}
            textAnchor="middle"
            fill={COLORS.goldBright}
            fontFamily={monoFamily}
            fontSize={22}
            fontWeight={700}
            letterSpacing="0.08em"
          >
            + TAKİP ET · @gyskamu
          </text>
          <text
            x={28}
            y={26}
            textAnchor="middle"
            fill={COLORS.creamCard}
            fontFamily={playfairFamily}
            fontSize={23}
            fontWeight={600}
          >
            Her gün hayat kurtaran bir memur dosyası
          </text>
        </g>
      ) : null}
    </svg>
  );
};

const BEAT_META = [
  {
    eyebrow: "CEZA HUKUKU · YAN YANA FAİLLİK",
    stageTitle: "OLAY YERİ ANALİZİ",
    footer: "TCK m.35 · m.37 · m.81",
    renderTitle: () => (
      <>
        İki silah patladı.{" "}
        <span
          style={{
            fontFamily: playfairItalicFamily,
            fontStyle: "italic",
            fontWeight: 400,
            color: COLORS.goldDark,
          }}
        >
          Katil
        </span>{" "}
        kim?
      </>
    ),
  },
  {
    eyebrow: "İLK YANIT",
    stageTitle: "ŞÜPHELİ SORGU DOSYALARI",
    footer: "TCK m.35 · m.37 · m.81",
    renderTitle: () => (
      <>
        İlk yanıt:{" "}
        <span
          style={{
            fontFamily: playfairItalicFamily,
            fontStyle: "italic",
            fontWeight: 400,
            color: COLORS.goldDark,
          }}
        >
          ikisi de mi?
        </span>
      </>
    ),
  },
  {
    eyebrow: "KAVRAM",
    stageTitle: "MÜŞTEREK KARAR TESTİ",
    footer: "TCK m.37 · MÜŞTEREK FAİLLİK BİRLİKTE KARAR GEREKTİRİR",
    renderTitle: () => (
      <>
        Ortak bir plan{" "}
        <span
          style={{
            fontFamily: playfairItalicFamily,
            fontStyle: "italic",
            fontWeight: 400,
            color: COLORS.goldDark,
          }}
        >
          yok.
        </span>
      </>
    ),
  },
  {
    eyebrow: "İSPAT",
    stageTitle: "BALİSTİK & ADALET TERAZİSİ",
    footer: "IN DUBIO PRO REO · ŞÜPHEDEN SANIK YARARLANIR",
    renderTitle: () => (
      <>
        Ölüm hangi{" "}
        <span
          style={{
            fontFamily: playfairItalicFamily,
            fontStyle: "italic",
            fontWeight: 400,
            color: COLORS.goldDark,
          }}
        >
          namludan
        </span>
        <br />
        çıktı?
      </>
    ),
  },
  {
    eyebrow: "SONUÇ",
    stageTitle: "MAHKEME HÜKMÜ",
    footer: "TCK m.81 · m.35/2 · MÜEBBET YERİNE 13-20 YIL",
    renderTitle: () => (
      <>
        Müebbet değil,{" "}
        <span
          style={{
            fontFamily: playfairItalicFamily,
            fontStyle: "italic",
            fontWeight: 400,
            color: COLORS.goldDark,
          }}
        >
          teşebbüs.
        </span>
      </>
    ),
  },
  {
    eyebrow: "PARADOKS",
    stageTitle: "DOSYA BİLANÇOSU",
    footer: "TCK m.35 · m.37 · m.81",
    renderTitle: () => (
      <>
        Bir cenaze,{" "}
        <span
          style={{
            fontFamily: playfairItalicFamily,
            fontStyle: "italic",
            fontWeight: 400,
            color: COLORS.goldDark,
          }}
        >
          sıfır
        </span>
        <br />
        cinayet cezası.
      </>
    ),
  },
  {
    eyebrow: "SENCE?",
    stageTitle: "KAMUOYU VİCDANI",
    footer: "BİLGİLENDİRME AMAÇLIDIR, HUKUKİ TAVSİYE DEĞİLDİR.",
    renderTitle: () => (
      <>
        Adaleti mi korur,{" "}
        <span
          style={{
            fontFamily: playfairItalicFamily,
            fontStyle: "italic",
            fontWeight: 400,
            color: COLORS.goldDark,
          }}
        >
          suçluyu
        </span>{" "}
        mu?
      </>
    ),
  },
];

export const GyskamuVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Determine active beat (0..6)
  let activeBeat = 0;
  for (let i = 0; i < timelineData.beats.length; i++) {
    if (t >= timelineData.beats[i].start) {
      activeBeat = i;
    }
  }

  const beatInfo = timelineData.beats[activeBeat];
  const beatEnterOpacity = interpolate(
    t,
    [beatInfo.start, beatInfo.start + 0.2],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const beatProgress = interpolate(
    t,
    [beatInfo.start, beatInfo.end],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const overallProgress = interpolate(
    t,
    [0, timelineData.totalDuration],
    [0, 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  let activeChunk = timelineData.segments[0].sub_chunks[0];
  for (const seg of timelineData.segments) {
    for (const chunk of seg.sub_chunks) {
      if (t >= chunk.start && t <= chunk.end + 0.25) {
        activeChunk = chunk;
      }
    }
  }

  const meta = BEAT_META[activeBeat];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg,
        backgroundImage: `
          linear-gradient(to right, ${COLORS.grid} 1.2px, transparent 1.2px),
          linear-gradient(to bottom, ${COLORS.grid} 1.2px, transparent 1.2px)
        `,
        backgroundSize: "108px 108px",
        paddingLeft: 96,
        paddingRight: 96,
        boxSizing: "border-box",
      }}
    >
      <Audio src={staticFile("audio/master_audio.mp3")} />

      {/* Double-Bordered Luxury Legal Dossier Frame */}
      <div
        style={{
          position: "absolute",
          top: 140,
          left: 48,
          right: 48,
          bottom: 215,
          border: `2px solid rgba(74, 28, 31, 0.22)`,
          borderRadius: 32,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 150,
          left: 58,
          right: 58,
          bottom: 225,
          border: `1px solid rgba(182, 146, 76, 0.45)`,
          borderRadius: 26,
          pointerEvents: "none",
        }}
      />

      {/* 1. Top Header Bar (@hukukla.app + Luxury DOSYA NO: 1 Plaque) */}
      <div
        style={{
          marginTop: 190,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: `linear-gradient(135deg, ${COLORS.maroonDark} 0%, ${COLORS.maroon} 100%)`,
              border: `2px solid ${COLORS.goldBright}`,
              boxShadow: "0 6px 16px rgba(43, 15, 18, 0.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width={30} height={30} viewBox="0 0 24 24" fill="none">
              <line
                x1="12"
                y1="4"
                x2="12"
                y2="20"
                stroke="#FAF6F0"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <line
                x1="5"
                y1="8"
                x2="19"
                y2="8"
                stroke="#FAF6F0"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <path
                d="M3.5 14.5L5.5 8.5L7.5 14.5C6.3 15.8 4.7 15.8 3.5 14.5Z"
                fill={COLORS.goldBright}
                stroke="#FAF6F0"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
              <path
                d="M16.5 14.5L18.5 8.5L20.5 14.5C19.3 15.8 17.7 15.8 16.5 14.5Z"
                fill={COLORS.goldBright}
                stroke="#FAF6F0"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
              <line
                x1="8"
                y1="20"
                x2="16"
                y2="20"
                stroke="#FAF6F0"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontFamily: monoFamily,
                fontSize: 25,
                fontWeight: 700,
                letterSpacing: "0.04em",
                color: COLORS.maroonDark,
              }}
            >
              @gyskamu
            </span>
            <span
              style={{
                fontFamily: monoFamily,
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.14em",
                color: COLORS.goldDark,
                marginTop: 2,
              }}
            >
              MEMUR HAKLARI &amp; MEVZUAT ARŞİVİ
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: `linear-gradient(135deg, ${COLORS.maroonDark} 0%, ${COLORS.maroon} 100%)`,
            border: `2px solid ${COLORS.goldBright}`,
            borderRadius: 12,
            padding: "10px 20px",
            boxShadow: "0 4px 12px rgba(43, 15, 18, 0.15)",
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              transform: "rotate(45deg)",
              backgroundColor: COLORS.goldBright,
            }}
          />
          <span
            style={{
              fontFamily: monoFamily,
              fontSize: 19,
              fontWeight: 700,
              letterSpacing: "0.1em",
              color: COLORS.goldBright,
            }}
          >
            DOSYA NO: 1
          </span>
        </div>
      </div>

      {/* 2. LUXURY GOLD & ESPRESSO PROGRESS DASHBOARD */}
      <div
        style={{
          marginTop: 22,
          width: "100%",
          background: `linear-gradient(135deg, ${COLORS.maroonDark} 0%, #3E1619 100%)`,
          borderRadius: 18,
          padding: "14px 22px 16px 22px",
          border: `2px solid ${COLORS.gold}`,
          boxShadow: "0 10px 24px rgba(43, 15, 18, 0.16)",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 11,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                fontFamily: monoFamily,
                fontSize: 14,
                fontWeight: 700,
                color: COLORS.maroonDark,
                backgroundColor: COLORS.goldBright,
                padding: "2px 9px",
                borderRadius: 5,
                letterSpacing: "0.08em",
              }}
            >
              BÖLÜM 0{activeBeat + 1}/07
            </span>
            <span
              style={{
                fontFamily: monoFamily,
                fontSize: 15,
                fontWeight: 700,
                color: COLORS.creamCard,
                letterSpacing: "0.12em",
              }}
            >
              {meta.stageTitle}
            </span>
          </div>
          <span
            style={{
              fontFamily: monoFamily,
              fontSize: 15,
              fontWeight: 700,
              color: COLORS.goldBright,
              letterSpacing: "0.08em",
            }}
          >
            %{Math.round(overallProgress)} TAMAMLANDI
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {[0, 1, 2, 3, 4, 5, 6].map((i) => {
            const isCompleted = i < activeBeat;
            const isActive = i === activeBeat;
            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: 9,
                  borderRadius: 5,
                  backgroundColor: "rgba(255, 255, 255, 0.12)",
                  border: isActive
                    ? `1px solid ${COLORS.goldBright}`
                    : "1px solid rgba(212, 190, 141, 0.25)",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                {isCompleted ? (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      background: `linear-gradient(90deg, ${COLORS.goldDark} 0%, ${COLORS.gold} 100%)`,
                    }}
                  />
                ) : null}
                {isActive ? (
                  <div
                    style={{
                      width: `${Math.max(10, beatProgress * 100)}%`,
                      height: "100%",
                      background: `linear-gradient(90deg, ${COLORS.gold} 0%, ${COLORS.goldBright} 100%)`,
                      boxShadow: `0 0 10px ${COLORS.goldBright}`,
                    }}
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Section Eyebrow & Main Headline */}
      <div
        style={{
          marginTop: 20,
          minHeight: 175,
          opacity: beatEnterOpacity,
        }}
      >
        <div
          style={{
            fontFamily: monoFamily,
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: "0.14em",
            color: COLORS.goldDark,
            marginBottom: 8,
          }}
        >
          ◆ {meta.eyebrow}
        </div>
        <div
          style={{
            fontFamily: playfairFamily,
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.09,
            color: COLORS.maroonDark,
          }}
        >
          {meta.renderTitle()}
        </div>
      </div>

      {/* 4. Center Stage Full-Body Action Canvas */}
      <div
        style={{
          width: 888,
          height: 650,
          opacity: beatEnterOpacity,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {activeBeat === 0 && <Scene0Hook t={t} fps={fps} />}
        {activeBeat === 1 && <Scene1Mugshots t={t} fps={fps} />}
        {activeBeat === 2 && <Scene2Kavram t={t} fps={fps} />}
        {activeBeat === 3 && <Scene3Ispat t={t} fps={fps} />}
        {activeBeat === 4 && <Scene4Sonuc t={t} fps={fps} />}
        {activeBeat === 5 && <Scene5Paradoks t={t} fps={fps} />}
        {activeBeat === 6 && <Scene6Sence t={t} fps={fps} />}
      </div>

      {/* 5. Legal Reference Footer */}
      <div style={{ marginTop: 12, width: "100%" }}>
        <div
          style={{
            width: "100%",
            height: 2,
            backgroundColor: COLORS.divider,
          }}
        />
        <div
          style={{
            marginTop: 12,
            fontFamily: monoFamily,
            fontSize: 17,
            fontWeight: 600,
            letterSpacing: "0.08em",
            color: COLORS.textMuted,
          }}
        >
          {meta.footer}
        </div>
      </div>

      {/* 6. Bottom Luxury Subtitle Box */}
      <div
        style={{
          marginTop: 24,
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            background: `linear-gradient(135deg, ${COLORS.maroonDark} 0%, ${COLORS.maroon} 100%)`,
            borderRadius: 16,
            padding: "20px 38px",
            border: `2px solid ${COLORS.gold}`,
            boxShadow: `6px 6px 0px ${COLORS.goldLight}`,
            maxWidth: 820,
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontFamily: playfairFamily,
              fontSize: 36,
              fontWeight: 700,
              lineHeight: 1.28,
            }}
          >
            {activeChunk.words.map((w, idx) => {
              const isHighlighted = activeChunk.highlight.includes(idx);
              return (
                <span
                  key={idx}
                  style={{
                    color: isHighlighted ? COLORS.subActive : COLORS.subMuted,
                    marginRight: idx < activeChunk.words.length - 1 ? 11 : 0,
                  }}
                >
                  {w}
                </span>
              );
            })}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
