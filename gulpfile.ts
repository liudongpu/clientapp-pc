import { series, src } from 'gulp';
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
    extConfig: ".json"
}



class GulpProcess {

    static execTask(sEnvName: string) {

        let oPack = JSON.parse(fs.readFileSync(oConfig.fileSourceConfig).toString());
        let oExtend = JSON.parse(fs.readFileSync(oConfig.fileSourceConfig + "." + sEnvName + oConfig.extConfig).toString());

        let oBuild = Object.assign(oPack, oExtend);

        let sConfigFile = path.join(oConfig.pathGulpConfig, sEnvName + oConfig.extConfig);



        this.mkdirsSync(oConfig.pathGulpConfig);

        fs.writeFileSync(sConfigFile, JSON.stringify(oBuild, null, "  "));


        child_process.execSync("electron-builder  --config " + sConfigFile, { stdio: "inherit" });


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
    GulpProcess.execTask("alpha");
    cb();
}



function build(cb) {

    child_process.execSync("tsc", { stdio: "inherit" });
    cb();
}





exports.package_alpha = series(build,init_alpha);
exports.build = build;
exports.default = series(build);