import { Entry } from './Structures';

export default class HQR {
    private buffer: ArrayBuffer = new ArrayBuffer(0);
    private entries: Entry[] = [];

    load(fileName: string) {
        const fs = require('fs');
        this.buffer = fs.readFileSync(fileName).buffer;
        this.readHqrHeader();
        return {
            buffer: this.buffer,
            entries: this.entries
        };
    }

    readHqrHeader = () => {
        const firstOffset = new Int32Array(this.buffer, 0, 1),
            numEntries = (firstOffset[0] / 4) - 1,
            idx_array = new Uint32Array(this.buffer, 0, numEntries);

        for (let i = 0; i < idx_array.length; i += 1) {
            const entry = this.createEntryFromOffset(idx_array[i], i);
            this.entries.push(entry);
        }
        return this.entries;
    }

    createEntryFromOffset = (offset: number, ind: number) => {
        if (offset === 0) {
            return {
                index: ind, isBlank: true,
                headerOffset: 0, offset: 0, originalSize: 0, compressedSize: 0, type: -1,
                hasHiddenEntry: false, nextHiddenEntry: -1
            } as Entry;
        }

        const header = new DataView(this.buffer, offset, 10);
        return {
            index: ind,
            isBlank: false,
            headerOffset: offset,
            offset: offset + 10,
            originalSize: header.getUint32(0, true),
            compressedSize: header.getUint32(4, true),
            type: header.getInt16(8, true),
            hasHiddenEntry: false,
            nextHiddenEntry: -1
        } as Entry;
    }

    readHqrEntry = (entryIndex: number) => {
        const entry = this.entries[entryIndex];
        if (entry.isBlank) {
            return new ArrayBuffer(0);
        }
        if (entry.type > 0) {
            const tgt_buffer = new ArrayBuffer(entry.originalSize);
            const source = new Uint8Array(this.buffer, entry.offset, entry.compressedSize);
            const target = new Uint8Array(tgt_buffer);
            let src_pos = 0;
            let tgt_pos = 0;
            while ((src_pos + 1) <= entry.compressedSize) {
                const flag = source[src_pos];

                for (let i = 0; i < 8; i += 1) {
                    src_pos += 1;

                    if ((flag & (1 << i)) !== 0) {
                        target[tgt_pos] = source[src_pos];
                        tgt_pos += 1;
                    } else {
                        const e = (source[src_pos] * 256) + source[src_pos + 1];
                        const len = ((e >> 8) & 0x000F) + entry.type + 1;
                        const addr = ((e << 4) & 0x0FF0) + ((e >> 12) & 0x00FF);

                        for (let g = 0; g < len; g += 1) {
                            target[tgt_pos] = target[tgt_pos - addr - 1];
                            tgt_pos += 1;
                        }
                        src_pos += 1;
                    }

                    if ((src_pos + 1) >= entry.compressedSize)
                        break;
                }

                src_pos += 1;
            }
            return tgt_buffer;
        }
        if (entry.hasHiddenEntry) {
            const tgt_buffer = new ArrayBuffer(entry.originalSize);
            const source = new Uint8Array(this.buffer, entry.offset, entry.compressedSize);
            const target = new Uint8Array(tgt_buffer);
            // entries that have hidden entries are marked with 1 at the start,
            // making the file to be faulty
            source[0] = 0;
            target.set(source);
            return tgt_buffer;
        }
        return this.buffer.slice(entry.offset, entry.offset + entry.compressedSize);
    }
}
