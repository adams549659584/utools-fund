import { TplFeature, FilesPayload } from '@/types/utools';

import { readFileSync } from 'fs';
import { IFundEnt } from '@/model/IFundEnt';
import FundDBHelper from '@/Helper/FundDBHelper';

const fundImport: TplFeature = {
  mode: 'none',
  args: {
    placeholder: '导入我的自选基金数据',
    enter: async (action, callbackSetList) => {
      if (action.type === 'files') {
        const jsonFile: FilesPayload = action.payload[0];
        if (jsonFile.isFile && jsonFile.name.includes('fund_data.json')) {
          const fundJsonStr = readFileSync(jsonFile.path, { encoding: 'utf-8' });
          const fundData: IFundEnt[] = JSON.parse(fundJsonStr);
          FundDBHelper.setList(fundData);
        }
      }
      utools.redirect('我的自选基金', '');
    },
  },
};

export default fundImport;
