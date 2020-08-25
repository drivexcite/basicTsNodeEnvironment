import axios from 'axios';

export async function getTopics(skip, top) {
    return await axios.get(`http://localhost:9090/topics?skip=${skip}&top=${top}`);
}