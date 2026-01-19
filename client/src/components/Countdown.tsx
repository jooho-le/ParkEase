import { useEffect, useMemo, useState } from 'react';
import { formatDuration } from '../lib/utils';

export default function Countdown({ target }: { target: string }) {
  const targetMs = useMemo(() => new Date(target).getTime(), [target]);
  const [remaining, setRemaining] = useState(() => targetMs - Date.now());

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining(targetMs - Date.now());
    }, 1000);
    return () => clearInterval(id);
  }, [targetMs]);

  if (remaining <= 0) {
    return <span className="text-rose-600">00:00</span>;
  }

  return <span className="text-emerald-600">{formatDuration(remaining)}</span>;
}
