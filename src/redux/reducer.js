import {
    SAVE_STUDENT_ID
} from "./types";

const initialState = {
    studentId : '',
};

const appReducer = (state = initialState, action) => {

  switch (action.type) {
    case SAVE_STUDENT_ID: {
      return { ...state, studentId: action.id };
    }
    default:
      return state;
  }
};

export default appReducer;