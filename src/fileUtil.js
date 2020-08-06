const fs = require('fs');
const path = require('path');
const glob = require("glob")

const getFileHandleObj = (files, out) => {
    return files && files.map(filePath => {
        let outFilePath = '';
        const slicePathDirRes = /(?![\.\/])/g.exec(filePath);
        if (slicePathDirRes && filePath.slice(slicePathDirRes.index)) {
            outFilePath = path.join(out, filePath);
        }
        return {
            filePath,
            outFilePath
        }
    })
}

const getFileHandleList = async (src, out) => {

    const stats = await fs.statSync(src);
    if (stats.isFile()) {
        return Promise.resolve(getFileHandleObj([src], out));
    }

    return new Promise((resolve, reject) => {
        glob(src + "/**/*.@(js|jsx|ts|tsx)", function (err, files) {
            if (err) {
                reject(err)
            }
            resolve(getFileHandleObj(files, out));
        });
    });
}

const createDir = async (dir) => {
    if (fs.existsSync(dir)) {
        return true;
    } else {
        if (await createDir(path.dirname(dir))) {
            await fs.mkdirSync(dir);
            return true;
        }
    }
}

module.exports = {
    getFileHandleList,
    createDir
}