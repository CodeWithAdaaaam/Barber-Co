'use client';

import { useState, ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

type AccordionItemProps = {
  title: string;
  children: ReactNode;
};

export const AccordionItem = ({ title, children }: AccordionItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-anthracite-dark">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left py-6"
      >
        <h3 className="text-xl font-semibold text-off-white">{title}</h3>
        <ChevronDown
          className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180 text-gold' : 'text-white/50'}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="pb-6 text-white/70">{children}</div>
      </div>
    </div>
  );
};