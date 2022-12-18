class Data {
  constructor() {
    username = null;
  }
  getusername() {
    return username;
  }
  changeusername(params) {
    this.username = params;
  }
}
module.exports = { Data };
