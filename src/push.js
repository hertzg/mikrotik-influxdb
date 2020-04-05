const { URL } = require("url");
const { encode } = require("querystring");
const { request } = require("./request");
const Config = require('./config')

const {
  INFLUX_ADDRESS = "http://127.0.0.1:8086",
  INFLUX_DATABASE,
  INFLUX_RETENTION_POLICY,
  INFLUX_USERNAME,
  INFLUX_PASSWORD,
  INFLUX_CONSISTENCY,
} = Config;

const makeUrl = (
  db = INFLUX_DATABASE,
  rp = INFLUX_RETENTION_POLICY,
  u = INFLUX_USERNAME,
  p = INFLUX_PASSWORD,
  consistency = INFLUX_CONSISTENCY,
  precision = "ns"
) => {
  if (!db) {
    throw new Error("Database name is required");
  }

  return new URL(
    `/write?${encode({ db, rp, u, p, consistency, precision })}`,
    INFLUX_ADDRESS
  );
};

/**
 *
 * @param data {Buffer}
 * @param url {URL}
 * @return {Promise<*>}
 */
const push = async (data, url = makeUrl()) => {
  return await request(data, url, { method: "POST" });
};

exports.push = push;
