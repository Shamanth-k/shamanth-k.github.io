"use client";

import { useEffect } from "react";
import Clarity from "@microsoft/clarity";

export default function ClarityAnalytics() {
  useEffect(() => {
    Clarity.init("z5a3s2q9xs");
  }, []);

  return null;
}
