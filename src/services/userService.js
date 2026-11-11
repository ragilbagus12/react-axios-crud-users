import axiosInstance from "./axiosInstance";

const ENDPOINT = '/collections/users/objects';

export async function getUsers() {
    const response = await axiosInstance.get(ENDPOINT);
    const objects = Array.isArray(response.data) ? response.data : [];
    return objects.filter((item) => item.data?.email); 
}

export async function getUserById(id) {
    const response = await axiosInstance.get(`${ENDPOINT}/${id}`);
    return response.data
}

export async function createUser(payload) {
    const response = await axiosInstance.post(ENDPOINT, payload);
    return response.data
}

export async function updateUser(id, payload) {
    const response = await axiosInstance.put(`${ENDPOINT}/${id}`, payload);
    return response.data
}

export async function patchUser(id, payload) {
    const response = await axiosInstance.patch(`${ENDPOINT}/${id}`, payload);
    return response.data
}

export async function deleteUser(id) {
    const response = await axiosInstance.delete(`${ENDPOINT}/${id}`);
    return response.data
}