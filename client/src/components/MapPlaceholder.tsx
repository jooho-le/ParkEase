export default function MapPlaceholder() {
  return (
    <div className="relative flex h-56 w-full items-center justify-center overflow-hidden rounded-2xl border border-emerald-100/70 bg-[#dff7e6] text-sm text-emerald-700 md:h-full">
      <div className="absolute inset-0 animate-pulse opacity-40" style={{
        background:
          'radial-gradient(circle at 20% 20%, rgba(16,185,129,0.12), transparent 45%), radial-gradient(circle at 80% 30%, rgba(16,185,129,0.12), transparent 40%)',
      }} />
      <div className="absolute left-4 top-4 z-10 flex flex-col overflow-hidden rounded-xl border border-emerald-200 bg-white shadow-soft">
        <button className="h-9 w-9 text-lg font-semibold text-emerald-600">+</button>
        <div className="h-px w-full bg-emerald-100" />
        <button className="h-9 w-9 text-lg font-semibold text-emerald-600">−</button>
      </div>
      <div className="relative z-10 text-center">
        <div className="text-xs uppercase tracking-[0.2em] text-emerald-400">실시간 지도</div>
        지도 자리 (네이버/구글 교체 예정)
      </div>
    </div>
  );
}
