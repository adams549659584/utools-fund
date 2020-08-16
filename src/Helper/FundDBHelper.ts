import { IFundEnt } from '@/model/IFundEnt';
import { DBItem } from '@/types/utools';

const FUND_DB_PRE_FIX = 'fund_';

export default class FundDBHelper {
  static set(fundId: string, data: IFundEnt) {
    return utools.db.put({
      _id: `${FUND_DB_PRE_FIX}${fundId}`,
      data,
    });
  }

  static update<IFundEnt>(data: DBItem<IFundEnt>) {
    return utools.db.put(data);
  }

  static get(fundId: string) {
    return utools.db.get<IFundEnt>(`${FUND_DB_PRE_FIX}${fundId}`);
  }

  static getAll() {
    return utools.db.allDocs<IFundEnt>(FUND_DB_PRE_FIX);
  }

  static del(fundId: string) {
    return utools.db.remove(`${FUND_DB_PRE_FIX}${fundId}`);
  }
}
