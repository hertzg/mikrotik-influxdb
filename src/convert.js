const { parseRange } = require("@network-utils/ip-range");
const Config = require('./config')

const {
  INFLUX_MEASUREMENT = "accounting",
  IP_RANGE = "192.168.88.1-192.168.88.255",
} = Config;

const validIps = new Set(parseRange(IP_RANGE));

const join = (obj) =>
  Object.entries(obj).reduce((a, [k, v]) => `${a ? `${a},` : ""}${k}=${v}`, "");

/**
 * Convert
 *
 * @param buffer {Buffer}
 * @param measurement string
 *
 * @returns string
 */
const convert = (buffer, measurement = INFLUX_MEASUREMENT) => {
  const data = Array.from(
    buffer
      .toString("utf8")
      .split("\n")
      .map((entry) => entry.split(" "))
      .flatMap((cell) => [
        {
          ip: cell[0],
          dir: "up",
          bytes: Number(cell[2]),
          packets: Number(cell[3]),
        },
        {
          ip: cell[1],
          dir: "down",
          bytes: Number(cell[2]),
          packets: Number(cell[3]),
        },
      ])
      .filter(({ ip }) => validIps.has(ip))
      .reduce((map, { ip, dir, bytes, packets }) => {
        const totals = map.has(ip)
          ? map.get(ip)
          : map
              .set(ip, {
                up: { bytes: 0, packets: 0 },
                down: { bytes: 0, packets: 0 },
              })
              .get(ip);

        totals[dir].bytes += bytes;
        totals[dir].packets += packets;

        map.set(ip, totals);

        return map;
      }, new Map())
      .entries()
  )
    .map(([ip, totals]) => [
      { ip },
      {
        upBytes: totals.up.bytes,
        downBytes: totals.down.bytes,
        upPackets: totals.up.packets,
        downPackets: totals.down.packets,
      },
    ])
    .map(([tags, fields]) => `${measurement},${join(tags)} ${join(fields)}`);

  return data.join("\n");
};

exports.convert = convert;
