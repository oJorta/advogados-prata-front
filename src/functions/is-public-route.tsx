import { APP_ROUTES } from '../constants/app-routes';

export function isPublicRoute(route: string) {
    const publicRoutes = Object.values(APP_ROUTES.public);
    
    return publicRoutes.includes(route);
}