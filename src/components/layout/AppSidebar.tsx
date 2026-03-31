import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Building2, 
  ChevronLeft, 
  ChevronRight,
  Home,
  Trees,
  Settings,
  UserPlus,
  LogOut,
  User,
  Car,
  Store,
  Bot,
  Info,
  ArrowLeft
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GlassPanel } from "@/components/ui/glass-panel";
import { GlassButton } from "@/components/ui/glass-button";
import { cn } from "@/lib/utils";
import { sendToUnreal, UEEvents } from "@/lib/ue-bridge";
import { useLanguage } from "@/i18n/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useAuth } from "@/hooks/useAuth";
import { useAppFlow } from "@/contexts/AppFlowContext";

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  route?: string;
  children?: NavItem[];
  adminOnly?: boolean;
  hideWhenLoggedIn?: boolean;
}


interface AppSidebarProps {
  onNavigate?: (itemId: string) => void;
  onDinoBotToggle?: () => void;
  dinoBotActive?: boolean;
}

export function AppSidebar({ onNavigate, onDinoBotToggle, dinoBotActive }: AppSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const { user, isAdmin, signOut } = useAuth();
  const { phase, backToSections } = useAppFlow();
  const [collapsed, setCollapsed] = useState(true);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(["units"]));

  // Translated nav items
  const navItems: NavItem[] = [
    { 
      id: "home", 
      label: t.nav.home, 
      icon: Home,
      route: "/"
    },
    { 
      id: "units", 
      label: t.nav.units, 
      icon: Building2,
      route: "/units"
    },
    {
      id: "parking",
      label: "Parking / Depo",
      icon: Car,
      route: "/parking"
    },
    {
      id: "lokale",
      label: "Lokale",
      icon: Store,
      route: "/lokale"
    },
    { 
      id: "surroundings", 
      label: t.nav.surroundings, 
      icon: Trees,
      route: "/surroundings"
    },
    {
      id: "building-info",
      label: t.nav.buildingInfo || "Building Info",
      icon: Info,
      route: "/building-info"
    },
    { 
      id: "admin", 
      label: "Admin Panel", 
      icon: Settings,
      route: "/admin",
      adminOnly: true
    },
    { 
      id: "signup", 
      label: "Sign Up / Login", 
      icon: UserPlus,
      route: "/admin",
      hideWhenLoggedIn: true
    },
  ];

  // Filter nav items based on user state
  const filteredNavItems = navItems.filter(item => {
    if (item.adminOnly && !isAdmin) return false;
    if (item.hideWhenLoggedIn && user) return false;
    return true;
  });

  const isActive = (item: NavItem): boolean => {
    if (item.route) {
      return location.pathname === item.route.split("?")[0];
    }
    return false;
  };

  const handleItemClick = (item: NavItem) => {
    if (item.children) {
      setExpandedItems(prev => {
        const next = new Set(prev);
        if (next.has(item.id)) {
          next.delete(item.id);
        } else {
          next.add(item.id);
        }
        return next;
      });
    }
    
    if (item.route) {
      navigate(item.route);
    } else {
      sendToUnreal(UEEvents.NAVIGATE_CATEGORY, { category: item.id });
    }
    
    onNavigate?.(item.id);
  };

  const renderNavItem = (item: NavItem, depth = 0) => {
    const active = item.id === "dinobot" ? dinoBotActive : isActive(item);
    const isExpanded = expandedItems.has(item.id);
    const hasChildren = item.children && item.children.length > 0;
    const Icon = item.icon;

    return (
      <div key={item.id}>
        <button
          onClick={() => handleItemClick(item)}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200",
            "hover:bg-white/10",
            active && "bg-primary/20 text-primary border-l-2 border-primary",
            depth > 0 && "ml-4 text-sm"
          )}
        >
          <Icon className={cn(
            "w-5 h-5 flex-shrink-0",
            active ? "text-primary" : "text-muted-foreground"
          )} />
          
          {!collapsed && (
            <>
              <span className={cn(
                "flex-1 text-left",
                active ? "text-foreground font-medium" : "text-muted-foreground"
              )}>
                {item.label}
              </span>
              
              {hasChildren && (
                <ChevronRight className={cn(
                  "w-4 h-4 transition-transform duration-200",
                  isExpanded && "rotate-90"
                )} />
              )}
            </>
          )}
        </button>
        
        {/* Children */}
        {hasChildren && isExpanded && !collapsed && (
          <div className="mt-1 space-y-1 animate-fade-in">
            {item.children!.map(child => renderNavItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={cn(
        "h-[calc(100%-2rem)] my-4 ml-4 flex flex-col transition-all duration-300 rounded-xl bg-[hsl(0,0%,4%)] border border-primary/20 overflow-hidden",
        collapsed ? "w-[70px]" : "w-64"
      )}
    >
      {/* Gold accent bar */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" aria-hidden="true" />
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <h1 className="text-lg font-semibold text-foreground">
              Louis de Paris
            </h1>
          )}
          <GlassButton
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </GlassButton>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto" data-tutorial="sidebar-nav">
        {filteredNavItems.map(item => renderNavItem(item))}
      </nav>

      {/* Footer - User Profile, Language Switcher & UE Connection Status */}
      <div className="p-3 border-t border-white/10 space-y-2">
        {/* User Profile Dropdown */}
        {user && !collapsed && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md bg-white/5 hover:bg-white/10 transition-colors">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 text-left overflow-hidden">
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 bg-background border border-border">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{user.email}</p>
                {isAdmin && (
                  <p className="text-xs text-primary">Admin</p>
                )}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => signOut()}
                className="text-destructive focus:text-destructive cursor-pointer"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        
        {user && collapsed && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex justify-center p-2 rounded-md bg-white/5 hover:bg-white/10 transition-colors">
                <User className="w-5 h-5 text-primary" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" className="w-56 bg-background border border-border">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium truncate">{user.email}</p>
                {isAdmin && (
                  <p className="text-xs text-primary">Admin</p>
                )}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => signOut()}
                className="text-destructive focus:text-destructive cursor-pointer"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {!collapsed && (
          <div className="flex justify-center">
            <LanguageSwitcher />
          </div>
        )}
        {/* Assistant button — gold themed */}
        <div className="flex justify-center">
          <button
            onClick={() => onDinoBotToggle?.()}
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110",
              dinoBotActive
                ? "bg-primary shadow-[0_0_16px_hsl(var(--primary)/0.5)]"
                : "bg-primary/80 hover:bg-primary"
            )}
            title="Assistant"
          >
            <Bot className="w-5 h-5 text-primary-foreground" />
          </button>
        </div>

        {/* Back to sections */}
        {phase === "browsing" && (
          <div className="flex justify-center">
            <button
              onClick={backToSections}
              className={cn(
                "flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-primary border border-primary/20 hover:bg-primary/15 transition-colors",
                collapsed && "w-10 h-10 p-0"
              )}
              title="Back to Sections"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" />
              {!collapsed && <span>Back</span>}
            </button>
          </div>
        )}
        <div className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-md bg-white/5",
          collapsed && "justify-center"
        )}>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          {!collapsed && (
            <span className="text-xs text-muted-foreground">
              {t.common.connected}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
