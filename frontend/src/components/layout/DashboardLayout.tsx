'use client';

import { Sidebar } from './Sidebar';

export function DashboardLayout({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <div className="flex h-screen bg-surface">
      <Sidebar />
      <main className="flex-1 ml-64 overflow-y-auto">
        {title && (
          <div className="sticky top-0 z-30 bg-surface/80 backdrop-blur-sm border-b border-border px-8 py-4">
            <h1 className="text-xl font-semibold text-slate-100">{title}</h1>
          </div>
        )}
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
