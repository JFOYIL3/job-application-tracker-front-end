export interface JobApplication {
    id: string;
    title: string;
    company: string;
    status?: string;
    location?: string;
    salaryRange?: { high_end: number; low_end: number };
    priority?: number;
    links?: string[];
  }