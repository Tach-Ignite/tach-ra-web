import { ReactNode } from 'react';
import { Nav } from './nav';

type AdminLayoutProps = {
  children: ReactNode;
};

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex flex-col md:flex-row">
      <div className="flex-none">
        <Nav />
      </div>
      <div className="flex-grow">
        <div className="p-6 m-4 rounded border border-tachGrey">{children}</div>
      </div>
    </div>
  );
}
