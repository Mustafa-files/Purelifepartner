/**
 * Hero illustration for the landing page, drawn as an inline SVG so it needs no
 * binary asset and stays crisp at every size. It mirrors the brand reference:
 * a soft pink gradient panel with a faint world map, a golden heart ring, and
 * three profile silhouettes (a woman in hijab, a woman in a red dress, and a
 * man in a suit). Colours come from the Tailwind theme tokens.
 */
export function HeroIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 760 430"
      className={className}
      role="img"
      aria-label="Three people in silhouette beneath a golden heart, on a soft world map"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="plp-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffeef0" />
          <stop offset="55%" stopColor="#ffdbe1" />
          <stop offset="100%" stopColor="#ffc7d1" />
        </linearGradient>
        <radialGradient id="plp-glow" cx="62%" cy="18%" r="60%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="plp-dark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2326" />
          <stop offset="100%" stopColor="#120d0f" />
        </linearGradient>
        <linearGradient id="plp-red" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e85561" />
          <stop offset="100%" stopColor="#c5303c" />
        </linearGradient>
        <linearGradient id="plp-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f6c560" />
          <stop offset="50%" stopColor="#e89b2f" />
          <stop offset="100%" stopColor="#f6c560" />
        </linearGradient>
        <clipPath id="plp-clip">
          <rect x="0" y="0" width="760" height="430" rx="36" />
        </clipPath>
      </defs>

      <g clipPath="url(#plp-clip)">
        {/* Background */}
        <rect x="0" y="0" width="760" height="430" fill="url(#plp-bg)" />
        <rect x="0" y="0" width="760" height="430" fill="url(#plp-glow)" />

        {/* Faint world map: stylised continents at low opacity */}
        <g fill="#d5453a" opacity="0.1">
          <path d="M70 150 q20 -28 52 -22 q26 4 24 30 q22 6 14 34 q-10 30 -44 26 q-30 -2 -34 -28 q-26 -6 -16 -38 z" />
          <path d="M150 250 q18 -10 30 6 q14 22 0 50 q-12 26 -30 18 q-14 -8 -10 -38 q-16 -18 10 -36 z" />
          <path d="M330 130 q34 -16 58 8 q20 20 6 44 q18 22 -8 44 q-30 24 -62 6 q-22 -14 -16 -42 q-22 -28 22 -60 z" />
          <path d="M360 250 q22 -8 34 12 q14 26 -4 52 q-16 22 -34 10 q-14 -12 -8 -40 q-14 -22 12 -34 z" />
          <path d="M560 140 q44 -18 80 6 q30 22 18 52 q26 16 8 48 q-28 32 -78 18 q-40 -12 -40 -44 q-30 -32 -16 -80 z" />
          <path d="M650 280 q22 -10 36 8 q16 22 0 44 q-16 20 -34 10 q-14 -10 -10 -34 q-12 -18 12 -28 z" />
        </g>
        {/* Map dots */}
        <g fill="#d5453a" opacity="0.16">
          {[
            [110, 110], [140, 130], [95, 175], [165, 200], [130, 235],
            [355, 105], [395, 125], [330, 170], [410, 195], [370, 250],
            [520, 130], [575, 115], [620, 160], [665, 130], [600, 215],
            [690, 250], [250, 90], [285, 300], [470, 90], [705, 180],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="3" />
          ))}
        </g>

        {/* Golden heart ring */}
        <g
          fill="none"
          stroke="url(#plp-gold)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M548 96 C548 70 512 62 500 86 C488 62 452 70 452 96 C452 124 500 150 500 150 C500 150 548 124 548 96 Z" />
          <path
            d="M540 104 C540 84 514 78 504 96 C494 78 468 84 468 104 C468 126 504 146 504 146"
            opacity="0.55"
            strokeWidth="4"
          />
        </g>

        {/* --- Figure: Man in suit (back, right, tallest) --- */}
        <g fill="url(#plp-dark)">
          <path d="M512 430 L516 332 C520 300 548 286 584 286 L600 288 L600 430 Z M724 430 L720 332 C716 302 690 288 656 286 L640 288 L640 430 Z" />
          <rect x="606" y="250" width="40" height="48" rx="14" />
          <path d="M598 156 C594 120 622 100 652 108 C678 115 688 140 686 162 C690 168 696 174 700 182 L702 190 L686 192 C690 210 678 226 660 228 C644 240 612 240 600 222 C584 206 586 168 598 156 Z" />
          {/* hair */}
          <path d="M598 156 C592 124 620 98 654 106 C672 110 684 124 686 142 C672 132 648 128 628 134 C612 139 602 148 598 156 Z" />
        </g>

        {/* --- Figure: Woman in red dress (center) --- */}
        <g fill="url(#plp-red)">
          <path d="M438 430 L444 338 C448 306 474 290 512 290 C552 290 576 308 580 340 L584 430 Z" />
          <rect x="500" y="252" width="34" height="46" rx="13" />
          <path d="M494 182 C490 150 514 130 542 136 C566 141 576 162 574 184 C578 190 584 196 588 204 L590 212 L574 214 C578 230 566 246 548 248 C532 258 504 258 492 242 C478 226 482 196 494 182 Z" />
          {/* hair: low bun + nape */}
          <path d="M494 182 C488 152 510 128 540 132 C520 138 506 152 502 172 C500 186 502 202 510 214 C496 230 478 220 476 200 C474 188 482 184 494 182 Z" />
          <circle cx="476" cy="206" r="16" />
        </g>

        {/* --- Figure: Woman in hijab (front, left) --- */}
        <g fill="url(#plp-dark)">
          <path d="M360 430 L360 356 C360 322 388 300 430 300 C470 300 496 322 498 356 L500 430 Z" />
          <path d="M392 212 C386 172 414 144 448 150 C478 155 492 180 490 206 C496 212 502 220 506 230 L508 240 L490 242 C494 258 482 274 462 278 C470 296 470 320 452 332 C420 348 380 338 372 308 C366 286 372 268 384 258 C372 244 380 222 392 212 Z" />
          {/* hijab drape over head and shoulders */}
          <path d="M392 212 C384 168 416 138 452 144 C484 149 498 178 492 208 C484 196 470 188 456 188 C470 196 478 212 476 230 C474 252 460 268 442 274 C456 288 458 312 444 326 C432 290 432 256 440 230 C420 224 400 226 388 240 C378 230 384 220 392 212 Z" />
        </g>

        {/* soft floor shadow */}
        <ellipse cx="500" cy="424" rx="180" ry="14" fill="#c5303c" opacity="0.12" />
      </g>
    </svg>
  );
}
