"use client"

import { useState, useEffect } from "react"
import { AdminGuard } from "@/components/admin/admin-guard"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { GlassCard } from "@/components/ui/glass-card"
import { GradientButton } from "@/components/ui/gradient-button"
import { FloatingInput } from "@/components/ui/floating-input"
import { adminApi } from "@/lib/api"

interface Product {
  _id: string
  name: string
  slug: string
  category: string
  images: string[]
  mrp: number
  sellingPrice: number
  stock: number
  visible: boolean
  description: string
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      const response = await adminApi.products.list({
        page: currentPage,
        limit: 10,
        q: searchQuery || undefined,
        category: selectedCategory || undefined,
      })
      setProducts(response.items)
      setTotalPages(response.totalPages)
    } catch (error) {
      console.error("Failed to fetch products:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [currentPage, searchQuery, selectedCategory])

  const handleToggleVisibility = async (product: Product) => {
    try {
      await adminApi.products.update(product._id, { visible: !product.visible })
      fetchProducts()
    } catch (error) {
      console.error("Failed to update product:", error)
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      await adminApi.products.delete(productId)
      fetchProducts()
    } catch (error) {
      console.error("Failed to delete product:", error)
    }
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
        <AdminSidebar />

        <main className="ml-64 p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-serif font-bold gradient-text mb-2">Products</h1>
              <p className="text-gray-600">Manage your product catalog</p>
            </div>
            <GradientButton onClick={() => setIsModalOpen(true)}>Add Product</GradientButton>
          </div>

          {/* Filters */}
          <GlassCard className="p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FloatingInput id="search" label="Search products..." value={searchQuery} onChange={setSearchQuery} />
              <FloatingInput
                id="category"
                label="Filter by category"
                value={selectedCategory}
                onChange={setSelectedCategory}
              />
            </div>
          </GlassCard>

          {/* Products Table */}
          <GlassCard className="overflow-hidden">
            {isLoading ? (
              <div className="p-6">
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 animate-pulse">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/20">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Product</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Category</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Price</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Stock</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/20">
                    {products.map((product) => (
                      <tr key={product._id} className="hover:bg-white/10 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg flex items-center justify-center">
                              {product.images?.[0] ? (
                                <img
                                  src={product.images[0] || "/placeholder.svg"}
                                  alt={product.name}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              ) : (
                                <span className="text-gray-500 text-xs">No Image</span>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{product.name}</p>
                              <p className="text-sm text-gray-600 line-clamp-1">{product.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 capitalize">{product.category}</td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <p className="font-medium text-gray-800">₹{product.sellingPrice}</p>
                            {product.mrp > product.sellingPrice && (
                              <p className="text-gray-500 line-through">₹{product.mrp}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{product.stock}</td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleToggleVisibility(product)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                              product.visible
                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                : "bg-red-100 text-red-800 hover:bg-red-200"
                            }`}
                          >
                            {product.visible ? "Visible" : "Hidden"}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setEditingProduct(product)
                                setIsModalOpen(true)
                              }}
                              className="text-blue-600 hover:text-blue-700 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product._id)}
                              className="text-red-600 hover:text-red-700 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-white/20">
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-white/20 border border-white/30 rounded disabled:opacity-50 hover:bg-white/30 transition-colors"
                  >
                    Previous
                  </button>

                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 rounded transition-colors ${
                        currentPage === i + 1
                          ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                          : "bg-white/20 border border-white/30 hover:bg-white/30"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 bg-white/20 border border-white/30 rounded disabled:opacity-50 hover:bg-white/30 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </GlassCard>
        </main>
      </div>
    </AdminGuard>
  )
}
