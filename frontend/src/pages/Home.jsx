import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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

/* ── Hero partner orbit ──
   The projection lives in JS, not in CSS 3D transforms: every frame, each
   orbiting element's angle becomes a screen position through one project()
   function, and the SVG orbit rings are drawn through that same function —
   so rings, planets and satellite chips can never disagree. Endpoints sit
   closest to the core (fastest orbit), then network, then security & cloud;
   six solution chips float on a slower outer orbit turning the other way. */
const ORBIT_RINGS = [
    { label: 'Endpoints',        r: .40, period: 38 },
    { label: 'Network',          r: .64, period: 60 },
    { label: 'Security & cloud', r: .86, period: 88 },
    { label: 'Solutions',        r: 1.0, period: 130, dir: -1, dash: true },
];

const ORBIT_SAT_RING = 3;

const ORBIT_SATELLITES = [
    { label: 'Cloud security',    phase: .00, href: '/cloud-security-services' },
    { label: 'IT infrastructure', phase: .17, href: '/infrastructure' },
    { label: 'Device & MDM',      phase: .34, href: '/mdm' },
    { label: 'Network security',  phase: .50, href: '/network-security' },
    { label: 'Consultancy',       phase: .67, href: '/consultancy' },
    { label: 'Gifting',           phase: .84, href: '/gifting' },
];

const ORBIT_STARS = Array.from({ length: 90 }, () => ({
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() < 0.85 ? 1 : 2,
    delay: -Math.random() * 5,
}));

/* Brand marks, inlined as 24x24 SVG paths — no network requests, no CDN.
   Sourced from the Simple Icons set (CC0); Microsoft's four-square is drawn
   to spec. Replace any path with the official SVG from that partner's
   portal when you have it. */
const ORBIT_MARKS = {
    apple: "M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701",
    dell: "M17.963 14.6V9.324h1.222v4.204h2.14v1.07h-3.362zm-9.784-3.288l2.98-2.292c.281.228.56.458.841.687l-2.827 2.14.611.535 2.827-2.216c.281.228.56.458.841.688a295.83 295.83 0 0 1-2.827 2.216l.61.536 2.83-2.295-.001-1.986h1.223v4.204h2.216v1.07h-3.362v-1.987c-.995.763-1.987 1.529-2.981 2.292l-2.981-2.292c-.144.729-.653 1.36-1.312 1.694-.285.147-.597.24-.915.276-.183.022-.367.017-.551.017H3.516V9.325H5.69a2.544 2.544 0 0 1 1.563.557c.454.36.778.872.927 1.43m-3.516-.917v3.21l.953-.001a1.377 1.377 0 0 0 1.036-.523 1.74 1.74 0 0 0 .182-1.889 1.494 1.494 0 0 0-.976-.766c-.166-.04-.338-.03-.507-.032h-.688zM11.82 0h.337a11.94 11.94 0 0 1 5.405 1.373 12.101 12.101 0 0 1 4.126 3.557A11.93 11.93 0 0 1 24 11.82v.36a11.963 11.963 0 0 1-3.236 8.033A11.967 11.967 0 0 1 12.182 24h-.361a11.993 11.993 0 0 1-4.145-.806 12.04 12.04 0 0 1-4.274-2.836A12.057 12.057 0 0 1 .576 15.67 12.006 12.006 0 0 1 0 12.181v-.361a11.924 11.924 0 0 1 1.992-6.396 12.211 12.211 0 0 1 4.71-4.172A11.875 11.875 0 0 1 11.82 0m-.153 1.23a10.724 10.724 0 0 0-6.43 2.375 10.78 10.78 0 0 0-3.319 4.573 10.858 10.858 0 0 0 .193 8.12 10.788 10.788 0 0 0 3.546 4.421 10.698 10.698 0 0 0 4.786 1.946c1.456.209 2.955.124 4.376-.26a10.756 10.756 0 0 0 5.075-3.062 10.742 10.742 0 0 0 2.686-5.28 10.915 10.915 0 0 0-.122-4.682 10.77 10.77 0 0 0-7.098-7.626 10.78 10.78 0 0 0-3.693-.525z",
    lenovo: "M21.044 12.288c0 .5-.343.867-.815.867-.464 0-.827-.38-.827-.867 0-.51.343-.868.815-.868.464 0 .827.381.827.868zm-14.305-.92a.787.787 0 0 0-.651.307.991.991 0 0 0-.172.738l1.479-.614a.708.708 0 0 0-.656-.43zm6.963.052c-.472 0-.816.358-.816.868 0 .486.364.867.828.867.472 0 .815-.368.815-.867 0-.487-.363-.868-.827-.868zM24 7.997v8.006H0V7.997h24zM5.01 13.05H3.088V9.825H2.23v4.003h2.78v-.777zm1.137-.094l2.163-.897a1.667 1.667 0 0 0-.37-.86c-.284-.33-.704-.505-1.216-.505-.931 0-1.633.686-1.633 1.593 0 .93.704 1.593 1.726 1.593.572 0 1.158-.272 1.432-.589l-.535-.411c-.357.264-.56.326-.885.326-.292 0-.52-.09-.682-.25zm5.57-1.039c0-.709-.507-1.223-1.252-1.223a1.28 1.28 0 0 0-1.005.494v-.442h-.846v3.081h.846v-1.753c0-.316.245-.651.698-.651.35 0 .712.243.712.651v1.753h.847v-1.91zm3.647.37c0-.904-.725-1.593-1.65-1.593-.933 0-1.663.7-1.663 1.593 0 .903.726 1.592 1.651 1.592.932 0 1.662-.7 1.662-1.592zm2.066 1.54l1.268-3.081h-.967l-.765 2.099-.765-2.1h-.966l1.268 3.081h.927zm4.449-1.54c0-.904-.725-1.593-1.65-1.593-.932 0-1.662.7-1.662 1.593 0 .903.725 1.592 1.65 1.592.932 0 1.662-.7 1.662-1.592z",
    hp: "M12.0069 24h-.3572l2.459-6.7453h3.3796c.5907 0 1.2364-.4533 1.4424-1.0166l2.6652-7.3085c.4396-1.1952-.2473-2.1706-1.525-2.1706h-4.6983l-3.929 10.798-2.2255 6.127C3.929 22.434 0 17.6806 0 12.007 0 6.498 3.7092 1.8546 8.7647.4396L6.4705 6.759 2.6514 17.2547h2.5415L8.4488 8.339h1.9095l-3.2558 8.9158H9.644l3.0223-8.3251c.4396-1.1952-.2473-2.1706-1.525-2.1706h-2.143l2.459-6.7453C11.636 0 11.8145 0 11.9931 0 18.6285 0 24 5.3715 24 12.007c.0137 6.6216-5.3578 11.993-11.9931 11.993zM19.2742 8.325h-1.9096l-2.6789 7.336h1.9096l2.6789-7.336z",
    cisco: "M16.331 18.171V17.06l-.022.01c-.25.121-.522.19-.801.203a1.186 1.186 0 01-.806-.237 1.038 1.038 0 01-.352-.498 1.21 1.21 0 01-.023-.667c.052-.225.178-.426.357-.569.16-.134.355-.218.562-.242a1.85 1.85 0 011.061.198l.024.013v-1.117l-.051-.014a2.862 2.862 0 00-1.011-.132 2.34 2.34 0 00-.903.206c-.287.132-.54.327-.739.571a2.221 2.221 0 00-.04 2.705c.295.378.709.645 1.175.756.491.12 1.006.102 1.487-.052l.082-.023M5.336 18.171V17.06l-.022.01c-.25.121-.522.19-.801.203a1.183 1.183 0 01-.806-.237 1.03 1.03 0 01-.351-.498 1.202 1.202 0 01-.024-.667c.052-.225.177-.426.357-.569.16-.134.355-.218.562-.242a1.85 1.85 0 011.061.198l.024.013v-1.117l-.051-.014a2.862 2.862 0 00-1.011-.132 2.344 2.344 0 00-.903.206 2.08 2.08 0 00-.74.571 2.224 2.224 0 00-.041 2.705 2.11 2.11 0 001.176.756c.491.12 1.005.102 1.487-.052l.083-.023M9.26 17.249l-.004.957.07.012c.22.041.441.069.664.085.195.019.391.022.587.012.187-.014.372-.049.551-.104.21-.06.405-.163.571-.305a1.16 1.16 0 00.333-.478 1.31 1.31 0 00-.007-.96 1.068 1.068 0 00-.298-.414 1.261 1.261 0 00-.438-.255l-.722-.268a.388.388 0 01-.197-.188.245.245 0 01.008-.219.382.382 0 01.154-.142.798.798 0 01.257-.074c.153-.022.308-.021.46.005.18.02.358.051.533.096l.038.008v-.883l-.069-.015a4.749 4.749 0 00-.543-.097 2.844 2.844 0 00-.714-.003c-.3.027-.585.143-.821.33-.16.126-.281.293-.351.484-.104.29-.105.608 0 .899.054.145.14.274.252.381.097.093.207.173.327.236.157.084.324.149.497.195.057.017.114.035.17.054l.085.031.024.01c.084.03.162.078.226.14.045.042.08.094.101.151a.325.325 0 01.001.161.339.339 0 01-.166.198.856.856 0 01-.275.086 2.032 2.032 0 01-.427.021 5.208 5.208 0 01-.557-.074 9.195 9.195 0 01-.287-.067l-.033-.006zm-2.475.995h1.05v-4.167h-1.05v4.167zm12.162-2.936a1.095 1.095 0 011.541.158 1.094 1.094 0 01-.157 1.541l-.017.014a1.096 1.096 0 01-1.367-1.713m-1.525.854a2.193 2.193 0 002.666 2.107 2.139 2.139 0 00.701-3.937 2.207 2.207 0 00-3.367 1.83M22.961 10.728a.52.52 0 001.039 0V9.573a.52.52 0 00-1.039 0v1.155M20.117 10.728a.522.522 0 001.041 0V8.139a.521.521 0 00-1.04 0v2.589M17.231 11.771a.521.521 0 001.039 0V6.17a.52.52 0 00-1.039 0v5.601M14.393 10.728a.521.521 0 001.04 0V8.139a.52.52 0 00-1.039 0v2.589M11.494 10.728a.522.522 0 001.039 0V9.573a.52.52 0 00-1.039 0v1.155M8.624 10.728a.52.52 0 001.039 0V8.139a.52.52 0 00-1.039 0v2.589M5.737 11.771a.52.52 0 001.039 0V6.17a.52.52 0 00-1.039 0v5.601M2.876 10.728a.522.522 0 001.04 0V8.139a.52.52 0 00-1.039 0v2.589M0 10.728a.521.521 0 001.039 0V9.573a.52.52 0 00-1.039 0v1.155",
    juniper: "M23.0864 13.1643c.0456 0 .0717-.0132.0717-.062 0-.0482-.0254-.0593-.0731-.0593h-.1023v.1213zm-.1037.0417v.1285h-.0445v-.334h.1487c.0846 0 .1172.0347.1172.1006 0 .054-.0229.0912-.0806.102l.0755.1314h-.0484l-.0746-.1285zm.0746-.2918a.2535.2535 0 0 0-.2533.2531c0 .1395.1136.2532.2533.2532a.2535.2535 0 0 0 .253-.2532.2534.2534 0 0 0-.253-.2531zm-.291.2531a.2912.2912 0 0 1 .291-.2908.291.291 0 0 1 .2905.2908.291.291 0 0 1-.2905.2907.2912.2912 0 0 1-.291-.2907zm-20.7445-.6602V8.8304h-.4212v3.6767c0 .8506.0337 1.5332-1.4404 1.5332A4.029 4.029 0 0 1 0 14.0369v.397a6.215 6.215 0 0 0 .1602.0022c1.7858 0 1.8616-.8002 1.8616-1.929zm15.5404-1.6972h3.1334c-.042-.918-.1011-1.7014-1.4404-1.7014-1.2887 0-1.6425.6992-1.693 1.7014zm1.7016-2.0889c1.794 0 1.853 1.2045 1.8447 2.4764h-3.5548c.0085 1.1204.2863 1.9544 1.7436 1.9544.775 0 1.1288-.2107 1.5079-.4886l.2357.3116c-.421.3117-.918.556-1.7436.556-1.8194 0-2.1565-1.053-2.1565-2.4091 0-1.356.3877-2.4007 2.123-2.4007zm-4.1484 2.7055c.7439 0 1.1135-.3625 1.1135-1.0949 0-.7322-.3988-1.0798-1.132-1.0798h-1.7285v2.1747zM15.109 8.839c1.0678 0 1.5519.5307 1.5519 1.474 0 .9497-.478 1.527-1.5578 1.527h-1.7348v1.5981h-.4124V8.839zm-2.9253 0v4.5991h-.4122V8.839zm-1.1939 4.5991h-.4296v-2.8134c0-.8086.0084-1.491-1.474-1.491-1.4743 0-1.4405.6824-1.4405 1.5331v2.7713h-.4212v-2.7713c0-1.1288.076-1.9289 1.8616-1.9289 1.7943 0 1.9037.8001 1.9037 1.8952zM2.7466 8.8304h.4297v2.8134c0 .8088-.0084 1.491 1.474 1.491 1.4742 0 1.4405-.6822 1.4405-1.533V8.8303h.4212v2.7713c0 1.1289-.0759 1.929-1.8616 1.929-1.7943 0-1.9038-.8001-1.9038-1.8952zm18.9675 1.8364v2.7713h.421v-2.7713c0-.8507-.0336-1.533 1.4407-1.533.1579 0 .298.0083.4242.023v-.4012a4.8535 4.8535 0 0 0-.4242-.0177c-1.7859 0-1.8617.8001-1.8617 1.929zm-.4315 4.3602c.1525.096.3017.1286.4542.1286.2624 0 .3789-.0737.3789-.2486 0-.18-.1508-.2057-.3789-.2468-.2743-.048-.4594-.0944-.4594-.3514 0-.2453.1577-.3413.4594-.3413.199 0 .3412.0447.4423.1132l-.072.1097c-.0908-.06-.2263-.0995-.3703-.0995-.228 0-.3257.0636-.3257.2144 0 .1612.132.192.3584.233.2776.0499.4782.091.4782.3635 0 .2521-.1612.3737-.5074.3737-.192 0-.3652-.0393-.5263-.1456zm-.7886-.4423l-.2538.2777v.396h-.132v-1.2703h.132v.7012l.643-.7012h.156l-.456.4989.5176.7715h-.1525l-.4543-.6738m-1.1006.0326c.18 0 .2914-.0549.2914-.2555 0-.1971-.108-.2485-.2965-.2485h-.4132v.504zm-.0377.1234h-.3806v.5178h-.132V13.988h.5486c.2948 0 .4286.1183.4286.3703 0 .2194-.1046.348-.3258.377l.3068.523h-.1439l-.3017-.5177m-.924-.1166c0-.3429-.1594-.528-.5058-.528-.3446 0-.5023.1851-.5023.528 0 .3446.1577.5298.5023.5298.3464 0 .5058-.1852.5058-.5298zm-.5058-.6566c.408 0 .6412.2024.6412.655 0 .4542-.2332.6565-.6412.6565-.4063 0-.6377-.2023-.6377-.6566 0-.4525.2314-.6549.6377-.6549zm-2.3571.0206l.3342 1.0508.3412-1.0508h.1166l.3394 1.0508.336-1.0508h.1303l-.408 1.2789h-.1165l-.343-1.0577-.341 1.0577h-.1183l-.4098-1.2789zm-1.392.1286v-.1286h1.0886v.1286h-.4766v1.1418h-.1355v-1.1418zm-.204-.1286v.1286h-.7046v.42h.6874v.127h-.6874v.4713h.7114v.1235h-.8468V13.988zm-2.0539 0l.7596 1.0475V13.988h.1303v1.2704h-.1235l-.7835-1.0784v1.0784h-.1303V13.988Z",
    fortinet: "M0 9.785h6.788v4.454H0zm8.666-6.33h6.668v4.453H8.666zm0 12.637h6.668v4.454H8.666zm8.522-6.307H24v4.454h-6.812zM2.792 3.455C1.372 3.814.265 5.404 0 7.425v.506h6.788V3.454zM0 16.091v.554c.24 1.926 1.276 3.466 2.624 3.9h4.188v-4.454zm24-8.184v-.506c-.265-1.998-1.372-3.587-2.792-3.972h-4.02v4.454H24zM21.376 20.57c1.324-.458 2.36-1.974 2.624-3.9v-.554h-6.812v4.454Z",
    microsoft: "M0 0h11.4v11.4H0V0zm12.6 0H24v11.4H12.6V0zM0 12.6h11.4V24H0V12.6zm12.6 0H24V24H12.6V12.6z",
};

const ORBIT_PARTNERS = [
    { name: 'Apple',     mark: 'apple',     brand: '#B8BEC2', ink: '#07080A', ring: 0, phase: .00, k: .92,  fit: '42%' },
    { name: 'Dell',      mark: 'dell',      brand: '#007DB8', ink: '#FFFFFF', ring: 0, phase: .25, k: 1.04, fit: '56%' },
    { name: 'Lenovo',    mark: 'lenovo',    brand: '#E2231A', ink: '#FFFFFF', ring: 0, phase: .50, k: 1.06, fit: '66%' },
    { name: 'HP',        mark: 'hp',        brand: '#0096D6', ink: '#FFFFFF', ring: 0, phase: .75, k: .95,  fit: '56%' },
    { name: 'Cisco',     mark: 'cisco',     brand: '#1BA0D7', ink: '#FFFFFF', ring: 1, phase: .12, k: 1.08, fit: '62%' },
    { name: 'Juniper',   mark: 'juniper',   brand: '#84B135', ink: '#07080A', ring: 1, phase: .62, k: 1.08, fit: '70%' },
    { name: 'Fortinet',  mark: 'fortinet',  brand: '#EE3124', ink: '#FFFFFF', ring: 2, phase: .06, k: 1.00, fit: '56%' },
    { name: 'Sophos',    mark: null,        brand: '#1B9DD9', ink: '#FFFFFF', ring: 2, phase: .40, k: 1.00, word: 'SOPHOS' },
    { name: 'Microsoft', mark: 'microsoft', brand: '#3A4149', ink: '#FFFFFF', ring: 2, phase: .73, k: 1.04, fit: '46%' },
];

const ORBIT_CFG = {
    tilt: 62, tiltMin: 16, tiltMax: 82,      // degrees from top-down; 0 = flat circle, 90 = edge on
    persp: 3.4,                              // camera distance as a multiple of the outer radius
    sunK: .46,                               // sun diameter as a fraction of the outer radius
    planetK: .145, planetMin: 32, planetMax: 92,
    pad: 20,                                 // breathing room at the top/right edges, px
    padBottom: 104,                          // room kept clear for the scroll cue and legend, px
    overlap: 150,                            // how far the system may tuck behind the copy scrim, px
    bleed: 0,                                // px the outer orbit may run past the right edge
    dragSpin: .0075,                         // radians of spin per px dragged horizontally
    dragTilt: .12,                           // degrees of tilt per px dragged vertically
    friction: .94,                           // inertia decay per frame
    scrollSpin: .0022,                       // radians of spin per px of page scroll
    chipRoom: 78,                            // px reserved either side for the satellite chips
    chipMinS: .88, chipMaxS: 1.12,           // chips never shrink past this — text must stay legible
    bob: 4,                                  // px of vertical float on each chip
};

const Home = () => {

    const dynamicTypingRef = useRef(null);

    const servicesCanvasRef = useRef(null);
    const aboutCanvasRef    = useRef(null);
    const whyCanvasRef      = useRef(null);

    const orbitHeroRef    = useRef(null);
    const orbitCopyRef    = useRef(null);
    const orbitStageRef   = useRef(null);
    const orbitSvgRef     = useRef(null);
    const orbitLegendRef  = useRef(null);
    const orbitCueRef     = useRef(null);
    const navigate = useNavigate();

    /* ── Partner orbit engine ──
       Imperative by design: every planet, satellite and orbit ring is driven
       from one requestAnimationFrame loop through a single project() call,
       so nothing can drift out of sync the way independent CSS animations
       eventually would. Built once on mount, torn down on unmount. */
    useEffect(() => {
        const hero  = orbitHeroRef.current;
        const copy  = orbitCopyRef.current;
        const stage = orbitStageRef.current;
        const svg   = orbitSvgRef.current;
        const legend = orbitLegendRef.current;
        const cue   = orbitCueRef.current;
        if (!hero || !copy || !stage || !svg) return;

        const TAU = Math.PI * 2;
        const DEG = Math.PI / 180;
        const SVG_NS = 'http://www.w3.org/2000/svg';
        const CFG = ORBIT_CFG;
        const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        let W = 0, H = 0, cx = 0, cy = 0, R = 0;
        let spin = 0, vSpin = 0, tilt = CFG.tilt, scrollSpin = 0;
        let time = 0, last = 0, paused = false, destroyed = false;
        let rafId = null;

        const created = []; // every DOM node this effect appends, for cleanup

        const ringPaths = ORBIT_RINGS.map((ring) => {
            const p = document.createElementNS(SVG_NS, 'path');
            if (ring.dash) p.setAttribute('stroke-dasharray', '3 7');
            svg.appendChild(p);
            created.push(p);
            return p;
        });

        if (legend) {
            ORBIT_RINGS.forEach((ring) => {
                const row = document.createElement('div');
                row.className = 'orbit-legend__row';
                row.innerHTML = `<span class="orbit-legend__dash${ring.dash ? ' is-dashed' : ''}"></span>`;
                row.appendChild(document.createTextNode(ring.label));
                legend.appendChild(row);
                created.push(row);
            });
        }

        const pauseOn = (el) => {
            const on  = () => { paused = true; };
            const off = () => { paused = false; };
            el.addEventListener('pointerenter', on);
            el.addEventListener('pointerleave', off);
            el.addEventListener('focus', on);
            el.addEventListener('blur', off);
            return () => {
                el.removeEventListener('pointerenter', on);
                el.removeEventListener('pointerleave', off);
                el.removeEventListener('focus', on);
                el.removeEventListener('blur', off);
            };
        };
        const teardownFns = [];

        const nodes = ORBIT_PARTNERS.map((p) => {
            const a = document.createElement('a');
            a.className = 'orbit-planet';
            a.href = '#';
            a.style.setProperty('--brand', p.brand);
            a.style.setProperty('--mark', p.ink);
            if (p.fit) a.style.setProperty('--fit', p.fit);
            a.setAttribute('aria-label', `${p.name} — ${ORBIT_RINGS[p.ring].label.toLowerCase()}`);

            if (p.mark && ORBIT_MARKS[p.mark]) {
                const markSvg = document.createElementNS(SVG_NS, 'svg');
                markSvg.setAttribute('viewBox', '0 0 24 24');
                markSvg.setAttribute('aria-hidden', 'true');
                const path = document.createElementNS(SVG_NS, 'path');
                path.setAttribute('d', ORBIT_MARKS[p.mark]);
                markSvg.appendChild(path);
                a.appendChild(markSvg);
            } else {
                const word = document.createElement('span');
                word.className = 'orbit-wordmark';
                word.textContent = p.word || p.name;
                a.appendChild(word);
            }

            const name = document.createElement('span');
            name.className = 'orbit-planet__name';
            name.textContent = p.name;
            a.appendChild(name);

            teardownFns.push(pauseOn(a));
            stage.appendChild(a);
            created.push(a);
            return a;
        });

        const sats = ORBIT_SATELLITES.map((sat) => {
            const a = document.createElement('a');
            a.className = 'orbit-sat';
            a.href = sat.href;
            a.textContent = sat.label;
            teardownFns.push(pauseOn(a));
            stage.appendChild(a);
            created.push(a);
            return a;
        });

        function syncHeroHeight() {
            const navEl = document.querySelector('.navbar-container');
            const navH = navEl ? navEl.getBoundingClientRect().height : 0;
            if (window.innerWidth >= 1000) {
                // the navbar sits in normal flow (not fixed), so a plain 100svh
                // hero runs that much past the bottom of the fold — pull it
                // back in so the bottom-anchored legend/cue stay visible
                hero.style.minHeight = `calc(100svh - ${navH}px)`;
            } else {
                // on narrow screens the system sits *below* the copy rather
                // than beside it, so the hero needs to grow past 100svh to
                // give it room — a fixed viewport-height cap here would
                // force the orbit down to its size floor and into the copy
                const copyH = copy.getBoundingClientRect().height;
                hero.style.minHeight = `${Math.round(copyH + 520)}px`;
            }
        }

        function measure() {
            syncHeroHeight();
            const rect = hero.getBoundingClientRect();
            W = rect.width; H = rect.height;

            const cosT = Math.cos(tilt * DEG);
            const sinT = Math.sin(tilt * DEG);
            const grow = CFG.persp / (CFG.persp - sinT);
            const bite = CFG.planetK / 2 * grow;

            const wide = W >= 1000;
            const copyRect = copy.getBoundingClientRect();
            let left, right, top, bottom;

            if (wide) {
                left   = (copyRect.right - rect.left) - CFG.overlap;
                right  = W - CFG.pad + CFG.bleed;
                top    = CFG.pad;
                bottom = H - CFG.padBottom;
            } else {
                left   = CFG.pad;
                right  = W - CFG.pad;
                top    = (copyRect.bottom - rect.top) - 24;
                bottom = H - CFG.padBottom;
            }

            cx = (left + right) / 2;
            cy = (top + bottom) / 2;

            const halfW = (right - left) / 2;
            const halfH = (bottom - top) / 2;

            R = Math.max(120, Math.min(
                (halfW - CFG.chipRoom) / (grow + bite),
                (halfH - 16) / (grow * cosT + bite)
            ));

            stage.style.setProperty('--cx', cx.toFixed(1) + 'px');
            stage.style.setProperty('--cy', cy.toFixed(1) + 'px');
            stage.style.setProperty('--sun', Math.round(R * CFG.sunK) + 'px');

            nodes.forEach((el, i) => {
                const d = Math.round(
                    Math.min(CFG.planetMax, Math.max(CFG.planetMin, R * CFG.planetK * ORBIT_PARTNERS[i].k))
                );
                el.style.setProperty('--d', d + 'px');
            });

            drawOrbits();
        }

        function project(angle, radius) {
            const cosT = Math.cos(tilt * DEG);
            const sinT = Math.sin(tilt * DEG);
            const px = Math.cos(angle) * radius;
            const pz = Math.sin(angle) * radius;
            const z  = pz * sinT;
            const s  = CFG.persp * R / (CFG.persp * R - z);
            return { x: px * s, y: pz * cosT * s, s, z };
        }

        function drawOrbits() {
            const STEPS = 120;
            ringPaths.forEach((path, i) => {
                const radius = R * ORBIT_RINGS[i].r;
                let d = '';
                for (let j = 0; j <= STEPS; j++) {
                    const pt = project((j / STEPS) * TAU, radius);
                    d += (j ? 'L' : 'M') + (cx + pt.x).toFixed(1) + ' ' + (cy + pt.y).toFixed(1);
                }
                path.setAttribute('d', d + 'Z');
            });
        }

        function frame(now) {
            if (destroyed) return;
            const dt = last ? Math.min((now - last) / 1000, .05) : 0;
            last = now;

            if (!paused && !still) time += dt;

            if (Math.abs(vSpin) > 1e-5) {
                spin += vSpin;
                vSpin *= CFG.friction;
                if (Math.abs(vSpin) <= 1e-5) vSpin = 0;
            }

            const zMax = R * Math.sin(tilt * DEG) || 1;

            for (let i = 0; i < nodes.length; i++) {
                const p = ORBIT_PARTNERS[i];
                const ring = ORBIT_RINGS[p.ring];
                const angle = (time / ring.period) * TAU + p.phase * TAU + spin + scrollSpin;
                const pt = project(angle, R * ring.r);
                nodes[i].style.transform = `translate3d(${pt.x.toFixed(1)}px,${pt.y.toFixed(1)}px,0) scale(${pt.s.toFixed(3)})`;
                nodes[i].style.opacity = (.52 + .48 * ((pt.z / zMax) + 1) / 2).toFixed(3);
                nodes[i].style.zIndex = String(100 + Math.round(pt.z));
            }

            const satRing = ORBIT_RINGS[ORBIT_SAT_RING];
            for (let i = 0; i < sats.length; i++) {
                const sat = ORBIT_SATELLITES[i];
                const angle = (time / satRing.period) * TAU * (satRing.dir || 1) + sat.phase * TAU + spin + scrollSpin;
                const pt = project(angle, R * satRing.r);
                const s2 = Math.min(CFG.chipMaxS, Math.max(CFG.chipMinS, pt.s));
                const bob = still ? 0 : Math.sin(time * .8 + i * 1.7) * CFG.bob;
                sats[i].style.transform = `translate3d(${pt.x.toFixed(1)}px,${(pt.y + bob).toFixed(1)}px,0) scale(${s2.toFixed(3)})`;
                sats[i].style.opacity = (.45 + .55 * ((pt.z / zMax) + 1) / 2).toFixed(3);
                sats[i].style.zIndex = String(100 + Math.round(pt.z));
            }

            rafId = requestAnimationFrame(frame);
        }

        /* drag: horizontal spins (with inertia), vertical tilts the plane
           (mouse only — touch keeps vertical drag as page scroll) */
        let dragging = false, moved = 0, lastX = 0, lastY = 0, touch = false;

        const onPointerDown = (e) => {
            dragging = true;
            moved = 0;
            touch = e.pointerType === 'touch';
            lastX = e.clientX; lastY = e.clientY;
            vSpin = 0;
            stage.classList.add('is-dragging');
            stage.setPointerCapture(e.pointerId);
        };
        const onPointerMove = (e) => {
            if (!dragging) return;
            const dx = e.clientX - lastX;
            const dy = e.clientY - lastY;
            lastX = e.clientX; lastY = e.clientY;
            moved += Math.abs(dx) + Math.abs(dy);

            const d = dx * CFG.dragSpin;
            spin += d;
            vSpin = d;

            if (!touch && Math.abs(dy) > 0) {
                tilt = Math.min(CFG.tiltMax, Math.max(CFG.tiltMin, tilt + dy * CFG.dragTilt));
                measure();
            }
        };
        const endDrag = (e) => {
            if (!dragging) return;
            dragging = false;
            stage.classList.remove('is-dragging');
            if (e && e.pointerId != null && stage.hasPointerCapture(e.pointerId)) {
                stage.releasePointerCapture(e.pointerId);
            }
        };
        const onClickCapture = (e) => {
            if (moved > 6) { e.preventDefault(); e.stopPropagation(); return; }
            const satEl = e.target.closest('.orbit-sat');
            if (satEl) {
                e.preventDefault();
                navigate(satEl.getAttribute('href'));
                return;
            }
            if (e.target.closest('.orbit-planet')) e.preventDefault();
        };
        const onKeyDown = (e) => {
            const step = .12;
            if (e.key === 'ArrowLeft')  { spin -= step; e.preventDefault(); }
            if (e.key === 'ArrowRight') { spin += step; e.preventDefault(); }
            if (e.key === 'ArrowUp')    { tilt = Math.max(CFG.tiltMin, tilt - 3); measure(); e.preventDefault(); }
            if (e.key === 'ArrowDown')  { tilt = Math.min(CFG.tiltMax, tilt + 3); measure(); e.preventDefault(); }
        };

        stage.addEventListener('pointerdown', onPointerDown);
        stage.addEventListener('pointermove', onPointerMove);
        stage.addEventListener('pointerup', endDrag);
        stage.addEventListener('pointercancel', endDrag);
        stage.addEventListener('click', onClickCapture, true);
        stage.addEventListener('keydown', onKeyDown);

        /* scroll: the system keeps turning as the page moves, and the cue
           fades once the visitor has actually started scrolling */
        let ticking = false;
        const onScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                const y = window.scrollY || 0;
                scrollSpin = still ? 0 : y * CFG.scrollSpin;
                cue?.classList.toggle('is-hidden', y > 40);
                ticking = false;
            });
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();

        const onCueClick = () => {
            hero.nextElementSibling?.scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'start' });
        };
        cue?.addEventListener('click', onCueClick);

        let resizeTimer;
        const onResize = () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(measure, 120); };
        window.addEventListener('resize', onResize);

        const onVisibility = () => { paused = document.hidden; };
        document.addEventListener('visibilitychange', onVisibility);

        // the copy column's height can shift after mount — web fonts
        // swapping in, or (on narrow screens) the stage sitting below it —
        // so re-fit whenever its box actually changes, not just on resize
        const copyObserver = new ResizeObserver(() => measure());
        copyObserver.observe(copy);

        measure();
        rafId = requestAnimationFrame(frame);

        return () => {
            destroyed = true;
            if (rafId) cancelAnimationFrame(rafId);
            clearTimeout(resizeTimer);
            copyObserver.disconnect();
            stage.removeEventListener('pointerdown', onPointerDown);
            stage.removeEventListener('pointermove', onPointerMove);
            stage.removeEventListener('pointerup', endDrag);
            stage.removeEventListener('pointercancel', endDrag);
            stage.removeEventListener('click', onClickCapture, true);
            stage.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onResize);
            document.removeEventListener('visibilitychange', onVisibility);
            cue?.removeEventListener('click', onCueClick);
            teardownFns.forEach((fn) => fn());
            created.forEach((el) => el.remove());
        };
    }, [navigate]);

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
            <section className="hero-section hero-section--orbit" ref={orbitHeroRef}>
                <div className="orbit-starfield" aria-hidden="true">
                    {ORBIT_STARS.map((s, i) => (
                        <span key={i} className="orbit-star" style={{
                            left: `${s.left}%`, top: `${s.top}%`,
                            width: `${s.size}px`, height: `${s.size}px`,
                            animationDelay: `${s.delay}s`,
                        }}></span>
                    ))}
                </div>

                {/* Planets, satellite chips and orbit-ring paths are built and
                    positioned imperatively (see the orbit-engine effect above) —
                    every frame comes from one project() call so nothing drifts
                    out of sync the way independent CSS animations would. */}
                <div className="orbit-stage" ref={orbitStageRef} tabIndex={0} role="group"
                    aria-label="Partner system — drag to spin, arrow keys to rotate">
                    <svg className="orbit-svg" ref={orbitSvgRef} aria-hidden="true"></svg>
                    <div className="orbit-sun" aria-hidden="true">
                        <span className="orbit-sun__corona"></span>
                        <span className="orbit-sun__core"></span>
                        <span className="orbit-sun__mark">StromexAI</span>
                    </div>
                </div>

                <div className="container mx-auto px-6 relative" style={{ zIndex:200, pointerEvents:'none' }}>
                    <div className="orbit-copy" ref={orbitCopyRef}>
                        <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', padding:'5px 16px', borderRadius:'99px', background:'rgba(255,255,255,0.06)', border:'1px solid var(--line)', marginBottom:'24px' }}>
                            <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:'var(--paper)', animation:'pulseDot 2s infinite' }}></span>
                            <span style={{ color:'var(--muted)', fontSize:'11px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.12em', fontFamily:'DM Sans,sans-serif' }}>Trusted IT Partner 2025</span>
                        </div>

                        <h1 className="text-3xl sm:text-5xl md:text-6xl" style={{ fontFamily:'Outfit,sans-serif', fontWeight:800, letterSpacing:'-0.03em', color:'var(--paper)', lineHeight:1.05, marginBottom:'24px', maxWidth:'17ch' }}>
                            Empowering Innovations Through AI‑Driven Tech Solutions
                        </h1>

                        <p className="reveal" style={{ color:'var(--muted)', fontSize:'1.1rem', lineHeight:1.7, maxWidth:'44ch', margin:'0 0 36px' }}>
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

                        <p className="orbit-hint reveal">Drag the system to spin it</p>

                        <div className="reveal" style={{ marginTop:'32px', display:'flex', alignItems:'center', gap:'28px', flexWrap:'wrap' }}>
                            {[
                                { icon:'fa-users',          val:'250+', label:'Happy Clients'    },
                                { icon:'fa-server',         val:'99%',  label:'Uptime SLA'       },
                                { icon:'fa-globe',          val:'15+',  label:'Years Experience' },
                            ].map((item, i) => (
                                <div key={i} style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                                    <div style={{ width:'34px', height:'34px', borderRadius:'10px', background:'rgba(255,255,255,0.07)', border:'1px solid var(--line)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--paper)', fontSize:'13px' }}>
                                        <i className={`fas ${item.icon}`}></i>
                                    </div>
                                    <div style={{ textAlign:'left' }}>
                                        <div style={{ color:'var(--paper)', fontWeight:800, fontSize:'1.05rem', fontFamily:'Outfit,sans-serif', lineHeight:1 }}>{item.val}</div>
                                        <div style={{ color:'var(--muted)', fontSize:'10px', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.1em' }}>{item.label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="orbit-legend" ref={orbitLegendRef} aria-hidden="true"></div>

                <button className="orbit-scroll-cue" ref={orbitCueRef} type="button">
                    <span>Scroll</span>
                    <span className="orbit-scroll-cue__track"><span className="orbit-scroll-cue__dot"></span></span>
                </button>

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