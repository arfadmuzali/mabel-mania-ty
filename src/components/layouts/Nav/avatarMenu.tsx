"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LayoutDashboard, LogOut, ShoppingBag } from "lucide-react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AvatarMenu({ session }: { session: Session }) {
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarFallback>
            {session?.user?.name?.charAt(0) ?? "AV"}
          </AvatarFallback>
          <AvatarImage alt="image" src={session?.user?.image ?? ""} />
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52" side="bottom" align="end">
        <DropdownMenuLabel>{session?.user?.name ?? ""}</DropdownMenuLabel>
        <DropdownMenuLabel className="text-neutral-600 py-0 text-xs">
          {session?.user?.email ?? ""}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => {
              router.push("/order");
            }}
          >
            <ShoppingBag />
            <span>Order</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              router.push("/dashboard");
            }}
          >
            <LayoutDashboard />
            <span>Dashboard</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={async () => {
              await signOut();
            }}
          >
            <LogOut />
            <span>Log Out</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
