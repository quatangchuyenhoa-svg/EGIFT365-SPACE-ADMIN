"use client";

import React from "react";
import Link from "next/link";
import { IconSchool, IconUsers, IconChevronRight } from "@tabler/icons-react";

interface SchoolConfig {
  slug: string;
  name: string;
  subTitle: string;
  domain: string;
  primaryColor: string;
  accentColor: string;
}

const SCHOOLS: SchoolConfig[] = [
  {
    slug: "nguyenbinhkhiem",
    name: "THPT Nguyễn Bỉnh Khiêm",
    subTitle: "Lớp 12A2 · Niên khóa 2023 - 2026",
    domain: "nguyenbinhkhiem.egift365.vn",
    primaryColor: "#2F4FA8",
    accentColor: "#F5A623",
  },
  {
    slug: "newton",
    name: "THPT Newton",
    subTitle: "Lớp 12A1 · Niên khóa 2023 - 2026",
    domain: "newton.egift365.vn",
    primaryColor: "#172033",
    accentColor: "#D63384",
  },
  {
    slug: "banmai",
    name: "THCS Ban Mai",
    subTitle: "Lớp 9A2 · Niên khóa 2021 - 2025",
    domain: "banmai.egift365.vn",
    primaryColor: "#A62B2B",
    accentColor: "#E2C33B",
  },
];

export default function MicrositesClient() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
      {SCHOOLS.map((school) => (
        <Link
          key={school.slug}
          href={`/manager/microsites/${school.slug}`}
          className="group relative bg-card hover:bg-zinc-50 border border-border/80 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 flex flex-col justify-between cursor-pointer select-none"
        >
          <div>
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 shadow-inner"
                style={{ backgroundColor: school.primaryColor }}
              >
                <IconSchool size={24} />
              </div>
              <div className="overflow-hidden">
                <h3 className="font-bold text-lg text-zinc-900 truncate group-hover:text-primary transition-colors">
                  {school.name}
                </h3>
                <p className="text-sm text-muted-foreground truncate">{school.subTitle}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <div className="flex justify-between items-center text-sm py-1.5 border-b border-dashed border-zinc-100">
                <span className="text-muted-foreground">Domain:</span>
                <span className="font-mono text-xs text-zinc-700 bg-zinc-100 px-2 py-0.5 rounded truncate max-w-[200px]">
                  {school.domain}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm py-1.5">
                <span className="text-muted-foreground">Colors:</span>
                <div className="flex gap-2.5 items-center">
                  <span 
                    className="w-4 h-4 rounded-full border border-zinc-200 shadow-sm"
                    style={{ backgroundColor: school.primaryColor }}
                    title="Primary Color"
                  />
                  <span 
                    className="w-4 h-4 rounded-full border border-zinc-200 shadow-sm"
                    style={{ backgroundColor: school.accentColor }}
                    title="Accent Color"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between text-sm font-semibold text-primary/90 group-hover:text-primary">
            <span className="flex items-center gap-1.5">
              <IconUsers size={16} />
              Quản lý học sinh
            </span>
            <IconChevronRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      ))}
    </div>
  );
}
