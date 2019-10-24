import { HelperCommon } from "../helper/common";
import { BrowserWindowConstructorOptions, app } from 'electron';
import * as axios from "axios";
/**
 * 配置信息
 */
export interface ISystemIncConfig {
    /**
     * 调用接口地址
     */
    apiUrl: string

}

/**
 * 不同环境的配置管理
 */
export interface ISystemListConfig {
    [keys: string]: ISystemIncConfig
}

export interface IAppIncConfig{

    browerConfig:BrowserWindowConstructorOptions
    requestUrl:string
    flagDevtool:boolean


}


const currentList: ISystemListConfig = {

    alpha: {
        apiUrl: 'http://www.icomecloud.com'
    },
    beta: {
        apiUrl: 'http://www.icomecloud.com'
    },
    preview: {
        apiUrl: 'http://www.icomecloud.com'
    },
    release: {
        apiUrl: 'http://www.icomecloud.com'
    }

};



let oAppConfig:IAppIncConfig={

    browerConfig:{width:800,height:600},
    requestUrl:"https://icomestatics.oss-cn-beijing.aliyuncs.com/developer/demo2/v1.html",
    flagDevtool:false
    
}



let tempConfig: ISystemIncConfig;
export class SupportConfig {


    private static supportConfig = new SupportConfig();

    public static getInstance() {
        return this.supportConfig;
    }




    private envArg = "--env=";

    private currentEnv = "";


    initArgs(aArgs: string[]) {


        HelperCommon.logDebug(app.getVersion());
        let args = aArgs.slice(1);
        args.forEach(fItem => {
            if (fItem.startsWith(this.envArg)) {
                this.currentEnv = fItem.substr(this.envArg.length);
                HelperCommon.logDebug('current system config '+this.currentEnv);
            }
        });

        if (!tempConfig && currentList[this.currentEnv]) {
            tempConfig = currentList[this.currentEnv];
        } else {
            tempConfig = currentList.release;
            HelperCommon.logDebug('init default system config '+this.currentEnv);
        };

    }


    upAppConfig():IAppIncConfig{
        return oAppConfig;
    }



    /**
     * 获取配置项
     */
    upSystemConfig(): ISystemIncConfig {
        return tempConfig;
    }





    requestAppConfig() {

        
        return axios.default.get(this.upSystemConfig().apiUrl).then(res=>{return res})


        

    }




}