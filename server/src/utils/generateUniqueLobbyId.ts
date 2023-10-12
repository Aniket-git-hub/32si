import { v4 as uuidv4 } from 'uuid';

const generateUniqueLobbyId = () => {
      return uuidv4();
};

export default generateUniqueLobbyId;
