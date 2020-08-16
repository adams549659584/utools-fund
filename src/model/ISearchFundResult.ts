/**
 * 基金搜索结果
 */
export interface ISearchFundResult {
  ErrCode: number;
  ErrMsg: string;
  Datas: {
    CODE: string;
    NAME: string;
    FundBaseInfo: {
      /**
       * 单位净值
       */
      DWJZ: number;

      /**
       * 净值对应日期 2020-08-14
       */
      FSRQ: string;
    };
  }[];
}
