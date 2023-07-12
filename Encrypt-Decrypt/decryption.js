const {Transform} = require("stream");
const fs = require("fs").promises;

class Decryptor extends Transform {
    constructor({ReadFileName, WriteFileName}) {
        super();
        this.ReadFileName = ReadFileName;
        this.WriteFileName = WriteFileName;
        this.size = null;
        this.fileHandler = null;
    }

    async _construct(callback) {
        const fileHandler = await fs.open(this.ReadFileName, "r");
        const fileSize = (await fileHandler.stat()).size;
        this.fileHandler = fileHandler;
        this.size = fileSize;
        this.readLength = 0;
    }

    // This is a simple encryption class that just adds 1 to every 8 bits representing a character
    _transform(chunk, encoding, callback) {
        for (let i = 0; i < chunk.length; i++) {
            if (chunk[i] !== 255) {
                chunk[i] = chunk[i] - 1;
            }
        }
        this.readLength += this.writableHighWaterMark;
        // console.log("this.readLength is ", this.readLength, "\n")
        // console.log("this.fileSize  is ", this.size, "\n")
        this.updateLine(`${(this.readLength / this.size) * 100}`)


        callback(null, chunk);
    }

    updateLine(text) {
        process.stdout.clearLine(); // Clear the current line
        process.stdout.cursorTo(0); // Move the cursor to the beginning of the line
        process.stdout.write(text); // Write the updated content
    }
    _destroy(error, callback) {
        this.fileHandler?.close();
    }

}

(async () => {
    const readFile = await fs.open("testFile.txt", "r");
    const writeFile = await fs.open("decrypted.txt", "w");
    const readStream = readFile.createReadStream();
    const writeStream = writeFile.createWriteStream();
    const decryptor = new Decryptor({
        ReadFileName: "testFile.txt",
        WriteFileName: "decrypted.txt",
    });
    readStream.pipe(decryptor).pipe(writeStream);
})()