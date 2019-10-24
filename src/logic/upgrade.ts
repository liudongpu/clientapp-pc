import { autoUpdater } from "electron-updater";
import { HelperCommon } from "../helper/common";

export class LogicUpgrade {




    static update() {
        autoUpdater.logger = HelperCommon.upLogger()
        //autoUpdater.logger.transports.file.level = "debug"

        autoUpdater.setFeedURL("https://icomeclientapp.oss-cn-beijing.aliyuncs.com/alpha/");
        autoUpdater.checkForUpdatesAndNotify()
    }


}

