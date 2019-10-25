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

    /**
     * 窗口配置项
     */
    browerWindowConfig: BrowserWindowConstructorOptions
    /**
     * 主请求的url
     */
    requestMainUrl: string
    /**
     * 是否打开调试工具
     */
    flagDevtool: boolean

    /**
     * 升级检测地址
     */
    upgradeFeedUrl: string

    /**
     * 更新信息地址
     */
    updateInfoUrl:string

}

/**
 * 系统信息配置预设
 */
const currentSystemList: ISystemListConfig = {

    alpha: {
        apiUrl: 'https://oss-clientapp.icomecloud.com/clientconfigs/appconfig.alpha.json'
    },
    beta: {
        apiUrl: 'https://oss-clientapp.icomecloud.com/clientconfigs/appconfig.beta.json'
    },
    preview: {
        apiUrl: 'https://oss-clientapp.icomecloud.com/clientconfigs/appconfig.preview.json'
    },
    release: {
        apiUrl: 'https://oss-clientapp.icomecloud.com/clientconfigs/appconfig.release.json'
    }

};



let oAppConfig: IAppIncConfig = {

    browerWindowConfig: { width: 800, height: 600 },
    requestMainUrl: "http://localhost:3000",
    flagDevtool: true,
    upgradeFeedUrl: "https://oss-clientapp.icomecloud.com/clientapp/alpha/",
    updateInfoUrl:"https://oss-clientapp.icomecloud.com/web/upgrade/index.html"

}



let tempConfig: ISystemIncConfig;

/**
 * 当前环境变量 注意 这个地方不能修改 在gulp中会替换这行的内容 如果本地调试，请在package.json中使用--env的启动模式
 */
var currentEnv = "";


/**
 * 配置类
 */
export class SupportConfig {


    private static supportConfig = new SupportConfig();

    public static getInstance() {
        return this.supportConfig;
    }



    /**
     * 命令行启动时的参数模式
     */
    private envArg = "--env=";



    /**
     * 初始化应用的参数配置
     * @param aArgs 
     */
    initArgs(aArgs: string[]) {


        /**
         * 判断如果当前环境标记为空时，则尝试从命令行参数获取
         */
        if (!currentEnv) {
            let args = aArgs.slice(1);
            args.forEach(fItem => {
                if (fItem.startsWith(this.envArg)) {
                    currentEnv = fItem.substr(this.envArg.length);
                    HelperCommon.logDebug('current system config ' + currentEnv);
                }
            });
        }

        /**
         * 这里是为了容错，如果配置失败则自动加载生产的配置项
         */
        if (!tempConfig && currentSystemList[currentEnv]) {
            tempConfig = currentSystemList[currentEnv];
        } else {
            tempConfig = currentSystemList.release;
            HelperCommon.logDebug('init default system config ' + currentEnv);
        };

    }


    /**
     * 获取应用的配置项
     */
    upAppConfig(): IAppIncConfig {
        return oAppConfig;
    }



    /**
     * 获取系统配置项
     */
    upSystemConfig(): ISystemIncConfig {
        return tempConfig;
    }




    /**
     * 请求网络的配置
     */
    requestAppConfig(): Promise<IAppIncConfig> {


        if (this.upSystemConfig().apiUrl) {
            return axios.default.get(this.upSystemConfig().apiUrl).then(res => { oAppConfig = Object.assign(oAppConfig, res.data); return oAppConfig })
        }
        else {
            return new Promise((res) => { res(oAppConfig) });
        }



    }




}