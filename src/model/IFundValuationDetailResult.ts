/**
 * 基金估值结果
 */
export interface IFundValuationDetailResult {
  ErrCode: number;
  ErrMsg: string;
  TotalCount: number;
  Datas: string[];
  Expansion: {
    FCODE: string;
    SHORTNAME: string;
    /**
     * 估值时间 2020-08-14 15:00
     */
    GZTIME: string;

    /**
     * 估值
     */
    GZ: string;

    /**
     * 单位净值
     */
    DWJZ: string;

    /**
     * 净值日期 2020-08-13
     */
    JZRQ: string;
  };
}
