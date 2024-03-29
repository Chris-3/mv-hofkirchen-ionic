import {Injectable} from '@angular/core';
import {Router, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {SupabaseService} from '../services/supabase.service';
import {filter, map, take} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard {

    constructor(private supabaseService: SupabaseService, private router: Router) {
    }

    canLoad(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        return this.supabaseService.getCurrentUser().pipe(
            filter(val => val !== null), // Filter out initial Behaviour subject value
            take(1), // Otherwise the Observable doesn't complete!
            map(isAuthenticated => {
                if (isAuthenticated) {
                    return true;
                } else {
                    return this.router.createUrlTree(['/']);
                }
            })
        );
    }

}
