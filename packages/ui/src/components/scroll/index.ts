/**
 * Scroll Animation Components
 *
 * GSAP + Lenis powered scroll animations for Apple-style effects.
 *
 * Usage:
 * 1. Wrap your app with <ScrollProvider> for smooth scrolling
 * 2. Use individual components for specific effects
 *
 * @example
 * ```tsx
 * import { ScrollProvider, ParallaxElement, TextReveal } from "@ninsys/ui/components/scroll";
 *
 * function App() {
 *   return (
 *     <ScrollProvider>
 *       <ParallaxElement speed={0.5}>
 *         <img src="hero.jpg" />
 *       </ParallaxElement>
 *       <TextReveal>
 *         Discover the future of plugin management.
 *       </TextReveal>
 *     </ScrollProvider>
 *   );
 * }
 * ```
 */

export { ScrollProvider, useScroll } from "./ScrollProvider";
export { ScrollSection } from "./ScrollSection";
export { ParallaxElement } from "./ParallaxElement";
export { TextReveal } from "./TextReveal";
export { ScrollProgress, useScrollProgress } from "./ScrollProgress";
export { HorizontalScroll } from "./HorizontalScroll";
export { SmoothScroll } from "./SmoothScroll";
