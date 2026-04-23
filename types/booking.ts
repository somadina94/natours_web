export interface BookingTourRef {
  _id: string;
  name: string;
  slug?: string;
  imageCover?: string;
}

export interface Booking {
  _id: string;
  tour: BookingTourRef | string;
  user?: unknown;
  price: number;
  paid: boolean;
  createdAt?: string;
  stripeCheckoutSessionId?: string;
}
