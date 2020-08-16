/**
 * @type { import ('./src/types/utools').PluginConfig }
 */
const pluginConfig = {
  pluginName: 'utools-tmpl',
  version: 'v1.0.0',
  description: '使用模板插件模式',
  author: '罗君',
  homepage: 'https://github.com/adams549659584/utools-tmpl',
  // main: 'index.html',
  preload: 'preload.js',
  logo: 'assets/img/logo.png',
  platform: ['win32'],
  // development: {
  //   main: '',
  //   preload: '',
  //   logo: '',
  //   buildPath: '',
  // },
  // pluginSetting: {
  //   single: true,
  //   height: 0,
  // },
  features: [
    {
      code: 'utools_tmpl_hello_none',
      explain: '无 UI 模式',
      cmds: ['hello', 'none'],
    },
    {
      code: 'utools_tmpl_hello_list',
      explain: '列表模式',
      cmds: ['hello', 'list'],
    },
    {
      code: 'utools_tmpl_hello_doc',
      explain: '文档模式',
      cmds: ['hello', 'doc'],
    },
  ],
};
export default pluginConfig;
