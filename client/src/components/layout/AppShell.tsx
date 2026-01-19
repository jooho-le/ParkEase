import { PropsWithChildren } from 'react';
import Topbar from './Topbar';

export default function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-[#f5f6f8]">
      <Topbar />
      <div className="mx-auto w-full max-w-6xl px-6 pb-10 pt-6">
        <main className="space-y-6">{children}</main>
      </div>
    </div>
  );
}
