import { autoUpdater } from "electron-updater";
import { HelperCommon } from "../helper/common";
import { SupportConfig } from "../support/config";
import { dialog } from "electron";


export class LogicUpgrade {




    static update() {

        if (SupportConfig.getInstance().upAppConfig().upgradeUrl) {

            autoUpdater.logger = HelperCommon.upLogger()
            //autoUpdater.logger.transports.file.level = "debug"

            autoUpdater.setFeedURL(SupportConfig.getInstance().upAppConfig().upgradeUrl);
            //autoUpdater.checkForUpdatesAndNotify()

            autoUpdater.checkForUpdates().then(result => {
                HelperCommon.logInfo(result);
            });

            autoUpdater.on('update-available', () => {
                dialog.showMessageBox(null, {
                    type: 'info',
                    title: 'Found Updates',
                    message: 'Found updates, do you want update now?',
                    buttons: ['Sure', 'No']
                }
               
              );
              autoUpdater.downloadUpdate()
            });
            

            autoUpdater.on('update-not-available', () => {
                dialog.showMessageBox(null, {
                    title: 'No Updates',
                    message: 'Current version is up-to-date.'
                })

            })

            autoUpdater.on('update-downloaded', () => {
                setImmediate(() => autoUpdater.quitAndInstall())
            })


        } else {
            HelperCommon.logDebug("skip upgrade beacuse upgradeUrl is null");
        }


    }


}

