import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { vehicleService } from "../services/vehiclesService";

export const mockVehicles = createAsyncThunk(
    'vehicles/create',
    async (numVehicles = 100) => vehicleService.mockVehicles(numVehicles));

export const vehiclesSlice = createSlice({
    name: 'vehicles',
    initialState: {
        data: [],
        selected: undefined,
    },
    reducers: {
        selectVehicle(state, { payload }) {
            state.selected = payload;
        },
        deselectVehicle(state) {
            state.selected = undefined
        }
    },
    extraReducers: builder => {
        builder.addCase(mockVehicles.fulfilled, (state, { payload }) => {
            state.data = state.data.concat(payload);
        });
    }
});

export const { selectVehicle, deselectVehicle } = vehiclesSlice.actions;
export default vehiclesSlice.reducer;


