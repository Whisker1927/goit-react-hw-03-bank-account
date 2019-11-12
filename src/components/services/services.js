import Swal from 'sweetalert2';

const save = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    Swal.fire('ERROR');
  }
};

const get = key => {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (error) {
    return null;
  }
};

export default {
  get,
  save,
};
