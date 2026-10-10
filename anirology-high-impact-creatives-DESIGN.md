---
version: "anirology-2026-10-10"
name: "Anirology - High-Impact Creatives"
description: "AniroLogy's conversion-focused creative-services and pricing system, expressed through an editorial off-white, charcoal, and acid-lime visual language."
colors:
  primary: "#C8F74A"
  secondary: "#151614"
  accent: "#C8F74A"
  background: "#F7F8EE"
  surface: "#FEFFF8"
  text-primary: "#151614"
  text-secondary: "#596056"
  border: "#B8BDB1"
typography:
  display-lg:
    fontFamily: "Space Grotesk"
    fontSize: "64px"
    fontWeight: 500
    lineHeight: "1.04"
    letterSpacing: "0"
  body-md:
    fontFamily: "DM Sans"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "1.6"
  label-md:
    fontFamily: "JetBrains Mono"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: "1.2"
spacing:
  base: "8px"
  gap: "16px"
  card-padding: "24px"
  section-padding: "80px"
rounded:
  card: "16px"
  control: "8px"
  pill: "9999px"
components:
  card:
    background: "Use the surface token with subtle borders and HTML-matched shadow depth"
    radius: "Match the declared card radius token"
  button:
    background: "Use primary or accent colors for the main action"
    radius: "Use the control or pill radius based on the source HTML"
---
# Nexura - High-Impact Creatives
Source: Neuform staff featured templates. Author: Sakura DesignCode (@sakura-designcode). Views: 83; favorites: 10; remixes: 3.
Tags: pricing, section, animated, cta, bento, billing.
## Overview
Nexura High Pricing Section is designed for comparing plans and supporting conversion decisions. Key features include plan comparison blocks and conversion-oriented actions. It is suitable for subscription pricing pages and plan comparison experiences.

Nexura Services Pricing Projects About See reviews Book a call High-performance ad creatives that drive growth Experience an agency-grade creative partnership focused on producing high-converting static ads and UGC that…
## Composition
Use the attached HTML reference as the source of truth. Preserve the visible hierarchy, first-screen composition, section rhythm, density, and interaction tone before adapting copy or content.
Key visible headings include: High-performance ad creatives that drive growth; Tasks; Q4 Holiday Campaign Assets; Email Banner Fall Promo; UGC Video Editing Batch 1; Social Media Carousel.
## Colors
Anchor the palette in primary #2D8CFF, secondary #262A34, accent #2D8CFF, background #0B0F19, surface #262A34, text-primary #FFFFFF. Keep background, surface, text, and border roles distinct so generated layouts retain the same contrast pattern as the source.
## Typography
Use DotGothic16 for display moments and JetBrains Mono for body copy unless the HTML clearly demands a compatible fallback. Labels and technical metadata should use JetBrains Mono or an equivalent mono face.
## Layout
Keep spacing deliberate and stable. Favor the same grid direction, max-width behavior, card density, and responsive stacking seen in the HTML. Do not replace distinctive source structures with generic SaaS sections.
## Components
Authentication and CTA controls should preserve the source button hierarchy, input density, and focused conversion path.
## Motion
Preserve existing motion cues such as masked reveals, staggered entrance, hover lift, scroll-triggered transitions, and ambient movement. Keep easing smooth and restrained.
## WebGL & Effects

If the source includes canvas, WebGL, Three.js, gradients, particles, or atmospheric effects, rebuild them as supporting layers behind the content. Keep effects performant, responsive, and secondary to the interface.

## Guardrails
- Do not flatten the source into a generic card grid.
- Do not swap the color mode unless the source clearly supports it.
- Preserve the first viewport signal, focal object, and visual density.
- Keep buttons, cards, and badges aligned to the same radius and border language.

## AniroLogy Design Direction

**Design read:** creative-services landing and pricing for design-conscious clients. It should feel like a working creative notebook, not a generic SaaS dashboard. Use bold charcoal ink on paper-like off-white fields; let the lime accent signal action, connection, and selected state.

**Layout:** use a 1400px content shell, `clamp(20px, 4vw, 64px)` gutters, and `clamp(72px, 12vw, 176px)` major section spacing. Lead with a left-aligned or split hero, one primary CTA, and a real proof object such as a creator portrait, campaign board, edit timeline, or project still. Alternate editorial image/text splits, asymmetric project grids, proof rails, and a lime-connected process sequence. Never use a centered hero or a repeated three-equal-card row.

**Type:** use Space Grotesk for display, DM Sans for body copy, and JetBrains Mono only for labels, deliverables, dates, and plan parameters. Keep display type tight and controlled; body copy has a 65ch maximum measure. Use direct, maker-led copy with real deliverables and outcomes. Avoid generic agency phrases such as “elevate,” “seamless,” “next-gen,” and “unlock.”

**Components:** primary buttons are lime with ink text, 44px minimum height, 8px radius, and a 1px tactile active press. Secondary buttons are transparent or clean-surface with a structural border. Use 18px-radius cards only where elevation establishes hierarchy; prefer negative space and hairline dividers elsewhere. Pricing must expose scope, turnaround, revision, and handoff details, with the featured plan signalled by lime wash and an ink border rather than a giant badge.

**Imagery and motion:** use real people, project artifacts, camera frames, and documentary-style crops. Thin route lines, arrows, cross marks, and loose circles may annotate a real idea, but cannot become decoration. Use 400-600ms staggered reveals, a one-time route-line draw, and a 1.02 image hover scale. Animate only transform and opacity; respect reduced motion. Never use looping decorative animation, glows, fake device mockups, or image-overlay pills.

**Responsive and accessibility:** collapse all multi-column layouts below 768px, keep body type at least 16px, and make touch targets at least 44px. Use `min-height: 100dvh`, never `height: 100vh`. Ink on paper and ink on lime are the standard accessible text pairings; never signal status with lime alone.

**Banned:** Nexura's navy/electric-blue visual language, pure black, gradients, neon glows, Inter, generic serif fonts, emojis, custom cursors, excessive pills, card-inside-card layouts, overlapping content, scroll prompts, and anonymous placeholder brands.
