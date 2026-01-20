'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Package,
  DollarSign,
  Star,
  Eye,
  MoreHorizontal
} from 'lucide-react';
import { toast } from 'sonner';

// Mock data - in production, fetch from API
const mockProducts = [
  {
    id: '1',
    name: 'Chicken Momo',
    description: 'Delicious steamed dumplings filled with seasoned chicken',
    price: 12.99,
    category: 'Chicken',
    image: '/api/placeholder/100/100',
    rating: 4.5,
    reviewCount: 128,
    inStock: true,
    stock: 25,
    featured: true
  },
  {
    id: '2',
    name: 'Buff Momo',
    description: 'Traditional Nepali dumplings with buffalo meat',
    price: 11.99,
    category: 'Buff',
    image: '/api/placeholder/100/100',
    rating: 4.2,
    reviewCount: 89,
    inStock: true,
    stock: 18,
    featured: false
  },
  {
    id: '3',
    name: 'Veg Momo',
    description: 'Vegetarian dumplings with fresh vegetables and spices',
    price: 9.99,
    category: 'Vegetarian',
    image: '/api/placeholder/100/100',
    rating: 4.7,
    reviewCount: 203,
    inStock: false,
    stock: 0,
    featured: true
  }
];

const categories = ['Chicken', 'Buff', 'Vegetarian', 'Pork', 'Fish', 'Other'];

export default function AdminProducts() {
  const [products, setProducts] = useState(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    featured: false,
    inStock: true
  });

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = () => {
    const newProduct = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      image: '/api/placeholder/100/100',
      rating: 0,
      reviewCount: 0,
      inStock: formData.inStock,
      stock: parseInt(formData.stock),
      featured: formData.featured
    };

    setProducts([...products, newProduct]);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      stock: '',
      featured: false,
      inStock: true
    });
    setIsAddDialogOpen(false);
    toast.success('Product added successfully');
  };

  const handleEditProduct = () => {
    if (!editingProduct) return;

    const updatedProducts = products.map(product =>
      product.id === editingProduct.id
        ? {
            ...product,
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            category: formData.category,
            stock: parseInt(formData.stock),
            featured: formData.featured,
            inStock: formData.inStock
          }
        : product
    );

    setProducts(updatedProducts);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      stock: '',
      featured: false,
      inStock: true
    });
    toast.success('Product updated successfully');
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(product => product.id !== productId));
      toast.success('Product deleted successfully');
    }
  };

  const openEditDialog = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      featured: product.featured,
      inStock: product.inStock
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      stock: '',
      featured: false,
      inStock: true
    });
    setEditingProduct(null);
    setIsAddDialogOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Products Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage your product catalog, pricing, and inventory.
          </p>
        </div>
        <Dialog open={isAddDialogOpen || !!editingProduct} onOpenChange={(open) => {
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter product description"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                    placeholder="0"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                  />
                  <Label htmlFor="featured">Featured</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="inStock"
                    checked={formData.inStock}
                    onChange={(e) => setFormData(prev => ({ ...prev, inStock: e.target.checked }))}
                  />
                  <Label htmlFor="inStock">In Stock</Label>
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button onClick={editingProduct ? handleEditProduct : handleAddProduct}>
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Products ({filteredProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center">
                        <Package className="w-5 h-5 text-gray-500" />
                      </div>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                          {product.rating} ({product.reviewCount})
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>${product.price}</TableCell>
                  <TableCell>
                    <span className={product.stock < 10 ? 'text-red-600 font-medium' : ''}>
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {product.featured && (
                        <Badge variant="secondary" className="text-xs">
                          Featured
                        </Badge>
                      )}
                      <Badge variant={product.inStock ? "default" : "destructive"} className="text-xs">
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(product)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredProducts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No products found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}