const path = require('path');

const fileUtil = require('./fileUtil')
const handler = require('./handler')

const getProcessArgs = (process) => {
    const processArgs = {}
    process && process.argv.slice(2).forEach(v => {
        if (v) {
            const splitArr = v.split('=');
            if (splitArr && splitArr.length === 1 && splitArr[0]) {
                processArgs[splitArr[0]] = true
            }
            if (splitArr && splitArr.length === 2 && splitArr[0] && splitArr[1]) {
                processArgs[splitArr[0]] = splitArr[1]
            }
        }
    })
    return processArgs;
}

const processArgs = getProcessArgs(process)

const default_src = "./test"
const default_out = "./output"
// const SRC = "./pages"

const SRC = (processArgs.src && typeof processArgs.src === "string") ? processArgs.src : default_src;
const OUT = (processArgs.out && typeof processArgs.out === "string") ? processArgs.out : default_out;


async function main() {
    // createDir(SRC, OUT)
    // await new Promise(res => { setTimeout(() => res(''), 1000) })
    const fileList = await fileUtil.getFileHandleList(SRC, OUT)
    for (let i = 0; i < fileList.length; i++) {
        const { filePath, outFilePath } = fileList[i]
        if (filePath && outFilePath) {
            await fileUtil.createDir(path.dirname(outFilePath));
            await handler.handleFile(filePath, outFilePath);
        }
    }
}

main()