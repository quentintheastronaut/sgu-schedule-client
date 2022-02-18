import axiosClient from "./axiosClient";

const profileAPI = {
    getProfileById: (id)=>{
        const url = `/profile?id=${id}`
        return axiosClient.get(url)
    }
}

export default profileAPI;