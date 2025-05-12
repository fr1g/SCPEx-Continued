import { applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { configureStore } from '@reduxjs/toolkit'
import { slices as s } from './ReduceHelper';
import rootSaga from './Saga';


const saga = createSagaMiddleware();

const store = configureStore(
    {
        reducer: {
            internal: s.internal.reducer,
            warehouseOperations: s.warehouseOperations.reducer
        },
        middleware: (getDefaultMiddleware) => {
            return getDefaultMiddleware().concat(saga);
        }
    }
);

saga.run(rootSaga);

export default store;