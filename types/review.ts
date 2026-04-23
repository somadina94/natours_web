export interface ReviewTourRef {
  _id: string;
  name: string;
  slug?: string;
}

export interface Review {
  _id: string;
  review: string;
  rating: number;
  createdAt?: string;
  tour: ReviewTourRef | string;
  user?: string;
}
