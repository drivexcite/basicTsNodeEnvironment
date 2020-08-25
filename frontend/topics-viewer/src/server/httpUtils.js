import axios from 'axios';

export async function getTopics(skip, top) {
    var result = await axios.get(`http://localhost:9090/topics?skip=${skip}&top=${top}`);

    if (result.status === 200)
        return result.data;

    return { topics: [], pagination: { count: 0, skip: 0, top: 0 } };
}