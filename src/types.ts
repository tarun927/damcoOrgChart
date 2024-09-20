// types.ts

export interface Employee {
    index?: number;
    name: string;
    designation: string;
    imageBase64: string;
    manager?: string;
    level?: number;
  }