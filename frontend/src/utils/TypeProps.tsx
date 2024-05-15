export type Post = {
  id: number;
  title: string;
  description: string;
  images: string[];
  location: string;
  reservations: Reservation[];
  user_id: number;
};

export type Reservation = {
  id: number;
  pickup_time: string;
  free: boolean;
};
