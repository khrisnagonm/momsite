// Professional Types
export interface Professional {
  id: string
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
  createdAt: any
  updatedAt: any
  createdBy: string
}

// Meeting Place Types
export interface MeetingPlace {
  id: string
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
  accessibility: string[]
  priceRange: string
  ageGroups: string[]
  createdAt: any
  updatedAt: any
  createdBy: string
}

// Event Types
export interface Event {
  id: string
  title: string
  description: string
  category: string
  date: any
  startTime: string
  endTime: string
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
  isFree: boolean
  ageGroups: string[]
  requirements: string[]
  materials: string[]
  images: string[]
  tags: string[]
  isActive: boolean
  registrationDeadline: any
  attendees: string[]
  createdAt: any
  updatedAt: any
  createdBy: string
}

// Forum Types
export interface ForumPost {
  id: string
  title: string
  content: string
  author: {
    id: string
    name: string
    avatar?: string
  }
  category: string
  tags: string[]
  likes: number
  replies: number
  views: number
  isSticky: boolean
  isLocked: boolean
  createdAt: any
  updatedAt: any
}

export interface ForumReply {
  id: string
  postId: string
  content: string
  author: {
    id: string
    name: string
    avatar?: string
  }
  likes: number
  createdAt: any
  updatedAt: any
}

// Product Types
export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  subcategory: string
  condition: "new" | "used" | "like-new"
  images: string[]
  seller: {
    id: string
    name: string
    rating: number
    location: string
  }
  location: string
  isAvailable: boolean
  tags: string[]
  specifications: {
    [key: string]: string
  }
  shipping: {
    available: boolean
    cost: number
    methods: string[]
  }
  views: number
  favorites: number
  createdAt: any
  updatedAt: any
}

// Utility Types
export interface Category {
  id: string
  name: string
  count: number
}

export interface SortOption {
  value: string
  label: string
}
