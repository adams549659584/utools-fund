/**
 * @type { import ('./src/types/utools').PluginConfig }
 */
const pluginConfig = {
  pluginName: '自选基金助手',
  version: 'v1.0.1',
  description: '自选基金助手',
  author: '罗君',
  homepage: 'https://github.com/adams549659584/utools-fund',
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
      code: 'utools_fund_add',
      explain: '添加自选基金',
      icon: 'assets/img/add.png',
      cmds: ['添加自选基金', '继续添加自选基金', '基金', 'fund']
    },
    {
      code: 'utools_fund_del',
      explain: '删除自选基金',
      icon: 'assets/img/del.png',
      cmds: ['删除自选基金', '继续删除自选基金', '基金', 'fund']
    },
    {
      code: 'utools_fund_my',
      explain: '我的自选基金',
      icon: 'assets/img/logo.png',
      cmds: ['我的自选基金', '基金', 'fund'],
    }
  ],
};
export default pluginConfig;
