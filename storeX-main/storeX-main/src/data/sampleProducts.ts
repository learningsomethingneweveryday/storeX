import { Product } from '../types';

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'AeroPulse Wireless Noise-Cancelling Headphones',
    shortDescription: 'High-fidelity audio with active noise cancellation and 40h battery life.',
    description: 'Experience studio-grade acoustics anywhere with the AeroPulse Headphones. Featuring custom 40mm titanium drivers, hybrid active noise cancellation with transparency mode, ultra-plush memory foam earcups, and up to 40 hours of playtime on a single USB-C charge.',
    price: 199.99,
    originalPrice: 249.99,
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80'
    ],
    rating: 4.8,
    reviewCount: 342,
    stock: 24,
    brand: 'AeroSound',
    features: [
      'Hybrid Active Noise Cancellation (ANC)',
      '40-hour Battery with Fast Fuel (10 min = 4 hours)',
      'Bluetooth 5.3 with Multi-Point Pairing',
      'Ergonomic foldable design with hard travel case'
    ],
    specs: {
      'Driver Size': '40mm Titanium',
      'Frequency Response': '20Hz - 40,000Hz',
      'Battery Life': '40 Hours (ANC on)',
      'Weight': '250g',
      'Connectivity': 'Bluetooth 5.3, 3.5mm AUX'
    },
    isFeatured: true,
    isNew: true,
    createdAt: '2026-08-15T10:00:00.000Z'
  },
  {
    id: 'prod-2',
    name: 'Vortex Mechanical Gaming Keyboard RGB',
    shortDescription: 'Hot-swappable linear mechanical switches with customizable per-key RGB.',
    description: 'Elevate your gaming and typing precision with the Vortex RGB Mechanical Keyboard. Built with an anodized aluminum top plate, pre-lubed linear switches, sound-dampening silicone foam, and detachable braided USB-C cable.',
    price: 129.99,
    originalPrice: 159.99,
    category: 'Computing',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&auto=format&fit=crop&q=80'
    ],
    rating: 4.7,
    reviewCount: 215,
    stock: 18,
    brand: 'VortexTech',
    features: [
      'Hot-Swappable 5-pin Switch Sockets',
      'Per-Key 16.8M RGB with Hardware Memory Profiles',
      'Double-Shot PBT Keycaps (Cherry Profile)',
      'Acoustic Multi-Layer Foam Dampening'
    ],
    specs: {
      'Layout': '75% Compact (84 Keys)',
      'Switches': 'Custom Pre-lubed Linear (45g)',
      'Connection': 'Tri-mode (2.4G / BT 5.1 / Type-C)',
      'Polling Rate': '1000 Hz',
      'Battery': '4000 mAh'
    },
    isFeatured: true,
    isNew: false,
    createdAt: '2026-07-20T14:30:00.000Z'
  },
  {
    id: 'prod-3',
    name: 'Horizon Ultra Smartwatch Pro',
    shortDescription: 'AMOLED display, comprehensive GPS, SpO2 & 14-day battery life.',
    description: 'Designed for adventure and daily fitness tracking. The Horizon Ultra Smartwatch Pro features a stunning 1.43-inch sapphire glass AMOLED display, titanium bezel, heart-rate and sleep monitoring, dual-band GPS, and 5ATM water resistance.',
    price: 249.99,
    originalPrice: 299.99,
    category: 'Wearables',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80'
    ],
    rating: 4.9,
    reviewCount: 489,
    stock: 35,
    brand: 'Horizon',
    features: [
      '1.43" Ultra-Bright AMOLED (1000 nits)',
      'Dual-Band Multi-Satellite GNSS Navigation',
      'Advanced 24/7 Heart Rate, ECG & SpO2 Sensing',
      '5ATM Water Resistant (Swim & Dive ready)'
    ],
    specs: {
      'Display': '1.43" AMOLED (466x466 px)',
      'Case Material': 'Aerospace Grade Titanium',
      'Battery Life': 'Up to 14 Days',
      'Water Rating': '50 Meters (5ATM)',
      'Sensors': 'Optical HR, Pulse Ox, Barometer, Gyro'
    },
    isFeatured: true,
    isNew: true,
    createdAt: '2026-08-28T09:15:00.000Z'
  },
  {
    id: 'prod-4',
    name: 'Quantum Ergonomic Wireless Precision Mouse',
    shortDescription: 'Sculpted ergonomic design with infinite scroll wheel and silent clicks.',
    description: 'Boost your workflow efficiency with the Quantum Precision Mouse. Ergonomically shaped to support your palm and wrist in a natural handshake posture, equipped with a 8000 DPI Darkfield sensor that tracks on any surface including glass.',
    price: 89.99,
    originalPrice: 109.99,
    category: 'Computing',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80',
    rating: 4.6,
    reviewCount: 164,
    stock: 42,
    brand: 'Quantum',
    features: [
      'MagSpeed Electromagnetic Hyper-Fast Scrolling',
      'Tracks on any surface with 8000 DPI optical sensor',
      'Connects up to 3 devices simultaneously',
      'USB-C Quick Charge (1 min charge = 3 hours use)'
    ],
    specs: {
      'DPI Range': '200 - 8000 DPI',
      'Buttons': '7 Programmable Buttons',
      'Battery': '70 Days on full charge',
      'Weight': '141g'
    },
    isFeatured: false,
    isNew: false,
    createdAt: '2026-06-11T12:00:00.000Z'
  },
  {
    id: 'prod-5',
    name: 'Lumina Smart Ambient Desk Lamp',
    shortDescription: 'Circadian rhythm lighting with wireless phone charging base.',
    description: 'Transform your desk workspace with the Lumina Smart Lamp. Offers step-less color temperature tuning (2700K - 6500K), glare-free asymmetrical optical design, integrated 15W Qi fast charging pad, and touch slider controls.',
    price: 69.99,
    originalPrice: 89.99,
    category: 'Smart Home',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80',
    rating: 4.5,
    reviewCount: 98,
    stock: 15,
    brand: 'Lumina',
    features: [
      'Auto-Dimming Ambient Light Sensor',
      '15W Fast Qi Wireless Charging Pad',
      'CRI ≥ 95 High Color Rendering Index',
      'Adjustable Dual-Axis Aluminum Arm'
    ],
    specs: {
      'Luminance': '1000 Lumens Max',
      'Color Temp': '2700K - 6500K',
      'Power Consumption': '18W LED',
      'Charging Output': '15W Max Qi'
    },
    isFeatured: false,
    isNew: true,
    createdAt: '2026-08-05T16:20:00.000Z'
  },
  {
    id: 'prod-6',
    name: 'AcousticPulse 360 Portable Waterproof Speaker',
    shortDescription: 'Room-filling 360-degree bass sound with IPX7 waterproof rating.',
    description: 'Take deep bass and punchy highs on your outdoor journeys. Features 360-degree omnidirectional sound dispersion, 20 hours of non-stop battery, IPX7 immersion waterproofing, and PartyBoost pairing to connect multiple speakers.',
    price: 119.99,
    originalPrice: 139.99,
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewCount: 512,
    stock: 29,
    brand: 'AeroSound',
    features: [
      'IPX7 100% Waterproof and Dustproof',
      '360° Omnidirectional Acoustic Soundstage',
      '20-Hour Playtime with Powerbank function',
      'Durable fabric and ruggedized rubber housing'
    ],
    specs: {
      'Output Power': '30W RMS',
      'Frequency': '60Hz - 20kHz',
      'Battery': '5200 mAh (20 Hours)',
      'Waterproof': 'IPX7 Certified'
    },
    isFeatured: true,
    isNew: false,
    createdAt: '2026-05-19T08:45:00.000Z'
  },
  {
    id: 'prod-7',
    name: 'ProLens 4K Studio Webcam with Ring Light',
    shortDescription: 'Ultra HD 4K Sony Starvis sensor with auto-focus and built-in adjustable ring light.',
    description: 'Broadcast in cinematic clarity with ProLens 4K. Equipped with dual noise-cancelling stereo microphones, intelligent face-tracking auto-focus, HDR backlighting correction, and a magnetic physical privacy shutter.',
    price: 149.99,
    originalPrice: 179.99,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80',
    rating: 4.6,
    reviewCount: 134,
    stock: 20,
    brand: 'VisionCraft',
    features: [
      'Sony 4K HDR Starvis Sensor (3840x2160 @ 30fps / 1080p @ 60fps)',
      'Integrated 3-Level Touch Ring Light',
      'AI Facial Auto-Framing & Fast Phase Detection AF',
      'Dual Stereo Noise-Cancelling Microphones'
    ],
    specs: {
      'Resolution': '4K @ 30 FPS / 1080p @ 60 FPS',
      'Field of View': '90° Wide Angle',
      'Interface': 'USB 3.0 Type-C',
      'Mount': 'Universal Monitor Clip + 1/4" Tripod Thread'
    },
    isFeatured: false,
    isNew: false,
    createdAt: '2026-07-02T11:10:00.000Z'
  },
  {
    id: 'prod-8',
    name: 'NovaBook Aluminum Laptop Stand & Hub',
    shortDescription: 'Ergonomic cooling stand with integrated 7-in-1 USB-C Docking Station.',
    description: 'Declutter your desk while optimizing your posture. Machined from aircraft-grade anodized aluminum, featuring adjustable tilt angles, heat dissipation vents, and an integrated dock with 4K HDMI, 100W PD, and USB 3.2 ports.',
    price: 79.99,
    originalPrice: 99.99,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviewCount: 176,
    stock: 50,
    brand: 'NovaGear',
    features: [
      'Integrated 7-in-1 USB-C Hub (4K HDMI, USB-A x3, SD/TF, 100W PD)',
      'Dual Pivot Stepless Height & Angle Adjustment',
      'Non-Slip Silicone Padding for Maximum Stability',
      'Foldable flat for effortless portability'
    ],
    specs: {
      'Compatibility': '10" to 17.3" Laptops & Tablets',
      'Ports': '1x HDMI 4K@60Hz, 3x USB 3.0, 1x PD 100W, SD/TF',
      'Material': 'CNC Sandblasted Aluminum Alloy',
      'Weight Capacity': 'Up to 8 kg'
    },
    isFeatured: false,
    isNew: false,
    createdAt: '2026-06-25T13:40:00.000Z'
  },
  {
    id: 'prod-9',
    name: 'Apex True Wireless Noise-Isolating Earbuds',
    shortDescription: 'Custom acoustic dynamic drivers with 32h case and spatial audio.',
    description: 'Pocket-sized audio perfection. The Apex True Wireless Earbuds combine active noise isolation, immersive spatial 3D audio, IPX5 sweat resistance, and seamless touch controls for gaming, gym, or commute.',
    price: 99.99,
    originalPrice: 129.99,
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
    rating: 4.5,
    reviewCount: 280,
    stock: 33,
    brand: 'AeroSound',
    features: [
      'Immersive Spatial Audio with Dynamic Head Tracking',
      'Low Latency 45ms Gaming Mode',
      '8 Hours Single Play + 24 Hours in Compact Case',
      'Crystal Clear 4-Mic Call Algorithm'
    ],
    specs: {
      'Driver': '11mm Graphene Driver',
      'Bluetooth': 'Version 5.3 LE Audio',
      'Waterproof': 'IPX5 Sweat & Rain Resistant',
      'Case Charging': 'USB-C & Qi Wireless Charging'
    },
    isFeatured: false,
    isNew: true,
    createdAt: '2026-08-20T17:00:00.000Z'
  },
  {
    id: 'prod-10',
    name: 'OmniCharge 25,000mAh 140W Power Bank',
    shortDescription: 'High-capacity airline-safe power bank with real-time digital OLED display.',
    description: 'Charge your laptop, tablet, and phone simultaneously at full speed. Delivers massive 140W USB-C Power Delivery 3.1 output, enough to charge a 16-inch MacBook Pro to 50% in just 30 minutes.',
    price: 119.99,
    originalPrice: 149.99,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewCount: 310,
    stock: 22,
    brand: 'NovaGear',
    features: [
      '140W Single Port PD 3.1 Max Output',
      'Multi-Device Fast Charging (2x USB-C + 1x USB-A)',
      'Smart Digital Display showing Voltage, Amps, & Time Left',
      'Airline-Approved 92.5Wh Battery Capacity'
    ],
    specs: {
      'Capacity': '25,000 mAh (92.5 Wh)',
      'Max Output': '140W Total',
      'Input Recharge': '100W Fast Recharge (2 hours full)',
      'Dimensions': '155 x 54 x 49 mm'
    },
    isFeatured: true,
    isNew: false,
    createdAt: '2026-07-14T09:30:00.000Z'
  },
  {
    id: 'prod-11',
    name: 'AuraView 27-inch 4K HDR IPS Monitor',
    shortDescription: 'Ultra-thin bezel 4K display with 99% DCI-P3 and 90W USB-C single cable setup.',
    description: 'Crafted for creators and professionals. The AuraView 27" features 3840x2160 IPS resolution with factory color calibration (Delta E < 2), HDR400 peak brightness, and integrated KVM switch for toggling multiple computers with one keyboard & mouse.',
    price: 449.99,
    originalPrice: 529.99,
    category: 'Computing',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewCount: 145,
    stock: 8,
    brand: 'VisionCraft',
    features: [
      '4K UHD IPS Panel with 99% DCI-P3 & 100% sRGB',
      '90W USB-C Power Delivery & DisplayPort Alt Mode',
      'Built-in Hardware KVM Switch and USB 3.0 Hub',
      'Height, Tilt, Swivel, and 90° Pivot Adjustable Stand'
    ],
    specs: {
      'Panel Size': '27 Inch 16:9 Aspect Ratio',
      'Resolution': '3840 x 2160 @ 60Hz',
      'Brightness': '400 cd/m²',
      'Response Time': '4ms GtG',
      'Inputs': '1x USB-C (90W), 2x HDMI 2.0, 1x DP 1.4'
    },
    isFeatured: false,
    isNew: false,
    createdAt: '2026-06-01T15:10:00.000Z'
  },
  {
    id: 'prod-12',
    name: 'SoundBar Cinema Home Theater System',
    shortDescription: 'Dolby Atmos 5.1 surround sound bar with wireless down-firing subwoofer.',
    description: 'Bring cinematic thunder into your living room. The SoundBar Cinema features upward-firing drivers for immersive Dolby Atmos height audio, dedicated voice clarity center channel, Bluetooth 5.2, and eARC HDMI connectivity.',
    price: 299.99,
    originalPrice: 379.99,
    category: 'Smart Home',
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviewCount: 188,
    stock: 12,
    brand: 'AeroSound',
    features: [
      'Dolby Atmos & DTS:X Spatial 3D Decoding',
      'Wireless 6.5-inch Deep Bass Subwoofer',
      'Dedicated Dialogue Enhancement Mode',
      'HDMI eARC for Lossless Audio Passthrough'
    ],
    specs: {
      'Channels': '5.1.2 Virtual Surround',
      'Total Output': '380W Peak Power',
      'Connectivity': 'HDMI eARC, Optical, AUX, Bluetooth 5.2',
      'Dimensions': '900 x 60 x 95 mm'
    },
    isFeatured: false,
    isNew: true,
    createdAt: '2026-08-12T18:00:00.000Z'
  }
];

export const CATEGORIES = [
  { id: 'All', name: 'All Products', count: 12, icon: 'LayoutGrid' },
  { id: 'Audio', name: 'Audio & Sound', count: 4, icon: 'Headphones' },
  { id: 'Computing', name: 'Computing & PCs', count: 3, icon: 'Laptop' },
  { id: 'Wearables', name: 'Wearables & Fitness', count: 1, icon: 'Watch' },
  { id: 'Accessories', name: 'Accessories & Docks', count: 3, icon: 'PlugZap' },
  { id: 'Smart Home', name: 'Smart Home & Living', count: 2, icon: 'Home' },
];
