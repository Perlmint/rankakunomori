export type Language = "en" | "ko" | "ja";
declare const value: ({
    [language in Language]: string;
} & { price: number })[];
export default value;