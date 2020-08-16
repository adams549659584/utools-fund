declare module 'encoding' {
  /**
   * Convert encoding of an UTF-8 string or a buffer
   *
   * @param str String to be converted
   * @param to Encoding to be converted to
   * @param from Encoding to be converted from
   * @return Encoded string
   */
  function convert(str: String | Buffer, to: String, from: String): Buffer;
}
