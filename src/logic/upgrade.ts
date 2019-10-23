import { autoUpdater } from "electron-updater";
import * as logger from "electron-log";

export class LogicUpgrade {




    static update() {
        autoUpdater.logger = logger
        //autoUpdater.logger.transports.file.level = "debug"

        autoUpdater.setFeedURL("https://icomeclientapp.oss-cn-beijing.aliyuncs.com/alpha/");
        autoUpdater.checkForUpdatesAndNotify()
    }


}

