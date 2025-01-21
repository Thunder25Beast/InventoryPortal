import axios from 'axios'

export const FetchUserData = async (accessid) => {
    const response = await axios.post(`https://sso.tech-iitb.org/project/getuserdata`, { "id" : accessid })
    return response.data
}