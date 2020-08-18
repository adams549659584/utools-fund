import { TplFeature, CallbackListItem } from '@/types/utools';
import FundDBHelper from '@/Helper/FundDBHelper';

const fundDel: TplFeature = {
  mode: 'list',
  args: {
    placeholder: '选择需删除的基金，回车键确认',
    enter: (action, callbackSetList) => {
      const dbList = FundDBHelper.getAll();
      const cbList = dbList.map(db => {
        const cb: CallbackListItem = {
          title: db.data.id,
          description: db.data.name,
        };
        return cb;
      });
      // 如果进入插件就要显示列表数据
      callbackSetList(cbList);
    },
    search: (action, searchWord, callbackSetList) => {
      let dbList = FundDBHelper.getAll();
      if (searchWord) {
        dbList = dbList.filter(x => x.data.id.includes(searchWord) || x.data.name.includes(searchWord));
      }
      const cbList = dbList.map(db => {
        const cb: CallbackListItem = {
          title: db.data.id,
          description: db.data.name,
        };
        return cb;
      });
      callbackSetList(cbList);
    }, // 用户选择列表中某个条目时被调用
    select: (action, itemData, callbackSetList) => {
      FundDBHelper.del(itemData.title);
      utools.redirect('继续删除自选基金', '');
    },
  },
};
export default fundDel;
