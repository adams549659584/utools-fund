import { IUtoolsDBEnt } from '@/model/IUtoolsDBEnt';
import { DBItem } from '@/types/utools';

export default class DBHelper {
  /**
   * 构造函数
   * @param dbPreFix 数据表前缀
   */
  constructor(dbPreFix: string) {
    this.dbPreFix = dbPreFix;
  }
  dbPreFix = 'my_utools_db_';

  set<T extends IUtoolsDBEnt>(data: T) {
    const that = this;
    const db: DBItem<T> = {
      _id: `${that.dbPreFix}${data.id}`,
      data,
    };
    const existDB = this.get(data.id);
    if (existDB) {
      db._rev = existDB._rev;
    }
    return utools.db.put(db);
  }

  setList<T extends IUtoolsDBEnt>(data: T[]) {
    const that = this;
    const existDBList = this.getAll();
    const dbList = data.map(x => {
      const db: DBItem<T> = {
        _id: `${that.dbPreFix}${x.id}`,
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

  update<T extends IUtoolsDBEnt>(data: DBItem<T>) {
    return utools.db.put(data);
  }

  get<T extends IUtoolsDBEnt>(dbId: string) {
    const that = this;
    return utools.db.get<T>(`${that.dbPreFix}${dbId}`);
  }

  getAll<T extends IUtoolsDBEnt>() {
    const that = this;
    return utools.db.allDocs<T>(that.dbPreFix);
  }

  del<T extends IUtoolsDBEnt>(dbId: string) {
    const that = this;
    return utools.db.remove<T>(`${that.dbPreFix}${dbId}`);
  }
}
