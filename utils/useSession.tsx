import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';

const useSession = () => {
    const selector =  useSelector((state: RootState) => state.persistedUserReducer.user);
    return selector
};

export default useSession;
