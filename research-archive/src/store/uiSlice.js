const OPEN_PROFILE = 'ui/openProfile';
const CLOSE_PROFILE = 'ui/closeProfile';

const initialState = {
  profileOpen: false,
};

export const openProfile = () => ({
  type: OPEN_PROFILE,
});

export const closeProfile = () => ({
  type: CLOSE_PROFILE,
});

export default function uiReducer(state = initialState, action) {
  switch (action.type) {
    case OPEN_PROFILE:
      return { ...state, profileOpen: true };
    case CLOSE_PROFILE:
      return { ...state, profileOpen: false };
    default:
      return state;
  }
}
