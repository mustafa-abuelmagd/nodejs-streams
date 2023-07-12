// const fs = require("fs/promises");
const fs = require("fs");

// const file_path = "./testFile.txt";
// const openFile = async (filePath) => {
//     try {
//         await fs.open(filePath, "w");
//     } catch (e) {
//         console.log(`File couldn't be opened. File is, instead, created! ${e}`);
//     }
// }
// const closeFile = async (filePath) => {
//     try {
//         await (await fs.open(filePath, "r")).close();
//     } catch (e) {
//         console.log(`File couldn't be closed! ${e}`);
//     }
// }
//
// const writeToFile = (filePath, data) => {
//     try {
//         fsSync.appendFileSync(filePath, data);
//     } catch (e) {
//         console.log(`File couldn't be written! ${e}`);
//     }
// }
//
//
// // Execute the operations
// // 1- open the file
// // benchmark the write.txt code
// // 2- write.txt to the file (appending mode)
// // 3- close the opened file (important)
//
// (async () => {
//     await openFile(file_path);
// })()
//
// console.time();
// for (let i = 0; i < 1000000; i++) {
//     writeToFile(file_path, `Added a new line ${i} \n`);
// }
// console.timeEnd();
// (async () => {
//     await closeFile(file_path);
// })();


// The internal size of the writable stream buffer is 16KB
// You cannot write.txt to the buffer any data that is longer than that size
// When the internal buffer reaches its size limit, any write.txt process will throw false when writing as the buffer is full
// when the buffer is full, or emptied, it fires an event with the name "drain"
// if we'd like to keep the memory usage of the application around that size, we need to keep track of that size and that event
// and not write.txt before the event is fired


(async () => {
    const stream = await fs.createWriteStream("./writable/testFile.txt");
    stream.on("drain", () => {
        loop();
    })
    stream.on("finish", async () => {
        console.timeEnd("loop");
        await stream.close();

    });
    stream.on("close", () => {
        console.log("stream was closed");
    })

    let i = 0;
    const loop = () => {
        while (i < 1000000) {
            if (!stream.write(` ${i} `)) break;
            if (i === 999999) return stream.end(` ${i} `);
            i++;
        }
    };
    console.time("loop");
    loop();

    // await fileHandler.close();

})();

