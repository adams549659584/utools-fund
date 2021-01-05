import { TplFeature, DBItem, CallbackListItem, CallbackSetList } from '@/types/utools';
import FundDBHelper from '@/Helper/FundDBHelper';
import { IFundValuationDetailResult } from '@/model/IFundValuationDetailResult';
import { get } from '@/Helper/HttpHelper';
import { ISearchFundResult } from '@/model/ISearchFundResult';
import { IFundEnt } from '@/model/IFundEnt';

// 缓存基金详情
let CACHE_FUND_DB_LIST: DBItem<IFundEnt>[];
// 当前搜索关键字
let CURRENT_SEARCH_WORD = '';
let QUERY_TIMER: NodeJS.Timeout;

const getMyFundDetails = async () => {
  const dbList = FundDBHelper.getAll();
  await Promise.all(
    dbList.map(async db => {
      try {
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
        let isValuation = true;
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
            // console.log(`净值:`, searchFundDetail.FundBaseInfo);
            lastTime = searchFundDetail.FundBaseInfo.FSRQ;
            nowJJJZ = Number(searchFundDetail.FundBaseInfo.DWJZ);
            isValuation = false;
          }
        }
        db.data = {
          ...oldData,
          yesJJJZ: Number(fundValuationDetail.Expansion.DWJZ),
          nowJJJZ: Number(nowJJJZ),
          lastTime,
          isValuation,
        };
        FundDBHelper.update(db);
        // console.log(JSON.stringify(db.data));
      } catch (error) {
        console.error(`${db.data.id} ${db.data.name} :`, error);
        // utools.showNotification(`网络请求失败，请稍后再试`);
      }
      return db;
    })
  );
  return FundDBHelper.getAll();
};

const fundDetailsToCbList = (dbList: DBItem<IFundEnt>[], searchWord = '') => {
  let sumIncome = 0;
  let cbList = dbList.map(db => {
    const fund = db.data;
    const rate = fund.nowJJJZ / fund.yesJJJZ - 1;
    const income = fund.holdCount > 0 ? rate * fund.holdCount * fund.yesJJJZ : 0;
    sumIncome += income;
    const cb: CallbackListItem = {
      fundCode: fund.id,
      title: `${fund.id} ${fund.name} ${fund.isValuation ? '' : '✅'}`,
      description: `${(rate * 100).toFixed(2)}% ￥${income.toFixed(2)}`,
      icon: rate >= 0 ? 'assets/img/up.png' : 'assets/img/down.png',
      searchWord,
    };
    return cb;
  });
  if (cbList.length === 0) {
    cbList = [
      {
        title: ``,
        description: ``,
        icon: 'assets/img/add.png',
        searchWord,
      },
    ];
  } else {
    cbList = [
      {
        title: `今日总收益 ${dbList.filter(x => x.data.holdCount > 0).every(x => !x.data.isValuation) ? '✅' : ''}`,
        description: `￥${sumIncome.toFixed(2)}`,
        icon: sumIncome >= 0 ? 'assets/img/up.png' : 'assets/img/down.png',
        searchWord,
      },
      ...cbList,
    ];
  }
  return cbList;
};

const loading = (cb: CallbackSetList, loadingTips = '加载中，请稍后。。。') => {
  cb([
    {
      title: loadingTips,
      description: '~~~~~~~~~~~~~~~',
      icon: 'assets/img/loading.png',
    },
  ]);
};

const showFundDetails = async (cb: CallbackSetList, isShowLoading = true) => {
  if (isShowLoading) {
    loading(cb);
  }
  const dbList = await getMyFundDetails();
  // 缓存
  CACHE_FUND_DB_LIST = dbList;
  const cbList = fundDetailsToCbList(dbList);
  cb(cbList);
  // 定时展示
  QUERY_TIMER = setTimeout(() => {
    showFundDetails(cb, false);
  }, 1000 * 60);
};

const hanlderUTools = {
  get(obj, prop) {
    // 是否魔改版标识
    if (prop === 'isMagicRevision') {
      return true;
    }
    if (prop === '__event__') {
      const val = obj[prop];
      // 处理用户退出当前插件，停止查询
      if (val.onPluginOut && !val.onPluginOut.isMagicRevision) {
        const rawOnPluginOut = val.onPluginOut;
        val.onPluginOut = cb => {
          console.log(`用户退出插件`);
          clearTimeout(QUERY_TIMER);
          return rawOnPluginOut(cb);
        };
        val.onPluginOut.isMagicRevision = true;
      }
      return val;
    }
    return obj[prop];
  },
  // set(obj, prop, value) {
  //   console.log(`set ${prop} : `, value);
  //   obj[prop] = value;
  //   return true;
  // },
};

const fundMy: TplFeature = {
  mode: 'list',
  args: {
    placeholder: '输入持有份额，选择对应基金，回车键保存，s前缀搜索',
    enter: async (action, callbackSetList) => {
      if (!utools.isMagicRevision) {
        utools = new Proxy(utools, hanlderUTools);
      }
      clearTimeout(QUERY_TIMER);
      showFundDetails(callbackSetList);
    },
    search: async (action, searchWord, callbackSetList) => {
      let dbList = CACHE_FUND_DB_LIST && CACHE_FUND_DB_LIST.length > 0 ? CACHE_FUND_DB_LIST : await getMyFundDetails();
      if (searchWord && searchWord.startsWith('s')) {
        searchWord = searchWord.substring(1);
        const newDbList = dbList.filter(d => d.data.id.includes(searchWord) || d.data.name.includes(searchWord));
        if (newDbList.length > 0) {
          dbList = newDbList;
        }
      }
      const cbList = fundDetailsToCbList(dbList, searchWord);
      callbackSetList(cbList);
    }, // 用户选择列表中某个条目时被调用
    select: (action, itemData, callbackSetList) => {
      if (!CACHE_FUND_DB_LIST || CACHE_FUND_DB_LIST.length === 0) {
        utools.redirect('添加自选基金', '');
        return;
      }
      if (action.type === 'text' && itemData.fundCode) {
        const fundDb = FundDBHelper.get(itemData.fundCode);
        if (itemData.searchWord) {
          const holdCount = parseFloat(itemData.searchWord);
          if (!Number.isNaN(holdCount)) {
            fundDb.data.holdCount = holdCount;
            FundDBHelper.update(fundDb);
          }
        }
      }
      utools.redirect('我的自选基金', '');
    },
  },
};

export default fundMy;
