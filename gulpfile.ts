import { series, src, dest } from 'gulp';

import * as fs from "fs";
import * as path from "path";
import * as child_process from "child_process";
import * as del from "del";


let oConfig = {

    pathGulpConfig: "dist/gule-configs/",
    fileSourceConfig: "xconfigs/builds/electron-builder.json",
    extConfig: ".json",
    ossKeyFile: "dist/key/miniapp.json",
    envName: "",
    distTsc: "dist/out-tsc/",
    distClientApp:"dist/clientapp",
    flagUploadOss:true,
    allowUpload:[".yml",".dmg",".blockmap",".exe",".zip"]
}



class GulpProcess {

    static execTask() {


        this.updateAppConfig();

        this.buildConfig();

        this.uploadOss();
        //child_process.execSync("electron-builder  --config " + sConfigFile, { stdio: "inherit" });


    }

    /**
     * 更新配置文件 这里替换var currentEnv = "";为打包的环境的值
     */
    static updateAppConfig() {

        let sFileConfig = path.join(oConfig.distTsc, "support", "config.js");

        let sConfigContent = fs.readFileSync(sFileConfig).toString();

        sConfigContent = sConfigContent.replace(/var\s*currentEnv\s*=\s*\"\"\s*;/, "var currentEnv = \"" + oConfig.envName + "\";");
        fs.writeFileSync(sFileConfig, sConfigContent);

    }



    /**
     * 执行electron-builder流程
     */
    static buildConfig() {
        let oPack = JSON.parse(fs.readFileSync(oConfig.fileSourceConfig).toString());


        oPack.appId = oPack.appId + "." + oConfig.envName;
        oPack.directories.output = oPack.directories.output + oConfig.envName + "/";

        //这里将目录路径设置上
        oConfig.distClientApp=oPack.directories.output;

        let sConfigFile = path.join(oConfig.pathGulpConfig, oConfig.envName + oConfig.extConfig);

        this.mkdirsSync(oConfig.pathGulpConfig);

        fs.writeFileSync(sConfigFile, JSON.stringify(oPack, null, "  "));



        del.sync(oConfig.distClientApp);
        child_process.execSync("electron-builder  --config " + sConfigFile, { stdio: "inherit" });
    }


    /**
     * 这里将生成的文件传上oss
     */
    static uploadOss() {

        if(!oConfig.flagUploadOss){
            return;
        }

        const OSS = require('ali-oss');

        if (!fs.existsSync(oConfig.ossKeyFile)) {
            console.error("upOssClient 不存在秘钥文件，无法初始化oss");
        }
        else {

           

            let oJson = JSON.parse(fs.readFileSync(oConfig.ossKeyFile).toString());

            let OSS = require('ali-oss');

            const client = new OSS({
                region: 'oss-cn-beijing',
                accessKeyId: oJson.oss.apikey,
                accessKeySecret: oJson.oss.apiSecret,
                bucket: "icomeclientapp"
            });


            
            fs.readdirSync(oConfig.distClientApp,{withFileTypes:true}).forEach(fItem=>{

                if(fItem.isFile()){
                    oConfig.allowUpload.forEach(sAllow=>{
                        if(fItem.name.endsWith(sAllow)){
                             

                            client.put("clientapp/"+oConfig.envName+"/"+fItem.name,path.join(oConfig.distClientApp,fItem.name)).then(result=>{
                                
                                if(result.res.statusCode===200){
                                    console.debug("upload success "+fItem.name);
                                }
                                else{
                                    console.warn(result);
                                }
                            })

                        }
                        
                    })
                }
            });

            


        }


    }






    // 递归创建目录 同步方法
    static mkdirsSync(dirname) {
        if (fs.existsSync(dirname)) {
            return true;
        } else {
            if (this.mkdirsSync(path.dirname(dirname))) {
                fs.mkdirSync(dirname);
                return true;
            }
        }
    }
}


function initAlphaWithNotUpload(cb) {

    oConfig.envName = "alpha";
    oConfig.flagUploadOss=false;
    GulpProcess.execTask();
    cb();
}



function initAlpha(cb) {

    oConfig.envName = "alpha";
    GulpProcess.execTask();
    cb();
}

function initBeta(cb) {

    oConfig.envName = "beta";
    GulpProcess.execTask();
    cb();
}

function initPreview(cb) {

    oConfig.envName = "preview";
    GulpProcess.execTask();
    cb();
}

function initRelease(cb) {

    oConfig.envName = "release";
    GulpProcess.execTask();
    cb();
}




function build(cb) {

    child_process.execSync("tsc", { stdio: "inherit" });
    cb();
}





exports.package_alpha = series(build,initAlphaWithNotUpload);
exports.deploy_alpha = series(build,initAlpha);
exports.deploy_beta = series(build,initBeta);
exports.deploy_preview = series(build,initPreview);
exports.deploy_release = series(build,initRelease);
exports.build = build;
exports.default = series(build);