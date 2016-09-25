var os = require('os');
var path = require('path');
var spawnSync = require('child_process').spawnSync;

function processOptions(config) {

    config["config"] = config["debug"] ? "Debug" : "Release";

    // AtomicNET
    if (config["nonet"]) {
        config["with-atomicnet"] = false;
    } else {
        if (os.platform() == "win32") {
            config["with-atomicnet"] = true;
        } else {
            // see if xbuild is available
            config["with-atomicnet"]  = false;
            if ( spawnSync) // TODO: CI box doesn't have spawnSync
                config["with-atomicnet"] = spawnSync("which", ["xbuild"]).status == 1 ? false : true;
        }
    }

    // paths
    config.atomicRoot = path.resolve(__dirname, "../..") + "/";
    config.artifactsRoot = config.atomicRoot + "Artifacts/";

    config.editorAppFolder = (os.platform() == "darwin") ? config.artifactsRoot + "/AtomicEditor/AtomicEditor.app/" : config.artifactsRoot + "AtomicEditor/";
    config.toolDataFolder = config.editorAppFolder + (os.platform() == "darwin" ? "Contents/Resources/ToolData/" : "Resources/ToolData/");

    // jenkins, TODO: abstract anything that requires jenkins
    config.jenkins = process.env.ATOMIC_JENKINS_BUILD == 1;
    config.buildSHA =  process.env.ATOMIC_BUILD_SHA ? process.env.ATOMIC_BUILD_SHA : "UNKNOWN_BUILD_SHA";
    config.devIDApp = process.env.ATOMIC_DEV_ID_APP ? process.env.ATOMIC_DEV_ID_APP : "";

    config.pfxFile = process.env.ATOMIC_PFX_FILE ? process.env.ATOMIC_PFX_FILE : "";
    config.pfxPW = process.env.ATOMIC_PFX_PW ? process.env.ATOMIC_PFX_PW : "";

    return config;
}

exports = module.exports = processOptions(require('minimist')(process.argv.slice(2), {
    "default" : {
        "noclean" : false,
        "debug" : false,
        "nonet" : false,
        "with-android" : false,
        "with-ios" : false,
        "with-docs" : false,
        "with-examples" : false,
        "package" : false
    }
}));