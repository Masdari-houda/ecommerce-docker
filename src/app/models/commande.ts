import { PanierProduit } from './panier-produit';

export interface Commandeproduct {
  id?: string;
  userId: string;
  produits: PanierProduit[];
  total: number;
  date: Date;
  statut: 'en_attente' | 'confirmee' | 'expediee' | 'livree' | 'annulee';
  adresseLivraison?: {
    nom: string;
    prenom: string;
    adresse: string;
    ville: string;
    codePostal: string;
    telephone: string;
  };
}

