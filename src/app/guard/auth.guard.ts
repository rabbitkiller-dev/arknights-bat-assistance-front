import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {IoService} from '../service/io.service';
import {CharacterService} from '../service/character.service';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(
    private ioService: IoService,
    private characterService: CharacterService,
  ) {
  }


  /**
   * 当前路由守卫
   * @returns Observable<boolean>|boolean
   */
  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    await this.ioService.init();
    await this.characterService.init();
    return true;
  }

  /**
   * 子路由守卫
   * @returns Observable<boolean>|boolean
   */
  async canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return await this.canActivate(route, state);
  }

}
