import { Location } from 'expo';
import firebase from 'firebase';
import 'firebase/firestore';
// import { ThunkAction as Thunk } from 'redux-thunk';
import { State as AppState } from './modules/app';
import { State as UserState } from './modules/user';
import { State as GPSState } from './modules/gps';
import { State as PostState } from './modules/post';
import { State as CafeState } from './modules/cafe';

export type Timestamp = firebase.firestore.Timestamp;
export type FieldValue = firebase.firestore.FieldValue;
export type Time =
  | { seconds: number; nanoseconds: number }
  | Timestamp
  | FieldValue
  | any;

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface PostOption {
  filter: 'cafeId' | 'city' | 'countryCode' | 'all';
  filterValue?: string;
  limit: number;
}

// Collection: users
export interface User {
  docId: string;
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  isConnected: boolean;
  lastAccessTime?: Timestamp;
  geoPoint?: GeoPoint;

  // favorite cafe info
  cafeId?: string;
  cafeName?: string;
  cafeCity?: string;
  cafeCountryCode?: string;

  // local
  favoriteCafe?: Cafe;
}

// Collection: cafes
export interface Cafe {
  docId?: string;
  id: string;
  name: string;
  phoneNumber: string;
  city: string;
  countryCode: string;
  addressLines: string[];
  geoPoint: GeoPoint;
}

// Collection: posts
export interface Post {
  docId?: string;
  // user
  uid: string;
  displayName: string;
  email: string | null;
  photoURL: string | null;

  // cafe
  cafeId: string;
  cafeName: string;
  cafeGeoPoint: GeoPoint;
  city: string;
  countryCode: string;

  // post
  columns: string;
  images?: [{ id: string; url: string; ref: string }];

  // timestamp
  createdAt: Time;
  updatedAt?: Time;
}

// Collection rooms
export interface Room {
  fId: string; // first Coffee?
  tId: string;
  from: User;
  to: User;
}

// Collection rooms > room > messages
export interface Message {
  from: string; // userId
  content: string;
}

// gps
export type Location = Location.LocationData
// {
//   coords: {
//     accuracy: number;
//     altitude: number;
//     altitudeAccuracy: number;
//     heading: number;
//     latitude: number;
//     longitude: number;
//     speed: number;
//   };
//   timestamp: number;
// };

// ACTION TYPES
//-------------------------------------------------------------------- user
export interface LOGGED_IN {
  type: 'LOGGED_IN';
  user: User;
}

export interface UPDATE_USER_CONNECTED {
  type: 'UPDATE_USER_CONNECTED';
  isConnected: boolean;
}

export interface UPDATE_USER_GEO_POINT {
  type: 'UPDATE_USER_GEO_POINT';
  geoPoint: GeoPoint;
}

export interface UPDATE_USER_FAVORITE_CAFE {
  type: 'UPDATE_USER_FAVORITE_CAFE';
  cafe: Cafe;
}
//-------------------------------------------------------------------- gps
export interface SET_GPS {
  type: 'SET_GPS';
  location: Location;
}
//-------------------------------------------------------------------- feed
export interface CREATE_POST {
  type: 'CREATE_POST';
  post: Post;
}
export interface SET_POSTS {
  type: 'SET_POSTS';
  posts: [Post];
}
//-------------------------------------------------------------------- cafe
export interface SELECT_CAFE {
  type: 'SELECT_CAFE';
  cafe: Cafe;
}

export type Action =
  | { type: 'LOADING' }
  | { type: 'LOADED' }
  | LOGGED_IN
  | { type: 'LOGGED_OUT' }
  | UPDATE_USER_CONNECTED
  | UPDATE_USER_GEO_POINT
  | UPDATE_USER_FAVORITE_CAFE
  | SET_GPS
  | CREATE_POST
  | SET_POSTS
  | SELECT_CAFE;

export interface Store {
  app: AppState;
  user: UserState;
  gps: GPSState;
  post: PostState;
  cafe: CafeState;
}
export type PromiseAction = Promise<Action>;
// export type ThunkAction = Thunk;
export type Dispatch = (
  action: Action | any | PromiseAction | Array<Action>,
  getState: any
) => any;
