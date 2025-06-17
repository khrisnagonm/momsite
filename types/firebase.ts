import type { Timestamp, FieldValue } from "firebase/firestore"

// Base interface for all Firestore documents
export interface FirestoreDocument {
  id: string
  createdAt: Timestamp | FieldValue
  updatedAt: Timestamp | FieldValue
  createdBy: string
}

// Professional interface with Firestore types
export interface Professional extends FirestoreDocument {
  name: string
  title: string
  specialties: string[]
  email: string
  phone: string
  location: string
  address: string
  bio: string
  experience: number
  rating: number
  reviewCount: number
  isVerified: boolean
  isActive: boolean
  availability: string[]
  consultationTypes: string[]
  pricing: {
    consultation: number
    workshop: number
    homeVisit: number
  }
  education: string[]
  certifications: string[]
  languages: string[]
  socialMedia: {
    website?: string
    instagram?: string
    facebook?: string
  }
}

// Meeting Place interface with Firestore types
export interface MeetingPlace extends FirestoreDocument {
  name: string
  description: string
  address: string
  neighborhood: string
  city: string
  coordinates: {
    lat: number
    lng: number
  }
  category: string
  amenities: string[]
  openingHours: {
    [key: string]: {
      open: string
      close: string
      closed: boolean
    }
  }
  contact: {
    phone?: string
    email?: string
    website?: string
  }
  images: string[]
  rating: number
  reviewCount: number
  isActive: boolean
  isVerified: boolean
  accessibility: string[]
  priceRange: string
  ageGroups: string[]
}

// Event interface with Firestore types
export interface Event extends FirestoreDocument {
  title: string
  description: string
  category: string
  date: Timestamp | FieldValue
  endDate?: Timestamp | FieldValue
  time: string
  endTime?: string
  location: {
    name: string
    address: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  organizer: {
    name: string
    email: string
    phone?: string
  }
  capacity: number
  registeredCount: number
  price: number
  currency: string
  ageGroups: string[]
  requirements: string[]
  includes: string[]
  images: string[]
  isActive: boolean
  isFeatured: boolean
  registrationDeadline?: Timestamp | FieldValue
  tags: string[]
  difficulty?: string
  duration?: string
}

// Forum Post interface with Firestore types
export interface ForumPost extends FirestoreDocument {
  title: string
  content: string
  category: string
  tags: string[]
  author: {
    uid: string
    name: string
    avatar?: string
  }
  likes: number
  replies: number
  views: number
  isSticky: boolean
  isLocked: boolean
  lastReplyAt?: Timestamp | FieldValue
  lastReplyBy?: {
    uid: string
    name: string
  }
}

// Forum Reply interface with Firestore types
export interface ForumReply extends FirestoreDocument {
  postId: string
  content: string
  author: {
    uid: string
    name: string
    avatar?: string
  }
  likes: number
  parentReplyId?: string
  isAccepted?: boolean
}

// Product interface with Firestore types
export interface Product extends FirestoreDocument {
  name: string
  description: string
  category: string
  subcategory?: string
  price: number
  currency: string
  condition: "new" | "used" | "like-new"
  images: string[]
  seller: {
    uid: string
    name: string
    avatar?: string
    rating: number
    reviewCount: number
  }
  location: {
    city: string
    neighborhood?: string
  }
  isActive: boolean
  isFeatured: boolean
  views: number
  favorites: number
  tags: string[]
  specifications?: {
    [key: string]: string
  }
  shippingOptions: string[]
  paymentMethods: string[]
}

// Category interface
export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  color?: string
  parentId?: string
  isActive: boolean
  order: number
}

// User Profile interface with Firestore types
export interface UserProfile extends FirestoreDocument {
  uid: string
  email: string
  displayName?: string
  avatar?: string
  bio?: string
  location?: string
  role: "user" | "admin" | "moderator"
  isActive: boolean
  isVerified: boolean
  preferences: {
    notifications: boolean
    newsletter: boolean
    publicProfile: boolean
  }
  stats: {
    postsCount: number
    repliesCount: number
    likesReceived: number
  }
  lastLoginAt: Timestamp | FieldValue
}

// Notification interface with Firestore types
export interface Notification extends FirestoreDocument {
  userId: string
  type: "like" | "reply" | "mention" | "event" | "system"
  title: string
  message: string
  data?: {
    [key: string]: any
  }
  isRead: boolean
  actionUrl?: string
}

// Review interface with Firestore types
export interface Review extends FirestoreDocument {
  targetType: "professional" | "place" | "event" | "product"
  targetId: string
  author: {
    uid: string
    name: string
    avatar?: string
  }
  rating: number
  title?: string
  content: string
  images?: string[]
  isVerified: boolean
  isActive: boolean
  helpfulCount: number
}

// Search filters and options
export interface SearchFilters {
  category?: string
  location?: string
  priceRange?: {
    min: number
    max: number
  }
  rating?: number
  isVerified?: boolean
  isActive?: boolean
  dateRange?: {
    start: Date
    end: Date
  }
}

export interface SortOption {
  value: string
  label: string
  field: string
  direction: "asc" | "desc"
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

// Form types
export interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
  phone?: string
}

export interface NewsletterSubscription {
  email: string
  preferences: string[]
  source?: string
}

// Analytics types
export interface AnalyticsEvent {
  event: string
  category: string
  action: string
  label?: string
  value?: number
  userId?: string
  timestamp: Timestamp | FieldValue
}
