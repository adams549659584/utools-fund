export interface IFundEnt {
  /**
   * 基金id
   */
  id: string;

  /**
   * 基金名称
   */
  name: string;

  /**
   * 持有数量
   */
  holdCount: number;

  /**
   * 昨日基金净值
   */
  yesJJJZ: number;

  /**
   * 现在基金估值或净值
   */
  nowJJJZ: number;

  /**
   * 当前是否是估值
   */
  isValuation: boolean;

  /**
   * 当前净值对应时间
   */
  lastTime: string;
}
