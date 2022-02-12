import axios from "axios";
import AuthenticateHeader from "./AuthenticateHeader";

// const API_URL = "http://localhost:5000/api/Car";
// const API_URL_2 = "http://localhost:5000/api/CarProduction"
// const API_URL_3 = "http://localhost:5000/api/CarName"
const API_URL = "https://157.245.22.110:8888/api/Car";
const API_URL_2 = "https://157.245.22.110:8888/api/CarProduction"
const API_URL_3 = "https://157.245.22.110:8888/api/CarName"


class CarService {
    getPublicContent() {
        return axios.get(API_URL);
    }

    getProductionYear() {
        return axios.get(API_URL_2, {headers: AuthenticateHeader()});
    }

    getName() {
        return axios.get(API_URL_3 + "/manufacturer", {headers: AuthenticateHeader()});
    }

    getNameModel() {
        return axios.get(API_URL_3, {headers: AuthenticateHeader()});
    }

    getNameModelCar(name) {
        return axios.get(API_URL_3 + "/" + name, {headers: AuthenticateHeader()});
    }

    getCars() {
        return axios.get(API_URL, {headers: AuthenticateHeader()});
    }

    getCar(UserId) {
        return axios.get(API_URL + "/" + UserId, {headers: AuthenticateHeader()});
    }

    deleteCar(CarId) {
        return axios.delete(API_URL + "/" + CarId, {
            headers: AuthenticateHeader(),
        });
    }

    updateCar(
        CarId,
        carNameId,
        carProductionId,
        FuelTypeId,
        CarVin,
        CarPlates
    ) {
        return axios.put(
            API_URL + "/" + CarId,
            {carNameId, carProductionId, FuelTypeId, CarVin, CarPlates},
            {headers: AuthenticateHeader()}
        );
    }

    addCar(carNameId, carProductionId, FuelTypeId, CarVin, CarPlates) {
        return axios.post(
            API_URL,
            {carNameId, carProductionId, FuelTypeId, CarVin, CarPlates},
            {headers: AuthenticateHeader()}
        );
    }

    addCarMechanic(
        carNameId,
        carProductionId,
        FuelTypeId,
        CarVin,
        CarPlates,
        UserEmail
    ) {
        return axios.post(
            API_URL + "/newcarmechanic",
            {

                carNameId,
                carProductionId,
                FuelTypeId,
                CarVin,
                CarPlates,
                UserEmail,
            },
            {headers: AuthenticateHeader()}
        );
    }
}

export default new CarService();
