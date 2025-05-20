"use client";

import { useAppSelector } from "@/redux/hooks";
import type React from "react";

import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type AuthGuardProps = {
  children: React.ReactNode;
};

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to login page with return url
      navigate("/login", { state: { from: location.pathname } });
    }
  }, [isAuthenticated, navigate, location]);

  // If not authenticated, don't render children
  if (!isAuthenticated) return null;

  return <>{children}</>;
}
