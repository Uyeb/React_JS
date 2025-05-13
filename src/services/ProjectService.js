import axios from "./axios";

const fetchAllProject = () => {
    return axios.get("/api/v1/Project")
}

export { fetchAllProject };