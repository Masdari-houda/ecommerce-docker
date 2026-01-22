import { Injectable, inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { auth } from '../../firebase-config';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  
  // Vérifier si l'utilisateur est authentifié
  if (!auth.currentUser) {
    // Rediriger vers /auth avec l'URL de retour
    router.navigate(['/auth'], { queryParams: { returnUrl: state.url } });
    return false;
  }
  return true;
};
