"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { toggleSidebar } from "@/redux/features/ui/uiSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import {
  Award,
  BookOpen,
  Briefcase,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Code,
  FileText,
  GraduationCap,
  Home,
  Mail,
  Menu,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

type SidebarItemProps = {
  icon: React.ElementType;
  label: string;
  path: string;
  isActive?: boolean;
  isCollapsed?: boolean;
};

type SidebarGroupProps = {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
  isCollapsed?: boolean;
};

const SidebarItem = ({
  icon: Icon,
  label,
  path,
  isActive,
  isCollapsed,
}: SidebarItemProps) => {
  const content = (
    <Link to={path}>
      <Button
        variant={isActive ? "secondary" : "ghost"}
        className={cn(
          "w-full justify-start gap-2 mb-1",
          isActive && "bg-secondary/20 text-secondary hover:bg-secondary/30"
        )}
      >
        <Icon className="h-5 w-5" />
        {!isCollapsed && <span>{label}</span>}
      </Button>
    </Link>
  );

  if (isCollapsed) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="right">{label}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return content;
};

const SidebarGroup = ({
  icon: Icon,
  label,
  children,
  isCollapsed,
}: SidebarGroupProps) => {
  const [isOpen, setIsOpen] = useState(true);

  if (isCollapsed) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center px-2 py-1.5">
              <Icon className="h-5 w-5" />
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">{label}</TooltipContent>
        </Tooltip>
        {children}
      </TooltipProvider>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mb-2">
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-start gap-2 mb-1">
          <Icon className="h-5 w-5" />
          <span>{label}</span>
          {isOpen ? (
            <ChevronDown className="h-4 w-4 ml-auto" />
          ) : (
            <ChevronRight className="h-4 w-4 ml-auto" />
          )}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-6">{children}</CollapsibleContent>
    </Collapsible>
  );
};

export function Sidebar() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { sidebarOpen } = useAppSelector((state: RootState) => state.ui);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => dispatch(toggleSidebar())}
          className="bg-background/80 backdrop-blur-sm"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Sidebar backdrop for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => dispatch(toggleSidebar())}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 z-40 h-full bg-card border-r transition-all duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          sidebarOpen ? "w-64" : "lg:w-20"
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <h2
            className={cn(
              "font-bold text-xl neon-text",
              !sidebarOpen && "lg:hidden"
            )}
          >
            Portfolio Admin
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => dispatch(toggleSidebar())}
            className="lg:flex hidden"
          >
            {sidebarOpen ? (
              <ChevronLeft className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => dispatch(toggleSidebar())}
            className="lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4 overflow-y-auto h-[calc(100vh-4rem)]">
          <SidebarItem
            icon={Home}
            label="Dashboard"
            path="/"
            isActive={isActive("/")}
            isCollapsed={!sidebarOpen}
          />

          <SidebarItem
            icon={User}
            label="Profile"
            path="/profile"
            isActive={isActive("/profile")}
            isCollapsed={!sidebarOpen}
          />

          <SidebarItem
            icon={FileText}
            label="About Me"
            path="/about"
            isActive={isActive("/about")}
            isCollapsed={!sidebarOpen}
          />

          <SidebarGroup
            icon={Briefcase}
            label="Experience"
            isCollapsed={!sidebarOpen}
          >
            <SidebarItem
              icon={Briefcase}
              label="All Experience"
              path="/experience"
              isActive={isActive("/experience")}
              isCollapsed={!sidebarOpen}
            />
            <SidebarItem
              icon={Briefcase}
              label="Add Experience"
              path="/experience/add"
              isActive={isActive("/experience/add")}
              isCollapsed={!sidebarOpen}
            />
          </SidebarGroup>

          <SidebarGroup
            icon={GraduationCap}
            label="Education"
            isCollapsed={!sidebarOpen}
          >
            <SidebarItem
              icon={GraduationCap}
              label="Education Details"
              path="/education"
              isActive={isActive("/education")}
              isCollapsed={!sidebarOpen}
            />
            <SidebarItem
              icon={Award}
              label="Add Achievement"
              path="/education/add/achievement"
              isActive={isActive("/education/add/achievement")}
              isCollapsed={!sidebarOpen}
            />
            <SidebarItem
              icon={BookOpen}
              label="Add Subject"
              path="/education/add/subject"
              isActive={isActive("/education/add/subject")}
              isCollapsed={!sidebarOpen}
            />
            <SidebarItem
              icon={GraduationCap}
              label="Add Course"
              path="/education/add/course"
              isActive={isActive("/education/add/course")}
              isCollapsed={!sidebarOpen}
            />
          </SidebarGroup>

          <SidebarGroup icon={Code} label="Skills" isCollapsed={!sidebarOpen}>
            <SidebarItem
              icon={Code}
              label="All Skills"
              path="/skills"
              isActive={isActive("/skills")}
              isCollapsed={!sidebarOpen}
            />
            <SidebarItem
              icon={Code}
              label="Add Skill"
              path="/skills/add"
              isActive={isActive("/skills/add")}
              isCollapsed={!sidebarOpen}
            />
            <SidebarItem
              icon={Code}
              label="Add Category"
              path="/skills/add-category"
              isActive={isActive("/skills/add-category")}
              isCollapsed={!sidebarOpen}
            />
          </SidebarGroup>

          <SidebarGroup icon={Code} label="Skills" isCollapsed={!sidebarOpen}>
            <SidebarItem
              icon={Code}
              label="All Skills"
              path="/skills"
              isActive={isActive("/skills")}
              isCollapsed={!sidebarOpen}
            />
            <SidebarItem
              icon={Code}
              label="Add Skill"
              path="/skills/add"
              isActive={isActive("/skills/add")}
              isCollapsed={!sidebarOpen}
            />
          </SidebarGroup>

          <SidebarGroup
            icon={Briefcase}
            label="Projects"
            isCollapsed={!sidebarOpen}
          >
            <SidebarItem
              icon={Briefcase}
              label="All Projects"
              path="/projects"
              isActive={isActive("/projects")}
              isCollapsed={!sidebarOpen}
            />
            <SidebarItem
              icon={Briefcase}
              label="Add Project"
              path="/projects/add"
              isActive={isActive("/projects/add")}
              isCollapsed={!sidebarOpen}
            />
          </SidebarGroup>

          <SidebarGroup icon={FileText} label="Blog" isCollapsed={!sidebarOpen}>
            <SidebarItem
              icon={FileText}
              label="All Posts"
              path="/blog"
              isActive={isActive("/blog")}
              isCollapsed={!sidebarOpen}
            />
            <SidebarItem
              icon={FileText}
              label="Add Post"
              path="/blog/add"
              isActive={isActive("/blog/add")}
              isCollapsed={!sidebarOpen}
            />
          </SidebarGroup>

          <SidebarItem
            icon={Mail}
            label="Contact"
            path="/contact"
            isActive={isActive("/contact")}
            isCollapsed={!sidebarOpen}
          />
        </div>
      </div>
    </>
  );
}

// Missing ChevronLeft import
