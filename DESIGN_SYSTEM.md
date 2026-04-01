# 🎨 FITPRO - UI/UX DESIGN SYSTEM

## 🎯 Brand Identity

**Core Values:**
- Premium Quality
- Strength & Power
- Authenticity
- Performance-Driven
- Rugged Masculinity

**Target Audience:**
- Fitness enthusiasts (18-45 years)
- Bodybuilders & athletes
- Gym-goers seeking premium supplements
- Health-conscious individuals

---

## 🎨 Color Palette

### Primary Colors
```css
/* Burnt Orange - Primary Brand Color */
--primary-50: #fef6ee;
--primary-100: #fce9d3;
--primary-500: #e8640f; /* Main */
--primary-600: #d94a05;
--primary-900: #75270e;

/* Dark - Background & Text */
--dark-700: #434343;
--dark-800: #2d2d2d; /* Matte Black */
--dark-900: #1a1a1a; /* Deep Black */
```

### Secondary Colors
```css
/* Concrete Gray */
--concrete-500: #6b7280;
--concrete-800: #262626;

/* Metallic */
--silver: #c0c0c0;
--steel: #71797E;
--iron: #3d3d3d;
```

### Semantic Colors
```css
/* Success */
--success: #10b981;

/* Error */
--error: #ef4444;

/* Warning */
--warning: #f59e0b;

/* Info */
--info: #3b82f6;
```

---

## 📝 Typography

### Font Families
```css
/* Display - Headers & Titles */
font-family: 'Bebas Neue', Impact, sans-serif;
font-weight: 700-900;
letter-spacing: 0.05em;

/* Body - Content */
font-family: 'Inter', system-ui, sans-serif;
font-weight: 400-700;

/* Mono - Code & Data */
font-family: 'Roboto Mono', monospace;
```

### Font Scales
```css
/* Display Sizes */
--display-lg: 4.5rem / 72px (900 weight)
--display-md: 3.5rem / 56px (900 weight)
--display-sm: 2.5rem / 40px (800 weight)

/* Heading Sizes */
--h1: 2.25rem / 36px (700 weight)
--h2: 1.875rem / 30px (700 weight)
--h3: 1.5rem / 24px (600 weight)
--h4: 1.25rem / 20px (600 weight)

/* Body Sizes */
--body-lg: 1.125rem / 18px (400 weight)
--body-md: 1rem / 16px (400 weight)
--body-sm: 0.875rem / 14px (400 weight)
--body-xs: 0.75rem / 12px (400 weight)
```

---

## 🧱 Component Styling

### Buttons

#### Primary Button
```css
background: linear-gradient(135deg, #e8640f 0%, #d94a05 100%);
color: #ffffff;
font-weight: 700;
padding: 0.75rem 1.5rem;
border-radius: 0.5rem;
box-shadow: 0 0 20px rgba(232, 100, 15, 0.3);
transition: all 0.3s ease;

/* Hover */
box-shadow: 0 0 40px rgba(232, 100, 15, 0.6);
transform: translateY(-2px);

/* Active */
transform: scale(0.95);
```

#### Secondary Button
```css
background: transparent;
border: 2px solid #e8640f;
color: #e8640f;
font-weight: 600;
padding: 0.75rem 1.5rem;
border-radius: 0.5rem;

/* Hover */
background: rgba(232, 100, 15, 0.1);
```

#### Ghost Button
```css
background: rgba(255, 255, 255, 0.1);
backdrop-filter: blur(10px);
color: #ffffff;
border: 1px solid rgba(255, 255, 255, 0.2);
```

### Cards

#### Product Card
```css
background: #2d2d2d;
border: 1px solid #434343;
border-radius: 0.5rem;
overflow: hidden;
transition: all 0.3s ease;

/* Hover */
border-color: #e8640f;
box-shadow: 0 0 20px rgba(232, 100, 15, 0.3);
transform: translateY(-4px);
```

#### Info Card
```css
background: linear-gradient(135deg, rgba(232, 100, 15, 0.1) 0%, rgba(217, 74, 5, 0.05) 100%);
border: 1px solid rgba(232, 100, 15, 0.3);
border-radius: 0.5rem;
padding: 1.5rem;
```

### Inputs

```css
background: #1a1a1a;
border: 1px solid #434343;
color: #ffffff;
padding: 0.75rem 1rem;
border-radius: 0.5rem;
transition: border-color 0.2s;

/* Focus */
border-color: #e8640f;
outline: none;
box-shadow: 0 0 0 3px rgba(232, 100, 15, 0.1);
```

---

## 🎭 Textures & Effects

### Background Textures
```css
/* Concrete */
background-image: url('/textures/concrete.jpg');
background-blend-mode: multiply;
opacity: 0.05;

/* Metal Brushed */
background-image: url('/textures/metal.jpg');
background-size: cover;
filter: grayscale(100%);
```

### Shadow Effects
```css
/* Soft Glow */
box-shadow: 0 0 20px rgba(232, 100, 15, 0.3);

/* Strong Glow */
box-shadow: 0 0 40px rgba(232, 100, 15, 0.6);

/* Brutal Shadow (Flat Design) */
box-shadow: 8px 8px 0px rgba(0, 0, 0, 0.3);

/* Inset Depth */
box-shadow: inset 4px 4px 8px rgba(0, 0, 0, 0.5);
```

### Gradients
```css
/* Gym Gradient */
background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);

/* Primary Gradient */
background: linear-gradient(135deg, #e8640f 0%, #d94a05 100%);

/* Dark Gradient (Top to Bottom) */
background: linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%);

/* Metallic Gradient */
background: linear-gradient(135deg, #c0c0c0 0%, #71797E 50%, #3d3d3d 100%);
```

---

## ✨ Animations

### Framer Motion Variants
```javascript
// Fade In
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } }
};

// Slide Up
const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

// Scale In
const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } }
};

// Stagger Children
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};
```

### CSS Animations
```css
/* Pulse Glow */
@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 0 20px rgba(232, 100, 15, 0.3); }
  50% { box-shadow: 0 0 40px rgba(232, 100, 15, 0.6); }
}

/* Shimmer Loading */
@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

/* Shake (Error) */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}
```

---

## 📱 Responsive Breakpoints

```javascript
const breakpoints = {
  xs: '320px',   // Mobile Small
  sm: '640px',   // Mobile
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large Desktop
  '2xl': '1536px' // Extra Large
};
```

### Mobile-First Design Principles
1. Touch targets minimum 44x44px
2. Thumb-friendly navigation at bottom
3. Simplified navigation menus
4. Larger text for readability (16px minimum)
5. Collapsible sections to reduce scrolling

---

## 🎯 Layout Patterns

### Container Widths
```css
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

@media (min-width: 640px) {
  .container { padding: 0 1.5rem; }
}

@media (min-width: 1024px) {
  .container { padding: 0 2rem; }
}
```

### Grid Systems
```css
/* Product Grid */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

/* Dashboard Grid */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}
```

---

## 🌟 Accessibility Guidelines

1. **Color Contrast:** Minimum 4.5:1 for normal text
2. **Focus States:** Visible focus indicators on all interactive elements
3. **Alt Text:** Descriptive alt text for all images
4. **Keyboard Navigation:** Full keyboard accessibility
5. **ARIA Labels:** Proper ARIA labels for screen readers
6. **Semantic HTML:** Use proper heading hierarchy

---

## 🖼️ Image Guidelines

### Product Images
- **Format:** WEBP (fallback: JPG)
- **Dimensions:** 1000x1000px (square)
- **Quality:** 85%
- **Background:** White or transparent
- **Optimization:** Always use Next.js Image component

### Hero Images
- **Format:** WEBP (fallback: JPG)
- **Dimensions:** 1920x1080px (16:9)
- **Quality:** 90%
- **File Size:** < 200KB

### Icons
- **Format:** SVG
- **Size:** 24x24px default
- **Stroke Width:** 2px
- **Library:** Lucide React

---

## 📐 Spacing System

```javascript
const spacing = {
  0: '0',
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  5: '1.25rem',  // 20px
  6: '1.5rem',   // 24px
  8: '2rem',     // 32px
  10: '2.5rem',  // 40px
  12: '3rem',    // 48px
  16: '4rem',    // 64px
  20: '5rem',    // 80px
  24: '6rem',    // 96px
};
```

---

## 🎨 Component States

### Hover
```css
transition: all 0.3s ease;
transform: translateY(-2px);
box-shadow: enhanced;
```

### Active
```css
transform: scale(0.95);
```

### Disabled
```css
opacity: 0.5;
cursor: not-allowed;
pointer-events: none;
```

### Loading
```css
opacity: 0.7;
cursor: wait;
/* Add spinner animation */
```

---

## 📝 Content Guidelines

### Product Descriptions
- **Length:** 150-300 words
- **Tone:** Confident, motivational, technical
- **Include:** Benefits, usage, ingredients
- **Avoid:** Medical claims, hype

### CTAs (Call-to-Actions)
- **Length:** 2-4 words
- **Examples:** "Add to Cart", "Shop Now", "Get Started"
- **Tone:** Action-oriented, direct

### Error Messages
- **Tone:** Helpful, not accusatory
- **Include:** What went wrong + How to fix
- **Example:** "Email already registered. Try logging in instead."

---

This design system ensures consistency across the entire platform while maintaining the premium, rugged fitness brand aesthetic.
