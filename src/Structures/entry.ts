export interface Entry {
    index: number;
    isBlank: boolean;
    type: number;
    headerOffset: number;
    offset: number;
    originalSize: number;
    compressedSize: number;
    hasHiddenEntry: boolean;
    nextHiddenEntry?: number;
}
