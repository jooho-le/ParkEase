import { motion } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';
import { UserCircle2 } from 'lucide-react';
import { useAuthStore } from '../../store/auth';
import { Button } from '../ui/button';

export default function Topbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="border-b border-emerald-100/70 bg-white"
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-10">
          <div>
            <p className="text-xs font-semibold uppercase text-emerald-500">ParkEase</p>
            <h1 className="text-lg font-semibold text-slate-900">주차 예약 MVP</h1>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? 'text-sm font-semibold text-emerald-700'
                  : 'text-sm text-slate-500 hover:text-emerald-600'
              }
            >
              홈
            </NavLink>
            <NavLink
              to="/my"
              className={({ isActive }) =>
                isActive
                  ? 'text-sm font-semibold text-emerald-700'
                  : 'text-sm text-slate-500 hover:text-emerald-600'
              }
            >
              내 예약
            </NavLink>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {user && (
            <motion.span
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-2 text-sm text-slate-500"
            >
              <UserCircle2 className="h-5 w-5 text-emerald-500" />
              {user.name} · {user.role}
            </motion.span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              logout();
              navigate('/login');
            }}
          >
            로그아웃
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
