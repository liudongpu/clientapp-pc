import { autoUpdater } from "electron-updater";
import { HelperCommon } from "../helper/common";
import { SupportConfig } from "../support/config";
import { dialog } from "electron";
import { GuideStart } from "../guide/start";


export class LogicUpgrade {



    /**
     * 更新检测代码
     */
    static update() {

        let oAppConfig = SupportConfig.getInstance().upAppConfig();

        if (oAppConfig.upgradeFeedUrl) {

            autoUpdater.logger = HelperCommon.upLogger()
            //autoUpdater.logger.transports.file.level = "debug"

            autoUpdater.setFeedURL(oAppConfig.upgradeFeedUrl);
            //autoUpdater.checkForUpdatesAndNotify()



            if (oAppConfig.upgradeModelType === "auto") {
                //GuideStart.getInstance().upBaseWindow().loadURL(oAppConfig.updateInfoUrl);

                //这里 如果有升级内容 则自动将首页设置为更新提示然后提示升级
                //oAppConfig.requestMainUrl=oAppConfig.updateInfoUrl;

                

                /*
                autoUpdater.on('update-available', () => {

                    GuideStart.getInstance().upBaseWindow().loadURL(oAppConfig.updateInfoUrl);
                    
                });


                autoUpdater.on('update-not-available', () => {
                    GuideStart.getInstance().upBaseWindow().loadURL(oAppConfig.requestMainUrl);
                    
                });
                



                autoUpdater.on('checking-for-update', () => {
                    HelperCommon.logDebug("LogicUpgrade.update", 'Checking for update...');
                  })
                  autoUpdater.on('update-available', (info) => {
                    HelperCommon.logDebug("LogicUpgrade.update", 'Update available.');
                  })
                  autoUpdater.on('update-not-available', (info) => {
                    HelperCommon.logDebug("LogicUpgrade.update", 'Update not available.');
                  })
                  autoUpdater.on('error', (err) => {
                    HelperCommon.logDebug("LogicUpgrade.update", 'Error in auto-updater. ' + err);
                  })
                  autoUpdater.on('download-progress', (progressObj) => {
                    let log_message = "Download speed: " + progressObj.bytesPerSecond;
                    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
                    log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
                    HelperCommon.logDebug("LogicUpgrade.update", log_message);
                  })
                  autoUpdater.on('update-downloaded', (info) => {
                    HelperCommon.logDebug("LogicUpgrade.update", 'Update downloaded');
                  });

                */

                  autoUpdater.checkForUpdatesAndNotify().then((result)=>{
                    HelperCommon.logDebug("LogicUpgrade.update.result", result);
                  });


            }
            else {
                autoUpdater.checkForUpdates().then(result => {
                    //HelperCommon.logInfo(result);
                });

                autoUpdater.on('update-available', () => {

                    GuideStart.getInstance().upBaseWindow().loadURL(oAppConfig.updateInfoUrl);
                    autoUpdater.downloadUpdate()
                });


                autoUpdater.on('update-not-available', () => {
                    GuideStart.getInstance().upBaseWindow().loadURL(oAppConfig.requestMainUrl);
                    HelperCommon.logDebug("LogicUpgrade.update", "skip upgrade beacuse update-not-available");
                })

                autoUpdater.on('update-downloaded', () => {
                    setImmediate(() => autoUpdater.quitAndInstall())
                })
            }



        } else {
            HelperCommon.logDebug("LogicUpgrade.update", "skip upgrade beacuse upgradeUrl is null");
        }


    }


}

