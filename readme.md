## 使用说明

### 在 Vue 项目中使用

```
// vue.config.js

const uploadSourceMapPlugin = require('webpack-plugin-upload-sourcemap')

// 需要将 productionSourceMap 设置为 true，将生成的 sourceMap 放在统一的目录下
// ...
productionSourceMap: true,
configureWebpack: {
  plugins: [
    new uploadSourceMapPlugin()
  ],
  output: {
    sourceMapFilename: "sourceMap/[file].map[query]"
  }
},
```


### 在 webpack 项目中使用

同上，需要将 `devtool` 设置为 `source-map`。


```
module.exports = {
  //...
  devtool: 'source-map',
  output: {
    sourceMapFilename: "sourceMap/[file].map[query]"
  },
};
```