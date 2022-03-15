/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import {applyMiddleware, combineReducers, createStore} from 'redux';
import thunk from 'redux-thunk';

import globalReducer, {IGlobalReducer} from './global/reducer';
import loginReducer, {ILoginReducer} from './login/reducer';
import conferenceReducer, {IConferenceReducer} from './conference/reducer';

export type RootReducer = {
  globalReducer: IGlobalReducer;
  loginReducer: ILoginReducer;
  conferenceReducer: IConferenceReducer;
};

export type AppDispatch = typeof store.dispatch;

const rootReducer = combineReducers({
  loginReducer,
  conferenceReducer,
  globalReducer,
});

export const store = createStore(rootReducer, applyMiddleware(thunk));
