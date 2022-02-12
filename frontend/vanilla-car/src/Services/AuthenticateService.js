import axios from "axios";
import AuthenticateHeader from "./AuthenticateHeader";

// const API_URL = "http://localhost:5000/api/Users/";

const API_URL = "https://localhost:8888/api/Users/";


class AuthenticateService {
    login(UserEmail, UserPassword) {
        return axios
            .post(API_URL + "login", {
                UserEmail,
                UserPassword,
            })
            .then((response) => {
                if (response.data.accessToken) {
                    localStorage.setItem("user", JSON.stringify(response.data));
                }

                return response.data;
            });
    }

    logout() {
        localStorage.removeItem("user");
    }

    getUser(UserId) {
        return axios.get(API_URL + UserId, {headers: AuthenticateHeader()});
    }

    getMechanics() {
        return axios.get(API_URL + "mechanic", {headers: AuthenticateHeader()});
    }

    getMechanic(id) {
        return axios.get(API_URL + "mechanic/" + id, {headers: AuthenticateHeader()});
    }

    register(
        UserEmail,
        UserPassword,
        UserConfirmPassword,
        UserName,
        UserSurname
    ) {
        return axios.post(API_URL + "register", {
            UserEmail,
            UserPassword,
            UserConfirmPassword,
            UserName,
            UserSurname,
        });
    }

    recoverconfirm(UserCode, UserEmail, UserPassword, UserConfirmPassword) {
        return axios.post(API_URL + "resetconfirm", {
            UserCode,
            UserEmail,
            UserPassword,
            UserConfirmPassword,
        });
    }

    confirmaccount(UserCode, UserEmail) {
        return axios.post(API_URL + "confirm/" + UserEmail + "/" + UserCode, {
            UserCode,
            UserEmail,
        });
    }

    recover(UserEmail) {
        return axios.post(API_URL + "reset", {UserEmail});
    }

    updateprofile(
        UserId,
        UserEmail,
        UserPassword,
        UserName,
        UserSurname,
        UserTelephone
    ) {
        return axios.put(
            API_URL + "updateuser",
            {
                UserId,
                UserEmail,
                UserPassword,
                UserName,
                UserSurname,
                UserTelephone,
            },
            {headers: AuthenticateHeader()}
        );
    }

    updatemechanic(
        UserId,
        UserEmail,
        UserPassword,
        UserName,
        UserSurname,
        UserTelephone,
        UserDescription
    ) {
        return axios.put(
            API_URL + "updateuser",
            {
                UserId,
                UserEmail,
                UserPassword,
                UserName,
                UserSurname,
                UserTelephone,
                UserDescription,
            },
            {headers: AuthenticateHeader()}
        );
    }

    updatepassword(UserId, UserOldPassword, UserPassword, UserConfirmPassword) {
        return axios.put(
            API_URL + "updatepassword",
            {UserId, UserOldPassword, UserPassword, UserConfirmPassword},
            {headers: AuthenticateHeader()}
        );
    }

    UpdateRole(UserId, RoleId) {
        return axios.put(
            API_URL + "updaterole",
            {UserId, RoleId},
            {headers: AuthenticateHeader()}
        );
    }

    deleteuser(UserId, UserPassword) {
        return axios.delete(API_URL, {
            data: {UserId, UserPassword},
            headers: {headers: AuthenticateHeader()},
        });
    }

    deleteadmin(UserId) {
        return axios.delete(API_URL + "delete/" + UserId, {
            headers: AuthenticateHeader(),
        });
    }

    getAllUsers() {
        return axios.get(API_URL, {headers: AuthenticateHeader()});
    }

    //address
    addaddress(
        UserId,
        ClientCity,
        ClientStreet,
        ClientPostalCode,

    ) {
        return axios.put(
            API_URL + "addaddress",
            {UserId, ClientCity, ClientStreet, ClientPostalCode},
            {headers: AuthenticateHeader()}
        );
    }
    updateaddress(
        UserId,
        ClientCity,
        ClientStreet,
        ClientPostalCode,

    ) {
        return axios.put(
            API_URL + "updateaddress",
            {UserId, ClientCity, ClientStreet, ClientPostalCode},
            {headers: AuthenticateHeader()}
        );
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem("user"));
    }
}

export default new AuthenticateService();
