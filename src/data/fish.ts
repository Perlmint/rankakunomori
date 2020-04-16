export enum Habitat {
    river,
    rivermouth,
    waterfall,
    pond,
    sea,
    dock,
}

export namespace Habitat {
    export function toString(habitat: Habitat) {
        switch (habitat) {
            case Habitat.river: return '강';
            case Habitat.waterfall: return '강(절벽 위)';
            case Habitat.rivermouth: return '하구';
            case Habitat.pond: return '연못';
            case Habitat.sea: return '바다';
            case Habitat.dock: return '부두';
        }
    }
}

export type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type Size = 1 | 2 | 3 | 4 | 5 | 6;

export namespace Size {
    export function toString(size: Size) {
        switch (size) {
            case 1: return '작음';
            case 2: return '약간 작음';
            case 3: return '중간';
            case 4: return '약간 큼';
            case 5: return '큼';
            case 6: return '매우 큼';
        }
    }
}

export interface Datum {
    name: string;
    living_months: [Month, Month][];
    appear_time: [number, number][][]
    habitat: Habitat,
    size: Size,
    price: number,
}

const data: Datum[] = [
    {
        name: "납줄개",
        living_months: [[11, 3]],
        appear_time: [[[0, 23]]],
        habitat: Habitat.river,
        size: 1,
        price: 900,
    },
    {
        name: "피라미",
        living_months: [[1, 12]],
        appear_time: [[[9, 16]]],
        habitat: Habitat.river,
        size: 1,
        price: 200,
    },
    {
        name: "붕어",
        living_months: [[1, 12]],
        appear_time: [[[0, 23]]],
        habitat: Habitat.river,
        size: 2,
        price: 160,
    },
    {
        name: "황어",
        living_months: [[1, 12]],
        appear_time: [[[16, 9]]],
        habitat: Habitat.river,
        size: 3,
        price: 240,
    },
    {
        name: "잉어",
        living_months: [[1, 12]],
        appear_time: [[[0, 23]]],
        habitat: Habitat.pond,
        size: 4,
        price: 300,
    },
    {
        name: "비단잉어",
        living_months: [[1, 12]],
        appear_time: [[[16, 9]]],
        habitat: Habitat.pond,
        size: 4,
        price: 4000,
    },
    {
        name: "금붕어",
        living_months: [[1, 12]],
        appear_time: [[[0, 23]]],
        habitat: Habitat.pond,
        size: 1,
        price: 1300,
    },
    {
        name: "툭눈금붕어",
        living_months: [[1, 12]],
        appear_time: [[[9, 16]]],
        habitat: Habitat.pond,
        size: 1,
        price: 1300,
    },
    {
        name: "난주",
        living_months: [[1, 12]],
        appear_time: [[[9, 16]]],
        habitat: Habitat.pond,
        size: 1,
        price: 4500,
    },
    {
        name: "송사리",
        living_months: [[4, 8]],
        appear_time: [[[0, 23]]],
        habitat: Habitat.pond,
        size: 1,
        price: 300,
    },
    {
        name: "가재",
        living_months: [[4, 9]],
        appear_time: [[[0, 23]]],
        habitat: Habitat.pond,
        size: 2,
        price: 200,
    },
    {
        name: "자라",
        living_months: [[8, 9]],
        appear_time: [[[16, 9]]],
        habitat: Habitat.river,
        size: 3,
        price: 3750,
    },
    {
        name: "늑대거북",
        living_months: [[4, 10]],
        appear_time: [[[21, 4]]],
        habitat: Habitat.river,
        size: 3,
        price: 5000,
    },
    {
        name: "올챙이",
        living_months: [[3, 7]],
        appear_time: [[[0, 23]]],
        habitat: Habitat.pond,
        size: 1,
        price: 100,
    },
    {
        name: "개구리",
        living_months: [[5, 8]],
        appear_time: [[[0, 23]]],
        habitat: Habitat.pond,
        size: 2,
        price: 120,
    },
    {
        name: "동사리",
        living_months: [[1, 12]],
        appear_time: [[[16, 9]]],
        habitat: Habitat.river,
        size: 2,
        price: 400,
    },
    {
        name: "미꾸라지",
        living_months: [[3, 5]],
        appear_time: [[[0, 23]]],
        habitat: Habitat.river,
        size: 2,
        price: 400,
    },
    {
        name: "메기",
        living_months: [[5, 10]],
        appear_time: [[[16, 9]]],
        habitat: Habitat.pond,
        size: 4,
        price: 800,
    },
    {
        name: "가물치",
        living_months: [[6, 8]],
        appear_time: [[[9, 16]]],
        habitat: Habitat.pond,
        size: 5,
        price: 5500,
    },
    {
        name: "블루길",
        living_months: [[1, 12]],
        appear_time: [[[9, 16]]],
        habitat: Habitat.river,
        size: 2,
        price: 180,
    },
    {
        name: "옐로우퍼치",
        living_months: [[10, 3]],
        appear_time: [[[0, 23]]],
        habitat: Habitat.pond,
        size: 3,
        price: 300,
    },
    {
        name: "큰입배스",
        living_months: [[1, 12]],
        appear_time: [[[0, 23]]],
        habitat: Habitat.river,
        size: 4,
        price: 320,
    },
    {
        name: "틸라피아",
        living_months: [[6, 10]],
        appear_time: [[[0, 23]]],
        habitat: Habitat.river,
        size: 5,
        price: 800,
    },
    {
        name: "강꼬치고기",
        living_months: [[9, 12]],
        appear_time: [[[4, 21]]],
        habitat: Habitat.river,
        size: 5,
        price: 1800,
    },
    {
        name: "빙어",
        living_months: [[12, 2]],
        appear_time: [[[0, 23]]],
        habitat: Habitat.river,
        size: 2,
        price: 400,
    },
    {
        name: "은어",
        living_months: [[7, 9]],
        appear_time: [[[0, 23]]],
        habitat: Habitat.river,
        size: 3,
        price: 900,
    },
    {
        name: "산천어",
        living_months: [[3, 6], [9, 11]],
        appear_time: [[[16, 21]], [[4, 21]]],
        habitat: Habitat.waterfall,
        size: 4,
        price: 1000,
    },
    {
        name: "열목어",
        living_months: [[3, 6], [9, 11]],
        appear_time: [[[16, 9]], [[4, 21]]],
        habitat: Habitat.waterfall,
        size: 2,
        price: 3800,
    },
    {
        name: "금송어",
        living_months: [[3, 5], [9, 11]],
        appear_time: [[[16, 9]], [[4, 21]]],
        habitat: Habitat.waterfall,
        size: 3,
        price: 15000,
    },
    {
        name: "일본연어",
        living_months: [[3, 12]],
        appear_time: [[[16, 9]]],
        habitat: Habitat.waterfall,
        size: 6,
        price: 15000,
    },
    {
        name: "연어",
        living_months: [[9, 9]],
        appear_time: [[[0, 23]]],
        habitat: Habitat.rivermouth,
        size: 4,
        price: 700,
    },
    {
        name: "왕연어",
        living_months: [[9, 9]],
        appear_time: [[[0, 23]]],
        habitat: Habitat.rivermouth,
        size: 6,
        price: 1800,
    },
    {
        name: "참게",
        living_months: [[9, 11]],
        appear_time: [[[16, 9]]],
        habitat: Habitat.river,
        size: 2,
        price: 2000,
    },
    {
        name: "구피",
        living_months: [[4, 11]],
        appear_time: [[[9, 16]]],
        habitat: Habitat.river,
        size: 1,
        price: 1300,
    },
    {
        name: "닥터피시",
        living_months: [[5, 9]],
        appear_time: [[[9, 17]]],
        habitat: Habitat.river,
        size: 2,
        price: 1500,
    },
    {
        name: "천사어",
        living_months: [[5, 10]],
        appear_time: [[[16, 9]]],
        habitat: Habitat.river,
        size: 2,
        price: 3000,
    },
    {
        name: "베타",
        living_months: [[5, 10]],
        appear_time: [[[9, 16]]],
        habitat: Habitat.river,
        size: 1,
        price: 2500,
    },
    {
        name: "네온테트라",
        living_months: [[4, 11]],
        appear_time: [[[9, 16]]],
        habitat: Habitat.river,
        size: 1,
        price: 500,
    },
    {
        name: "레인보우피쉬",
        living_months: [[5, 10]],
        appear_time: [[[9, 16]]],
        habitat: Habitat.river,
        size: 1,
        price: 800,
    },
    {
        name: "피라니아",
        living_months: [[6, 9]],
        appear_time: [[[9, 16], [21, 4]]],
        habitat: Habitat.river,
        size: 1,
        price: 2500,
    },
];

export default data;