import { TemplatePlugin } from '@/types/utools';
import Hello from './Hello';

// utools.onPluginEnter(params => {
//   Hello.sayHello();
// });

const preload: TemplatePlugin = {
  utools_tmpl_hello_none: {
    mode: 'none',
    args: {
      placeholder: '无 UI 模式',
      enter: (action, cb) => {
        Hello.sayHello('Hello None');
        utools.outPlugin();
      },
    },
  },
  utools_tmpl_hello_list: {
    mode: 'list',
    args: {
      placeholder: '列表模式',
      enter: (action, callbackSetList) => {
        console.log(action);
        // 如果进入插件就要显示列表数据
        callbackSetList([
          {
            title: '这是标题',
            description: '这是描述(跳去我的github)',
            icon: '', // 图标(可选)
            url: 'https://github.com/adams549659584/utools-tmpl',
          },
        ]);
      },
      search: (action, searchWord, callbackSetList) => {
        // 获取一些数据
        // 执行 callbackSetList 显示出来
        callbackSetList([
          {
            title: searchWord,
            description: '虽然文字变了，但是还是跳去我的github',
            icon: '', // 图标，
            url: 'https://github.com/adams549659584/utools-tmpl',
            other: 'xxx',
          },
        ]);
      }, // 用户选择列表中某个条目时被调用
      select: (action, itemData, callbackSetList) => {
        utools.hideMainWindow();
        const url = itemData.url;
        require('electron').shell.openExternal(url);
        utools.outPlugin();
      },
    },
  },
  utools_tmpl_hello_doc: {
    mode: 'doc',
    args: {
      indexes: [
        {
          t: '这是标题',
          d: '这是描述',
          p: 'assets/doc/index.html', //页面, 只能是相对路径
        },
      ],
      placeholder: '文档模式',
    },
  },
};

window.exports = preload;
