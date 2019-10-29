import { autoUpdater } from "electron-updater";
import { HelperCommon } from "../helper/common";
import { SupportConfig, IAppIncConfig } from "../support/config";
import { dialog, app } from "electron";
import { GuideStart } from "../guide/start";


export class LogicUpgrade {



    private static processResult(result,oAppConfig){

        HelperCommon.logDebug("LogicUpgrade.update.result", result);
                if(result.versionInfo&&result.versionInfo.version!==app.getVersion()&&!oAppConfig.browerLoadUrl){
                    
                    oAppConfig.browerLoadUrl=oAppConfig.updateInfoUrl;
                }
                else{
                     
                    oAppConfig.browerLoadUrl=oAppConfig.requestMainUrl;
                }
                return oAppConfig;
    }


    /**
     * 更新检测代码
     */
    static update():Promise<IAppIncConfig> {

        let oAppConfig = SupportConfig.getInstance().upAppConfig();

        autoUpdater.logger = HelperCommon.upLogger();

        HelperCommon.logDebug("LogicUpgrade.feedurl", autoUpdater.getFeedURL());

        if(oAppConfig.updateInfoUrl){
            autoUpdater.setFeedURL(oAppConfig.upgradeFeedUrl);
        }

        if (oAppConfig.upgradeModelType === "auto") {

            return autoUpdater.checkForUpdatesAndNotify().then((result)=>LogicUpgrade.processResult(result,oAppConfig));
        }
        else if (oAppConfig.upgradeModelType === "base") {


           

            autoUpdater.on('update-available', () => {

                //oAppConfig.browerLoadUrl=oAppConfig.updateInfoUrl;
                autoUpdater.downloadUpdate()
            });


            autoUpdater.on('update-not-available', () => {
                //oAppConfig.browerLoadUrl=oAppConfig.requestMainUrl;
                HelperCommon.logDebug("LogicUpgrade.update.base", "skip upgrade beacuse update-not-available");
            })

            autoUpdater.on('update-downloaded', () => {
                setImmediate(() => autoUpdater.quitAndInstall())
            })

            return autoUpdater.checkForUpdates().then(result =>LogicUpgrade.processResult(result,oAppConfig));

        }
        else{



            return new Promise(res=>{if(!oAppConfig.browerLoadUrl){oAppConfig.browerLoadUrl=oAppConfig.requestMainUrl};res(oAppConfig)});
        }






        if (oAppConfig.upgradeFeedUrl) {

            autoUpdater.logger = HelperCommon.upLogger()
            //autoUpdater.logger.transports.file.level = "debug"

            HelperCommon.logDebug("LogicUpgrade.feedurl", autoUpdater.getFeedURL());

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
                    if(result.versionInfo&&result.versionInfo.version!==app.getVersion()){
                        GuideStart.getInstance().upBaseWindow().loadURL(oAppConfig.updateInfoUrl);
                    }
                    else{
                        GuideStart.getInstance().upBaseWindow().loadURL(oAppConfig.requestMainUrl);
                    }
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

