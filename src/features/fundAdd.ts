import { TplFeature, CallbackListItem } from '@/types/utools';
import { ISearchFundResult } from '@/model/ISearchFundResult';
import { get } from '@/Helper/HttpHelper';
import FundDBHelper from '@/Helper/FundDBHelper';

const DEFAULT_CB_LIST: CallbackListItem[] = [
  {
    title: `我的自选基金`,
    description: `回车键返回`,
    icon: 'assets/img/logo.png',
  },
  // {
  //   title: `删除自选基金`,
  //   description: ``,
  //   icon: 'assets/img/del.png',
  // },
];

const fundAdd: TplFeature = {
  mode: 'list',
  args: {
    placeholder: '输入基金简称/代码/拼音，回车键确认',
    enter: async (action, callbackSetList) => {
      callbackSetList(DEFAULT_CB_LIST);
    },
    search: async (action, searchWord, callbackSetList) => {
      // 获取一些数据
      let cbList: CallbackListItem[] = [];
      if (searchWord) {
        const searchResult = await get<ISearchFundResult>(`http://fundsuggest.eastmoney.com/FundSearch/api/FundSearchAPI.ashx?m=1&key=${searchWord}`);
        if (searchResult) {
          if (searchResult.ErrCode === 0) {
            cbList = searchResult.Datas.map(fund => {
              const cb: CallbackListItem = {
                title: fund.CODE,
                description: fund.NAME,
                DWJZ: fund.FundBaseInfo.DWJZ,
                FSRQ: fund.FundBaseInfo.FSRQ,
              };
              return cb;
            });
          } else {
            utools.showMessageBox({
              message: searchResult.ErrMsg,
            });
          }
        }
        callbackSetList(cbList);
      } else {
        callbackSetList(DEFAULT_CB_LIST);
      }
    }, // 用户选择列表中某个条目时被调用
    select: (action, itemData, callbackSetList) => {
      const defaultOpt = DEFAULT_CB_LIST.find(x => x.title === itemData.title);
      if (defaultOpt) {
        utools.redirect(itemData.title, '');
        return;
      }
      const existFund = FundDBHelper.get(itemData.title);
      if (!existFund) {
        FundDBHelper.set({
          id: itemData.title,
          name: itemData.description,
          holdCount: 0,
          yesJJJZ: 0,
          nowJJJZ: itemData.DWJZ,
          lastTime: itemData.FSRQ,
          isValuation: true,
        });
      }
      utools.redirect('继续添加自选基金', '');
    },
  },
};
export default fundAdd;
