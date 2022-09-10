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
    async find(payload: { resourceName: string, column: string, value: string}) {
        return await APIClient.get(`/api/find/${payload.resourceName}`, {params:{column: payload.column, value: payload.value}})
    },
    async store(payload: { resourceName: string, fields: any }) {
        return await APIClient.post(`/api/${payload.resourceName}`, {fields: payload.fields})
    },
    async update(payload: { resourceName: string, resourceID: number, fields: any }) {
        console.log(payload.fields);
        return await APIClient.put(`/api/${payload.resourceName}/${payload.resourceID}`, {fields: payload.fields})
    },
    async delete(payload: { resourceName: string, resourceID: number}) {
        return await APIClient.delete(`/api/${payload.resourceName}/${payload.resourceID}`)
    },
};

export default ResourceService
