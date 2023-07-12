const fs = require("fs");
const {Readable,} = require("stream");
const {pipeline} = require("stream").promises;
const CustomWriter = require("./../CustomWritable/customWriter");

class FileReader extends Readable {
    constructor({highWaterMark, fileName}) {
        super(highWaterMark);
        this.fd = null;
        this.fileName = fileName;
    }

    _construct(callback) {
        fs.open(this.fileName, "r", (err, fd) => {
            if (err) return callback(err);
            else {
                this.fd = fd;
                callback();
            }
        })
    }

    _read(size) {
        const buff = Buffer.alloc(size);
        fs.read(this.fd, buff, 0, size, null, (err, bytesRead) => {
            if (err) return this.destroy();
            this.push(bytesRead > 0 ? buff.subarray(0, bytesRead) : null);
        })
    }

    _destroy(error, callback) {
        if (this.fd) {
            fs.close(this.fd, (err) => callback(err || error));
        } else {
            callback(error);
        }
    }
}


// (async () => {
//     const fileReader = new FileReader({fileName: "testFile.txt"});
//     console.time("loop");
//     fileReader.on("data", (data) => {
//         console.log(data)
//     })
//
//     fileReader.on("end", () => {
//         console.timeEnd("loop");
//     })
//
//
// })();

(async () => {
    const fileReader = new FileReader({fileName: "testFile.txt"});
    const fileWriter = new CustomWriter({fileName: "testFile2.txt"});
    console.time("copy");

    pipeline(fileReader, fileWriter);

    console.timeEnd("copy");


})();
