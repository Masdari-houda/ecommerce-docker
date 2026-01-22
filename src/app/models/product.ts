export interface Product {
  id: number;
  title: string;
  name: string;            // on met title ici aussi pour que ton code marche direct
  description: string;
  price: number;
  oldPrice?: number;       // prix barré (on le calcule)
  discountPercentage?: number;
  rating?: number;
  stock: number;
  brand?: string;
  category: string;
  thumbnail: string;
  img: string;             // thumbnail ici aussi → ton code actuel marche
  images?: string[];
}