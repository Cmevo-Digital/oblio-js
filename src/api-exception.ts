export class OblioApiException {
  message = '';
  code = 0;
  constructor(message = '', code = 0) {
    this.message = message;
    this.code = code;
  }
}
