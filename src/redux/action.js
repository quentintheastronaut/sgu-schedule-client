import { SAVE_STUDENT_ID } from "./types";

export const save_student_id = (id) => {
  return {
    type: SAVE_STUDENT_ID,
    id
  };
};
