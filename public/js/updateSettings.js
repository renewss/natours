import axios from 'axios';
import { showAlert } from './alert';

// type is either password or data
export const updateSettings = async (data, type) => {
    try {
        const url =
            type === 'data'
                ? 'http://127.0.0.1:3000/api/v1/users/updateMe'
                : 'http://127.0.0.1:3000/api/v1/users/updateMyPassword';
        const res = await axios({
            method: 'PATCH',
            url,
            data
        });

        if (res.data.status === 'success') {
            console.log(res.data.status);
            showAlert(res.data.status, 'Updated successfully');
            setTimeout(() => {
                location.reload();
            }, 800);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};
