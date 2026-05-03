import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Linkedin, Facebook, Twitter, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="h-auto md:h-16 border-t border-slate-800 bg-brand-navy flex flex-col md:flex-row items-center px-4 md:px-10 justify-between gap-4 py-4 md:py-0">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-[10px] font-mono uppercase tracking-tighter text-slate-500">Network Online: Active</span>
        </div>
        <div className="hidden md:block h-4 w-[1px] bg-slate-800"></div>
        <span className="text-[10px] font-mono text-slate-500 uppercase">Latency: 42ms</span>
        <span className="text-[10px] font-mono text-slate-500 uppercase">Regions: SD, CN, IN, AE</span>
      </div>
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
        <span className="text-[10px] text-slate-500 tracking-widest font-bold uppercase">Vavadia &copy; 2026 Trade Management System</span>
        <div className="flex gap-4">
          <div className="w-2 h-2 bg-slate-800"></div>
          <div className="w-2 h-2 bg-slate-800"></div>
          <div className="w-2 h-2 bg-brand-gold"></div>
        </div>
      </div>
    </footer>
  );
}
