
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { 
  TrendingUp, 
  Wallet, 
  Target, 
  Bot, 
  Receipt, 
  Star, 
  Trophy, 
  Zap 
} from "lucide-react";

interface AppSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const menuItems = [
  { id: "dashboard", title: "Dashboard", icon: TrendingUp },
  { id: "transactions", title: "Transactions", icon: Wallet },
  { id: "budget", title: "Budget", icon: Target },
  { id: "bills", title: "Bills", icon: Receipt },
  { id: "features", title: "Features", icon: Star },
  { id: "rewards", title: "Rewards", icon: Trophy },
  { id: "challenges", title: "Challenges", icon: Zap },
  { id: "ai-assistant", title: "AI Assistant", icon: Bot },
];

const AppSidebar = ({ activeTab, setActiveTab }: AppSidebarProps) => {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className={isCollapsed ? "w-14" : "w-60"} collapsible="icon">
      <div className="p-4">
        <SidebarTrigger className="mb-4" />
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => setActiveTab(item.id)}
                    className={`${
                      activeTab === item.id
                        ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                        : "hover:bg-slate-100"
                    } transition-all duration-200`}
                  >
                    <item.icon className="h-4 w-4" />
                    {!isCollapsed && <span>{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
