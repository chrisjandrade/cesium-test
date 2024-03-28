import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { portsService } from "../services/portsService";

export const retrievePorts = createAsyncThunk(
    'ports/retrieve',
    async () => await portsService.retrievePorts());

export const mockPorts = createAsyncThunk(
    'ports/mock',
    async (numPorts) => await portsService.mockPorts(numPorts));

export const portSlice = createSlice({
    name: 'ports',
    initialState: {
        data: {},
        selected: null
    },
    reducers: {
        selectPort(state, { payload }) {
            if (Object.keys(state.data).findIndex(key => key === payload) > -1) {
                state.selected = payload;
            } else {
                console.warn('The specified port doesn\'t exist =>', payload);
            }
        },
        deselectPort(state) {
            state.selected = null;
        }
    },
    extraReducers: builder => {
        builder.addCase(retrievePorts.fulfilled, (state, { payload }) => void(state.data = payload));
        
        builder.addCase(mockPorts.fulfilled, (state, { payload }) => {
            state.data = {
                ...state.data,
                ...payload
            };
        });
    }
});

export const { selectPort, deselectPort } = portSlice.actions;
export default portSlice.reducer;
