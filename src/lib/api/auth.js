import axios from 'axios';

export async function login(loginData) {
    const res = { success: false, identity: 'visitor', msg: '' };
    try {
        const { account, password, identity } = loginData;
        const response = await axios.post(`${import.meta.env.VITE_API_DOMAIN}/auth/login`, { account, password, identity });

        const { success, token, identity: identityValue } = response.data
        if (success) {
            res.success = true;
            res.identity = identityValue;
            localStorage.setItem('liveApp', JSON.stringify({ token, identity: identityValue }));
        }
    } catch (error) {
        console.log(error);
        const { msg } = error.response.data;
        res.msg = msg;
    }
    return res;
}

export async function logout(tokenValue) {
    const res = { success: false, msg: '' };
    try {
        const response = await axios.delete(`${import.meta.env.VITE_API_DOMAIN}/auth/logout`, { 
            headers: {
                'Authorization': `bear ${tokenValue}`
            } 
        });

        const { success } = response.data;
        if (success) {
            res.success = true;
            localStorage.removeItem('liveApp');
        }
    } catch (error) {
        console.log(error);
        const { msg } = error.response.data;
        res.msg = msg;
    }
    return res;
}

// 檢查是否存在登入token資料
export function hasLogin() {
    const data = localStorage.getItem('liveApp');
    if (!data) {
        return false;
    }
    const { token } = JSON.parse(data);

    if (token) {
        return true;
    } else {
        return false;
    }
}