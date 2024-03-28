import { configureStore } from "@reduxjs/toolkit";
import portsReducer from './reducers/portsSlice';
import vehiclesReducer from './reducers/vehiclesSlice';

export const store = configureStore({
    reducer: {
        ports: portsReducer,
        vehicles: vehiclesReducer
    }
});
