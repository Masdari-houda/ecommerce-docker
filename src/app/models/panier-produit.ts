import { Product } from '../models/product';

export interface PanierProduit {
  
  produit: Product; 
  quantity: number;  
  price: number;    
   
}