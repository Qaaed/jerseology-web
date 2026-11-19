import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springX = useSpring(cursorX, { stiffness: 450, damping: 32, mass: 0.4 });
  const springY = useSpring(cursorY, { stiffness: 450, damping: 32, mass: 0.4 });

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (prefersReduced || isTouch) return;

    setEnabled(true);

    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      const target = e.target as HTMLElement | null;
      const interactive = target?.closest('a, button, input, select, textarea, [data-cursor="interactive"]');
      setIsHoveringInteractive(Boolean(interactive));
    };

    const leave = () => {
      cursorX.set(-100);
      cursorY.set(-100);
    };

    window.addEventListener('mousemove', move);
    document.addEventListener('mouseleave', leave);
    return () => {
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseleave', leave);
    };
  }, [cursorX, cursorY]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100] hidden md:block"
      style={{
        x: springX,
        y: springY,
        translateX: '-50%',
        translateY: '-50%',
      }}
    >
      <motion.div
        animate={{
          scale: isHoveringInteractive ? 2.4 : 1,
          opacity: isHoveringInteractive ? 0.35 : 0.9,
        }}
        transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
        className="h-2.5 w-2.5 rounded-full bg-[#AD2828]"
      />
    </motion.div>
  );
}
