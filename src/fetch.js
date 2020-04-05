const { request } = require("./request");
const Config = require('./config')

const {
  ROUTEROS_ACCOUNTING_URL = "http://192.168.88.1/accounting/ip.cgi",
} = Config;

const fetch = async (url = ROUTEROS_ACCOUNTING_URL) => {
  return await request(null, url);
};

exports.fetch = fetch;
