export interface CurriculumDisciplineAddRequest {
  curriculumId: number;
  disciplineId: number;
  semester: number;
  totalHours: number;
  lectureHours: number;
  practiceHours: number;
  labHours: number;
  selfStudyHours: number;
  testCount: number;
  hasCredit: boolean;
  hasExam: boolean;
  creditUnits: number;
}
