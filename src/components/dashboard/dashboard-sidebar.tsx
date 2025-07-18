
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  Users,
  Wrench,
  Package,
  KeyRound,
  User,
  CreditCard,
  Settings,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  FolderKanban,
  ChevronRight,
  HousePlug,
  Captions,
  Table,
  Library,
  Cog,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar"
import ButtonOut  from "./auth/signout-button"
import type { Session } from "next-auth"
import { table } from "console"


export function DashboardSidebar({ session }: {session: Session| null}) {
  const pathname = usePathname()
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)

  const routes = [
    {
      title: "Daschboard",
      icon: LayoutDashboard,
      href: "/dashboard",
    },
    {
      title: "Clientes",
      icon: Users,
      href: "/dashboard/cliente",
    },
    {
      title: "Projetos",
      icon: FolderKanban,
      href: "/dashboard/projeto",
      subItems: [
        {
          title: "Cadastro",
          href: "/dashboard/projeto",
        },
        {
          title: "Gerenciamento",
          href: "/dashboard/projeto/gerenciamento",
        }
      ],
    },
    {
      title: "Técnicos",
      icon: Wrench,
      href: "/dashboard/tecnico",
    },
    {
      title: "Equipamentos",
      icon: Cog,
      href: "/dashboard/equipamentos/gerais",
    },
    {
      title: "Proteção",
      icon: HousePlug,
      href: "/dashboard/equipamentos",
      subItems: [
        {
          title: "Proteção CC",
          href: "/dashboard/equipamentos/protecao/cc",
        },
        {
          title: "Proteção CA",
          href: "/dashboard/equipamentos/protecao/ca",
        }
      ],
    },
    {
      title: "Módulo fotovoltaico",
      icon: Table,
      href: "/dashboard/equipamentos/modulo",
    },
    {
      title: "Inversor",
      icon: Captions,
      href: "/dashboard/equipamentos/inversor",
    },
    {
      title: "Biblioteca",
      icon: Library,
      href: "/dashboard/biblioteca",
    },
    {
      title: "Acesso",
      icon: KeyRound,
      href: "/dashboard/acessos",
    },
  ]
  
  const userMenuItems = [
    {
      title: "Minha Conta",
      icon: User,
      href: "/dashboard/perfil/conta",
    },
    {
      title: "Plano",
      icon: CreditCard,
      href: "/dashboard/perfil/plano",
    },
    {
      title: "Configurações",
      icon: Settings,
      href: "/dashboard/perfil/configuracoes",
    },
  ]

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 px-2 py-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={session?.user.image ? `./images/avatars/${session.user.image}` : "/placeholder.svg"} alt={session?.user.name ?? undefined} />
            <AvatarFallback>{session?.user?.name?.charAt(0) ?? '?'}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{session?.user.name}</span>
            <span className="text-xs text-muted-foreground">{session?.user.email}</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-auto h-8 w-8">
                <ChevronDown className="h-4 w-4" />
                <span className="sr-only">Menu de perfil</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Meu Perfil</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {userMenuItems.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <Link href={item.href} className="flex items-center gap-2">
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <ButtonOut variant={"ghost"} className="flex items-center gap-2">Sair</ButtonOut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {routes.map((route) => (
            <SidebarMenuItem key={route.href}>
              <SidebarMenuButton 
                asChild 
                isActive={pathname === route.href || (route.subItems && pathname.startsWith(route.href))} 
                tooltip={route.title}
              >
                {route.subItems ? (
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      setOpenSubmenu(openSubmenu === route.href ? null : route.href);
                    }} 
                    className="flex w-full items-center gap-2"
                  >
                    <route.icon className="h-5 w-5" />
                    <span>{route.title}</span>
                    <ChevronRight className={`ml-auto h-4 w-4 transition-transform ${openSubmenu === route.href ? 'rotate-90' : ''}`} />
                  </button>
                ) : (
                  <Link href={route.href} className="flex items-center gap-2">
                    <route.icon className="h-5 w-5" />
                    <span>{route.title}</span>
                  </Link>
                )}
              </SidebarMenuButton>
              {route.subItems && openSubmenu === route.href && (
                <SidebarMenuSub>
                  {route.subItems.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.href}>
                      <SidebarMenuSubButton 
                        asChild 
                        isActive={pathname === subItem.href}
                      >
                        <Link href={subItem.href}>
                          <span>{subItem.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t p-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">© 2024 Sistema</span>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
