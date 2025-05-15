"use client";

import { ReactNode, useState } from "react";
import { motion } from "motion/react";
import { cn } from "../../utils/cn";

export type TabType<T> = {
  id: number | string;
  label: string | ReactNode;
  data: T;
};

export type TabsProps<T> = {
  id: string | number;
  tabs: TabType<T>[];
  onChange?: (tab: TabType<T>) => void;
  disabled?: boolean;
  className?: string;
};

export const Tabs = <T,>({ tabs, className, ...props }: TabsProps<T>) => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const handleActiveTab = (tab: TabType<T>) => {
    setActiveTab(tab.id);
    props.onChange?.(tab);
  };

  return (
    <div
      className={cn(
        "bg-background-main relative flex h-[48px] w-full rounded-[12px] border border-white/10 p-1 shadow-sm transition-opacity duration-200",
        props.disabled && "pointer-events-none opacity-50",
        className,
      )}
    >
      {tabs.map((tab) => (
        <button
          key={`${props.id}-${tab.id}`}
          onClick={() => handleActiveTab(tab)}
          className={cn(
            "font-space-grotesk relative w-full p-[3px] text-[14px] font-bold text-gray-700 transition-all duration-200 focus-visible:outline-2",
            activeTab === tab.id && "text-white",
          )}
          type="button"
        >
          {activeTab === tab.id && (
            <motion.div
              layoutId={`${props.id}-bubble`}
              transition={{ type: "spring", stiffness: 500, damping: 50, mass: 1 }}
              className="absolute inset-0 z-10 h-full max-h-[100px] w-full max-w-[500px] rounded-[8px] bg-blue-600 mix-blend-difference shadow"
            />
          )}
          <span className="absolute top-1/2 left-1/2 z-20 w-full -translate-x-1/2 -translate-y-1/2">
            {tab.label}
          </span>
        </button>
      ))}
    </div>
  );
};
