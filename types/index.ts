import type React from "react"
// Professional types
export interface Professional {
  id: string
  name: string
  specialty: string
  description: string
  experience: string
  location: string
  phone: string
  email: string
  website?: string
  image?: string
  rating: number
  reviewCount: number
  verified: boolean
  services: string[]
  availability: {
    days: string[]
    hours: string
  }
  createdAt: string
  updatedAt: string
}

// Meeting place types
export interface MeetingPlace {
  id: string
  name: string
  description: string
  address: string
  city: string
  category: string
  amenities: string[]
  image?: string
  rating: number
  reviewCount: number
  priceRange: string
  contact: {
    phone?: string
    email?: string
    website?: string
  }
  schedule: {
    days: string[]
    hours: string
  }
  accessibility: boolean
  createdAt: string
  updatedAt: string
}

// Event types
export interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  category: string
  organizer: string
  maxAttendees?: number
  currentAttendees: number
  price: number
  image?: string
  tags: string[]
  requirements?: string[]
  ageGroup: string
  createdAt: string
  updatedAt: string
}

// Forum types
export interface ForumAuthor {
  name: string
  avatar?: string
  badge: string
  joinDate: string
}

export interface ForumPost {
  id: string
  title: string
  content: string
  author: ForumAuthor
  category: string
  subcategory?: string
  createdAt: string
  replies: number
  likes: number
  views: number
  isPinned: boolean
  isHot: boolean
  tags: string[]
  lastReply?: {
    author: string
    time: string
  }
}

export interface ForumReply {
  id: string
  author: ForumAuthor
  content: string
  createdAt: string
  likes: number
  postId: string
}

// Marketplace types
export interface Product {
  id: string
  title: string
  description: string
  price: number
  originalPrice?: number
  category: string
  condition: "new" | "like-new" | "good" | "fair"
  seller: {
    name: string
    avatar?: string
    rating: number
    reviewCount: number
    verified: boolean
  }
  images: string[]
  location: string
  tags: string[]
  availability: "available" | "sold" | "reserved"
  createdAt: string
  updatedAt: string
  views: number
  favorites: number
}

// Category types
export interface Category {
  name: string
  icon: React.ReactNode
  count: number
}

// Filter and sort types
export interface FilterOptions {
  category?: string
  location?: string
  priceRange?: [number, number]
  condition?: string
  availability?: string
}

export interface SortOption {
  value: string
  label: string
}
