import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, ShieldCheck, TrendingUp, Truck, Globe2, BarChart3, 
  ChevronRight, CheckCircle2, Mail, Phone, MapPin 
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function Home() {
  return (
    <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-0 min-h-[calc(100vh-8rem)]">
      {/* Column 1: Brand & Hero (5/12) */}
      <div className="md:col-span-12 lg:col-span-5 border-r border-slate-800 p-8 md:p-16 flex flex-col justify-center bg-gradient-to-br from-slate-950 to-slate-900 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 right-10 w-64 h-64 border border-brand-gold rotate-45"></div>
          <div className="absolute bottom-10 left-10 w-32 h-32 border border-slate-700 -rotate-12"></div>
        </div>
        
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <div className="mb-8 flex gap-3">
            <span className="h-[2px] w-12 bg-brand-gold self-center"></span>
            <span className="text-brand-gold text-[10px] font-black uppercase tracking-[0.3em]">B2B Trade Consultancy</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black leading-[0.9] tracking-tighter mb-8 text-white">
            Source <span className="text-slate-500">Smarter.</span><br/>
            Trade <span className="text-slate-500">Globally.</span><br/>
            Grow <span className="text-brand-gold">Faster.</span>
          </h1>
          
          <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-sm font-light">
            We help businesses find the right products, at the right price, with full sourcing and trade support.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Link 
              to="/inquiry" 
              className="px-10 py-5 bg-brand-gold text-brand-navy font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-transform"
            >
              Start Inquiry
            </Link>
            <button 
              onClick={() => document.getElementById('strategic-caps')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-10 py-5 bg-slate-800 text-white font-black uppercase text-[10px] tracking-widest hover:bg-slate-700 transition-colors"
            >
              How It Works
            </button>
          </div>
        </motion.div>
      </div>

      {/* Column 2: Operations & Sourcing (4/12) */}
      <div id="strategic-caps" className="md:col-span-6 lg:col-span-4 border-r border-slate-800 flex flex-col pt-20 lg:pt-0">
        <div className="flex-1 p-8 md:p-12 border-b border-slate-800">
          <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] mb-12">Strategic Capability</h3>
          <div className="space-y-10">
            {[
              { id: "01", title: "Product Sourcing", desc: "Access high-quality manufacturing hubs in China and India." },
              { id: "02", title: "GVS Sudan Logistics", desc: "Localized trading and execution via GVS Import & Export Sudan." },
              { id: "03", title: "ME Consolidation", desc: "Warehousing and logistics hubs across the UAE and Middle East." }
            ].map((cap) => (
              <motion.div 
                key={cap.id}
                whileHover={{ x: 10 }}
                className="flex gap-6 group cursor-default"
              >
                <div className="w-14 h-14 bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 group-hover:border-brand-gold/50 transition-colors">
                  <span className="text-brand-gold font-mono text-sm">{cap.id}</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-wider mb-2 text-slate-200">{cap.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-[200px]">{cap.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="h-1/3 bg-slate-950/50 p-12 flex flex-col justify-end">
          <div className="p-8 border-l-4 border-brand-gold bg-slate-900/80 backdrop-blur-sm">
            <p className="text-sm italic text-slate-400 leading-relaxed">
              "To build a business ecosystem that empowers trade and creates sustainable growth across emerging markets."
            </p>
          </div>
        </div>
      </div>

      {/* Column 3: Global Reach (3/12) */}
      <div className="md:col-span-6 lg:col-span-3 p-8 md:p-12 flex flex-col justify-between relative bg-slate-950 pt-20 lg:pt-0">
        <div>
          <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] mb-12">Global Network</h3>
          <div className="space-y-2">
            {[
              { name: "Sudan", role: "GVS HUB" },
              { name: "China", role: "SOURCING" },
              { name: "India", role: "SOURCING" },
              { name: "UAE", role: "LOGISTICS" }
            ].map((loc) => (
              <div key={loc.name} className="flex justify-between items-center py-5 border-b border-slate-800/50 group">
                <span className="text-sm font-bold tracking-tight text-slate-300 group-hover:text-white transition-colors">{loc.name}</span>
                <span className={cn(
                  "text-[9px] px-3 py-1 font-black uppercase tracking-tighter rounded-sm",
                  loc.role === "GVS HUB" ? "bg-brand-gold text-brand-navy" : "bg-slate-800 text-brand-gold"
                )}>
                  {loc.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="bg-brand-gold p-10 text-brand-navy mt-12 md:mt-0"
        >
          <h4 className="text-3xl font-black mb-4 leading-none uppercase tracking-tighter">Ready to scale?</h4>
          <p className="text-xs mb-8 font-bold leading-tight opacity-70">
            Tell us what you need — we’ll help you source it with full trade support.
          </p>
          <Link 
            to="/inquiry"
            className="w-full py-4 bg-brand-navy text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center hover:bg-slate-900 transition-colors"
          >
            Start Inquiry
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export function About() {
  return (
    <div className="flex-1 bg-slate-950">
      <section className="py-24 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-gold opacity-5 skew-x-12 translate-x-20"></div>
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="mb-6 flex gap-3">
            <span className="h-[2px] w-12 bg-brand-gold self-center"></span>
            <span className="text-brand-gold text-[10px] font-black uppercase tracking-[0.3em]">Corporate Identity</span>
          </div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl md:text-8xl font-black text-white leading-none tracking-tighter mb-8"
          >
            Pioneering <br/>
            <span className="text-slate-700 underline decoration-brand-gold/30">Trade</span> Solutions.
          </motion.h1>
          <div className="max-w-2xl">
            <p className="text-xl text-slate-400 font-light leading-relaxed">
              Vavadia is a premier B2B trade consultancy focused on high-precision global sourcing and market-specific trade execution.
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 border-b border-slate-800">
        <div className="p-8 md:p-20 border-r border-slate-800">
          <h2 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] mb-12">Who We Are</h2>
          <div className="space-y-8">
            <p className="text-lg text-slate-300 leading-relaxed font-light">
              We connect ambition with supply. Our model leverages digital procurement mapping with a physical presence in key trade corridors across Sudan, India, China, and the Middle East.
            </p>
            <div className="p-10 border border-slate-800 bg-slate-900 shadow-2xl relative">
              <div className="absolute -top-3 -left-3 w-6 h-6 bg-brand-gold rotate-45"></div>
              <p className="text-sm italic text-brand-gold leading-relaxed">
                "We don't just find products; we build bridges between global manufacturing hubs and emerging market demands."
              </p>
            </div>
          </div>
        </div>
        <div className="bg-slate-900/50 p-8 md:p-20 flex items-center justify-center relative overflow-hidden">
           <div className="w-full max-w-md aspect-square border border-slate-800 rotate-45 flex items-center justify-center">
              <div className="w-3/4 h-3/4 border border-brand-gold/20 flex items-center justify-center rotate-45">
                 <span className="text-slate-800 font-black text-9xl -rotate-90">V</span>
              </div>
           </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 border-b border-slate-800">
        <div className="p-8 md:p-20 border-r border-slate-800 bg-slate-900">
          <div className="flex gap-4 items-center mb-10">
            <TrendingUp className="text-brand-gold w-5 h-5" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-white">Our Vision</h3>
          </div>
          <p className="text-slate-400 leading-relaxed font-light">
            To build a business ecosystem that empowers trade, strengthens distribution, and creates sustainable growth for all stakeholders across emerging markets.
          </p>
        </div>
        <div className="p-8 md:p-20 bg-slate-950">
          <div className="flex gap-4 items-center mb-10">
            <Globe2 className="text-brand-gold w-5 h-5" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-white">Our Mission</h3>
          </div>
          <p className="text-slate-400 leading-relaxed font-light">
            To deliver reliable products, efficient supply chains, and smart sourcing solutions by combining global procurement expertise with practical market understanding.
          </p>
        </div>
      </section>
    </div>
  );
}

export function Services() {
  const services = [
    { title: "Product Sourcing", desc: "Direct access to verified manufacturers across India, China, and high-growth markets.", icon: <Search /> },
    { title: "Supplier Verification", desc: "On-ground audit and compliance checks to ensure reliability and safety.", icon: <ShieldCheck /> },
    { title: "Price Comparison", desc: "Comprehensive benchmarking to ensure you pay the best market rate.", icon: <BarChart3 /> },
    { title: "Negotiation Support", desc: "Professional terms negotiation to secure favorable payment and MOQ conditions.", icon: <TrendingUp /> },
    { title: "Import Guidance", desc: "Assistance with documentation, HS codes, and regulatory compliance.", icon: <Globe2 /> },
    { title: "Warehouse & Consolidation", desc: "Hub services in UAE to combine orders and optimize shipping costs.", icon: <Truck /> },
    { title: "Sudan Local Supply", desc: "Direct trade execution inside Sudan through GVS Import & Export.", icon: <CheckCircle2 /> }
  ];

  return (
    <div className="flex-1 bg-slate-900">
      <section className="p-8 md:p-20 border-b border-slate-800">
        <div className="max-w-3xl">
          <div className="mb-6 flex gap-3">
            <span className="h-[2px] w-12 bg-brand-gold self-center"></span>
            <span className="text-brand-gold text-[10px] font-black uppercase tracking-[0.3em]">Operational Scope</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter mb-8 italic">
            Trade <span className="text-slate-600">Infrastructure.</span>
          </h1>
          <p className="text-slate-400 text-lg font-light leading-relaxed">
            From initial product identification to final delivery, we provide a seamless bridge for global B2B procurement and trade logistics.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-b border-slate-800">
        {services.map((s, i) => (
          <div key={i} className="p-12 border-r border-b border-slate-800 hover:bg-slate-950 transition-colors group">
            <div className="w-12 h-12 bg-slate-800 border border-slate-700 flex items-center justify-center mb-10 group-hover:border-brand-gold transition-colors">
              <span className="text-brand-gold">{React.cloneElement(s.icon as React.ReactElement, { size: 20 })}</span>
            </div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-4">{s.title}</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-light">{s.desc}</p>
          </div>
        ))}
        <Link to="/inquiry" className="p-12 bg-brand-gold flex flex-col justify-center gap-6 group">
          <h3 className="text-3xl font-black text-brand-navy uppercase leading-none tracking-tighter">Request Custom <br/> Sourcing Map</h3>
          <p className="text-xs font-bold text-brand-navy/60 uppercase tracking-widest">Submit Requirements Now</p>
          <div className="w-12 h-12 bg-brand-navy flex items-center justify-center group-hover:translate-x-2 transition-transform">
            <ChevronRight className="text-white" />
          </div>
        </Link>
      </section>
    </div>
  );
}

export function Network() {
  const hubs = [
    { country: "Sudan", role: "Local Market & Execution", details: "Core hub for trade distribution and direct import services through GVS.", color: "bg-slate-900 border-brand-gold/50" },
    { country: "India", role: "Primary Sourcing", details: "Direct connections with agricultural, industrial, and technology suppliers.", color: "bg-slate-800/50 border-slate-700" },
    { country: "China", role: "Manufacturing Hub", details: "Vetted electronic, machinery, and general product manufacturing network.", color: "bg-slate-800/50 border-slate-700" },
    { country: "UAE / Middle East", role: "Logistics Hub", details: "Strategic warehouse and consolidation partners in Dubai for global reach.", color: "bg-slate-800/50 border-slate-700" }
  ];

  return (
    <div className="flex-1 bg-slate-950">
      <section className="p-8 md:p-20 border-b border-slate-800">
        <div className="max-w-3xl">
          <div className="mb-6 flex gap-3">
            <span className="h-[2px] w-12 bg-brand-gold self-center"></span>
            <span className="text-brand-gold text-[10px] font-black uppercase tracking-[0.3em]">Global Footprint</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter mb-8 italic">
            Market <span className="text-slate-600">Saturation.</span>
          </h1>
          <p className="text-slate-400 text-lg font-light leading-relaxed">
            Our network is built on established trade corridors and physical presence in the world's most critical supply regions.
          </p>
        </div>
      </section>
      
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-b border-slate-800">
        {hubs.map((h, i) => (
          <motion.div 
            key={i} 
            whileHover={{ y: -5 }}
            className={cn("p-12 border-r border-b border-slate-800 h-[450px] flex flex-col justify-between group", h.color)}
          >
            <div className="space-y-6">
              <div className="w-10 h-10 border border-slate-700 flex items-center justify-center group-hover:border-brand-gold transition-colors">
                 <Globe2 className="w-4 h-4 text-brand-gold" />
              </div>
              <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">{h.country}</h3>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 border-l border-slate-700 pl-4">
                {h.role}
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-light italic">
              {h.details}
            </p>
          </motion.div>
        ))}
      </section>

      <section className="p-8 md:p-20 bg-slate-900 border-b border-slate-800 flex flex-col lg:flex-row gap-12 items-center">
        <div className="shrink-0 w-24 h-24 border-2 border-brand-gold flex items-center justify-center rotate-45">
          <Globe2 className="w-8 h-8 text-brand-gold -rotate-45" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">The Bridge Corridor</h2>
          <p className="text-slate-500 text-sm font-light leading-relaxed max-w-2xl">
            By strategically positioning our warehouse partners in UAE, we enable businesses in Sudan and neighboring regions to access Indian and Chinese manufacturing with lower shipping overheads and faster lead times.
          </p>
        </div>
        <div className="ml-auto">
          <Link to="/contact" className="px-8 py-4 border border-brand-gold text-brand-gold text-[10px] font-black uppercase tracking-widest hover:bg-brand-gold hover:text-brand-navy transition-all">
            Contact Network Desk
          </Link>
        </div>
      </section>
    </div>
  );
}

export function GVS() {
  return (
    <div className="flex-1 bg-slate-950">
      <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[80vh] border-b border-slate-800">
        <div className="p-8 md:p-20 flex flex-col justify-center border-r border-slate-800">
           <div className="mb-6 flex gap-3">
              <span className="h-[2px] w-12 bg-brand-gold self-center"></span>
              <span className="text-brand-gold text-[10px] font-black uppercase tracking-[0.3em]">Sudan Region Expansion</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-white leading-none tracking-tighter mb-8 italic">
              GVS <span className="text-slate-700">Import.</span>
            </h1>
            <p className="text-xl text-slate-400 font-light leading-relaxed mb-10 max-w-xl">
              Operating through <span className="text-brand-gold font-bold">GVS Import & Export</span>, we provide specialized trade execution and supply chain services within the Sudanese market.
            </p>
            
            <div className="grid grid-cols-2 gap-8 mb-12">
              <div>
                <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] mb-4">Core Focus</h4>
                <ul className="space-y-2">
                  {['Spare Parts', 'Agri Equipment', 'Irrigation Systems'].map((t) => (
                    <li key={t} className="text-xs text-slate-300 flex items-center gap-2">
                      <div className="w-1 h-1 bg-brand-gold"></div> {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-l border-slate-800 pl-8">
                <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] mb-4">Market Depth</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed uppercase">Navigating complex local regulations and logistics hubs in Port Sudan.</p>
              </div>
            </div>

            <Link to="/inquiry" className="w-full md:w-max px-12 py-5 bg-brand-gold text-brand-navy font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-transform text-center">
              Submit Sourcing Requirement
            </Link>
        </div>
        <div className="bg-slate-900 flex items-center justify-center p-8 overflow-hidden relative">
           <div className="w-full h-full border-2 border-slate-800 absolute inset-20"></div>
           <div className="w-full h-full border border-slate-800 absolute inset-40 rotate-12"></div>
           <div className="z-10 p-12 bg-slate-950 border border-slate-800 shadow-3xl text-center max-w-sm">
              <span className="text-brand-gold font-mono text-xs mb-4 block underline">EXECUTION 02</span>
              <p className="text-xl text-white font-black uppercase tracking-tighter italic">"Empowering the Sudanese industrial core."</p>
           </div>
        </div>
      </section>
    </div>
  );
}

export function Contact() {
  return (
    <div className="flex-1 bg-slate-900 border-b border-slate-800">
      <div className="grid grid-cols-1 md:grid-cols-12">
        <div className="md:col-span-5 p-8 md:p-20 border-r border-slate-800 bg-slate-950 flex flex-col justify-center">
           <div className="mb-6 flex gap-3">
            <span className="h-[2px] w-12 bg-brand-gold self-center"></span>
            <span className="text-brand-gold text-[10px] font-black uppercase tracking-[0.3em]">Communication Desk</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tighter mb-12">
            Get In <span className="text-slate-700 underline decoration-brand-gold/30">Touch.</span>
          </h1>
          
          <div className="space-y-4">
            {[
              { icon: <Mail />, label: "Email", value: "info@vavadia.com" },
              { icon: <Phone />, label: "Phone", value: "+249 9XX XXX XXXX" },
              { icon: <MapPin />, label: "Region", value: "Port Sudan / Khartoum" }
            ].map((item) => (
              <div key={item.label} className="p-6 border border-slate-800 bg-slate-900/50 flex items-center gap-6 group hover:border-slate-600 transition-colors">
                <div className="w-10 h-10 bg-slate-800 flex items-center justify-center text-brand-gold">
                  {React.cloneElement(item.icon as React.ReactElement, { size: 16 })}
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{item.label}</p>
                  <p className="text-sm font-bold text-white">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-7 p-8 md:p-20 bg-slate-900 flex flex-col justify-center">
           <div className="max-w-xl self-center w-full">
            <h2 className="text-sm font-black uppercase text-slate-400 tracking-[0.3em] mb-12 flex items-center gap-4">
              <div className="w-2 h-2 bg-brand-gold"></div> Direct Terminal
            </h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="md:col-span-1">
                 <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Name</label>
                 <input type="text" className="w-full bg-slate-950 border border-slate-800 p-4 text-white text-sm focus:border-brand-gold outline-none transition-colors" placeholder="IDENTIFIER" />
               </div>
               <div className="md:col-span-1">
                 <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Email</label>
                 <input type="email" className="w-full bg-slate-950 border border-slate-800 p-4 text-white text-sm focus:border-brand-gold outline-none transition-colors" placeholder="GATEWAY@DOMAIN.COM" />
               </div>
               <div className="md:col-span-2">
                 <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Subject</label>
                 <input type="text" className="w-full bg-slate-950 border border-slate-800 p-4 text-white text-sm focus:border-brand-gold outline-none transition-colors" placeholder="ROUTING_KEY" />
               </div>
               <div className="md:col-span-2">
                 <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Message Body</label>
                 <textarea rows={4} className="w-full bg-slate-950 border border-slate-800 p-4 text-white text-sm focus:border-brand-gold outline-none transition-colors resize-none" placeholder="ENCRYPTED_DATA_PACKET..."></textarea>
               </div>
               <div className="md:col-span-2">
                 <button className="w-full py-5 bg-brand-gold text-brand-navy font-black text-[10px] uppercase tracking-[0.4em] hover:bg-white transition-colors">
                    Transmit Message
                 </button>
               </div>
            </form>
           </div>
        </div>
      </div>
    </div>
  );
}

import { Inquiry as InquiryType } from '../types';

export function Inquiry() {
  const [formData, setFormData] = React.useState<Partial<InquiryType>>({
    requiredSupport: [],
    preferredSource: 'Any'
  });
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [allInquiries, setAllInquiries] = React.useState<InquiryType[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('vavadia_inquiries');
    if (saved) {
      setAllInquiries(JSON.parse(saved));
    }
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName) newErrors.fullName = 'Required';
    if (!formData.companyName) newErrors.companyName = 'Required';
    if (!formData.whatsapp) newErrors.whatsapp = 'Required';
    if (!formData.email) newErrors.email = 'Required';
    if (!formData.productName) newErrors.productName = 'Required';
    if (!formData.quantity) newErrors.quantity = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const newInquiry: InquiryType = {
        ...formData as InquiryType,
        id: crypto.randomUUID(),
        timestamp: Date.now()
      };
      const updated = [newInquiry, ...allInquiries];
      localStorage.setItem('vavadia_inquiries', JSON.stringify(updated));
      setAllInquiries(updated);
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleSupport = (item: string) => {
    const current = formData.requiredSupport || [];
    if (current.includes(item)) {
      setFormData({ ...formData, requiredSupport: current.filter(i => i !== item) });
    } else {
      setFormData({ ...formData, requiredSupport: [...current, item] });
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex-1 bg-slate-950 flex items-center justify-center p-8 min-h-[60vh]">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md w-full border border-slate-800 p-12 text-center bg-slate-950 shadow-2xl relative">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-brand-gold rotate-45 flex items-center justify-center">
             <CheckCircle2 className="text-brand-navy w-4 h-4 -rotate-45" />
          </div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Transmission Successful</h2>
          <p className="text-slate-500 text-xs mb-10 leading-relaxed uppercase tracking-widest font-bold">
            Inquiry logged. Our trade desk will review your requirement and establish communication within 72 hours.
          </p>
          <button 
            onClick={() => setIsSubmitted(false)}
            className="w-full py-4 bg-slate-800 text-slate-300 text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 transition-colors"
          >
            Create New Log
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-900 border-b border-slate-800">
      <div className="max-w-5xl mx-auto p-8 md:p-20 text-white">
        <div className="flex justify-between items-center mb-16">
          <div className="space-y-2 text-left">
            <div className="flex gap-3">
              <div className="w-2 h-2 bg-brand-gold"></div>
              <span className="text-brand-gold text-[10px] font-black uppercase tracking-[0.3em]">Trade Registry</span>
            </div>
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic">Inquiry Processing.</h1>
          </div>
          <button 
            onClick={() => setIsAdmin(!isAdmin)}
            className="text-[9px] font-black uppercase tracking-widest border border-slate-800 px-4 py-2 text-slate-500 hover:text-white transition-colors"
          >
            {isAdmin ? 'Operation Form' : 'Log View (ADMIN)'}
          </button>
        </div>

        {isAdmin ? (
          <div className="space-y-4">
            <h2 className="text-[10px] font-black text-brand-gold uppercase tracking-[0.3em] mb-8 border-b border-slate-800 pb-4 text-left">Recent Transactions</h2>
            {allInquiries.length === 0 ? (
              <div className="border border-slate-800 p-20 text-center text-slate-700 uppercase text-[10px] tracking-widest">No Active Logs Detected</div>
            ) : (
              allInquiries.map((inq) => (
                <div key={inq.id} className="border border-slate-800 p-6 flex flex-col md:flex-row justify-between gap-6 bg-slate-950 group hover:border-brand-gold/30 transition-colors text-left font-sans">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-black text-white uppercase tracking-tighter italic">{inq.productName}</span>
                      <span className="text-[9px] font-black bg-brand-gold text-brand-navy px-2 py-0.5 rounded-sm uppercase">{inq.productCategory}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest leading-none">
                      Requester: <span className="text-slate-300">{inq.fullName}</span> / Terminal: <span className="text-slate-300">{inq.companyName}</span>
                    </div>
                  </div>
                  <div className="text-right flex flex-col justify-between">
                    <div className="text-[9px] font-mono text-slate-700 uppercase">{new Date(inq.timestamp).toISOString()}</div>
                    <div className="text-[10px] font-black text-brand-gold uppercase tracking-[0.2em]">{inq.whatsapp}</div>
                  </div>
                </div>
              ))
            )}
            <button 
               className="text-[9px] font-black text-red-900 uppercase tracking-widest mt-8 hover:text-red-500 transition-colors block"
               onClick={() => { localStorage.removeItem('vavadia_inquiries'); setAllInquiries([]); }}
            >
              Purge Database
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="border border-slate-800 bg-slate-950 p-8 md:p-16 space-y-20">
            {/* Section 1: Contact Info */}
            <div className="space-y-12">
              <div className="flex gap-6 items-center">
                <div className="w-12 h-12 border border-slate-800 flex items-center justify-center shrink-0">
                  <span className="text-slate-500 font-mono text-xs">01</span>
                </div>
                <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white">Identifier Protocol</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                <div className="text-left font-sans">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Full Legal Name *</label>
                  <input 
                    type="text" 
                    className={cn("w-full bg-slate-900 border border-slate-800 p-4 text-white text-sm focus:border-brand-gold outline-none transition-all", errors.fullName && "border-red-900")}
                    placeholder="NAME IDENTIFIER"
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  />
                </div>
                <div className="text-left font-sans">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Company Terminal *</label>
                  <input 
                    type="text" 
                    className={cn("w-full bg-slate-900 border border-slate-800 p-4 text-white text-sm focus:border-brand-gold outline-none transition-all", errors.companyName && "border-red-900")}
                    placeholder="LEGAL ENTITY"
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                  />
                </div>
                <div className="text-left font-sans">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">WhatsApp Uplink *</label>
                  <input 
                    type="tel" 
                    className={cn("w-full bg-slate-900 border border-slate-800 p-4 text-white text-sm focus:border-brand-gold outline-none transition-all", errors.whatsapp && "border-red-900")}
                    placeholder="+249 XXXXXXXX"
                    onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                  />
                </div>
                <div className="text-left font-sans">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Gateway Email *</label>
                  <input 
                    type="email" 
                    className={cn("w-full bg-slate-900 border border-slate-800 p-4 text-white text-sm focus:border-brand-gold outline-none transition-all", errors.email && "border-red-900")}
                    placeholder="CONTACT@DOMAIN.COM"
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Product Specs */}
            <div className="space-y-12">
              <div className="flex gap-6 items-center">
                <div className="w-12 h-12 border border-slate-800 flex items-center justify-center shrink-0">
                  <span className="text-slate-500 font-mono text-xs">02</span>
                </div>
                <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white">Cargo Technicals</h3>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-8">
                <div className="lg:col-span-2 text-left font-sans">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Product Nomenclature *</label>
                  <input 
                    type="text" 
                    className={cn("w-full bg-slate-900 border border-slate-800 p-4 text-white text-sm focus:border-brand-gold outline-none transition-all", errors.productName && "border-red-900")}
                    onChange={(e) => setFormData({...formData, productName: e.target.value})}
                  />
                </div>
                <div className="text-left font-sans">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Vector Category</label>
                  <select 
                    className="w-full bg-slate-900 border border-slate-800 p-4 text-white text-xs focus:border-brand-gold outline-none appearance-none transition-all"
                    onChange={(e) => setFormData({...formData, productCategory: e.target.value})}
                  >
                    <option value="">SELECT VECTOR</option>
                    <option value="Industrial">Industrial</option>
                    <option value="Agricultural">Agricultural</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Automotive">Automotive</option>
                  </select>
                </div>
                <div className="text-left font-sans">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Volume Depth *</label>
                  <input 
                    type="text" 
                    className={cn("w-full bg-slate-900 border border-slate-800 p-4 text-white text-sm focus:border-brand-gold outline-none transition-all", errors.quantity && "border-red-900")}
                    placeholder="QUANTITY"
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  />
                </div>
                <div className="text-left font-sans">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Target Ceiling (USD)</label>
                  <input 
                    type="text" 
                    className="w-full bg-slate-900 border border-slate-800 p-4 text-white text-sm focus:border-brand-gold outline-none transition-all"
                    placeholder="E.G. 15.50 / UNIT"
                    onChange={(e) => setFormData({...formData, targetPrice: e.target.value})}
                  />
                </div>
                <div className="text-left font-sans">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Target Sourcing Hub</label>
                  <select 
                    className="w-full bg-slate-900 border border-slate-800 p-4 text-white text-xs focus:border-brand-gold outline-none appearance-none transition-all"
                    onChange={(e) => setFormData({...formData, preferredSource: e.target.value as any})}
                  >
                    <option value="Any">Global Neutral</option>
                    <option value="India">India Hub</option>
                    <option value="China">China Hub</option>
                    <option value="UAE">UAE Logistics</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: Professional Support */}
            <div className="space-y-12">
              <div className="flex gap-6 items-center">
                <div className="w-12 h-12 border border-slate-800 flex items-center justify-center shrink-0">
                  <span className="text-slate-500 font-mono text-xs">03</span>
                </div>
                <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white">Operation Modules</h3>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-800 border border-slate-800 text-left font-sans">
                {[
                  'Product sourcing', 'Supplier comparison', 'Supplier verification',
                  'Delivery to Sudan', 'Warehouse in UAE / ME', 'Local supply inside Sudan'
                ].map((item) => (
                  <label key={item} className="flex items-center gap-4 p-6 bg-slate-950 cursor-pointer hover:bg-slate-900 transition-colors group">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 accent-brand-gold"
                      checked={formData.requiredSupport?.includes(item)}
                      onChange={() => toggleSupport(item)}
                    />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-white transition-colors">{item}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-20 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-12 text-left font-sans">
               <div className="flex gap-6 items-start max-w-sm">
                  <div className="w-1 h-12 bg-brand-gold shrink-0"></div>
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-loose">
                    Transmission of this file initiates the trade identification sequence. Standard consultancy parameters apply globally.
                  </p>
               </div>
               <button 
                 type="submit"
                 className="w-full md:w-max px-20 py-6 bg-brand-gold text-brand-navy font-black text-[10px] uppercase tracking-[0.4em] shadow-3xl hover:bg-white active:scale-95 transition-all"
               >
                 Initiate Log Submission
               </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
