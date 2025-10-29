'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  Users,
  Package,
  Scissors,
  ShoppingCart,
  Factory
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = {
  admin: [
    { name: 'Dashboard', href: '/dashboard/admin', icon: LayoutDashboard },
    { name: 'All SRDs', href: '/srd', icon: FileText },
    { name: 'Users', href: '/users', icon: Users },
    { name: 'Settings', href: '/settings', icon: Settings }
  ],
  vmd: [
    { name: 'Dashboard', href: '/dashboard/vmd', icon: LayoutDashboard },
    { name: 'Create SRD', href: '/dashboard/vmd/create', icon: FileText },
    { name: 'My SRDs', href: '/srd?department=vmd', icon: Package },
    { name: 'Pending Reviews', href: '/srd?status=pending', icon: FileText }
  ],
  cad: [
    { name: 'Dashboard', href: '/dashboard/cad', icon: LayoutDashboard },
    { name: 'Active SRDs', href: '/srd?department=cad', icon: Scissors },
    { name: 'In Progress', href: '/srd?department=cad&status=in-progress', icon: Package },
    { name: 'Completed', href: '/srd?department=cad&status=approved', icon: FileText }
  ],
  commercial: [
    { name: 'Dashboard', href: '/dashboard/commercial', icon: LayoutDashboard },
    { name: 'Quotations', href: '/srd?department=commercial', icon: ShoppingCart },
    { name: 'Suppliers', href: '/suppliers', icon: Users },
    { name: 'Pending', href: '/srd?department=commercial&status=pending', icon: FileText }
  ],
  mmc: [
    { name: 'Dashboard', href: '/dashboard/mmc', icon: LayoutDashboard },
    { name: 'Production', href: '/srd?department=mmc', icon: Factory },
    { name: 'Quality Control', href: '/quality', icon: Package },
    { name: 'Completed', href: '/srd?department=mmc&status=approved', icon: FileText }
  ]
};

export default function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  
  const userRole = session?.user?.role;
  const items = menuItems[userRole] || [];

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">SRD</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">SRD System</h2>
            <p className="text-sm text-gray-500">{userRole?.toUpperCase()} Portal</p>
          </div>
        </div>
        
        <nav className="space-y-2">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}