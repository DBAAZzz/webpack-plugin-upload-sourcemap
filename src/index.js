const { readdir, rm } = require('fs/promises')
const { createReadStream } = require('fs')
const axios = require('axios')
const FormData = require('form-data')
const path = require('path')

const PLUGINS_NAME = 'uploadSourceMapPlugin'

class uploadSourceMapPlugin {

    constructor(options) {
        console.log('options', options)
    }

    async getAssets(distDir) {
        try {
            // 获取所有sourceMap的文件名
            const files = await readdir(distDir)
            console.log('files', files)
            // 获取所有souceMap的文件路径
            return files.filter(el => /\.js\.map$/i.test(el)).map(el => path.join(distDir, el))
        } catch (error) {
            console.log('error', error)
        }
    }

    async uploadFile(filePath) {
        const stream = createReadStream(filePath)
        const formData = new FormData()
        formData.append('file', stream)
        return axios.default({
            url: 'http://127.0.0.1:3000/file/upload',
            method: 'post',
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjA5MjljNjQwLTg3OWQtMTFlYi1iNGExLTMzM2ZhNTQ5ZjVlYSIsImlhdCI6MTYzODUwMjcxNywiZXhwIjoxNjM4NTg5MTE3fQ.oeq1nXIeEpvpMQkutFuaJSUkx0FeU0K0ES4Iz9toN8w',
                ...formData.getHeaders(),
            },
            timeout: 10000,
            data: formData
        }).then((res) => {
            console.log('uploadResponse', res)
        }).catch((err) => {
            console.log('uploadError', err)
        })
    }

    apply(compiler) {
        const sourceMapDir = path.join(compiler.options.output.path, 'sourceMap')
        compiler.hooks.afterEmit.tapPromise(PLUGINS_NAME, async () => {
            let files = await this.getAssets(path.join(sourceMapDir, 'js'))
            if (files) {
                for (const file of files) {
                    console.log(`上传成功${file}文件`)
                    await this.uploadFile(file)
                }
                await rm(sourceMapDir, {
                    recursive: true
                })
            }
        })
    }
}

module.exports = uploadSourceMapPlugin;