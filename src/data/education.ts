export type EducationItem = {
  school: string;
  credential: string;
  period: string;
  details?: string[];
};

export const EDUCATION: EducationItem[] = [
  {
    school: "National Institute of Technology Calicut",
    credential: "B.Tech., Electronics & Communication Engineering",
    period: "2014 – 2018",
  },
  {
    school: "Indian School Darsait",
    credential: "Class XII (PCM + CS)",
    period: "2012 – 2014",
  },
  {
    school: "Indian School Darsait",
    credential: "Class X",
    period: "2010 – 2012",
  },
];

export const EDUCATION_HEADING = "Education" as const;
