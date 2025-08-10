import { CanActivateFn } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from '../decoded-token';

export const hotelGuard: CanActivateFn = (route, state) => {
  const jwt = localStorage.getItem('token');

  const decodedToken = jwtDecode<DecodedToken>(jwt!);

  if (decodedToken.roles.toLowerCase() == 'hotel') {
    return true;
  }

  return false;
};
export const companyGuard: CanActivateFn = (route, state) => {
  const jwt = localStorage.getItem('token');

  const decodedToken = jwtDecode<DecodedToken>(jwt!);

  if (decodedToken.roles.toLowerCase() == 'tourismcompany') {
    return true;
  }

  return false;
};
export const touristGuard: CanActivateFn = (route, state) => {
  const jwt = localStorage.getItem('token');

  const decodedToken = jwtDecode<DecodedToken>(jwt!);

  if (decodedToken.roles.toLowerCase() == 'tourist') {
    return true;
  }

  return false;
};
export const tourGuideGuard: CanActivateFn = (route, state) => {
  const jwt = localStorage.getItem('token');

  const decodedToken = jwtDecode<DecodedToken>(jwt!);

  if (decodedToken.roles.toLowerCase() == 'tourguide') {
    return true;
  }

  return false;
};
export const adminGuard: CanActivateFn = (route, state) => {
  const jwt = localStorage.getItem('token');

  const decodedToken = jwtDecode<DecodedToken>(jwt!);

  if (decodedToken.roles.toLowerCase() == 'admin') {
    return true;
  }

  return false;
};
