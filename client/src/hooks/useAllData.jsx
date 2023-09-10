import { useContext } from 'react';
import { AllDataContext } from '../context/AllDataContext';

export default function useAllData() {
    return useContext(AllDataContext);
}