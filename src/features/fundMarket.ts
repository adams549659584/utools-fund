import { TplFeature, CallbackListItem } from '@/types/utools';
import { get } from '@/Helper/HttpHelper';

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
  }>(`https://push2.eastmoney.com/api/qt/ulist.np/get?fltt=2&secids=1.000001,0.399001,0.399006,100.HSI,1.000300&fields=f2,f3,f4,f12,f14`);
  if (searchWord) {
    marketResult.data.diff = marketResult.data.diff.filter(x => x.f12.includes(searchWord) || x.f14.includes(searchWord));
  }
  const cbList = marketResult.data.diff.map(x => {
    const cb: CallbackListItem = {
      title: x.f14,
      description: `涨幅：${x.f3}%    ---  最新：${x.f2} `,
      icon: x.f3 >= 0 ? 'assets/img/up.png' : 'assets/img/down.png',
    };
    return cb;
  });
  return cbList;
};

const fundMarket: TplFeature = {
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
};

export default fundMarket;
