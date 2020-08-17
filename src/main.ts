import { TemplatePlugin, CallbackListItem, DBItem, FilesPayload } from '@/types/utools';
import { get } from './Helper/HttpHelper';
import FundDBHelper from './Helper/FundDBHelper';
import { ISearchFundResult } from './model/ISearchFundResult';
import { IFundValuationDetailResult } from './model/IFundValuationDetailResult';
import { IFundEnt } from './model/IFundEnt';
import { writeFileSync, readFileSync } from 'fs';
import { resolve } from 'path';

// 缓存基金详情
let CACHE_FUND_DB_LIST: DBItem<IFundEnt>[];
// 当前基金持有数量
let CURRENT_FUND_HOLD_COUNT = 0;

const getMyFundDetails = async () => {
  const dbList = FundDBHelper.getAll();
  await Promise.all(
    dbList.map(async db => {
      const oldData = db.data;
      const fundValuationDetail = await get<IFundValuationDetailResult>(
        `https://fundmobapi.eastmoney.com/FundMApi/FundVarietieValuationDetail.ashx?FCODE=${oldData.id}&deviceid=D03E8A22-9E0A-473F-B045-3745FC7931C4&plat=Iphone&product=EFund&version=6.2.9&GTOKEN=793EAE9248BC4181A9380C49938D1E31`
      );
      if (fundValuationDetail.ErrCode !== 0) {
        utools.showMessageBox({
          message: fundValuationDetail.ErrMsg,
        });
        return;
      }
      let lastTime = fundValuationDetail.Expansion.GZTIME;
      let nowJJJZ = Number(fundValuationDetail.Expansion.GZ);
      const searchFundResult = await get<ISearchFundResult>(`http://fundsuggest.eastmoney.com/FundSearch/api/FundSearchAPI.ashx?m=1&key=${oldData.id}`);
      if (searchFundResult.ErrCode !== 0) {
        utools.showMessageBox({
          message: searchFundResult.ErrMsg,
        });
        return;
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
      console.log(JSON.stringify(db.data));
      return db;
    })
  );
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

const getFundMarketIndexs = async (searchWord = '') => {
  const marketResult = await get<{
    data: {
      total: number;
      diff: {
        f2: number;
        f3: number;
        f4: number;
        f12: string;
        f14: string;
      }[];
    };
  }>(`https://push2.eastmoney.com/api/qt/ulist.np/get?fltt=2&fields=f2,f3,f4,f12,f14&secids=1.000001,1.000300,0.399001,0.399006&_=1597632105416`);
  if (searchWord) {
    marketResult.data.diff = marketResult.data.diff.filter(x => x.f12.includes(searchWord) || x.f14.includes(searchWord));
  }
  const cbList = marketResult.data.diff.map(x => {
    const cb: CallbackListItem = {
      title: x.f14,
      description: `涨幅：${x.f3}%    最新：${x.f2}`,
      icon: x.f3 >= 0 ? 'assets/img/up.png' : 'assets/img/down.png',
    };
    return cb;
  });
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
          FundDBHelper.set({
            id: itemData.title,
            name: itemData.description,
            holdCount: 0,
            yesJJJZ: 0,
            nowJJJZ: itemData.DWJZ,
            lastTime: itemData.FSRQ,
          });
        }
        utools.redirect('继续添加自选基金', '');
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
        utools.redirect('继续删除自选基金', '');
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
  utools_fund_market: {
    mode: 'list',
    args: {
      placeholder: '大盘指数行情',
      enter: async (action, callbackSetList) => {
        const cbList = await getFundMarketIndexs();
        callbackSetList(cbList);
      },
      search: async (action, searchWord, callbackSetList) => {
        const cbList = await getFundMarketIndexs(searchWord);
        callbackSetList(cbList);
      },
    },
  },
  utools_fund_config_export: {
    mode: 'none',
    args: {
      placeholder: '导出我的自选基金数据',
      enter: async (action, callbackSetList) => {
        const dbList = FundDBHelper.getAll();
        const fundData = dbList.map(db => db.data);
        const savePath = resolve(utools.getPath('desktop'), 'fund_data.json');
        writeFileSync(savePath, JSON.stringify(fundData), { encoding: 'utf-8' });
        utools.showNotification(`已导出数据 fund_data.json 至桌面`);
        utools.redirect('我的自选基金', '');
      },
    },
  },
  utools_fund_config_import: {
    mode: 'none',
    args: {
      placeholder: '导入我的自选基金数据',
      enter: async (action, callbackSetList) => {
        if (action.type === 'files') {
          const jsonFile: FilesPayload = action.payload[0];
          if (jsonFile.isFile && jsonFile.name === 'fund_data.json') {
            const fundJsonStr = readFileSync(jsonFile.path, { encoding: 'utf-8' });
            const fundData: IFundEnt[] = JSON.parse(fundJsonStr);
            FundDBHelper.setList(fundData);
          }
        }
        utools.redirect('我的自选基金', '');
      },
    },
  },
};

window.exports = preload;
