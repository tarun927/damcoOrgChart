export interface Employee {
    index: number;
    name: string;
    designation: string;
    imageBase64: string;
    managerIndex?: number;
    level?: number;
}
