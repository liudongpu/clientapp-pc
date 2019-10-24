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

export interface IAppIncConfig {

    browerConfig: BrowserWindowConstructorOptions
    requestUrl: string
    flagDevtool: boolean


}


const currentList: ISystemListConfig = {

    alpha: {
        apiUrl: ''
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



let oAppConfig: IAppIncConfig = {

    browerConfig: { width: 800, height: 600 },
    requestUrl: "http://localhost:3000",
    flagDevtool: true

}



let tempConfig: ISystemIncConfig;

var currentEnv = "";

export class SupportConfig {


    private static supportConfig = new SupportConfig();

    public static getInstance() {
        return this.supportConfig;
    }




    private envArg = "--env=";




    initArgs(aArgs: string[]) {



        if (!currentEnv) {
            let args = aArgs.slice(1);
            args.forEach(fItem => {
                if (fItem.startsWith(this.envArg)) {
                    currentEnv = fItem.substr(this.envArg.length);
                    HelperCommon.logDebug('current system config ' + currentEnv);
                }
            });
        }

        if (!tempConfig && currentList[currentEnv]) {
            tempConfig = currentList[currentEnv];
        } else {
            tempConfig = currentList.release;
            HelperCommon.logDebug('init default system config ' + currentEnv);
        };

    }


    upAppConfig(): IAppIncConfig {
        return oAppConfig;
    }



    /**
     * 获取配置项
     */
    upSystemConfig(): ISystemIncConfig {
        return tempConfig;
    }





    requestAppConfig(): Promise<IAppIncConfig> {


        if (this.upSystemConfig().apiUrl) {
            return axios.default.get(this.upSystemConfig().apiUrl).then(res => { oAppConfig = Object.assign(oAppConfig, res.data); return oAppConfig })


        }
        else {
            return new Promise((res) => { res(oAppConfig) });
        }



    }




}