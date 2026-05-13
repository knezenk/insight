import { Outlet } from 'react-router-dom';

import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function AppLayout(): JSX.Element {
  return (
    <div className="grid h-screen grid-cols-[240px_1fr] grid-rows-[56px_1fr]">
      <div className="row-span-2 border-r border-line bg-surface">
        <Sidebar />
      </div>
      <div className="col-start-2 border-b border-line bg-surface">
        <Topbar />
      </div>
      <main className="col-start-2 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
