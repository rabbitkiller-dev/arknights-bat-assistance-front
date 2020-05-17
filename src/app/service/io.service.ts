import {Injectable, PlatformRef} from '@angular/core';
// @ts-ignore
import IO from 'socket.io-client';
// @ts-ignore
import platform from 'platform';
import {AlertController, Platform} from '@ionic/angular';
import {reject} from 'q';

/** 用户是否被封禁 */
let isSeal = false;
const SealText = '你已经被关进小黑屋中, 请反思后再试';
/** 封禁用户释放时间 */
export const SealUserTimeout = 1000 * 60 * 10; // 10分钟

@Injectable({providedIn: 'root'})
export class IoService {
  socket: SocketIOClient.Socket;

  constructor(
    public platformRef: PlatformRef,
    public alertController: AlertController,
  ) {

  }

  init() {
    return new Promise((resolve, reject) => {
      this.socket = new IO('//localhost:9200/', {});
      // this.socket = new IO('//47.106.106.88:9200/', {});
      this.socket.on('connect', async () => {
        const token = window.localStorage.getItem('token');
        if (token) {
          const user = await this.loginByToken(
            token,
            platform.os?.family,
            platform.name,
            platform.description,
          );
          resolve(user);
        } else {
          await this.loginFailback();
          resolve();
        }
      });
    });
  }

  async loginFailback() {
    const res = await this.fetch('guest', {
      os: platform.os.family,
      browser: platform.name,
      environment: platform.description
    });
    console.log(res);
  }

  /**
   * 使用token登录
   * @param token 登录token
   * @param os 系统
   * @param browser 浏览器
   * @param environment 环境信息
   */
  async loginByToken(
    token: string,
    os = '',
    browser = '',
    environment = '',
  ) {
    const user = await this.fetch(
      'loginByToken',
      {
        token,
        os,
        browser,
        environment,
      },
      {toast: false},
    );
    window.localStorage.setItem('username', user.username);
    return user;
  }

  fetch<T = any>(event: string, data = {}, {
    toast = true,
  } = {}): Promise<T | null> {
    if (isSeal) {
      this.alertController.create({
        header: '封禁提示',
        message: SealText,
        buttons: ['确定']
      }).then((alert) => {
        alert.present();
      });
      return Promise.reject(SealText);
    }
    return new Promise((resolve, reject) => {
      this.socket.emit(event, data, (res: any) => {
        if (typeof res === 'string') {
          if (toast) {
            this.alertController.create({
              header: '发生错误',
              message: res,
              buttons: ['确定']
            }).then((alert) => {
              alert.present();
            });
          }
          /**
           * 服务端返回封禁状态后, 本地存储该状态
           * 用户再触发接口请求时, 直接拒绝
           */
          if (res === SealText) {
            isSeal = true;
            // 用户封禁和ip封禁时效不同, 这里用的短时间
            setTimeout(() => {
              isSeal = false;
            }, SealUserTimeout);
          }
          reject(res);
        } else {
          resolve(res);
        }
      });
    });
  }
}
