import { useEffect, useMemo, useState } from 'react';
import { motion, animate, useMotionValue } from 'framer-motion';
import { PanelMode } from '../../lib/types';

export default function BottomSheet({
  children,
  mode,
}: {
  children: React.ReactNode;
  mode: PanelMode;
}) {
  const [viewport, setViewport] = useState(() => window.innerHeight);
  const y = useMotionValue(0);

  useEffect(() => {
    const onResize = () => setViewport(window.innerHeight);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const snapPoints = useMemo(() => {
    return [80, Math.round(viewport * 0.45), Math.round(viewport * 0.82)];
  }, [viewport]);

  useEffect(() => {
    y.set(viewport - snapPoints[1]);
  }, [snapPoints, viewport, y]);

  useEffect(() => {
    const target = mode === 'FOCUS' ? snapPoints[2] : snapPoints[1];
    animate(y, viewport - target, { type: 'spring', stiffness: 320, damping: 32 });
  }, [mode, snapPoints, viewport, y]);

  const handleDragEnd = () => {
    const current = y.get();
    const closest = snapPoints.reduce((prev, point) => {
      const prevPos = viewport - prev;
      const nextPos = viewport - point;
      return Math.abs(current - nextPos) < Math.abs(current - prevPos) ? point : prev;
    }, snapPoints[0]);

    animate(y, viewport - closest, { type: 'spring', stiffness: 300, damping: 30 });
  };

  return (
    <motion.div
      style={{ y }}
      drag="y"
      dragConstraints={{
        top: viewport - snapPoints[2],
        bottom: viewport - snapPoints[0],
      }}
      dragElastic={0.08}
      onDragEnd={handleDragEnd}
      className="fixed bottom-0 left-0 right-0 z-40 rounded-t-3xl border border-emerald-100/70 bg-white p-4 shadow-2xl"
    >
      <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-emerald-200" />
      {children}
    </motion.div>
  );
}
