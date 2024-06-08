import axios from 'axios';

export async function getUnfinshTodo(page=1, limit=6) {
    const { data: result} = await axios.get(`${import.meta.env.VITE_API_DOMAIN}/todos?done=0&page=${page}&limit=${limit}`);

    const data = {
        docs: result.docs,
        totalDocs: result.totalDocs
    };

    return data;
}