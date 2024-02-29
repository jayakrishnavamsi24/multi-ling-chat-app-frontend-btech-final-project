const userAuthReducer = (state = null, action) => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.user,
      };
    case "SET_USER_NULL":
      return {
        ...state,
        user: null,
      };
    case 'UPDATE_USER_LANGUAGE':
      return {
          ...state, 
          user: { 
              ...state.user,  // Keep other user data 
              languageCode: action.payload 
          }
      }; 
    default:
      return state;
  }
};

export default userAuthReducer;
