const {Duplex} = require("stream");
const fs = require("fs");

class CustomDuplex extends Duplex {
    constructor({
                    writableHighWaterMark,
                    readableHighWaterMark,
                    readFileName,
                    writeFileName
                }) {
        super({
            writableHighWaterMark,
            readableHighWaterMark
        });
        this.readFileName = readFileName;
        this.writeFileName = writeFileName;
        this.ReadFd = null;
        this.WriteFd = null;
        this.chunks = [];
        this.chunkSize = 0;
        this.writeCount = 0;
    }


    // open the read.txt file, then the write.txt file inside each other
    _construct(callback) {
        fs.open(this.readFileName, "r", (err, ReadFd) => {
            if (err) return callback(err);

            this.ReadFd = ReadFd;
            fs.open(this.writeFileName, "w", (err, WriteFd) => {
                if (err) return callback(err);
                this.WriteFd = WriteFd;
                callback();
            });
        });
    }

    _read(size) {
        const buff = Buffer.alloc(size);
        fs.read(this.ReadFd, buff, 0, size, null, (err, bytesRead) => {
            if (err) return this.destroy();
            this.push(bytesRead > 0 ? buff.subarray(0, bytesRead) : null);
        })
    }

    _write(chunk, encoding, callback) { // here we do write.txt to the file using the file descriptor
        this.chunks.push(chunk);
        this.chunkSize += chunk.length;
        if (this.chunkSize > this.writableHighWaterMark) {
            fs.write(this.WriteFd, Buffer.concat(this.chunks), (err) => {
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
        fs.write(this.WriteFd, Buffer.concat(this.chunks), (err) => {
            if (err) return callback(err);
            this.chunks = [];
            this.writeCount = 0;
            ++this.writeCount;
            callback();
        });
    }

    _destroy(error, callback) {
        if (this.ReadFd) {
            fs.close(this.ReadFd, (err) => callback(err || error));
        }
        if (this.WriteFd) {
            fs.close(this.WriteFd, (err) => callback(err || error));
        } else {
            callback(error);
        }
    }

}

const DuplexStream = new CustomDuplex({
    readFileName: "read.txt.txt",
    writeFileName: "write.txt.txt"
});

DuplexStream.write("write.txt 1 \n");
DuplexStream.write("write.txt 2 \n");
DuplexStream.write("write.txt 3 \n");
DuplexStream.write("write.txt 4 \n");
DuplexStream.write("write.txt 5 \n");
DuplexStream.end("ending the write.txt stream");

DuplexStream.on("data", (chunk) => {
    console.log("chunk", chunk.toString());
})

