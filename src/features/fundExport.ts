import { TplFeature } from '@/types/utools';
import FundDBHelper from '@/Helper/FundDBHelper';
import { resolve } from 'path';
import { writeFileSync } from 'fs';

const fundExport: TplFeature = {
  mode: 'none',
  args: {
    placeholder: '导出我的自选基金数据',
    enter: async (action, callbackSetList) => {
      const dbList = FundDBHelper.getAll();
      const fundData = dbList.map(db => db.data);
      const savePath = resolve(utools.getPath('desktop'), 'fund_data.json');
      writeFileSync(savePath, JSON.stringify(fundData), { encoding: 'utf-8' });
      utools.showNotification(`已导出数据 fund_data.json 至桌面`);
      utools.redirect('我的自选基金', '');
    },
  },
};

export default fundExport;
