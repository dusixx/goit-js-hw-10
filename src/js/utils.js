import { Notify } from 'notiflix';
import debounce from 'lodash.debounce';

export default {
  debounce,

  error(msg, timeout = 1500) {
    Notify.failure(msg, { timeout, showOnlyTheLastOne: true });
  },

  info(msg, timeout = 1500) {
    Notify.info(msg, { timeout, showOnlyTheLastOne: true });
  },
};
