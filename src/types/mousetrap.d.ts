declare module '*/mousetrap.min.js' {
  namespace Mousetrap {
    interface ExtendedKeyboardEvent extends KeyboardEvent {
      returnValue: boolean; // IE returnValue
    }

    interface MousetrapStatic {
      (el?: Element): MousetrapInstance;
      new (el?: Element): MousetrapInstance;
      addKeycodes(keycodes: { [key: number]: string }): void;
      stopCallback: (e: ExtendedKeyboardEvent, element: Element, combo: string) => boolean;
      bind(keys: string | string[], callback: (e: ExtendedKeyboardEvent, combo: string) => any, action?: string): MousetrapInstance;
      unbind(keys: string | string[], action?: string): MousetrapInstance;
      trigger(keys: string, action?: string): MousetrapInstance;
      reset(): MousetrapInstance;

      /** https://craig.is/killing/mice#extensions.global */
      bindGlobal(keyArray: string | string[], callback: (e: ExtendedKeyboardEvent, combo: string) => any, action?: string): void;
    }

    interface MousetrapInstance {
      stopCallback: (e: ExtendedKeyboardEvent, element: Element, combo: string) => boolean;
      bind(keys: string | string[], callback: (e: ExtendedKeyboardEvent, combo: string) => any, action?: string): this;
      unbind(keys: string | string[], action?: string): this;
      trigger(keys: string, action?: string): this;
      handleKey(character: string, modifiers: string[], e: ExtendedKeyboardEvent): void;
      reset(): this;
    }
  }

  const Mousetrap: Mousetrap.MousetrapStatic;

  export default Mousetrap;
}
