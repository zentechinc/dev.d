import * as filesProxies from './files';
import {Readable, PassThrough, Writable} from 'stream';
import fs from 'fs';

jest.mock('fs');

describe('files.js', function () {
    describe('streamInsert', function () {
        const newLines = ['1', '2', '3', '4', '5'];
        // it('should insert a the whole block if no interrupt or resumes are triggered', async function () {
        //     console.log('<------- marker 1 ------->');
        //     const mockReadStream = jest.fn().mockImplementation(() => {
        //         const readable = new Readable();
        //         readable.push('a');
        //         readable.push('b');
        //         readable.push('c');
        //         readable.push('d');
        //         readable.push('e');
        //         readable.push('f');
        //         readable.push('g');
        //         readable.push(null);
        //
        //         return readable;
        //     });
        //
        //     const mockWriteStream = jest.fn().mockImplementation(() => {
        //         const writable = new Writable();
        //
        //         // const writeMock = jest.fn()
        //
        //         return {
        //             close: jest.fn(),
        //             removeAllListeners: jest.fn(),
        //             // write: jest.fn()
        //             write: jest.fn(() => 'red')
        //         };
        //         // return jest.sp
        //     });
        //
        //
        //     fs.createReadStream.mockReturnValue(mockReadStream());
        //     fs.createWriteStream.mockReturnValue(mockWriteStream());
        //
        //     const writeSpy = jest.spyOn(fs.createWriteStream(), 'write');
        //
        //     await filesProxies.streamInsert('unitTest.txt', newLines);
        //     expect(1).toEqual(1);
        //     expect(fs.createReadStream).toBeCalledWith('unitTest.txt');
        //     expect(fs.createWriteStream).toBeCalledWith('unitTest.txt_tmp', {'flags': 'w'});
        //     expect(fs.createWriteStream.write).toBeCalledWith('unitTest.txt_tmp', {'flags': 'w'});
        // });

        it('should insert a the whole block if no interrupt or resumes are triggered', async function () {
            const mockReadable = new PassThrough();
            const mockWriteable = new PassThrough();
            const mockFilePath = '/oh/what/a/file.txt';
            fs.createWriteStream.mockReturnValueOnce(mockWriteable);

            // Act & Assert
            await expect(filesProxies.streamInsert(mockReadable, mockFilePath))
                .rejects.toEqual('ahoy!');
        });
    });
});

