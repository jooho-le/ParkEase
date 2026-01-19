import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { Home, CalendarCheck } from 'lucide-react';

const links = [
  { to: '/', label: '홈', icon: Home },
  { to: '/my', label: '내 예약', icon: CalendarCheck },
];

export default function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 md:block">
      <div className="rounded-2xl bg-white p-4 shadow-soft">
        <p className="text-xs font-semibold uppercase text-slate-400">메뉴</p>
        <nav className="mt-4 space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className="relative block"
              >
                {({ isActive }) => (
                  <div className="relative">
                    {isActive && (
                      <motion.div
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-xl bg-emerald-600"
                        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                      />
                    )}
                    <div
                      className={cn(
                        'relative z-10 flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition',
                        isActive
                          ? 'text-white'
                          : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
                      )}
                    >
                      <motion.span
                        whileHover={{ scale: 1.06 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      >
                        <Icon size={18} />
                      </motion.span>
                      {link.label}
                    </div>
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
