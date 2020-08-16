import { IFundEnt } from '@/model/IFundEnt';
import { DBItem } from '@/types/utools';

const FUND_DB_PRE_FIX = 'fund_';

export default class FundDBHelper {
  static set(data: IFundEnt) {
    return utools.db.put({
      _id: `${FUND_DB_PRE_FIX}${data.id}`,
      data,
    });
  }

  static setList(data: IFundEnt[]) {
    const dbList = data.map(x => {
      const db: DBItem<IFundEnt> = {
        _id: `${FUND_DB_PRE_FIX}${x.id}`,
        data: x,
      };
      return db;
    });
    return utools.db.bulkDocs(dbList);
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
