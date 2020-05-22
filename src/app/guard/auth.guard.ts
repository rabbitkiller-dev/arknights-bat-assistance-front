import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {IoService} from '../service/io.service';
import {CharacterService} from '../service/character.service';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(
    private router: Router,
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
    console.log(state.url);
    // 访问登录页并且没有登录
    if (state.url === '/login' && !this.ioService.isLogin) {
      return true;
    }
    // 访问登录页但是登录了 跳转到首页
    if (state.url === '/login' && this.ioService.isLogin) {
      this.router.navigateByUrl('/');
      return false;
    }

    if (this.ioService.isLogin) {
      await this.characterService.init();
      return true;
    } else {
      this.router.navigateByUrl('/login');
      return false;
    }
  }

  /**
   * 子路由守卫
   * @returns Observable<boolean>|boolean
   */
  async canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return await this.canActivate(route, state);
  }

}
