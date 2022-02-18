import axiosClient from "./axiosClient";

const scheduleAPI = {
    getScheduleById: (id)=>{
        const url = `/schedule?id=${id}`
        return axiosClient.get(url)
    }
}

export default scheduleAPI;