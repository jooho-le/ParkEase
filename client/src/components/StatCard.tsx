import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from './ui/card';

export default function StatCard({ label, value, helper }: { label: string; value: ReactNode; helper?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      whileHover={{ y: -2 }}
    >
      <Card className="flex-1 border border-emerald-100/60 shadow-sm transition-shadow hover:shadow-md">
      <CardContent className="space-y-2">
        <p className="text-xs font-semibold text-slate-400">{label}</p>
        <p className="text-3xl font-semibold text-slate-900">{value}</p>
        {helper && <p className="text-xs text-slate-500">{helper}</p>}
        <div className="h-1 w-12 rounded-full bg-emerald-400" />
      </CardContent>
      </Card>
    </motion.div>
  );
}
