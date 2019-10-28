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
                GuideStart.getInstance().upBaseWindow().loadURL(oAppConfig.updateInfoUrl);
                autoUpdater.checkForUpdatesAndNotify()
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

