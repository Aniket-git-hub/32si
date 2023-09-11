import { useContext } from 'react';
import { AllDataContext } from '../context/AllDataContext';

export const useAllData = () => {
    return useContext(AllDataContext);
}