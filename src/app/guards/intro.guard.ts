import {COMPONENT} from '../interfaces/route-names';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Preferences} from '@capacitor/preferences';

export const INTRO_KEY = 'intro-seen';

@Injectable({
    providedIn: 'root'
})
export class IntroGuard {
    constructor(private router: Router) {
    }

    async canLoad(): Promise<boolean> {
        const ret = await Preferences.get({key: INTRO_KEY});
        const hasSeenIntro = JSON.parse(ret.value);
        // console.log(hasSeenIntro);
        if (hasSeenIntro) {
            return true;
        } else {
            this.router.navigateByUrl('/' + COMPONENT.INTRO, {replaceUrl: true});
            return false;
        }
    }
}
