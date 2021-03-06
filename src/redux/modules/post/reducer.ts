import { Action, Post, CREATE_POST } from '../../types';

export interface State {
  filter: 'cafeId' | 'city' | 'countryCode' | 'all';
  posts: Post[];
  lastDoc: any;
}

const initialState: State = {
  filter: 'cafeId',
  posts: [],
  lastDoc: null
};

function applyCreatePost(state: State, action: CREATE_POST) {
  const { post } = action;
  return {
    ...state,
    posts: [post, ...state.posts]
  };
}

function reducer(state: State = initialState, action: Action) {
  switch (action.type) {
    case 'SET_POSTS':
      return { ...state, posts: action.posts };
    case 'CREATE_POST':
      return applyCreatePost(state, action);
    case 'CHANGE_POSTS_FILTER':
      return { ...state, filter: action.filter };
    case 'LOGGED_OUT':
      return initialState;
    default:
      return state;
  }
}

export default reducer;
