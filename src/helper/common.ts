
import * as logger from "electron-log";


export class HelperCommon {

    static logDebug(message: any) {
         
        logger.debug(message);
    }

    static logInfo(message: any) {
         
        logger.info(message);
    }

    static upLogger(){
        return logger;
    }



}