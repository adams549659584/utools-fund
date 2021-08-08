/// <reference path="electron.d.ts" />

import { BrowserWindow, StreamProtocolResponse } from 'electron';

/**
 * @description 文档链接: https://u.tools/docs/developer/api.html
 */
export interface UToolsApi {
  /**
   * 是否魔改版标识
   */
  isMagicRevision: boolean;

  // 事件相关API
  /**
   * @description 当插件装载成功，uTools将会主动调用这个方法（生命周期内仅调用一次）
   * @description 注意：uTools 的其他api以及preload.js中定义的方法，都需要在此回调被执行后才可被调用，否则将报错。
   * @param cb 回调函数
   */
  onPluginReady(cb: Function): void;

  /**
   * @description 每当插件从后台进入到前台时，uTools将会主动调用这个方法
   * @param cb 回调函数
   */
  onPluginEnter(cb: (params: onPluginEnterCBParams) => void): void;

  /**
   * @description 每当插件从前台进入到后台时，uTools将会主动调用这个方法
   * @param cb 回调函数
   */
  onPluginOut(cb: Function): void;

  /**
   * @description 用户对插件进行分离操作时，uTools将会主动调用这个方法
   * @param cb 回调函数
   */
  onPluginDetach(cb: Function): void;

  /**
   * @description 当此插件的数据在其他设备上被更改后同步到此设备时，uTools将会主动调用这个方法
   * @param cb 回调函数
   */
  onDbPull(cb: (docs: { _id: string; _rev: string }[]) => void): void;

  // 窗口交互 API
  /**
   * @description 执行该方法将会隐藏uTools主窗口，包括此时正在主窗口运行的插件，分离的插件不会被隐藏。
   * @param isRestorePreWindow 是否焦点回归到前面的活动窗口，默认 true
   */
  hideMainWindow(isRestorePreWindow?: Boolean): Boolean;

  /**
   * @description 执行该方法将会显示uTools主窗口，包括此时正在主窗口运行的插件。
   */
  showMainWindow(): Boolean;

  /**
   * 执行该方法将会修改插件窗口的高度。
   * @param height 窗口的高度
   */
  setExpendHeight(height: Number): Boolean;

  /**
   * @description 设置子输入框，进入插件后，原本uTools的搜索条主输入框将会变成子输入框，子输入框可以为插件所使用。
   * @param onChange 回调函数
   * @param placeholder 自输入框提示
   * @param isFocus 是否聚焦
   */
  setSubInput(onChange: onSubInputChange, placeholder?: string, isFocus?: Boolean): Boolean;

  /**
   * @description 移出先前设置的子输入框，在插件切换到其他页面时可以重新设置子输入框为其所用。
   */
  removeSubInput(): Boolean;

  /**
   * @description 直接对子输入框的值进行设置。
   * @param val 需要输入的值
   */
  setSubInputValue(val: string): Boolean;

  /**
   * @description 子输入框获得焦点
   */
  subInputFocus(): Boolean;

  /**
   * @description 子输入框获得焦点并选中
   */
  subInputSelect(): Boolean;

  /**
   * @description 子输入框失去焦点，插件获得焦点
   */
  subInputBlur(): Boolean;

  /**
   * @description 执行该方法将会退出当前插件。
   */
  outPlugin(): Boolean;

  /**
   * 该方法可以携带数据，跳转到另一个插件进行处理，如果用户未安装对应的插件，uTools会弹出提醒并引导进入插件中心下载。
   * @param cmd 插件关键词
   * @param payload
   */
  redirect(cmd: string, payload: string | FilesPayload | WindowPayload): Boolean;

  /**
   * 弹出文件选择框
   * @param options OpenDialogSyncOptions
   */
  showOpenDialog(options: Electron.OpenDialogSyncOptions): Array<string> | undefined;

  /**
   * 打开文件保存框
   * @param options SaveDialogSyncOptions
   */
  showSaveDialog(options: Electron.SaveDialogSyncOptions): string | undefined;

  /**
   * 弹出消息框
   */
  showMessageBox(options: Electron.MessageBoxSyncOptions): Number;

  /**
   * 插件页面中查找内容
   * @param text 要搜索的内容(必填):Ubrowser;
   * @param options
   */
  findInPage(text: string, options?: Electron.FindInPageOptions): void;

  /**
   * 停止插件页面中查找
   * @param action "clearSelection" | "keepSelection" | "activateSelection", 默认 "clearSelection"
   */
  stopFindInPage(action?: 'clearSelection' | 'keepSelection' | 'activateSelection'): void;

  /**
   * 原生拖拽文件到其他窗口
   * @param file 文件路径 或 文件路径集合
   */
  startDrag(file: string | Array<string>): void;

  /**
   * 创建浏览器窗口
   * @param url  相对路径的html文件 例如: test.html?param=xxx
   * @param options 注意: preload 需配置相对位置 https://www.electronjs.org/docs/api/browser-window#new-browserwindowoptions
   */
  createBrowserWindow(url: string, options: Electron.BrowserWindowConstructorOptions, callback?: () => void): UBrowserWindow;

  // 动态增减
  /**
   * @description 返回本插件所有动态增加的功能。
   */
  getFeatures(): Feature[];

  /**
   * @description 为本插件动态新增某个功能。
   * @param feature feature
   */
  setFeature(feature: Feature): Boolean;

  /**
   * @description 动态删除本插件的某个功能。
   * @param code feature.code
   */
  removeFeature(code: string): Boolean;

  // 工具

  /**
   * 屏幕取色
   * @param cb 取色结束回调
   */
  screenColorPick(cb: (options: screenColorPickCBOptions) => void): void;

  /**
   * 屏幕截图
   * @param cb 截图结束回调
   */
  screenCapture(cb: (imgBase64: string) => void): void;

  // 模拟

  /**
   * 模拟键盘按键
   * @param key 键值
   * @param modifier 功能键
   */
  simulateKeyboardTap(key: string, ...modifier: ('control' | 'ctrl' | 'shift' | 'option' | 'alt' | 'command' | 'super')[]): void;

  /**
   * 模拟鼠标移动
   */
  simulateMouseMove(x: Number, y: Number): void;

  /**
   * 模拟鼠标左键单击
   */
  simulateMouseClick(x?: number, y?: number): void;

  /**
   * 模拟鼠标右键单击
   */
  simulateMouseRightClick(x?: number, y?: number): void;

  /**
   * 模拟鼠标双击
   */
  simulateMouseDoubleClick(x?: number, y?: number): void;

  /**
   * 获取鼠标绝对位置
   */
  getCursorScreenPoint(): { x: number; y: number };

  // 屏幕
  /**
   * 获取主显示器
   */
  getPrimaryDisplay(): Display;
  /**
   * 获取所有显示器
   */
  getAllDisplays(): Display[];
  /**
   * 获取位置所在的显示器
   */
  getDisplayNearestPoint(point: { x: number; y: number }): Display;
  /**
   * 获取矩形所在的显示器
   */
  getDisplayMatching(rect: { x: number; y: number; width: number; height: number }): Display;
  // 复制

  /**
   * 复制文件到系统剪贴板
   * @param file
   */
  copyFile(file: string | Array<string>): Boolean;

  /**
   * 复制图片到系统剪贴板
   * @param img
   */
  copyImage(img: string | Uint8Array): Boolean;

  /**
   * 复制文本
   * @param text
   */
  copyText(text: string): Boolean;

  // 系统
  /**
   * @description 执行该方法将会弹出一个系统通知。
   * @param body 显示的内容
   */
  showNotification(body: string): void;

  /**
   * 系统默认方式打开给定的文件
   * @param path 文件绝对路径
   */
  shellOpenItem(path: string): void;

  /**
   * 系统文件管理器中显示给定的文件
   * @param path 文件绝对路径
   */
  shellShowItemInFolder(path: string): void;

  /**
   * 系统默认的协议打开URL
   * @param url
   */
  shellOpenExternal(url: string): void;

  /**
   * 播放哔哔声
   */
  shellBeep(): void;

  /**
   * @description 获取本地机器唯一ID，可以根据此值区分同一用户的不同设备
   */
  getLocalId(): string;

  /**
   * @description 你可以通过名称请求以下的路径
   * home 用户的 home 文件夹（主目录）
   * appData 当前用户的应用数据文件夹，默认对应：
   *   %APPDATA% Windows 中
   *   ~/Library/Application Support macOS 中
   * userData 储存你应用程序设置文件的文件夹，默认是 appData 文件夹附加应用的名称
   * temp 临时文件夹
   * exe 当前的可执行文件
   * desktop 当前用户的桌面文件夹
   * documents 用户文档目录的路径
   * downloads 用户下载目录的路径
   * music 用户音乐目录的路径
   * pictures 用户图片目录的路径
   * videos 用户视频目录的路径
   * logs 应用程序的日志文件夹
   * @param name
   */
  getPath(name: PathName): string;

  /**
   * @description 获取当前浏览器URL (呼出uTools前的活动窗口):Ubrowser;
   */
  getCurrentBrowserUrl(): string;

  /**
   * 获取当前文件管理器路径(linux 不支持)，呼出uTools前的活动窗口为资源管理器才能获取
   */
  getCurrentFolderPath(): string;

  isMacOs(): void;

  isWindows(): void;

  isLinux(): void;

  /**
   * @description 该方法只适用于在macOS下执行，用于判断uTools是否拥有辅助权限，如果没有可以调用API方法requestPrivilege请求
   */
  isHadPrivilege(): Boolean;

  /**
   * @description  该方法只适用于在macOS下执行，该方法调用后会弹出窗口向用户申请辅助权限。
   */
  requestPrivilege(): Boolean;

  // 数据库 api
  db: DB;

  dbStorage: {
    /**
     * 键值对存储，如果键名存在，则更新其对应的值
     * @param key 键名(同时为文档ID)
     * @param value 键值
     */
    setItem(key: string, value: any): void;
    /**
     * 获取键名对应的值
     */
    getItem(key: string): any;
    /**
     * 删除键值对(删除文档)
     */
    removeItem(key: string): void;
  };

  // ubrowser api
  ubrowser: Ubrowser;

  /**
   * 获取闲置的 ubrowser
   */
  getIdleUBrowsers(): { id: number; title: string; url: string }[];
  /**
   * 设置 ubrowser 代理 https://www.electronjs.org/docs/api/session#sessetproxyconfig
   */
  setUBrowserProxy(config: { pacScript?: string; proxyRules?: string; proxyBypassRules?: string }): boolean;
  /**
   * 清空 ubrowser 缓存
   */
  clearUBrowserCache(): boolean;

  /**
   * 是否深色模式
   */
  isDarkColors(): boolean;

  /**
   * 获取用户
   */
  getUser(): { avatar: string; nickname: string; type: string } | null;

  /**
   * 获取用户服务端临时令牌
   */
  fetchUserServerTemporaryToken(): Promise<{ token: string; expiredAt: number }>;

  /**
   * 打开支付
   * @param callback 支付成功触发
   */
  openPayment(
    options: {
      /**
       * 商品ID，在 “uTools 开发者工具” 插件中创建
       */
      goodsId: string;
      /**
       * 第三方服务生成的订单号(可选)
       */
      outOrderId?: string;
      /**
       * 第三方服务附加数据，在查询API和支付通知中原样返回，可作为自定义参数使用(可选)
       */
      attach?: string;
    },
    callback?: () => void
  ): void;

  /**
   * 获取用户支付记录
   */
  fetchUserPayments(): Promise<{ order_id: string; total_fee: number; body: string; attach: string; goods_id: string; out_order_id: string; paid_at: string }[]>;

  /**
   * 获取本地 ID
   */
  getNativeId(): string;

  /**
   * 获取软件版本
   */
  getAppVersion(): string;

  /**
   * 获取文件图标
   */
  getFileIcon(filePath: string): string;

  /**
   * 获取复制的文件或文件夹
   */
  getCopyedFiles(): { isFile: boolean; isDirectory: boolean; name: string; path: string }[];

  /**
   * 读取当前文件管理器路径(linux 不支持)
   */
  readCurrentFolderPath(): Promise<string>;

  /**
   * 读取当前浏览器窗口的URL(linux 不支持)
   * MacOs 支持浏览器 Safari、Chrome、Opera、Vivaldi、Brave
   * Windows 支持浏览器 Chrome、Firefox、Edge、IE、Opera、Brave
   * Linux 不支持
   */
  readCurrentBrowserUrl(): Promise<string>;

  /**
   * 默认方式打开给定的文件
   */
  shellOpenPath(fullPath: string): void;
}

export type UBrowserWindow = BrowserWindow & { executeJavaScript: (js: string) => Promise<any> };

export interface Display {
  accelerometerSupport: 'available' | 'unavailable' | 'unknown';
  bounds: { x: number; y: number; width: number; height: number };
  colorDepth: number;
  colorSpace: string;
  depthPerComponent: number;
  id: number;
  internal: boolean;
  monochrome: boolean;
  rotation: number;
  scaleFactor: number;
  size: { width: number; height: number };
  touchSupport: 'available' | 'unavailable' | 'unknown';
  workArea: { x: number; y: number; width: number; height: number };
  workAreaSize: { width: number; height: number };
}

export type PathName =
  | 'home'
  | 'appData'
  | 'userData'
  | 'cache'
  | 'temp'
  | 'exe'
  | 'module'
  | 'desktop'
  | 'documents'
  | 'downloads'
  | 'music'
  | 'pictures'
  | 'videos'
  | 'logs'
  | 'pepperFlashSystemPlugin';
export type Platform = 'win32' | 'darwin' | 'linux';

/**
 * 字符串|正则文本|图片|文件、文件夹|窗口|无匹配
 */
export type FeatureCMDType = string | FeatureRegexCMD | FeatureImgCMD | FeatureFilesCMD | FeatureWindowCMD | FeatureOverCMD;

export interface FeatureRegexCMD {
  /**
   * 正则文本
   */
  type: 'regex';

  /**
   * 文字说明，在搜索列表中出现（必须）
   */
  label: string;

  /**
   * 正则表达式字符串
   */
  match: string;

  /**
   * 长度限制（主输入框中的字符不少于） (可选)
   */
  minLength?: number;

  /**
   * 长度限制（不多于） (可选)
   */
  maxLength?: number;
}

export interface FeatureImgCMD {
  /**
   * 图片
   */
  type: 'img';

  /**
   * 文字说明，在搜索列表中出现（必须）
   */
  label: string;
}

export interface FeatureFilesCMD {
  /**
   * 文件、文件夹
   */
  type: 'files';

  /**
   * 文字说明，在搜索列表中出现（必须）
   */
  label: string;

  /**
   * 支持 file 或 directory (可选)
   */
  fileType?: 'file' | 'directory';

  /**
   * 文件名称正则匹配  (可选)
   */
  match?: string;

  /**
   * 文件数量限制（不少于） (可选)
   */
  minLength?: number;

  /**
   * 文件数量限制（不多于） (可选)
   */
  maxLength?: number;
}

export interface FeatureWindowCMD {
  /**
   * 窗口
   */
  type: 'window';

  /**
   * 文字说明，在搜索列表中出现（必须）
   */
  label: string;

  /**
   * 窗口匹配规则
   */
  match: {
    /**
     * 应用 (可选) ["xxx.app", "xxx.exe"]
     */
    app: string[];

    /**
     * 匹配窗口标题的正则 (有配置时应用也必须配置) (可选)
     */
    title?: string;

    /**
     * 窗口类 Windows 专有 (可选)
     */
    class?: string;
  };
}

export interface FeatureOverCMD {
  /**
   * 无匹配
   */
  type: 'over';

  /**
   * 文字说明，在搜索列表中出现（必须） "无匹配时"
   */
  label: string;

  /**
   * 排除的正则 (可选)
   */
  exclude?: string;

  /**
   * 长度限制（主输入框中的字符不少于） (可选)
   */
  minLength?: number;

  /**
   * 长度限制（不多于） (可选)
   */
  maxLength?: number;
}

export interface Feature {
  /**
   * 插件提供的某个功能的唯一标示，此为必选项，且不可重复
   */
  code: string;
  /**
   * 对此功能的说明，将在搜索列表对应位置中显示
   */
  explain: string;
  /**
   * 功能图标, 相对路径。支持 png、jpg、svg 格式，此为可选项
   */
  icon?: string;
  /**
   * 功能适配平台 ["win32", "darwin", "linux"]，此为可选项
   */
  platform?: Platform | Array<Platform>;
  /**
   * 该功能下可响应的命令集，支持 6 种类型
   */
  cmds: Array<FeatureCMDType>;
}

export interface onSubInputChangeArg {
  text: string;
}

export interface onSubInputChange {
  (item: onSubInputChangeArg): void;
}

export interface DB {
  /**
   * @description 执行该方法将会创建或更新数据库文档
   * @description 每次更新时都要传入完整的文档数据，无法对单个字段进行更新
   * @param item 数据
   */
  put<T = any>(item: DBItem<T>): DbReturn;

  /**
   * @description 执行该方法将会根据文档ID获取数据
   * @param id doc id
   */
  get<T = any>(id: string): DBItem<T> | null;

  /**
   * @description 执行该方法将会删除数据库文档，可以传入文档对象或文档id进行操作。
   * @param id id 或者是完整的文档
   */
  remove<T = any>(id: string | DBItem<T>): DbReturn;

  /**
   * @description 执行该方法将会批量更新数据库文档，传入需要更改的文档对象合并成数组进行批量更新。
   * @param items 数据
   */
  bulkDocs<T = any>(items: DBItem<T>[]): DbReturn[];

  /**
   * @description 执行该方法将会获取所有数据库文档，如果传入字符串，则会返回以字符串开头的文档，也可以传入指定ID的数组，不传入则为获取所有文档。
   * @param id id 或 id 数组
   */
  allDocs<T = any>(id?: string | Array<string>): DBItem<T>[];

  /**
   * 存储附件到新文档
   * @param docId 文档ID
   * @param attachment 附件 buffer
   * @param type 附件类型，示例：image/png, text/plain
   */
  postAttachment(docId: string, attachment: Uint8Array, type: string): DbReturn;
  /**
   * 获取附件
   * @param docId 文档ID
   */
  getAttachment(docId: string): Uint8Array | null;
  /**
   * 获取附件类型
   * @param docId 文档ID
   */
  getAttachmentType(docId: string): string | null;
}

export interface screenColorPickCBOptions {
  hex: string;
  rgb: string;
}

export interface DBItem<T> {
  _id: string;
  _rev?: string;
  data: T;
}

export interface DbReturn {
  id: string;
  rev?: string;
  ok?: boolean;
  error?: boolean;
  name?: string;
  message?: string;
}

export interface FilesPayload {
  isFile: boolean;
  isDirectory: boolean;
  name: string;
  path: string;
}

export interface WindowPayload {
  id: number;
  class: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  appPath: string;
  pid: number;
  app: string;
}

export interface Action {
  /**
   * feature.cmd.type 对应匹配的数据
   */
  payload: string | FilesPayload | WindowPayload;

  /**
   * plugin.json 配置的 feature.code
   */
  code: string;
  /**
   * plugin.json 配置的 feature.cmd.type，可以为 "text"、"img"、 "files"、 "regex"、 "over"、"window"
   */
  type: 'text' | 'img' | 'files' | 'regex' | 'over' | 'window';

  /**
   * 存在多个匹配时的可选匹配类型和数据 [{ type, payload }]
   */
  optional: Array<any> | undefined;
}

declare global {
  let utools: UToolsApi;
}

export interface CallbackListItem {
  title: string;
  description: string;
  icon?: string;
  url?: string;

  [propName: string]: any;
}

/**
 * @description 设置列表项目
 * @param items 设置条目
 */
export interface CallbackSetList {
  (items: CallbackListItem | CallbackListItem[]): void;
}

/**
 * @param action action
 * @param cb 回调函数，可以继续设置列表项目
 * @description 进入插件时调用（可选）
 */
export interface TplFeatureArgsEnter {
  (action: Action, cb: CallbackSetList): void;
}

/**
 * @param action action
 * @param word 搜索的字符创
 * @param cb 回调函数，可以继续设置列表项目
 * @description 子输入框内容变化时被调用 可选 (未设置则无搜索):Ubrowser;
 */
export interface TplFeatureArgsSearch {
  (action: Action, word: string, cb: CallbackSetList): void;
}

/**
 * @param action action
 * @param item 选中的item
 * @param cb 回调函数，可以继续设置列表项目
 * @description 用户选择列表中某个条目时被调用
 */
export interface TplFeatureArgsSelect {
  (action: Action, item: CallbackListItem, cb: CallbackSetList): void;
}

/**
 * @description 模板插件参数
 */
export interface TplFeatureArgs {
  /**
   * 进入插件时调用（可选）
   */
  enter?: TplFeatureArgsEnter;
  /**
   * 子输入框内容变化时被调用 可选 (未设置则无搜索)
   */
  search?: TplFeatureArgsSearch;
  /**
   * 用户选择列表中某个条目时被调用
   */
  select?: TplFeatureArgsSelect;
  /**
   * 子输入框为空时的占位符，默认为字符串"搜索"
   */
  placeholder: string;

  /**
   * 文档模式的索引集合  indexes: require('./indexes.json')
   */
  indexes?: Array<{
    /**
     * 标题
     */
    t: string;

    /**
     * 描述
     */
    d: string;

    /**
     * 页面, 只能是相对路径
     */
    p: string;
  }>;
}

export type TplFeatureMode = 'list' | 'doc' | 'none';

/**
 * @description 模板插件 Feature
 */
export interface TplFeature {
  mode: TplFeatureMode;
  args: TplFeatureArgs;
}

/**
 * @description 模板插件, feature-code: Feature
 */
export interface TemplatePlugin {
  [index: string]: TplFeature;
}

interface onPluginEnterCBParams extends Action {}

// ubrowser 相关
/**
 * 请查看 https://u.tools/docs/developer/ubrowser.html
 */
export interface Ubrowser {
  useragent(userAgent: string): Ubrowser;
  goto(url: string, headers?: any): Ubrowser;
  goto(mdText: string, title?: string): Ubrowser;
  viewport(width: Number, height: Number): Ubrowser;
  hide(): Ubrowser;
  show(): Ubrowser;
  css(cssCode: string): Ubrowser;
  press(key: string, ...modifier: string[]): Ubrowser;
  paste(text?: string): Ubrowser;
  screenshot(arg?: string | any, savePath?: string): Ubrowser;
  pdf(options?: any, savePath?: string): Ubrowser;
  device(arg: string | any): Ubrowser;
  cookies(name?: string): Ubrowser;
  setCookies(name: string, value: string): Ubrowser;
  setCookies(cookies: Array<any>): Ubrowser;
  removeCookies(name: string): Ubrowser;
  clearCookies(url?: string): Ubrowser;
  devTools(mode?: 'right' | 'bottom' | 'undocked' | 'detach'): Ubrowser;
  evaluate(func: Function, ...params: Array<any>): Ubrowser;
  wait(ms: Number): Ubrowser;
  wait(selector: string, timeout?: Number): Ubrowser;
  wait(func: Function, timeout: Number, ...params: Array<any>): Ubrowser;
  when(selector: string): Ubrowser;
  when(func: Function, ...params: Array<any>): Ubrowser;
  end(): Ubrowser;
  click(selector: string): Ubrowser;
  mousedown(selector: string): Ubrowser;
  mouseup(selector: string): Ubrowser;
  file(selector: string, payload: string | Array<string> | Buffer): Ubrowser;
  value(selector: string, val: string): Ubrowser;
  check(selector: string, checked: Boolean): Ubrowser;
  focus(selector: string): Ubrowser;
  scroll(selector: string): Ubrowser;
  scroll(y: Number): Ubrowser;
  scroll(x: Number, y: Number): Ubrowser;
  run(ubrowserId: Number): Promise<any[]>;
  run(options?: UbrowserRunOptions): Promise<any[]>;
}

export interface UbrowserRunOptions {
  show?: Boolean; //(可选)
  width?: Number; //(可选) 宽度
  height?: Number; //(可选) 高度
  x?: Number; //(可选)
  y?: Number; //(可选)
  center?: Boolean; //(可选)
  minWidth?: Number; //(可选) 窗口的最小宽度, 默认值为
  minHeight?: Number; //(可选) 窗口的最小高度. 默认值为
  maxWidth?: Number; //(可选) 窗口的最大宽度,
  maxHeight?: Number; //(可选) 窗口的最大高度,
  resizable?: Boolean; //(可选) 窗口是否可以改变尺寸,
  movable?: Boolean; //(可选) 窗口是否可以移动. 在 Linux 中无效。 默认值为
  minimizable?: Boolean; //(可选) 窗口是否可以最小化. 在 Linux 中无效。 默认值为
  maximizable?: Boolean; //(可选) 窗口是否可以最大化动. 在 Linux 中无效。 默认值为
  alwaysOnTop?: Boolean; //(可选) 窗口是否永远置顶。
  fullscreen?: Boolean; //(可选) 窗口是否全屏.
  fullscreenable?: Boolean; //(可选) 窗口是否可以进入全屏状态，默认值为
  enableLargerThanScreen?: Boolean; //(可选) 是否允许改变窗口的大小使之大于屏幕的尺寸. 仅适用于 macOS，因为其它操作系统默认允许 大于屏幕的窗口。 默认值为
  opacity?: Number; //(可选) 设置窗口初始的不透明度, 介于 0.0 (完全透明) 和 1.0 (完全不透明) 之间。仅支持 Windows 和
}

export interface PluginConfig {
  /**
   * 插件名称，它会在 uTools 的很多地方出现。此为必选项，长度不能超过 20 个字符。
   */
  pluginName: string;

  /**
   * 插件的版本，需要符合 Semver（语义化版本）规范。一般情况下形如：主.次.修订即可。此为必选项 打包时会以package.json的version为准覆盖此值
   */
  version: string;

  /**
   * 插件描述，简洁的说明这个插件的作用
   */
  description: string;

  /**
   * 开发者名称，将在 uTools 对应的位置显示
   */
  author: string;

  /**
   * 开发者主页，此为可选项，如果配置了此项，用户点击开发者时，将在浏览器中打开此页面
   */
  homepage?: string;

  /**
   * 入口文件，当该配置为空时，表示插件为模板插件。 main 与 preload 至少存在其一
   */
  main?: string;

  /**
   * 这是一个关键文件，你可以在此文件内调用 uTools、 nodejs、 electron 提供的 api。 main 与 preload 至少存在其一
   */
  preload?: string;

  /**
   * 此插件的图标，此为必选项，否则打包后将无法安装
   */
  logo: string;

  /**
   * 可选值： win32, darwin, linux
插件支持的平台，此为可选项，默认为全平台支持
   */
  platform?: Array<Platform>;

  /**
   * 在开发模式下，可使用 development 配置覆盖 main、preload、logo 的值，在打包时，此字段会被删除
   */
  development?: {
    /**
     * 开发模式下的入口文件
     */
    main?: string;

    /**
     * 开发模式下的 preload 文件
     */
    preload?: string;

    /**
     * logo
     */
    logo?: string;

    /**
     * 为开发模式指定打包目录（默认为 plugin.json 所在目录）。打包目录下也必须存在完整配置。
     */
    buildPath?: string;
  };

  /**
   * 插件设置
   */
  pluginSetting?: {
    /**
     * 插件是否允许多开（默认不允许）。多开方式：分离插件后，再次创建
     */
    single?: boolean;

    /**
     * 插件高度。可动态修改（参考），该项被设置后，用户则不能再调整高度
     */
    height?: number;
  };

  /**
   * 插件功能
   */
  features?: Feature[];
}
