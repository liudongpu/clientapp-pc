import { BrowserWindow, dialog, app } from 'electron';
import { SupportConfig } from '../support/config';
import { HelperCommon } from '../helper/common';




let win: any;



export class GuideStart {




  /**
   * APP准备好时操作
   */
  appReady() {



    SupportConfig.getInstance().requestAppConfig().then((response) => {


      let oAppConfig = SupportConfig.getInstance().upAppConfig();

      win = new BrowserWindow(oAppConfig.browerConfig);



      win.loadURL(oAppConfig.requestUrl);


      if (oAppConfig.flagDevtool) {
        win.webContents.openDevTools();
      }

      // Emitted when the window is closed.
      win.on('closed', () => {
        // Dereference the window object, usually you would store window
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
      });

    }).catch(() => {

      dialog.showErrorBox("网络请求错误", "请求错误，请重新打开尝试");

      app.quit();
    });



  }


  appActivate() {
    if (win === null) {
      this.appReady();
    }
  }






}



