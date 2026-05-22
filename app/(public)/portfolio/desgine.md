---
name: Ultra-Dark Architectural Cinema
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#e0c0b1'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#a78b7d'
  outline-variant: '#584237'
  surface-tint: '#ffb690'
  primary: '#ffb690'
  on-primary: '#552100'
  primary-container: '#f97316'
  on-primary-container: '#582200'
  inverse-primary: '#9d4300'
  secondary: '#ffb869'
  on-secondary: '#482900'
  secondary-container: '#8f5600'
  on-secondary-container: '#ffdab5'
  tertiary: '#93ccff'
  on-tertiary: '#003351'
  tertiary-container: '#00a2f4'
  on-tertiary-container: '#003554'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdbca'
  primary-fixed-dim: '#ffb690'
  on-primary-fixed: '#341100'
  on-primary-fixed-variant: '#783200'
  secondary-fixed: '#ffdcbb'
  secondary-fixed-dim: '#ffb869'
  on-secondary-fixed: '#2c1700'
  on-secondary-fixed-variant: '#673d00'
  tertiary-fixed: '#cde5ff'
  tertiary-fixed-dim: '#93ccff'
  on-tertiary-fixed: '#001d32'
  on-tertiary-fixed-variant: '#004b74'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 80px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  display-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0.01em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1440px
  gutter: 32px
  margin-desktop: 64px
  margin-mobile: 24px
---

## Brand & Style

The design system is rooted in the concept of "Architectural Cinema." It prioritizes the visual impact of interior photography by receding the UI into an ultra-dark, sophisticated background. The personality is exclusive, precise, and authoritative, mirroring the high-end craftsmanship of premium interior design. 

By blending **Minimalism** with **Glassmorphism**, the design system creates a sense of depth and physical presence. The interface does not merely sit on top of content; it floats within a volumetric space, utilizing subtle light leaks and reflections to guide the user's eye. The emotional response is one of calm, quiet luxury—removing digital noise to focus on the artistry of the physical environment.

## Colors

The palette is defined by an "Ultra Dark" foundation, utilizing an almost-black `#050505` to provide infinite depth. Secondary surfaces use `#0B0B0B` to create subtle separation without breaking the immersion. 

The primary accent, **Vivid Orange**, acts as a functional light source within the UI, signifying action and importance. The **Warm Glow** secondary accent is reserved for ambient lighting effects, such as radial gradients that mimic the soft spill of a high-end light fixture. Gradients should be used sparingly as "glows" rather than fills, maintaining a high-contrast relationship between the darkness and the light.

## Typography

This design system employs a high-contrast typographic hierarchy. **Hanken Grotesk** is used for headings to provide a sharp, contemporary, and architectural feel. Its geometric precision conveys a sense of modern engineering and design rigor. 

For body copy and functional text, **Inter** provides maximum legibility and a systematic, clean aesthetic. Display sizes use tight letter-spacing and heavy weights to create "visual anchors" on the screen, while labels are often set in all-caps with generous tracking to evoke the feel of blueprints or architectural signage.

## Layout & Spacing

The layout philosophy follows a **Fixed Grid** model for desktop to ensure a curated, editorial experience. A 12-column grid is used with wide 32px gutters to allow the UI elements significant "breathing room," reflecting the spaciousness of luxury interiors. 

Whitespace is treated as a premium asset. Content should be grouped into distinct horizontal bands that utilize vertical margins of 128px or more to separate different "moods" or project galleries. On mobile, the grid transitions to 4 columns with reduced margins, focusing on a singular, vertical flow of high-impact imagery.

## Elevation & Depth

Depth in the design system is achieved through **Glassmorphism** and **Ambient Glows** rather than traditional shadows. 

1.  **Base Layer:** The `#050505` background represents the furthest plane.
2.  **Surface Layer:** Secondary containers use a subtle tint or the `glass_surface` token with a `20px` backdrop blur.
3.  **Reflections:** Glass surfaces must have a 1px top-border with `glass_border` to simulate a "specular highlight" on the edge of a glass pane.
4.  **Luminosity:** Primary interactive elements or focused sections are highlighted by a large, low-opacity radial gradient of `#F97316` positioned behind the layer, creating a volumetric "halo" effect.

## Shapes

The shape language is "Soft" yet disciplined. While luxury often leans into hard edges, this design system uses a 0.25rem (4px) base radius to mirror the subtle beveling found in high-end furniture and architectural finishing. 

Larger containers (Cards, Modals) use `rounded-lg` (8px) to feel substantial and "heavy." Circular shapes are reserved strictly for iconic elements or specific navigational toggles to maintain the predominantly rectangular, structural rhythm of the layout.

## Components

### Buttons
Buttons should feel "heavy" and tactile. The **Primary Button** is a solid `#F97316` with black text, using a bold weight and no shadow—the color itself provides the "light." **Secondary Buttons** use the glassmorphic style with a subtle white border and a hover effect that increases the backdrop blur opacity.

### Input Fields
Inputs are minimal, featuring only a bottom border in the default state. Upon focus, they expand into a glassmorphic container with a soft orange glow emanating from the bottom-left corner.

### Cards
Cards are the primary vehicle for architectural photography. They should feature no visible borders in their default state, only a subtle gradient overlay at the bottom for text legibility. On hover, a 1px glass border appears, and the image scales slightly (1.05x) with a slow, elegant transition (600ms).

### Chips & Tags
Tags are used for material types (e.g., "Marble," "Oak"). These are styled as "Ghost" elements: transparent backgrounds with white text and a `0.5px` border at 20% opacity.

### Navigation
The main navigation should be a persistent glassmorphic bar at the top or bottom, utilizing `backdrop-filter: blur(20px)` to allow the interior visualizations to bleed through as the user scrolls.