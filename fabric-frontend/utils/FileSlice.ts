import CryptoJS from 'crypto-js';

export class FileSlice {
    public readonly chunkSize: number;
    public readonly file: File;

    private offset = 0;
    public readonly chunkCount: number;

    constructor(file: File, chunkSize: number) {
        this.chunkSize = chunkSize;
        this.file = file;
        this.chunkCount = Math.ceil(this.file.size / chunkSize);
    }

    // 获取下一个分片
    public next(): Blob {
        if (this.offset >= this.file.size) {
            throw new Error('reach file end');
        }
        else if (this.offset + this.chunkSize >= this.file.size) {
            const partial = this.file.slice(this.offset, this.file.size);
            this.offset = this.file.size;
            return partial;
        }
        else {
            const partial = this.file.slice(this.offset, this.chunkSize + this.offset);
            this.offset += this.chunkSize;
            return partial;
        }
    }

    // 重置当前分片计数
    public reset(): void { this.offset = 0; }

    // 以编号获取某个分片
    public get(order: number): Blob {
        if (order === this.chunkCount - 1) {
            return this.file.slice(order * this.chunkSize, this.file.size);
        }
        else {
            return this.file.slice(order * this.chunkSize, (order + 1) * this.chunkSize);
        }
    }
}
