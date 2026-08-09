/**
 * Product catalog for the NOVA store grid.
 *
 * `image` points at picsum.photos placeholders so the project runs out of
 * the box with zero asset setup. Swap these for real product renders
 * (transparent PNG/WebP, shot on a tinted surface per the reference
 * system) before shipping — see the README for image guidance.
 */
export const CATEGORIES = ["All", "Headphones", "Earphones", "Speakers", "Accessories"];

export const PRODUCTS = [
  {
    id: "aero-max",
    name: "Aero Max",
    category: "Headphones",
    price: 399,
    tagline: "Over-ear. Adaptive noise cancelling that listens back.",
    image: "https://picsum.photos/seed/aero-max/800/800",
    colors: ["Graphite", "Chalk", "Moss"],
    isNew: true,
  },
  {
    id: "aero-lite",
    name: "Aero Lite",
    category: "Headphones",
    price: 249,
    tagline: "The everyday pair. 40 hours on a single charge.",
    image: "https://picsum.photos/seed/aero-lite/800/800",
    colors: ["Graphite", "Sand"],
  },
  {
    id: "aero-studio",
    name: "Aero Studio",
    category: "Headphones",
    price: 549,
    tagline: "Reference-grade drivers, tuned by ear, not by spec sheet.",
    image: "https://picsum.photos/seed/aero-studio/800/800",
    colors: ["Black", "Walnut"],
  },
  {
    id: "loop-pro",
    name: "Loop Pro",
    category: "Earphones",
    price: 229,
    tagline: "In-ear. Disappears in your ear and in your day.",
    image: "https://picsum.photos/seed/loop-pro/800/800",
    colors: ["Chalk", "Graphite", "Coral"],
    isNew: true,
  },
  {
    id: "loop",
    name: "Loop",
    category: "Earphones",
    price: 149,
    tagline: "The essentials, done properly. Nothing extra.",
    image: "https://picsum.photos/seed/loop/800/800",
    colors: ["Chalk", "Graphite"],
  },
  {
    id: "loop-sport",
    name: "Loop Sport",
    category: "Earphones",
    price: 179,
    tagline: "Sweat-proof. Stays put through anything you throw at it.",
    image: "https://picsum.photos/seed/loop-sport/800/800",
    colors: ["Volt", "Graphite"],
  },
  {
    id: "orb-one",
    name: "Orb One",
    category: "Speakers",
    price: 179,
    tagline: "Fits in a palm. Fills a room.",
    image: "https://picsum.photos/seed/orb-one/800/800",
    colors: ["Chalk", "Graphite", "Moss"],
  },
  {
    id: "orb-home",
    name: "Orb Home",
    category: "Speakers",
    price: 349,
    tagline: "Room-filling sound with a mic array that finds your voice.",
    image: "https://picsum.photos/seed/orb-home/800/800",
    colors: ["Chalk", "Graphite"],
    isNew: true,
  },
  {
    id: "orb-outdoor",
    name: "Orb Outdoor",
    category: "Speakers",
    price: 229,
    tagline: "IP67-rated. Waterproof enough to forget about.",
    image: "https://picsum.photos/seed/orb-outdoor/800/800",
    colors: ["Sand", "Moss"],
  },
  {
    id: "charge-stand",
    name: "Charge Stand",
    category: "Accessories",
    price: 89,
    tagline: "One dock, every NOVA device, one cable to the wall.",
    image: "https://picsum.photos/seed/charge-stand/800/800",
    colors: ["Graphite"],
  },
  {
    id: "travel-case",
    name: "Travel Case",
    category: "Accessories",
    price: 49,
    tagline: "Hard shell. Soft on what's inside.",
    image: "https://picsum.photos/seed/travel-case/800/800",
    colors: ["Chalk", "Graphite"],
  },
  {
    id: "braided-cable",
    name: "Braided Cable, 2m",
    category: "Accessories",
    price: 29,
    tagline: "Outlasts the charger it came with.",
    image: "https://picsum.photos/seed/braided-cable/800/800",
    colors: ["Graphite"],
  },
];
