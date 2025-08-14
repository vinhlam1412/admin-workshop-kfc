import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface WorkshopDate {
  id: string;
  date: string;
}

export interface WorkshopTime {
  id: string;
  idWorkShopDate: string;
  time: string;
  totalSlot: number;
  remainSlot: number;
}

export interface CustomerRegistration {
  id: string;
  parentName: string;
  childName: string;
  childAge: number;
  workShopDate: string;
  workShopTime: string;
  parentPhone: string;
  imageBill: string;
  billNumber: string;
}

interface AppState {
  isAuthenticated: boolean;
  user: { email: string } | null;
  workshopDates: WorkshopDate[];
  workshopTimes: WorkshopTime[];
  customerRegistrations: CustomerRegistration[];
}

type AppAction =
  | { type: 'LOGIN'; payload: { email: string } }
  | { type: 'LOGOUT' }
  | { type: 'ADD_WORKSHOP_DATE'; payload: WorkshopDate }
  | { type: 'UPDATE_WORKSHOP_DATE'; payload: WorkshopDate }
  | { type: 'DELETE_WORKSHOP_DATE'; payload: string }
  | { type: 'ADD_WORKSHOP_TIME'; payload: WorkshopTime }
  | { type: 'UPDATE_WORKSHOP_TIME'; payload: WorkshopTime }
  | { type: 'DELETE_WORKSHOP_TIME'; payload: string }
  | { type: 'SET_WORKSHOP_TIMES'; payload: WorkshopTime[] }
  | { type: 'UPDATE_SLOT_COUNT'; payload: { timeId: string; remainSlot: number } };

const initialState: AppState = {
  isAuthenticated: false,
  user: null,
  workshopDates: [
    { id: '1', date: '2025-08-20' },
    { id: '2', date: '2025-08-21' },
    { id: '3', date: '2025-08-22' }
  ],
  workshopTimes: [
    { id: '1', idWorkShopDate: '1', time: '09:00-10:00', totalSlot: 10, remainSlot: 9 },
    { id: '2', idWorkShopDate: '1', time: '10:00-11:00', totalSlot: 10, remainSlot: 9 },
    { id: '3', idWorkShopDate: '2', time: '14:00-15:00', totalSlot: 8, remainSlot: 7 },
    { id: '4', idWorkShopDate: '3', time: '09:00-10:00', totalSlot: 12, remainSlot: 12 }
  ],
  customerRegistrations: [
    {
      id: '1',
      parentName: 'Nguyen Van A',
      childName: 'Be An',
      childAge: 8,
      workShopDate: '2025-08-20',
      workShopTime: '09:00-10:00',
      parentPhone: '0901234567',
      imageBill: 'https://media-cdn.tripadvisor.com/media/photo-s/12/d6/34/cc/our-bill.jpg',
      billNumber: 'KFC001'
    },
    {
      id: '2',
      parentName: 'Tran Thi B',
      childName: 'Be Binh',
      childAge: 7,
      workShopDate: '2025-08-20',
      workShopTime: '10:00-11:00',
      parentPhone: '0902345678',
      imageBill: 'https://media-cdn.tripadvisor.com/media/photo-s/12/d6/34/cc/our-bill.jpg',
      billNumber: 'KFC002'
    },
    {
      id: '3',
      parentName: 'Le Van C',
      childName: 'Be Cuong',
      childAge: 9,
      workShopDate: '2025-08-21',
      workShopTime: '14:00-15:00',
      parentPhone: '0903456789',
      imageBill: 'https://media-cdn.tripadvisor.com/media/photo-s/12/d6/34/cc/our-bill.jpg',
      billNumber: 'KFC003'
    }
  ]
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        user: { email: action.payload.email }
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null
      };
    case 'ADD_WORKSHOP_DATE':
      return {
        ...state,
        workshopDates: [...state.workshopDates, action.payload]
      };
    case 'UPDATE_WORKSHOP_DATE':
      return {
        ...state,
        workshopDates: state.workshopDates.map(date =>
          date.id === action.payload.id ? action.payload : date
        )
      };
    case 'DELETE_WORKSHOP_DATE':
      return {
        ...state,
        workshopDates: state.workshopDates.filter(date => date.id !== action.payload),
        workshopTimes: state.workshopTimes.filter(time => time.idWorkShopDate !== action.payload)
      };
    case 'ADD_WORKSHOP_TIME':
      return {
        ...state,
        workshopTimes: [...state.workshopTimes, action.payload]
      };
    case 'UPDATE_WORKSHOP_TIME':
      return {
        ...state,
        workshopTimes: state.workshopTimes.map(time =>
          time.id === action.payload.id ? action.payload : time
        )
      };
    case 'DELETE_WORKSHOP_TIME':
      return {
        ...state,
        workshopTimes: state.workshopTimes.filter(time => time.id !== action.payload)
      };
    case 'SET_WORKSHOP_TIMES':
      return {
        ...state,
        workshopTimes: action.payload
      };
    case 'UPDATE_SLOT_COUNT':
      return {
        ...state,
        workshopTimes: state.workshopTimes.map(time =>
          time.id === action.payload.timeId 
            ? { ...time, remainSlot: action.payload.remainSlot }
            : time
        )
      };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppStore must be used within an AppProvider');
  }
  return context;
}