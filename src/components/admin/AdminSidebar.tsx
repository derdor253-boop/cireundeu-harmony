import {
  LayoutDashboard,
  Home,
  Scroll,
  Package,
  Images,
  Newspaper,
  Phone,
  BookOpen,
  Settings,
  LogOut,
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { signOutAdmin } from "@/hooks/useAdminAuth";
import { toast } from "sonner";

const items = [
  { title: "Beranda Dashboard", url: "/admin", icon: LayoutDashboard, end: true },
  { title: "Kelola Beranda", url: "/admin/beranda", icon: Home },
  { title: "Kelola Profil & Sejarah", url: "/admin/profil-kampung", icon: Scroll },
  { title: "Kelola Paket Wisata", url: "/admin/paket", icon: Package },
  { title: "Kelola Galeri & Visual", url: "/admin/galeri", icon: Images },
  { title: "Artikel & Berita", url: "/admin/artikel", icon: Newspaper },
  { title: "Kontak & Media Sosial", url: "/admin/kontak", icon: Phone },
  { title: "Buku Saku Admin", url: "/admin/buku-saku", icon: BookOpen },
  { title: "Pengaturan", url: "/admin/pengaturan", icon: Settings },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOutAdmin();
    toast.success("Berhasil keluar dari dasbor");
    navigate("/admin/login");
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="border-b border-border p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-forest text-cream font-display text-lg">
            C
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate font-display text-sm font-semibold text-forest">Dasbor Admin</p>
              <p className="truncate text-xs text-muted-foreground">Kampung Cireundeu</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Kelola Konten Website</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = item.end
                  ? pathname === item.url
                  : pathname === item.url || pathname.startsWith(item.url + "/");
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                      <NavLink to={item.url} end={item.end}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} tooltip="Keluar">
                  <LogOut className="h-4 w-4" />
                  <span>Keluar</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
