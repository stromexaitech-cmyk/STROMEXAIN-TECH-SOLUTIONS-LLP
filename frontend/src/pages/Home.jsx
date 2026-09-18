import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { BlackHoleHeroSection } from '../components/ui/blackhole-hero-section';

/** True while the viewport is narrow — mirrors the hero's own copy-vs-hole layout swap. */
function useNarrowViewport(query = '(max-width: 767px)') {
    const [narrow, setNarrow] = useState(false);
    useEffect(() => {
        const m = window.matchMedia(query);
        const sync = () => setNarrow(m.matches);
        sync();
        m.addEventListener('change', sync);
        return () => m.removeEventListener('change', sync);
    }, [query]);
    return narrow;
}

/* ─────────────────────────────────────────────────
   Neural Network Canvas Utility
   Lightweight animated node-edge graph.
   Returns a cleanup function to cancel on unmount.
───────────────────────────────────────────────── */
function initNeuralNetwork(canvas, nodeCount = 38) {
    if (!canvas) return () => {};
    const ctx = canvas.getContext('2d');
    let animId;
    let w, h, nodes = [];
    const DIST = 175;

    function resize() {
        w = canvas.width  = canvas.offsetWidth;
        h = canvas.height = canvas.offsetHeight;
        nodes = Array.from({ length: nodeCount }, () => ({
            x:  Math.random() * w,
            y:  Math.random() * h,
            vx: (Math.random() - 0.5) * 0.26,
            vy: (Math.random() - 0.5) * 0.26,
            r:  Math.random() * 2 + 1.4,
        }));
    }

    function draw() {
        ctx.clearRect(0, 0, w, h);
        for (let i = 0; i < nodes.length; i++) {
            const a = nodes[i];
            a.x += a.vx; a.y += a.vy;
            if (a.x < 0 || a.x > w) a.vx *= -1;
            if (a.y < 0 || a.y > h) a.vy *= -1;
            for (let j = i + 1; j < nodes.length; j++) {
                const b = nodes[j];
                const dx = b.x - a.x, dy = b.y - a.y;
                const d = Math.sqrt(dx * dx + dy * dy);
                if (d < DIST) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(37,99,235,${(1 - d / DIST) * 0.5})`;
                    ctx.lineWidth = 0.65;
                    ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
                }
            }
        }
        for (const n of nodes) {
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(37,99,235,0.48)';
            ctx.fill();
        }
        animId = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
}

/* Split so each word can be pulled into place independently — see the
   gravitational-collapse reveal wired up in the Home component below. */
const HERO_HEADLINE_WORDS = ['Where', 'Complexity', 'Collapses', 'Into', 'Clarity'];

const Home = () => {

    const dynamicTypingRef = useRef(null);
    const narrow = useNarrowViewport();
    const heroHeadlineRef = useRef(null);

    const servicesCanvasRef = useRef(null);
    const aboutCanvasRef    = useRef(null);
    const whyCanvasRef      = useRef(null);

    /* Headline reveal — each word is pulled into place from a scattered,
       blurred start, like matter converging under gravity before it settles
       into the shape of a sentence. Matches the black hole behind it instead
       of a generic fade-up. */
    useEffect(() => {
        const words = heroHeadlineRef.current?.querySelectorAll('.hero-word-collapse');
        if (!words || !words.length) return;
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduced) {
            words.forEach((w) => { w.style.opacity = '1'; });
            return;
        }

        words.forEach((w, i) => {
            const angle = (i / words.length) * Math.PI * 2 + Math.random() * 0.8;
            const dist = 46 + Math.random() * 34;
            // anime.js's transform engine parses translateX/translateY/scale
            // as separate function tokens — the translate(x, y) shorthand
            // isn't recognized, so the words never actually animate back.
            w.style.transform = `translateX(${Math.cos(angle) * dist}px) translateY(${Math.sin(angle) * dist}px) scale(1.7)`;
            w.style.opacity = '0';
            w.style.filter = 'blur(10px)';
        });

        if (window.anime) {
            window.anime({
                targets: words,
                translateX: 0,
                translateY: 0,
                scale: 1,
                opacity: [0, 1],
                filter: ['blur(10px)', 'blur(0px)'],
                easing: 'easeOutExpo',
                duration: 1100,
                delay: window.anime.stagger(90, { start: 150 }),
            });
        } else {
            words.forEach((w) => {
                w.style.transition = 'transform 900ms cubic-bezier(.16,1,.3,1), opacity 700ms ease, filter 900ms ease';
                w.style.transform = 'none';
                w.style.opacity = '1';
                w.style.filter = 'blur(0px)';
            });
        }
    }, []);

    /* Neural networks */
    useEffect(() => {
        const c1 = initNeuralNetwork(servicesCanvasRef.current, 40);
        const c2 = initNeuralNetwork(aboutCanvasRef.current,    26);
        const c3 = initNeuralNetwork(whyCanvasRef.current,      20);
        return () => { c1(); c2(); c3(); };
    }, []);

    /* Anime / reveal / stats counter / typing */
    useEffect(() => {
        if (window.anime) {
            const svcObs = new IntersectionObserver(entries => {
                entries.forEach(e => {
                    if (e.isIntersecting) {
                        window.anime({ targets: e.target, opacity:[0,1], translateY:[40,0], duration:800, easing:'easeOutQuart' });
                        window.anime({ targets: e.target.querySelectorAll('.card-icon,.card-desc,.card-list li'), opacity:[0,1], translateY:[20,0], delay: window.anime.stagger(60), easing:'easeOutQuart' });
                        svcObs.unobserve(e.target);
                    }
                });
            }, { threshold: 0.1 });
            document.querySelectorAll('.service-card').forEach(c => svcObs.observe(c));
        }

        /* Reveal + stat counter */
        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('is-visible');
                    e.target.querySelectorAll('.headline-word').forEach(w => w.classList.add('is-visible'));
                    if (e.target.classList.contains('reveal')) {
                        const stat = e.target.querySelector('.stat-number');
                        if (stat && !stat.dataset.counted) {
                            const end = parseInt(stat.dataset.target), dur = 2000;
                            const step = ts => {
                                if (!stat.dataset.startTime) stat.dataset.startTime = ts;
                                const p = Math.min((ts - stat.dataset.startTime) / dur, 1);
                                stat.textContent = Math.floor(p * end);
                                if (p < 1) requestAnimationFrame(step);
                            };
                            requestAnimationFrame(step);
                            stat.dataset.counted = true;
                        }
                    }
                    obs.unobserve(e.target);
                }
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

        /* Typing animation */
        const dynamicEl = dynamicTypingRef.current;
        if (dynamicEl && !dynamicEl.dataset.initialized) {
            dynamicEl.dataset.initialized = 'true';
            dynamicEl.textContent = '';
            const words = [
                { text: "Growth",         color: "#22c55e" },
                { text: "Potential",      color: "#3b82f6" },
                { text: "Success",        color: "#eab308" },
                { text: "Opportunities",  color: "#a855f7" },
                { text: "Innovation",     color: "#ec4899" },
                { text: "Challenges",     color: "#f97316" },
                { text: "Efficiency",     color: "#06b6d4" },
                { text: "Scalability",    color: "#8b5cf6" },
            ];
            let wIdx = 0, cIdx = 0, isDeleting = false, timeoutId;
            function type() {
                if (!dynamicEl) return;
                const word = words[wIdx];
                dynamicEl.style.color = word.color; dynamicEl.className = 'dynamic-word';
                if (!isDeleting) {
                    dynamicEl.textContent = word.text.substring(0, cIdx + 1); cIdx++;
                    if (cIdx === word.text.length) { isDeleting = true; timeoutId = setTimeout(type, 2000); return; }
                } else {
                    dynamicEl.textContent = word.text.substring(0, cIdx - 1); cIdx--;
                    if (cIdx === 0) { isDeleting = false; wIdx = (wIdx + 1) % words.length; }
                }
                timeoutId = setTimeout(type, isDeleting ? 50 : 100);
            }
            timeoutId = setTimeout(type, 500);
            return () => {
                clearTimeout(timeoutId);
                if (dynamicEl) dynamicEl.dataset.initialized = '';
            };
        }
    }, []);

    /* ── Review data ── */
    const reviews = [
        { name:'Anil Kumar',     role:'Founder, Innovate Solutions',     color:'0ea5e9', text:'"StromeX Tech transformed our IT infrastructure. Their cloud migration was seamless, and their support is always responsive and professional."' },
        { name:'Priya Sharma',   role:'CTO, Secure Solutions',           color:'8b5cf6', text:'"The security services from StromeX have been a game-changer for us. We feel much more confident in our data protection and threat detection."', delay:'100ms' },
        { name:'Sanjay Kohli',   role:'Director of IT, Global Logistics', color:'3b82f6', text:'"We\'ve been using StromeX Tech for all our networking needs for years. The reliability and expertise of their team are unmatched."', delay:'200ms' },
        { name:'Vikram Rao',     role:'Operations Manager, VRA Industries',color:'ec4899', text:'"The team at StromeX provided excellent networking solutions for our new office. The setup was fast and flawless."' },
        { name:'Aditi Singh',    role:'Business Owner, Tech Innovators',  color:'f59e0b', text:'"I am highly impressed with their support team. They helped me with a critical hardware issue promptly, minimizing our downtime."', delay:'100ms' },
        { name:'Jaspreet Singh', role:'Retail Manager, Smart Mart',       color:'10b981', text:'"We were looking for reliable peripherals and StromeX provided us with top-quality products that fit our budget perfectly."', delay:'200ms' },
    ];

    /* ── Partner rows data ── */
    const partnersRow1 = [
        { name:'Dell',             logo:'https://upload.wikimedia.org/wikipedia/commons/1/18/Dell_logo_2016.svg' },
        { name:'Apple',            logo:'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
        { name:'Microsoft',        logo:'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg' },
        { name:'Samsung',          logo:'https://cdn.simpleicons.org/samsung/1428A0' },
        { name:'Cisco',            logo:'https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg' },
        { name:'Google Workspace', logo:'https://upload.wikimedia.org/wikipedia/commons/5/5f/Google_Workspace_Logo.svg' },
        { name:'AWS',              logo:'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg' },
        { name:'Adobe',            logo:'https://upload.wikimedia.org/wikipedia/commons/6/6e/Adobe_Corporate_logo.svg' },
        { name:'Lenovo',           logo:'https://cdn.simpleicons.org/lenovo/E2231A' },
        { name:'Sophos',           logo:'https://upload.wikimedia.org/wikipedia/commons/e/e1/Sophos_logo.png' },
        { name:'Slack',            logo:'https://upload.wikimedia.org/wikipedia/commons/b/b9/Slack_Technologies_Logo.svg' },
        { name:'HP',               logo:'https://upload.wikimedia.org/wikipedia/commons/a/ad/HP_logo_2012.svg' },
    ];
    const partnersRow2 = [
        { name:'Fortinet',     logo:'https://cdn.simpleicons.org/fortinet/EE3124' },
        { name:'Zoom',         logo:'https://cdn.simpleicons.org/zoom/2D8CFF' },
        { name:'Juniper',      logo:'https://upload.wikimedia.org/wikipedia/commons/3/31/Juniper_Networks_logo.svg' },
        { name:'Azure',        logo:'https://upload.wikimedia.org/wikipedia/commons/f/fa/Microsoft_Azure.svg' },
        { name:'Google Cloud', logo:'https://upload.wikimedia.org/wikipedia/commons/0/01/Google-cloud-platform.svg' },
        { name:'VMware',       logo:'https://upload.wikimedia.org/wikipedia/commons/9/9a/Vmware.svg' },
        { name:'Symantec',     logo:'https://cdn.simpleicons.org/broadcom/CC0000' },
        { name:'Oracle',       logo:'https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg' },
        { name:'IBM',          logo:'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg' },
        { name:'Dropbox',      logo:'https://cdn.simpleicons.org/dropbox/0061FF' },
        { name:'Atlassian',    logo:'https://cdn.simpleicons.org/atlassian/0052CC' },
        { name:'Nutanix',      logo:'https://cdn.simpleicons.org/nutanix/024DA1' },
    ];

    return (
        <React.Fragment>

            {/* ══════════════════════════════
                Hero
            ══════════════════════════════ */}
            <section className="relative w-full" style={{ minHeight: '100svh' }}>
                <BlackHoleHeroSection
                    focus={narrow ? [0.5, 0.76] : [0.74, 0.46]}
                    scrim={narrow ? 'top' : 'left'}
                    scrimStrength={0.92}
                    distance={24}
                    elevation={narrow ? -7 : -5.5}
                    fov={narrow ? 58 : 42}
                    steps={narrow ? 200 : 300}
                    resolution={narrow ? 0.6 : 0.7}
                    hotColor="#EAF4FF"
                    midColor="#38BDF8"
                    coolColor="#054494"
                >
                    <div className={`container mx-auto px-6 relative flex ${narrow ? 'items-start pt-24' : 'items-center'}`} style={{ minHeight: '100svh', zIndex: 10 }}>
                        <div style={{ maxWidth: '40rem' }}>
                            <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', padding:'5px 16px', borderRadius:'99px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.14)', marginBottom:'24px' }}>
                                <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#F4F5F7', animation:'pulseDot 2s infinite' }}></span>
                                <span style={{ color:'#9AA3AF', fontSize:'11px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.12em', fontFamily:'DM Sans,sans-serif' }}>Trusted IT Partner 2025</span>
                            </div>

                            <h1 ref={heroHeadlineRef} className="text-3xl sm:text-5xl md:text-6xl hero-glow-text" style={{ fontFamily:'Outfit,sans-serif', fontWeight:800, letterSpacing:'-0.03em', color:'#F4F5F7', lineHeight:1.05, marginBottom:'24px', maxWidth:'19ch' }}>
                                {HERO_HEADLINE_WORDS.map((word, i) => (
                                    <span key={i} className="hero-word-collapse" style={{ display:'inline-block', willChange:'transform, filter, opacity', marginRight:'0.26em' }}>
                                        {word}
                                    </span>
                                ))}
                            </h1>

                            <p className="reveal" style={{ color:'#9AA3AF', fontSize:'1.1rem', lineHeight:1.7, maxWidth:'44ch', margin:'0 0 36px' }}>
                                Transforming businesses with next-generation AI, cloud infrastructure, and enterprise-grade security solutions.
                            </p>

                            <div className="flex flex-wrap reveal" style={{ gap:'14px' }}>
                                <Link to="/solutions" className="hero-btn-primary">
                                    <i className="fas fa-rocket" style={{ fontSize:'14px' }}></i> Explore services
                                </Link>
                                <Link to="/contact" className="hero-btn-secondary">
                                    <i className="fas fa-paper-plane" style={{ fontSize:'14px' }}></i> Get in touch
                                </Link>
                            </div>

                            <div className="reveal" style={{ marginTop:'44px', display:'flex', alignItems:'center', gap:'28px', flexWrap:'wrap' }}>
                                {[
                                    { icon:'fa-users',          val:'250+', label:'Happy Clients'    },
                                    { icon:'fa-server',         val:'99%',  label:'Uptime SLA'       },
                                    { icon:'fa-globe',          val:'15+',  label:'Years Experience' },
                                ].map((item, i) => (
                                    <div key={i} style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                                        <div style={{ width:'34px', height:'34px', borderRadius:'10px', background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.14)', display:'flex', alignItems:'center', justifyContent:'center', color:'#F4F5F7', fontSize:'13px' }}>
                                            <i className={`fas ${item.icon}`}></i>
                                        </div>
                                        <div style={{ textAlign:'left' }}>
                                            <div style={{ color:'#F4F5F7', fontWeight:800, fontSize:'1.05rem', fontFamily:'Outfit,sans-serif', lineHeight:1 }}>{item.val}</div>
                                            <div style={{ color:'#9AA3AF', fontSize:'10px', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.1em' }}>{item.label}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </BlackHoleHeroSection>
                <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'70px', background:'linear-gradient(to top,#021840,transparent)', zIndex:9 }}></div>
            </section>

            {/* ══════════════════════════════
                Stats
                bg: light sky-blue gradient (stats-section class)
            ══════════════════════════════ */}
            <section className="stats-section overflow-hidden">
                <div className="max-w-screen-2xl mx-auto px-6 relative">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
                        {[
                            { target:250, suffix:'+', label:'Global Clients',     icon:'fa-users',          color:'#054494' },
                            { target:99,  suffix:'%', label:'System Uptime',      icon:'fa-server',         color:'#02A2F0' },
                            { target:15,  suffix:'+', label:'Years Experience',   icon:'fa-calendar-check', color:'#016FE2' },
                            { target:500, suffix:'+', label:'Projects Delivered', icon:'fa-trophy',         color:'#FF6E04' },
                        ].map((s, i) => (
                            <div key={i} className="text-center reveal" style={{ transitionDelay:`${i*80}ms` }}>
                                <div style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:'46px', height:'46px', borderRadius:'14px', background:`${s.color}12`, border:`1px solid ${s.color}22`, marginBottom:'10px' }}>
                                    <i className={`fas ${s.icon}`} style={{ color:s.color, fontSize:'17px' }}></i>
                                </div>
                                <div style={{ fontFamily:'Outfit,sans-serif', fontSize:'2.8rem', fontWeight:900, color:s.color, lineHeight:1, marginBottom:'6px' }}>
                                    <span className="stat-number" data-target={s.target}>0</span>{s.suffix}
                                </div>
                                <div style={{ color:'#94A3B8', textTransform:'uppercase', letterSpacing:'0.18em', fontSize:'10px', fontWeight:700 }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════
                About — Empowering Innovation
                bg: soft sky-blue tint (about-section-wrap)
            ══════════════════════════════ */}
            <section className="about-section-wrap">
                {/* bg layers */}
                <canvas ref={aboutCanvasRef} className="about-neural-canvas" aria-hidden="true" />
                <div className="section-grid-lines" aria-hidden="true" />
                <div className="about-orb-1" aria-hidden="true" />
                <div className="about-orb-2" aria-hidden="true" />
                <div className="about-dot-accent-1" aria-hidden="true" />
                <div className="about-dot-accent-2" aria-hidden="true" />

                <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                        {/* Left */}
                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-bold tracking-widest uppercase mb-6">
                                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                                The Vanguard of Innovation
                            </div>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-8">
                                Empowering Innovation with{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">AI-Driven Solutions.</span>
                            </h2>
                            <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-xl">
                                At StromeXAI Tech Solutions, we provide advanced IT infrastructure and smart technology
                                services, ensuring businesses thrive in secure, scalable, and efficient digital environments.
                            </p>
                            <div className="flex flex-wrap gap-3 mb-10">
                                <div className="pillar-badge"><i className="fas fa-microchip text-blue-500"></i> AI Integration</div>
                                <div className="pillar-badge"><i className="fas fa-cloud text-sky-500"></i> Cloud First</div>
                                <div className="pillar-badge"><i className="fas fa-fingerprint text-indigo-500"></i> Security Centric</div>
                            </div>
                            <div className="flex items-center gap-8">
                                <Link to="/about" className="px-9 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">
                                    Our Legacy
                                </Link>
                                <Link to="/contact" className="text-slate-900 font-bold hover:text-blue-600 flex items-center gap-2 transition-all group">
                                    Collaborative Partnership <i className="fas fa-arrow-right group-hover:translate-x-2 transition-transform"></i>
                                </Link>
                            </div>
                        </div>

                        {/* Right */}
                        <div className="relative reveal" style={{ transitionDelay:"200ms" }}>
                            <div className="dot-grid absolute -top-12 -right-12 w-80 h-80 -z-10 opacity-30"></div>
                            <div className="dot-grid absolute -bottom-12 -left-12 w-80 h-80 -z-10 opacity-30"></div>
                            <div className="relative z-10 p-4 bg-white/60 backdrop-blur-md border border-slate-200 rounded-[3rem] shadow-2xl">
                                <img src="https://assets.zyrosite.com/YNq24D1owzh9BMDW/screenshot-2025-08-17-at-8.17.00a-am-Yg2yzkPpq6HMpzMQ.png"
                                    alt="Collaborative Tech Team"
                                    className="floating-image rounded-[3rem] w-full aspect-[16/10] object-cover shadow-inner" />
                                <div className="absolute -bottom-10 -right-10 glass-card p-5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] bg-white/95 backdrop-blur-xl max-w-[210px] border border-blue-50">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                                            <i className="fas fa-award"></i>
                                        </div>
                                        <div className="font-bold text-slate-900 text-sm leading-tight">Tier-1 <br />Provider</div>
                                    </div>
                                    <p className="text-[11px] text-slate-500 leading-relaxed font-medium">Ranked #1 for Infrastructure Security & AI Deployment in 2025.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════
                Mission / Vision
                bg: warm light grey (mv-section-wrap)
            ══════════════════════════════ */}
            <section className="mv-section-wrap">
                <div className="max-w-screen-2xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="mv-card reveal">
                            <div className="w-14 h-14 bg-blue-100 rounded-3xl flex items-center justify-center text-blue-600 text-xl mb-6">
                                <i className="fas fa-rocket"></i>
                            </div>
                            <h3>Our Mission</h3>
                            <p>To empower businesses with transformative technology and intelligent solutions that drive efficiency and foster innovation.</p>
                        </div>
                        <div className="mv-card reveal" style={{ transitionDelay:"150ms" }}>
                            <div className="w-14 h-14 bg-indigo-100 rounded-3xl flex items-center justify-center text-indigo-600 text-xl mb-6">
                                <i className="fas fa-eye"></i>
                            </div>
                            <h3>Our Vision</h3>
                            <p>To be a globally recognized leader in AI-powered services, shaping the future through relentless dedication to excellence.</p>
                        </div>
                        <div id="elite-values-box" className="reveal relative overflow-hidden group" style={{ transitionDelay:"300ms" }}>
                            <div className="absolute -top-10 -right-10 w-36 h-36 bg-blue-500/10 blur-3xl rounded-full"></div>
                            <h3 className="relative z-10">Elite Values</h3>
                            <div className="space-y-6 relative z-10">
                                <div className="ev-item">
                                    <div className="ev-icon group-hover:bg-blue-500 group-hover:text-white transition-all duration-500 text-blue-400"><i className="fas fa-lightbulb text-xl"></i></div>
                                    <div><div className="ev-title">Innovation</div><div className="ev-sub">Next-gen thinking</div></div>
                                </div>
                                <div className="ev-item">
                                    <div className="ev-icon group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500 text-emerald-400"><i className="fas fa-shield-halved text-xl"></i></div>
                                    <div><div className="ev-title">Integrity</div><div className="ev-sub">Unwavering trust</div></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════
                Services — Premier Enterprise
                bg: pale blue-grey (services-section)
            ══════════════════════════════ */}
            <section className="services-section">
                {/* bg layers */}
                <canvas ref={servicesCanvasRef} className="services-neural-canvas" aria-hidden="true" />
                <div className="section-grid-lines" aria-hidden="true" />
                <div className="services-orb-1" aria-hidden="true" />
                <div className="services-orb-2" aria-hidden="true" />
                <div className="services-orb-3" aria-hidden="true" />
                <div className="absolute inset-0 bg-[radial-gradient(#c7d9f0_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25" style={{ zIndex:1 }}></div>

                <div className="max-w-screen-2xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-14 reveal">
                        <div className="inline-block px-4 py-1.5 mb-5 text-[10px] font-bold tracking-[0.2em] text-blue-600 uppercase bg-blue-50 rounded-full border border-blue-100">Our Expertise</div>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-5 tracking-tight">Premier Enterprise Solutions</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto text-base leading-relaxed">Scalable, efficient, and secure technology suites designed to keep your infrastructure at peak performance.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { title:'Cloud Security',    icon:'https://img.icons8.com/fluency/48/cloud.png',          color:'blue',   items:['Cloud Migration','Strategy Consulting','Zero-Trust Security'] },
                            { title:'IT Infrastructure', icon:'https://img.icons8.com/fluency/48/server.png',         color:'indigo', items:['Network Implementation','Server Management','Data Center Design'], delay:'50ms' },
                            { title:'Device & MDM',      icon:'https://img.icons8.com/fluency/48/computer.png',       color:'blue',   items:['Zero-Touch Deployment','Asset Management','App Provisioning'], delay:'100ms' },
                            { title:'Network Security',  icon:'https://img.icons8.com/fluency/48/cyber-security.png', color:'indigo', items:['Firewall Management','Remote VPN Access','Endpoint Protection'], delay:'150ms' },
                            { title:'IT Consultancy',    icon:'https://img.icons8.com/fluency/48/consultation.png',   color:'blue',   items:['Tech Architecture','Certification Bootcamps','Process Audits'], delay:'200ms' },
                            { title:'Gifting Solutions', icon:'https://img.icons8.com/fluency/48/gift.png',           color:'indigo', items:['Custom Branding','Global Logistics','Event Management'], delay:'250ms' },
                        ].map((svc, i) => (
                            <div key={i} className="service-card group hover:-translate-y-2" style={svc.delay ? { transitionDelay:svc.delay } : {}}>
                                <div className="flex items-center mb-6">
                                    <div className={`service-card-icon-wrap ${svc.color === 'indigo' ? 'indigo' : ''} w-14 h-14 rounded-2xl flex items-center justify-center mr-4`}>
                                        <img src={svc.icon} className="w-8 h-8 card-icon" alt={svc.title} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900">{svc.title}</h3>
                                </div>
                                <ul className="space-y-3 text-slate-500 text-sm card-list font-medium">
                                    {svc.items.map((it, j) => (
                                        <li key={j} className="flex items-center">
                                            <span className={`w-5 h-5 rounded-full bg-${svc.color}-50 text-${svc.color}-600 flex items-center justify-center mr-3 text-[10px]`}><i className="fas fa-check"></i></span>
                                            {it}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════
                Why Partner With Us
                bg: light lavender tint (why-section)
            ══════════════════════════════ */}
            <section className="why-section">
                {/* bg layers */}
                <canvas ref={whyCanvasRef} className="why-neural-canvas" aria-hidden="true" />
                <div className="why-grid-lines" aria-hidden="true" />
                <div className="why-orb-1" aria-hidden="true" />
                <div className="why-orb-2" aria-hidden="true" />

                <div className="max-w-screen-2xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-12 reveal">
                        <h2 className="text-4xl text-slate-800 font-bold mb-3">Why Partner With Us?</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon:'fa-certificate',    color:'text-red-500',    title:'Certified Expertise',  desc:'Engineers holding 100+ multi-vendor certifications.' },
                            { icon:'fa-diagram-project',color:'text-blue-500',   title:'Scalable Solutions',   desc:'Stable, secure networks that scale with your growth.', delay:'100ms' },
                            { icon:'fa-chart-line',     color:'text-green-500',  title:'Reliable Performance', desc:'Enterprise-grade uptime and consistent delivery.', delay:'200ms' },
                            { icon:'fa-network-wired',  color:'text-orange-500', title:'Proactive Management', desc:'Preventive monitoring to minimize any disruptions.', delay:'300ms' },
                        ].map((c, i) => (
                            <div key={i} className="glass-card p-7 reveal text-center" style={c.delay ? { transitionDelay:c.delay } : {}}>
                                <i className={`fas ${c.icon} text-3xl ${c.color} mb-5`}></i>
                                <h4 className="text-base font-bold text-slate-800 mb-2">{c.title}</h4>
                                <p className="text-slate-500 text-sm">{c.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center reveal" style={{ marginTop: '4rem' }}>
                        <div className="typing-text">
                            <span id="static-typing">Unlocking Your Business </span>
                            <span id="dynamic-typing" ref={dynamicTypingRef}></span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════
                Technology Partners
                bg: warm off-white (partners-section-wrap)
            ══════════════════════════════ */}
            <section className="partners-section-wrap">
                <div className="max-w-screen-2xl mx-auto px-6">
                    <div className="text-center mb-12 reveal">
                        <div className="section-pill" style={{ margin:'0 auto 14px' }}>
                            <span className="dot"></span> Trusted By The Best
                        </div>
                        <h2 className="text-4xl font-bold mb-3" style={{ fontFamily:'Outfit,sans-serif', color:'#0F172A' }}>Our Technology Partners</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed">Collaborating with world-class industry leaders to deliver elite solutions.</p>
                    </div>

                    <div className="relative overflow-hidden flex flex-col gap-4 w-full fade-edges">
                        <div className="marquee-track left">
                            {[...partnersRow1, ...partnersRow1].map((p, i) => (
                                <a key={i} href="#" className="partner-logo bg-white border border-gray-200 flex items-center justify-center p-5 h-24 mx-2">
                                    <img src={p.logo} alt={p.name} style={{ maxHeight:'38px', maxWidth:'80px' }} />
                                </a>
                            ))}
                        </div>
                        <div className="marquee-track right">
                            {[...partnersRow2, ...partnersRow2].map((p, i) => (
                                <a key={i} href="#" className="partner-logo bg-white border border-gray-200 flex items-center justify-center p-5 h-24 mx-2">
                                    <img src={p.logo} alt={p.name} style={{ maxHeight:'38px', maxWidth:'80px' }} />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════
                Client Reviews
                bg: light cool grey (reviews-section-wrap)
            ══════════════════════════════ */}
            <section className="reviews-section-wrap">
                <div className="max-w-screen-2xl mx-auto px-6">
                    <div className="text-center mb-12 reveal">
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">What Our Clients Say</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed">Hear from businesses that have partnered with us and experienced real growth and security.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {reviews.map((r, i) => (
                            <div key={i} className="glass-card p-7 flex flex-col items-center text-center reveal transition-all duration-300 hover:-translate-y-2" style={r.delay ? { transitionDelay:r.delay } : {}}>
                                <div className="flex text-yellow-400 mb-4">{[...Array(5)].map((_, s) => <i key={s} className="fas fa-star"></i>)}</div>
                                <p className="text-slate-600 italic mb-6 leading-relaxed text-sm">{r.text}</p>
                                <div className="mt-auto">
                                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(r.name)}&background=${r.color}&color=fff`}
                                        alt={r.name} className="rounded-full h-12 w-12 mb-3 mx-auto border-2 border-white shadow-sm" />
                                    <p className="font-bold text-slate-800 text-sm">{r.name}</p>
                                    <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-1">{r.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════
                CTA
                bg: light grey (cta-section-wrap)
            ══════════════════════════════ */}
            <section className="cta-section-wrap">
                <div className="max-w-6xl mx-auto cta-power-card reveal relative">
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                                Ready to Elevate Your Digital Perimeter?
                            </h2>
                            <p className="text-slate-400 text-base mb-8 leading-relaxed">
                                Join the Elite network. Schedule a complimentary security audit with our team of specialists today. Experience the intersection of artificial intelligence and human expertise.
                            </p>
                            <div className="flex gap-4">
                                <div className="flex -space-x-3">
                                    {[1,2,3].map(n => (
                                        <img key={n} src={`https://ui-avatars.com/api/?name=User+${n}&background=random`}
                                            className="w-9 h-9 rounded-full border-2 border-slate-900" alt="Client" />
                                    ))}
                                </div>
                                <div className="text-sm text-slate-400"><span className="text-white font-bold">500+</span> Businesses Trust Us</div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-5">
                            <Link to="/contact" className="group px-9 py-5 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-500 transition-all flex items-center justify-between shadow-[0_20px_40px_-10px_rgba(37,99,235,0.3)]">
                                <span className="text-lg">Contact a Specialist</span>
                                <i className="fas fa-arrow-right group-hover:translate-x-2 transition-transform"></i>
                            </Link>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                                    <div className="text-blue-400 text-xl mb-2"><i className="fas fa-clock"></i></div>
                                    <div className="text-xs text-slate-500">24/7 Support</div>
                                    <div className="text-xs text-slate-500">Always available for you</div>
                                </div>
                                <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                                    <div className="text-emerald-400 text-xl mb-2"><i className="fas fa-shield-halved"></i></div>
                                    <div className="text-xs text-slate-500">Guaranteed</div>
                                    <div className="text-xs text-slate-500">Secure & Scalable</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </React.Fragment>
    );
};

export default Home;