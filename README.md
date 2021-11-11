# LBATSLibrary v. 0.0.1BETA
Little Big Adventure Library written in Typescript

## How to install?
```
TODO
```

## How to use?
```
import HQR from './hqr';

const hqr = new HQR(),
    textEntriesIndex = 1, //index in HQR file (starts from 0)
    testLBA = hqr.load('./test1.hqr');
console.log(testLBA);
```

Results will be something like:
```
{
  buffer: ArrayBuffer {
    [Uint8Contents]: <34 02 00 00 94 02 00 00 22 05 00 00 70 05 00 00 ed 07 00 00 b1 08 00 00 d6 1c 00 00 5e 1e 00 00 5c 3a 00 00 7e 3c 00 00 9e 69 00 00 00 6a 00 00 d2 73 00 00 c8 74 00 00 06 89 00 00 54 89 00 00 63 91 00 00 c5 91 00 00 25 9b 00 00 7d 9b 00 00 5a a1 00 00 e8 a1 00 00 c3 ac 00 00 f1 ac 00 00 49 af 00 00 ... 248554 more bytes>,
    byteLength: 248654
  },
  entries: [
    {
      index: 0,
      isBlank: false,
      headerOffset: 564,
      offset: 574,
      originalSize: 86,
      compressedSize: 86,
      type: 0,
      hasHiddenEntry: false,
      nextHiddenEntry: -1
    },
    (...)
  ]
}
```

To decode HQR entry:
```
console.log(hqr.readHqrEntry(textEntriesIndex));
```

Results will be something like:
```
ArrayBuffer {
  [Uint8Contents]: <58 00 5f 00 68 00 7c 00 85 00 97 00 af 00 c8 00 d7 00 ee 00 fa 00 0b 01 1b 01 2a 01 3b 01 44 01 58 01 5d 01 69 01 70 01 88 01 92 01 9c 01 ac 01 c2 01 d0 01 e1 01 f9 01 0b 02 1c 02 31 02 3c 02 4d 02 60 02 70 02 80 02 a7 02 b6 02 c8 02 df 02 f0 02 f7 02 0e 03 40 03 4e 6f 72 6d 61 6c 00 41 74 68 6c 65 ... 732 more bytes>,
  byteLength: 832
}
```
