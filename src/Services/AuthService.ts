import APIClient from "./ApiService";

const AuthService = {
    async login(payload: { [key: string]: any }) {
        console.log('testing');
        await APIClient.get("/sanctum/csrf-cookie",);
        console.log('login initiated');
        return APIClient.post("/login", payload);
    },
    logout() {
        return APIClient.post("/logout");
    },
    async forgotPassword(payload: { [key: string]: any }) {
        await APIClient.get("/sanctum/csrf-cookie");
        return APIClient.post("/forgot-password", payload);
    },
    getAuthUser() {
        return APIClient.get("/api/users/auth");
    },
    async resetPassword(payload: { [key: string]: any }) {
        await APIClient.get("/sanctum/csrf-cookie");
        return APIClient.post("/reset-password", payload);
    },
    updatePassword(payload: { [key: string]: any }) {
        return APIClient.put("/user/password", payload);
    },
    async registerUser(payload: { [key: string]: any }) {
        await APIClient.get("/sanctum/csrf-cookie");
        return APIClient.post("/register", payload);
    },
    sendVerification(payload: { [key: string]: any }) {
        return APIClient.post("/email/verification-notification", payload);
    },
    updateUser(payload: { [key: string]: any }) {
        return APIClient.put("/user/profile-information", payload);
    },
};


export default AuthService