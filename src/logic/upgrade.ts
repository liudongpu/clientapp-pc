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

        if (SupportConfig.getInstance().upAppConfig().upgradeFeedUrl) {

            autoUpdater.logger = HelperCommon.upLogger()
            //autoUpdater.logger.transports.file.level = "debug"

            autoUpdater.setFeedURL(SupportConfig.getInstance().upAppConfig().upgradeFeedUrl);
            //autoUpdater.checkForUpdatesAndNotify()

            autoUpdater.checkForUpdates().then(result => {
                //HelperCommon.logInfo(result);
            });

            autoUpdater.on('update-available', () => {
                
                GuideStart.getInstance().upBaseWindow().loadURL(SupportConfig.getInstance().upAppConfig().updateInfoUrl);
                autoUpdater.downloadUpdate()
            });


            autoUpdater.on('update-not-available', () => {
                HelperCommon.logDebug("skip upgrade beacuse update-not-available");
            })

            autoUpdater.on('update-downloaded', () => {
                setImmediate(() => autoUpdater.quitAndInstall())
            })


        } else {
            HelperCommon.logDebug("skip upgrade beacuse upgradeUrl is null");
        }


    }


}

