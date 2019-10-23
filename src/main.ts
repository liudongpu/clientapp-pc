import { app} from 'electron';
import {GuideStart} from './guide/start';
import { SupportConfig } from './support/config';



let guideStart:GuideStart=new GuideStart();




//这里初始化整个项目的配置信息
SupportConfig.getInstance().initArgs(process.argv);


try {

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', guideStart.appReady);

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', guideStart.appActivate);

} catch (e) {
  // Catch Error
  // throw e;
}
