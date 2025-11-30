"use client";
import {
  ExternalLink,
  GitHub,
  ModeDark,
  ModeLight,
  ModeSystem,
  Theme,
  Timezone,
  Video,
} from "@repo/icons";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  US_TIMEZONES,
  useCalendar,
} from "@repo/ui";
import { useTheme } from "next-themes";

interface AuthMenuProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export function AuthMenu({ user }: AuthMenuProps) {
  const { theme, setTheme } = useTheme();
  const { timezonePreference, setTimezone } = useCalendar();

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="grid -ml-2 grid-cols-[auto_1fr] gap-x-4 gap-y-0.5 items-center w-full p-2 rounded-lg hover:bg-accent/50 transition-colors"
        render={<Button variant="ghost" className="h-auto" />}
      >
        <Avatar className="size-10 grid-cols-1 row-span-2 cursor-pointer hover:opacity-80 transition-opacity">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className="text-sm">{initials}</AvatarFallback>
        </Avatar>
        <span className="text-md text-left tracking-tight col-start-2">
          {user.name}
        </span>
        <span className="col-start-2 text-left text-sm leading-tight text-muted-foreground tracking-tight">
          {user.email}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem
          render={
            <a
              href="https://github.com/arnoldsandoval/interview-joinwarp"
              target="_blank"
              rel="noopener noreferrer"
            />
          }
        >
          <GitHub />
          GitHub repository
          <ExternalLink className="ml-auto" />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Video />
          Demo video
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Theme />
            Theme
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-46">
            <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
              <DropdownMenuRadioItem name="theme" value="light">
                <ModeLight />
                Light
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem name="theme" value="dark">
                <ModeDark />
                Dark
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem name="theme" value="system">
                <ModeSystem />
                System
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Timezone />
            Timezone
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-46">
            <DropdownMenuRadioGroup
              value={timezonePreference}
              onValueChange={setTimezone}
            >
              {US_TIMEZONES.map((tz) => (
                <DropdownMenuRadioItem
                  key={tz.value}
                  name="timezone"
                  value={tz.value}
                >
                  {tz.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
