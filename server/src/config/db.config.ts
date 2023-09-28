import { getEnvironmentVariable } from '../utils/Helper';

export default {
  mongodb_URI: getEnvironmentVariable('MONGODB_URI'),
};
