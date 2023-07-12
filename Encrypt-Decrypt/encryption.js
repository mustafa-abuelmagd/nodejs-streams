const {Transform} = require("stream");
const fs = require("fs").promises;

class Encryptor extends Transform {
    // This is a simple encryption class that just adds 1 to every 8 bits representing a character
    _transform(chunk, encoding, callback) {
        for (let i = 0; i < chunk.length; i++) {
            if (chunk[i] !== 255) {
                chunk[i] = chunk[i] + 1;
            }
        }
        console.log("the current chunk is ", chunk.toString())

        callback(null, chunk);
    }

}

(async () => {
    const readFile = await fs.open("read.txt", "r");
    const writeFile = await fs.open("write.txt", "w");
    const readStream = readFile.createReadStream();
    const writeStream = writeFile.createWriteStream();
    const encryptor = new Encryptor({
        ReadFileName: "read.txt",
        WriteFileName: "read.txt",
    });
    readStream.pipe(encryptor).pipe(writeStream);
})()