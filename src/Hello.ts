export default class Hello {
  static sayHello(message) {
    utools.showMessageBox({
      message,
    });
  }

  static repeat(message) {
    return utools.showMessageBox({
      message,
    });
  }
}
