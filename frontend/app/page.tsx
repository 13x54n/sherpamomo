import Link from 'next/link';
import { products } from '@/lib/data';
import ProductGrid from '@/components/ProductGrid';

export default function Home() {
  return (
    <div className="w-full min-h-screen pb-20">

      <div className="container mx-auto px-4">

        {/* Product Grid */}
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
