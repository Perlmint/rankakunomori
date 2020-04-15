type NAME = "eng" | "kor";
declare const value: ({
    [name in NAME]: string;
    } & { price: number })[]
export = value;