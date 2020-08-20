import { IFundEnt } from '@/model/IFundEnt';
import { DBItem } from '@/types/utools';

const FUND_DB_PRE_FIX = 'fund_';

export default class FundDBHelper {
  static set(data: IFundEnt) {
    const db: DBItem<IFundEnt> = {
      _id: `${FUND_DB_PRE_FIX}${data.id}`,
      data,
    };
    const existDB = FundDBHelper.get(data.id);
    if (existDB) {
      db._rev = existDB._rev;
    }
    return utools.db.put(db);
  }

  static setList(data: IFundEnt[]) {
    const existDBList = FundDBHelper.getAll();
    const dbList = data.map(x => {
      const db: DBItem<IFundEnt> = {
        _id: `${FUND_DB_PRE_FIX}${x.id}`,
        data: x,
      };
      const existDB = existDBList.find(d => d.data.id === x.id);
      if (existDB) {
        db._rev = existDB._rev;
      }
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
