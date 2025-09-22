import { NavLink, useLocation } from "react-router-dom";
import {
  BarChart3,
  Upload,
  FileText,
  CheckCircle,
  Database,
  Activity,
  Settings,
  Home,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Rules Management", url: "/rules", icon: FileText },
  { title: "Upload Claims", url: "/claims/upload", icon: Upload },
  { title: "Validation", url: "/validate", icon: CheckCircle },
  { title: "Results", url: "/results", icon: Database },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Admin Tools", url: "/admin", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isCollapsed = state === "collapsed";
  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <Activity className="h-8 w-8 text-sidebar-primary" />
            <div>
              <h1 className="text-lg font-bold text-sidebar-foreground">
                RCM Validator
              </h1>
              <p className="text-xs text-sidebar-foreground/60">
                Healthcare Analytics
              </p>
            </div>
          </div>
        )}
        {isCollapsed && (
          <div className="flex justify-center">
            <Activity className="h-8 w-8 text-sidebar-primary" />
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url} className="sidebar-nav-item">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}