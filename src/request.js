const HTTP = require("http");
const bl = require("bl");

const request = (data = null, ...args) =>
  new Promise((resolve, reject) => {
    const req = HTTP.request(...args, (res) => {
      res.pipe(
        bl((err, data) => {
          if (err) {
            reject(err);
            return;
          }

          resolve({ res, data });
        })
      );
    });

    if (data != null) {
      req.end(data);
    } else {
      req.end();
    }
  });

exports.request = request
