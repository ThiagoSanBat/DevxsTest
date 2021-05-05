export type Product = {
  id?: number;
  name?: string;
  description?: string;
  price?: number;
  images?: { id: number }[];
};

export type User = {
  id?: number;
  email?: string;
  role?: string;
  name?: string;
  password?: string;
};
