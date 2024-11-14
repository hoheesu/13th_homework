import React from 'react';

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      {children}
      <div className="bg-[#4d6ebc] w-screen h-full"></div>
    </div>
  );
}
