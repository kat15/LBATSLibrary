import { Entry } from "@/core/Structures/entry";

export default class HQR {
    load(fileName: string) {
        const fs = require('fs'),
            file = fs.readFileSync(fileName).buffer;
        this.readHqrHeader(file);
        return '1';
    }

    readHqrHeader = (buffer: ArrayBuffer) => {
        let entries: Entry[] = [];
        const firstOffset = new Int32Array(buffer, 0, 1),
            numEntries = (firstOffset[0] / 4) - 1,
            idx_array = new Uint32Array(buffer, 0, numEntries);

        for (let i = 0; i < idx_array.length; i += 1) {
            const entry = this.createEntryFromOffset(buffer, idx_array[i], i);
            entries.push(entry);
            console.log(entry);
        }
        return entries;
    }

    createEntryFromOffset = (buffer: ArrayBuffer, offset: number, ind: number) => {
        if (offset === 0) {
            return {
                index: ind, isBlank: true,
                headerOffset: 0, offset: 0, originalSize: 0, compressedSize: 0, type: -1,
                hasHiddenEntry: false, nextHiddenEntry: -1
            } as Entry;
        }

        const header = new DataView(buffer, offset, 10);
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
    };
}
