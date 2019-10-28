
import * as logger from "electron-log";


export class HelperCommon {

    static logDebug(tag:string,message: any) {
         
        logger.debug(tag+":",message);
    }

    static logInfo(tag:string,message: any) {
         
        logger.info(tag+":",message);
    }

    static upLogger(){
        return logger;
    }



}