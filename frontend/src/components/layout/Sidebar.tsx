import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  LayoutDashboard, 
  FileText, 
  Wallet, 
  ShieldCheck, 
  BarChart, 
  CreditCard, 
  Globe, 
  ChevronRight,
  ChevronLeft,
  ScrollText // Using ScrollText instead of FileContract which doesn't exist in lucide
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAppContext } from '../../hooks/useAppContext';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { useWeb3 } from '../../hooks/useWeb3';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  isActive: boolean;
  isCollapsed: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  href, 
  icon, 
  title, 
  isActive,
  isCollapsed
}) => {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link 
            href={href} 
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
              isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-primary",
              isCollapsed && "justify-center px-2"
            )}
          >
            {icon}
            {!isCollapsed && <span>{title}</span>}
          </Link>
        </TooltipTrigger>
        {isCollapsed && (
          <TooltipContent side="right">
            {title}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

const Sidebar: React.FC = () => {
  const router = useRouter();
  const { sidebarOpen, setSidebarOpen } = useAppContext();
  const { isLoggedIn } = useWeb3();
  
  // Navigation items
  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "Contracts",
      href: "/contracts",
      icon: <ScrollText className="h-5 w-5" />,
    },
    {
      title: "Wallet",
      href: "/wallet",
      icon: <Wallet className="h-5 w-5" />,
    },
    {
      title: "Documents",
      href: "/documents",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: "KYC",
      href: "/kyc",
      icon: <ShieldCheck className="h-5 w-5" />,
    },
    {
      title: "Risk Intelligence",
      href: "/risk",
      icon: <BarChart className="h-5 w-5" />,
    },
    {
      title: "Trade Finance",
      href: "/finance",
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      title: "Global Trade",
      href: "/trade",
      icon: <Globe className="h-5 w-5" />,
    }
  ];
  
  // Not visible when not logged in
  if (!isLoggedIn) {
    return null;
  }
  
  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-16 bottom-0 left-0 z-30 w-64 border-r bg-background transition-all duration-300",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-20"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Toggle button (desktop only) */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 hidden lg:flex"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
          
          {/* Navigation */}
          <ScrollArea className="flex-1 py-4">
            <nav className="grid gap-1 px-2">
              {navItems.map((item) => (
                <SidebarItem
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  title={item.title}
                  isActive={router.pathname === item.href}
                  isCollapsed={!sidebarOpen}
                />
              ))}
            </nav>
          </ScrollArea>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;