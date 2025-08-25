"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navigation/navbar";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { ProductFilters } from "@/components/products/product-filters";
import { productsApi } from "@/lib/api";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/contexts/auth-context";

interface Product {
  _id: string;
  name: string;
  slug: string;
  image?: string; // single image
  images?: string[]; // multiple images
  mrp: number;
  sellingPrice: number;
  category: string;
  description: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await productsApi.list({
        page: currentPage,
        limit: 12,
        q: searchQuery || undefined,
        category: selectedCategory || undefined,
        sort: sortBy,
      });
      setProducts(response.items);
      setTotalPages(response.totalPages);

      // Extract unique categories
      const uniqueCategories = [
        ...new Set(response.items.map((p) => p.category).filter(Boolean)),
      ];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, selectedCategory, sortBy, searchQuery]);

  const handleAddToCart = async (productId: string) => {
    if (!isAuthenticated) {
      window.location.href = "/auth/login";
      return;
    }

    try {
      await addToCart(productId, 1);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100">
      <Navbar />

      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-bold gradient-text-pink mb-4">
              Our Collection
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover premium beauty products carefully curated for the modern
              woman
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar (filters on top in mobile, left on desktop) */}
            <div className="order-1 lg:order-none lg:col-span-1">
              <ProductFilters
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                sortBy={sortBy}
                onSortChange={setSortBy}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            </div>

            {/* Products Grid */}
            <div className="order-2 lg:order-none lg:col-span-3">
              {isLoading ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <GlassCard key={i} className="p-6 animate-pulse">
                      <div className="aspect-square bg-gray-200 rounded-lg mb-4" />
                      <div className="h-4 bg-gray-200 rounded mb-2" />
                      <div className="h-4 bg-gray-200 rounded w-2/3 mb-4" />
                      <div className="h-8 bg-gray-200 rounded" />
                    </GlassCard>
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-12 h-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    No products found
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <GlassCard
                        key={product._id}
                        className="group hover-lift overflow-hidden"
                      >
                        <div className="relative">
                          <div className="aspect-square bg-gradient-to-br from-pink-100 to-purple-100">
                            {(product.images && product.images.length > 0) ||
                            product.image ? (
                              <img
                                src={
                                  product.images?.[0] ||
                                  product.image ||
                                  "/placeholder.svg"
                                }
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-gray-500">No Image</span>
                              </div>
                            )}
                          </div>

                          {product.mrp > product.sellingPrice && (
                            <div className="absolute top-4 right-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-2 py-1 rounded-full text-xs font-semibold neon-pink">
                              {Math.round(
                                ((product.mrp - product.sellingPrice) /
                                  product.mrp) *
                                  100
                              )}
                              % OFF
                            </div>
                          )}
                        </div>

                        <div className="p-6">
                          <div className="mb-2">
                            <span className="text-xs text-purple-600 font-semibold uppercase tracking-wide">
                              {product.category}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                            {product.description}
                          </p>

                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                              <span className="text-xl font-bold text-gray-800">
                                ₹{product.sellingPrice}
                              </span>
                              {product.mrp > product.sellingPrice && (
                                <span className="text-sm text-gray-500 line-through">
                                  ₹{product.mrp}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Link
                              href={`/products/${product.slug}`}
                              className="flex-1"
                            >
                              <GradientButton
                                variant="secondary"
                                className="w-full text-sm"
                              >
                                View Details
                              </GradientButton>
                            </Link>
                            <GradientButton
                              onClick={() => handleAddToCart(product._id)}
                              className="px-4 text-sm ripple"
                            >
                              Add to Cart
                            </GradientButton>
                          </div>
                        </div>
                      </GlassCard>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-12">
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            setCurrentPage(Math.max(1, currentPage - 1))
                          }
                          disabled={currentPage === 1}
                          className="px-4 py-2 bg-white/20 border border-white/30 rounded-lg disabled:opacity-50 hover:bg-white/30 transition-all duration-300"
                        >
                          Previous
                        </button>

                        {[...Array(totalPages)].map((_, i) => (
                          <button
                            key={i + 1}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                              currentPage === i + 1
                                ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                                : "bg-white/20 border border-white/30 hover:bg-white/30"
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}

                        <button
                          onClick={() =>
                            setCurrentPage(
                              Math.min(totalPages, currentPage + 1)
                            )
                          }
                          disabled={currentPage === totalPages}
                          className="px-4 py-2 bg-white/20 border border-white/30 rounded-lg disabled:opacity-50 hover:bg-white/30 transition-all duration-300"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
