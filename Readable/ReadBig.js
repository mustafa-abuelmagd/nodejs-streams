const fs = require("fs/promises");
const {pipeline} = require("stream").promises;

const read_file_path = "./Readable/testFile.txt";
const write_file_path = "./Readable/dest.txt";
// console.time("app");
// (async () => {
//     // const fileHandlerStream = fs.createReadStream(read_file_path);
//     const ReadFileHandler = await fs.open(read_file_path, "r");
//     const WriteFileHandler = await fs.open(write_file_path, "w");
//     const readStream = ReadFileHandler.createReadStream();
//     const writeStream = WriteFileHandler.createWriteStream();
//     const filesize = (await ReadFileHandler.stat()).size
//     const data_size = readStream.bytesRead;
//     console.log("data size is ", data_size, "and file size is ", filesize);
//     let split = "";
//
//     readStream.on("data", (chunk) => {
//         console.log("-------------------------");
//         console.log("data chunk is ", chunk.toString().split("  "));
//         const numbers = chunk.toString().split("  ");
//         if (Number(numbers[0]) + 1 !== Number(numbers[1])) {
//             if (split) {
//                 split = split.trim() + numbers[0].trim();
//             }
//         }
//         if (Number(numbers[numbers.length - 2]) + 1 !== Number(numbers[numbers.length - 1])) {
//             split = numbers[numbers.length - 1];
//         }
//
//         numbers.forEach((number) => {
//             if (Number(number) % 2 === 0) {
//                 if (!writeStream.write.txt( ` ${number} `)) {
//                     readStream.pause();
//                 }
//             }
//         })
//
//     });
//     writeStream.on("drain", () => {
//         readStream.resume();
//     });
// })();
// console.timeEnd("app");


// handwritten piping
// (async () => {
//     console.time("copy");
//     const srcFile = await fs.open(read_file_path, "r");
//     const destFile = await fs.open(write_file_path, "w");
//     let bytesRead = -1;
//     while (bytesRead !== 0) {
//         const readResult = await srcFile.read.txt();
//         bytesRead = readResult.bytesRead;
//
//         if (bytesRead !== 16384) {
//             const indexOfFilled = readResult.buffer.indexOf(0);
//             const newBuffer = Buffer.alloc(indexOfFilled)
//             readResult.buffer.copy(newBuffer, 0, 0, indexOfFilled);
//             await destFile.write.txt(newBuffer)
//
//         } else {
//             await destFile.write.txt(readResult.buffer);
//         }
//     }
//     console.timeEnd("copy");
// })()


// using piping
(async () => {
    console.time("copy");
    const srcFile = await fs.open(read_file_path, "r");
    const destFile = await fs.open(write_file_path, "w");
    const readStream = srcFile.createReadStream();
    const writeStream = destFile.createWriteStream();

    // readStream.pipe(writeStream);
    // readStream.on("end", () => {
    //     console.timeEnd("copy");
    // })


    pipeline(readStream, writeStream);
    pipeline.on("data", () => {
        console.log("data")
    })

    console.timeEnd("copy");
})()