import { createEntityAdapter, EntityState } from "@ngrx/entity";
import { createReducer, on } from "@ngrx/store";
import * as counterActions from "../actions/counter.actions";
import { Counter } from "../models/counter";

export const adapter = createEntityAdapter<Counter>({
    selectId: (counter) => counter.index,
    sortComparer: (counterA, counterB) => counterA.index - counterB.index,
});

export interface CountersState extends EntityState<Counter> {}

export const initialState: CountersState = adapter.getInitialState();

export const reducer = createReducer(
    initialState,
    on(counterActions.loadPending, (state, action) => adapter.addOne({ index: action.index, isLoading: true }, state)),
    on(counterActions.loadCompleted, (state, action) =>
        adapter.updateOne(
            {
                id: action.index,
                changes: {
                    value: action.counter.value,
                    isLoading: false,
                },
            },
            state,
        ),
    ),
    on(counterActions.loadAllPending, (state): CountersState => state),
    on(counterActions.loadAllCompleted, (state, action) => adapter.addMany(action.counters, state)),
    on(counterActions.decrementPending, counterActions.incrementPending, (state, action) =>
        adapter.updateOne(
            {
                id: action.index,
                changes: {
                    isSaving: true,
                },
            },
            state,
        ),
    ),
    on(counterActions.decrementCompleted, counterActions.incrementCompleted, (state, action) =>
        adapter.updateOne(
            {
                id: action.index,
                changes: {
                    value: action.counter.value,
                    isSaving: false,
                },
            },
            state,
        ),
    ),
);

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors();
