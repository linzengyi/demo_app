import axios from 'axios';

export async function loadData(page=1,limit=4, options) {

    let queryParams = `page=${page}&limit=${limit}`;
    if (options !== undefined && 
        options.date !== undefined && 
        typeof options.date === 'string') {
            queryParams += `&date=${options.date}`; 
    }

    const { data: result} = await axios.get(`${import.meta.env.VITE_API_DOMAIN}/accounts?${queryParams}`);

    const data = {
        docs: result.docs,
        totalDocs: result.totalDocs
    };

    return data;
}

export async function createData(data) {

    const { data: result } = await axios.post(`${import.meta.env.VITE_API_DOMAIN}/accounts`, data);

    return result;
}

export async function deleteData(id) {
    const { data: result} = await axios.delete(`${import.meta.env.VITE_API_DOMAIN}/accounts/${id}`);
    return result;
}