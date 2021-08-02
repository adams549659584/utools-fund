import { IFundEnt } from '@/model/IFundEnt';
import { DBItem } from '@/types/utools';
import DBHelper from './DBHelper';

const FUND_DB_PRE_FIX = 'fund_';
const DB_INSTANCE = new DBHelper(FUND_DB_PRE_FIX);
export default class FundDBHelper {
  static set(data: IFundEnt) {
    return DB_INSTANCE.set<IFundEnt>(data);
  }

  static setList(data: IFundEnt[]) {
    return DB_INSTANCE.setList<IFundEnt>(data);
  }

  static update(data: DBItem<IFundEnt>) {
    return DB_INSTANCE.update<IFundEnt>(data);
  }

  static get(fundId: string) {
    return DB_INSTANCE.get<IFundEnt>(fundId);
  }

  static getAll() {
    return DB_INSTANCE.getAll<IFundEnt>();
  }

  static del(fundId: string) {
    return DB_INSTANCE.del<IFundEnt>(fundId);
  }
}
