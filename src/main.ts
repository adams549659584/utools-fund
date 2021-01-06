import { TemplatePlugin } from '@/types/utools';
import fundAdd from './features/fundAdd';
// import fundDel from './features/fundDel';
import fundMarket from './features/fundMarket';
import fundExport from './features/fundExport';
import fundMy from './features/fundMy';
import fundImport from './features/fundImport';

const preload: TemplatePlugin = {
  utools_fund_add: fundAdd,
  // utools_fund_del: fundDel,
  utools_fund_my: fundMy,
  utools_fund_market: fundMarket,
  utools_fund_config_export: fundExport,
  utools_fund_config_import: fundImport,
};

window.exports = preload;
