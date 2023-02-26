import { Notify } from 'notiflix';
import debounce from 'lodash.debounce';

export default {
  debounce,

  error(msg, timeout = 1500) {
    Notify.failure(msg, { timeout });
  },

  info(msg, timeout = 1500) {
    Notify.info(msg, { timeout });
  },
};
