
"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  LogOut,
  UserRound,
  ChevronDown,
  Settings,
} from "lucide-react";

export function UserMenu() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const user = session?.user;

  const initials =
    user?.name
      ?.trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((name) => name[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/login",
      redirect: true,
    });
  };

  if (status === "loading") {
    return (
      <div className="h-9 w-9 animate-pulse rounded-full bg-slate-200" />
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Open user menu"
            className="
              group flex h-10 w-10 items-center justify-center
              rounded-full border border-transparent
              transition-all duration-200
              hover:border-slate-200 hover:bg-slate-100
              focus-visible:ring-2 focus-visible:ring-teal-600
              focus-visible:ring-offset-2
              data-[popup-open]:bg-slate-100
            "
          />
        }
      >
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={user?.image ?? undefined}
            alt={user?.name ?? "User"}
          />

          <AvatarFallback className="bg-[#B8E0F5] text-sm font-semibold text-[#252437]">
            {initials}
          </AvatarFallback>
        </Avatar>

      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-60 rounded-xl border border-slate-200 bg-white p-2 shadow-lg"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2 py-2 font-normal">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={user?.image ?? undefined}
                  alt={user?.name ?? "User"}
                />

                <AvatarFallback className="bg-[#B8E0F5] font-semibold text-[#252437]">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {user?.name ?? "User"}
                </p>

                <p className="truncate text-xs text-slate-500">
                  {user?.email ?? ""}
                </p>
              </div>
            </div>
          </DropdownMenuLabel>        
          <DropdownMenuSeparator className="my-1" />

          <DropdownMenuItem
            onClick={handleLogout}
            className="
              cursor-pointer gap-2 rounded-lg px-3 py-2.5
              text-sm text-red-600
              transition-colors duration-150
              hover:bg-red-50 hover:text-red-700
              focus:bg-red-50 focus:text-red-700
            "
          >
            <LogOut className="h-4 w-4" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}