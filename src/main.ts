import { TemplatePlugin, CallbackListItem, DBItem } from '@/types/utools';
import { get } from './Helper/HttpHelper';
import FundDBHelper from './Helper/FundDBHelper';
import { ISearchFundResult } from './model/ISearchFundResult';
import { IFundValuationDetailResult } from './model/IFundValuationDetailResult';
import { IFundEnt } from './model/IFundEnt';

// 缓存基金详情
let CACHE_FUND_DB_LIST: DBItem<IFundEnt>[];
// 当前基金持有数量
let CURRENT_FUND_HOLD_COUNT = 0;

const getMyFundDetails = async () => {
  const dbList = FundDBHelper.getAll();
  for (const db of dbList) {
    const oldData = db.data;
    const fundValuationDetail = await get<IFundValuationDetailResult>(
      `https://fundmobapi.eastmoney.com/FundMApi/FundVarietieValuationDetail.ashx?FCODE=${oldData.id}&deviceid=D03E8A22-9E0A-473F-B045-3745FC7931C4&plat=Iphone&product=EFund&version=6.2.9&GTOKEN=793EAE9248BC4181A9380C49938D1E31`
    );
    if (fundValuationDetail.ErrCode !== 0) {
      utools.showMessageBox({
        message: fundValuationDetail.ErrMsg,
      });
      continue;
    }
    let lastTime = fundValuationDetail.Expansion.GZTIME;
    let nowJJJZ = Number(fundValuationDetail.Expansion.GZ);
    const searchFundResult = await get<ISearchFundResult>(`http://fundsuggest.eastmoney.com/FundSearch/api/FundSearchAPI.ashx?m=1&key=${oldData.id}`);
    if (searchFundResult.ErrCode !== 0) {
      utools.showMessageBox({
        message: searchFundResult.ErrMsg,
      });
      continue;
    } else {
      const searchFundDetail = searchFundResult.Datas[0];
      // 最后单位净值
      if (lastTime.includes(searchFundDetail.FundBaseInfo.FSRQ)) {
        lastTime = searchFundDetail.FundBaseInfo.FSRQ;
        nowJJJZ = Number(searchFundDetail.FundBaseInfo.DWJZ);
      }
    }
    db.data = {
      ...oldData,
      yesJJJZ: Number(fundValuationDetail.Expansion.DWJZ),
      nowJJJZ: Number(nowJJJZ),
      lastTime,
    };
    FundDBHelper.update(db);
    console.log(db.data);
  }
  return FundDBHelper.getAll();
};

const fundDetailsToCbList = (dbList: DBItem<IFundEnt>[]) => {
  let sumIncome = 0;
  let cbList = dbList.map(db => {
    const fund = db.data;
    const rate = Math.round((fund.nowJJJZ / fund.yesJJJZ - 1) * 10000) / 10000;
    const income = fund.holdCount > 0 ? rate * fund.holdCount * fund.yesJJJZ : 0;
    sumIncome += income;
    const cb: CallbackListItem = {
      fundCode: fund.id,
      title: `${fund.id} ${fund.name}`,
      description: `${(rate * 100).toFixed(2)}% ￥${income.toFixed(2)}`,
      icon: rate >= 0 ? 'assets/img/up.png' : 'assets/img/down.png',
    };
    return cb;
  });
  cbList = [
    {
      title: `今日总收益`,
      description: `￥${sumIncome.toFixed(2)}`,
      icon: sumIncome >= 0 ? 'assets/img/up.png' : 'assets/img/down.png',
    },
    ...cbList,
  ];
  return cbList;
};

const preload: TemplatePlugin = {
  utools_fund_add: {
    mode: 'list',
    args: {
      placeholder: '输入基金简称/代码/拼音，回车键确认',
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
        }
        callbackSetList(cbList);
      }, // 用户选择列表中某个条目时被调用
      select: (action, itemData, callbackSetList) => {
        const existFund = FundDBHelper.get(itemData.title);
        if (!existFund) {
          FundDBHelper.set(itemData.title, {
            id: itemData.title,
            name: itemData.description,
            holdCount: 0,
            yesJJJZ: 0,
            nowJJJZ: itemData.DWJZ,
            lastTime: itemData.FSRQ,
          });
        }
        utools.redirect('我的自选基金', '');
      },
    },
  },
  utools_fund_del: {
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
        utools.redirect('我的自选基金', '');
      },
    },
  },
  utools_fund_my: {
    mode: 'list',
    args: {
      placeholder: '输入持有份额，选择对应基金，回车键保存',
      enter: async (action, callbackSetList) => {
        const dbList = await getMyFundDetails();
        // 缓存
        CACHE_FUND_DB_LIST = dbList;
        CURRENT_FUND_HOLD_COUNT = 0;
        const cbList = fundDetailsToCbList(dbList);
        // 如果进入插件就要显示列表数据
        callbackSetList(cbList);
      },
      search: async (action, searchWord, callbackSetList) => {
        let dbList = CACHE_FUND_DB_LIST && CACHE_FUND_DB_LIST.length > 0 ? CACHE_FUND_DB_LIST : await getMyFundDetails();
        CURRENT_FUND_HOLD_COUNT = Number(searchWord);
        const cbList = fundDetailsToCbList(dbList);
        callbackSetList(cbList);
      }, // 用户选择列表中某个条目时被调用
      select: (action, itemData, callbackSetList) => {
        if (!CACHE_FUND_DB_LIST || CACHE_FUND_DB_LIST.length === 0) {
          utools.redirect('添加自选基金', '');
          return;
        }
        if (action.type === 'text' && itemData.fundCode) {
          const fundDb = FundDBHelper.get(itemData.fundCode);
          fundDb.data.holdCount = CURRENT_FUND_HOLD_COUNT;
          FundDBHelper.update(fundDb);
        }
        utools.redirect('我的自选基金', '');
      },
    },
  },
};

window.exports = preload;
