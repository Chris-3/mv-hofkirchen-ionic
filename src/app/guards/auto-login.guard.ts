import {COMPONENT} from '../interfaces/route-names';
import {Injectable} from '@angular/core';
import {Router, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {filter, take, map} from 'rxjs/operators';
import {SupabaseService} from '../services/supabase.service';

@Injectable({
    providedIn: 'root'
})
export class AutoLoginGuard {
    constructor(private supabaseService: SupabaseService, private router: Router) {
    }

    canLoad(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        return this.supabaseService.getCurrentUser().pipe(
            filter(val => val !== null), // Filter out initial Behaviour subject value
            take(1), // Otherwise the Observable doesn't complete!
            map(isAuthenticated => {
                if (isAuthenticated) {
                    return this.router.createUrlTree(['/' + COMPONENT.INSIDE]);
                } else {
                    return true;
                }
            })
        );
    }
}
