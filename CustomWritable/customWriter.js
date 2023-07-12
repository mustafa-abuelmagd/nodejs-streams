// We'll need to implement the stream interface
// also, some necessary methods need to be implemented
// _construct(): responsible for initializing data, opening the file, etc
// _final(): what happens after all the data is written? write.txt the final chunk
// _destroy(): responsible for ending the whole process, closing file maybe, and any other necessary operations

const {Writable} = require("stream");
const fs = require("fs");

class FileWriter extends Writable {
    constructor({highWaterMark, fileName}) {
        super(highWaterMark);
        this.fileName = fileName;
        this.fd = null;
        this.chunks = [];
        this.chunkSize = 0;
        this.writeCount = 0;

    }

    _construct(callback) { // here is where we open the file, assign the file descriptor fd
        fs.open(this.fileName, "w", (err, fd) => {
            if (err) {
                return callback(err);
            } else {
                this.fd = fd;
                callback();
            }
        });
    }

    _write(chunk, encoding, callback) { // here we do write.txt to the file using the file descriptor
        this.chunks.push(chunk);
        this.chunkSize += chunk.length;

        if (this.chunkSize > this.writableHighWaterMark) {
            fs.write(this.fd, Buffer.concat(this.chunks), (err) => {
                if (err) {
                    return callback(err);
                }
                this.chunks = [];
                this.chunkSize = 0;
                this.writeCount = 0;
                ++this.writeCount;
                callback();

            })
        } else {
            callback();
        }
    }

    _final(callback) {
        fs.write(this.fd, Buffer.concat(this.chunks), (err) => {
            if (err) {
                return callback(err);
            }
            this.chunks = [];
            this.writeCount = 0;
            ++this.writeCount;
            callback();
        });
    }

    _destroy(error, callback) {
        console.log("Number of writes:", this.writeCount);
        if (this.fd) {
            fs.close(this.fd, (err) => {
                callback(err || error);
            });
        } else {
            callback(error);
        }
    }
}

// instantiate a new stream with the file you'd like to write.txt to
// do some writing operations
// end the stream, log the execution time,


// (async () => {
//     console.time("loop");
//     const myWriter = new FileWriter({fileName: "test.txt"});
//     let d = 0;
//     myWriter.on("drain", () => {
//         ++d;
//         loop();
//     })
//
//     myWriter.on("finish", async () => {
//         console.timeEnd("loop");
//         console.log("Number of drains:", d);
//         await myWriter.end();
//
//     });
//     myWriter.on("close", () => {
//         console.log("stream was closed");
//     })
//
//     let i = 0;
//     const loop = () => {
//         while (i < 1000000) {
//             if (!myWriter.write.txt(` ${i} `)) break;
//             if (i === 999999) return myWriter.end(` ${i} `);
//             i++;
//         }
//     };
//     loop();
//
//     // await fileHandler.close();
//
// })();


module.exports = FileWriter;