"use client"

import { useState } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { cn } from "@/lib/utils"

interface ProductFiltersProps {
  categories: string[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
  sortBy: string
  onSortChange: (sort: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function ProductFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  searchQuery,
  onSearchChange,
}: ProductFiltersProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "popular", label: "Most Popular" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
  ]

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <GlassCard className="p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-400/50 focus:border-pink-400/50 transition-all duration-300"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </GlassCard>

      {/* Mobile Filter Toggle */}
      <div className="md:hidden">
        <button
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className="w-full px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-medium"
        >
          {isFiltersOpen ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {/* Filters */}
      <div className={cn("space-y-4", !isFiltersOpen && "hidden md:block")}>
        {/* Sort Options */}
        <GlassCard className="p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Sort By</h3>
          <div className="space-y-2">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onSortChange(option.value)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg transition-all duration-300",
                  sortBy === option.value
                    ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                    : "text-gray-700 hover:bg-white/30",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </GlassCard>

        {/* Categories */}
        <GlassCard className="p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Categories</h3>
          <div className="space-y-2">
            <button
              onClick={() => onCategoryChange("")}
              className={cn(
                "w-full text-left px-3 py-2 rounded-lg transition-all duration-300 capitalize",
                selectedCategory === ""
                  ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                  : "bg-white/50 text-gray-800 hover:bg-white/70",
              )}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg transition-all duration-300 capitalize",
                  selectedCategory === category
                    ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                    : "text-gray-700 hover:bg-white/30",
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
