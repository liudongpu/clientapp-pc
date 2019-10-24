import { series, src, dest } from 'gulp';

import * as fs from "fs";
import * as path from "path";
import * as child_process from "child_process";
// `clean` 函数并未被导出（export），因此被认为是私有任务（private task）。
// 它仍然可以被用在 `series()` 组合中。
function clean(cb) {
    // body omitted
    cb();
}



let oConfig = {

    pathGulpConfig: "dist/gule-configs/",
    fileSourceConfig: "xconfigs/builds/electron-builder.json",
    extConfig: ".json",
    envName: "",
    distTsc: "dist/out-tsc/"
}



class GulpProcess {

    static execTask() {


        this.updateAppConfig();

        this.buildConfig();
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

        let sConfigFile = path.join(oConfig.pathGulpConfig, oConfig.envName + oConfig.extConfig);

        this.mkdirsSync(oConfig.pathGulpConfig);

        fs.writeFileSync(sConfigFile, JSON.stringify(oPack, null, "  "));

        //child_process.execSync("electron-builder  --config " + sConfigFile, { stdio: "inherit" });
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




function init_alpha(cb) {

    oConfig.envName = "alpha";
    GulpProcess.execTask();
    cb();
}



function build(cb) {

    child_process.execSync("tsc", { stdio: "inherit" });
    cb();
}





exports.package_alpha = series(build, init_alpha);
exports.build = build;
exports.default = series(build);