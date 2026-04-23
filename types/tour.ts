export type TourDifficulty = "easy" | "medium" | "difficult";

export interface TourLocation {
  type?: string;
  coordinates: number[];
  address?: string;
  description?: string;
  day?: number;
}

export interface Tour {
  _id: string;
  id?: string;
  name: string;
  slug: string;
  duration: number;
  maxGroupSize: number;
  difficulty: TourDifficulty;
  ratingsAverage: number;
  ratingsQuantity: number;
  price: number;
  priceDiscount?: number;
  summary: string;
  description?: string;
  imageCover: string;
  images: string[];
  startDates: string[];
  startLocation?: {
    type?: string;
    coordinates: number[];
    address?: string;
    description?: string;
  };
  locations?: TourLocation[];
  guides?: { name?: string; photo?: string; role?: string }[];
  reviews?: unknown[];
}

export interface ApiListResponse<T> {
  status: string;
  results: number;
  data: { data: T[] };
}

export interface ApiItemResponse<T> {
  status: string;
  data: { data: T };
}
