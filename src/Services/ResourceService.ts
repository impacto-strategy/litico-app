import APIClient from "./ApiService";

const ResourceService = {
    async index(payload: { resourceName: string, params?: any }) {
        return await APIClient.get(`/api/${payload.resourceName}`, {params: payload.params})
    },
    async get(payload: { resourceName: string, resourceID: number, params?: any }) {
        return await APIClient.get(`/api/${payload.resourceName}/${payload.resourceID}`, {params: payload.params})
    },
    async fields(payload: { resourceName: string }) {
        return await APIClient.get(`/api/fields/${payload.resourceName}`)
    },
    async store(payload: { resourceName: string, fields: any }) {
        return await APIClient.post(`/api/${payload.resourceName}`, {fields: payload.fields})
    },
    async update(payload: { resourceName: string, resourceID: number, fields: any }) {
        return await APIClient.put(`/api/${payload.resourceName}/${payload.resourceID}`, {...payload.fields})
    },
};

export default ResourceService
