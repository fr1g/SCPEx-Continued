import { applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { configureStore } from '@reduxjs/toolkit'
import { slices as s } from './ReduceHelper';
// import rootReducer from './reducers';
// import rootSaga from './sagas';

const saga = createSagaMiddleware();

export const store = configureStore(
    {
        reducer: {
            internal: s.internal.reducer,
            warehouseOperations: s.warehouseOperations.reducer
        }
    }
);

