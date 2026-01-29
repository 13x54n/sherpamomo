export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
};

export const products: Product[] = [
  {
    id: "momo-classic",
    name: "Classic Momo",
    description: "Steamed dumplings with chicken, ginger, and herbs.",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1604908177225-53a2c2b1c3a6?auto=format&fit=crop&w=800&q=80",
    category: "Dumplings",
  },
  {
    id: "momo-spicy",
    name: "Spicy Momo",
    description: "Signature momo with chili oil and a fiery kick.",
    price: 13.99,
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    category: "Dumplings",
  },
  {
    id: "tandoori-momo",
    name: "Tandoori Momo",
    description: "Char-grilled momo marinated in tandoori spices.",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=800&q=80",
    category: "Specials",
  },
  {
    id: "veg-momo",
    name: "Veggie Momo",
    description: "Plant-based dumplings with fresh seasonal veggies.",
    price: 11.99,
    image: "https://images.unsplash.com/photo-1516685304081-de7947d419d4?auto=format&fit=crop&w=800&q=80",
    category: "Vegetarian",
  },
  {
    id: "momo-platter",
    name: "Momo Platter",
    description: "Mix of classic, spicy, and veggie momos.",
    price: 22.5,
    image: "https://images.unsplash.com/photo-1546069901-eacef0df6022?auto=format&fit=crop&w=800&q=80",
    category: "Combos",
  },
  {
    id: "soup",
    name: "Momo Soup",
    description: "Comforting broth with momos and herbs.",
    price: 9.5,
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80",
    category: "Sides",
  },
];
