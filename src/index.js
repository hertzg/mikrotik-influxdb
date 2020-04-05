const { fetch } = require("./fetch");
const { convert } = require("./convert");
const { push } = require("./push");
const { promisify } = require("util");
const Config = require("./config");

const delay = promisify(setTimeout);

const { PUSH_INTERVAL = 1000 } = Config;

const loop = () =>
  fetch()
    .then(({ _, data }) => convert(data))
    .then((points) => push(points))
    .then(() => delay(PUSH_INTERVAL))
    .then(() => loop());

console.log("Polling for accounting data every %jms", PUSH_INTERVAL);
loop();
