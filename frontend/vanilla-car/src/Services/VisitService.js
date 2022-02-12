import axios from "axios";
import AuthenticateHeader from "./AuthenticateHeader";

// const API_URL = "http://localhost:5000/api/Visit";
// const API_URL_2 = "http://localhost:5000/api/VisitNotRegistered";
const API_URL = "https://157.245.22.110:8888/api/Visit";
const API_URL_2 = "https://157.245.22.110:8888/api/VisitNotRegistered";

class VisitService {
    getPublicContent() {
        return axios.get(API_URL);
    }

    addVisitNotRegistered(
        VisitNotRegisteredDateTime,
        UserEmail,
        UserTelephone,
        VisitTypeId,
        MechanicId
    ) {
        return axios.post(
            API_URL_2,
            {
                VisitNotRegisteredDateTime,
                UserEmail,
                UserTelephone,
                VisitTypeId,
                MechanicId,
            },
            {headers: AuthenticateHeader()}
        );
    }

    getVisitFromCodeNotRegistered(code) {
        return axios.get(API_URL_2 + "/code/" + code, {
            headers: AuthenticateHeader(),
        });
    }

    getVisitNotRegistered() {
        return axios.get(API_URL_2, {
            headers: AuthenticateHeader(),
        });
    }

    getVisitForMechanicNotRegistered(UserId) {
        return axios.get(API_URL_2 + "/allvisit/" + UserId, {
            headers: AuthenticateHeader(),
        });
    }

    deleteVisitNotRegistered(VisitId) {
        return axios.delete(API_URL_2 + "/" + VisitId, {
            headers: AuthenticateHeader(),
        });
    }

    UpdateVisitNotRegistered(
        VisitId,
        visitNotRegisteredDateTime,
        VisitTypeId,
        MechanicId
    ) {
        return axios.put(
            API_URL_2 + "/" + VisitId,
            {visitNotRegisteredDateTime, MechanicId, VisitTypeId},
            {headers: AuthenticateHeader()}
        );
    }

    visitpaymentNotRegistered(VisitId, PaymentCost) {
        return axios.put(
            API_URL_2 + "/visitpaymentcost/" + VisitId,
            {PaymentCost},
            {headers: AuthenticateHeader()}
        );
    }

    visitpaymentupdateNotRegistered(VisitId, PaymentCost) {
        return axios.put(
            API_URL_2 + "/visitpaymentcostupdate/" + VisitId,
            {PaymentCost},
            {headers: AuthenticateHeader()}
        );
    }

    isdoneNotRegistered(VisitId) {
        return axios.put(
            API_URL_2 + "/isdone/" + VisitId,
            {},
            {headers: AuthenticateHeader()}
        );
    }

    AddVisitLogNotRegistered(VisitId, visitNotRegisteredLog) {
        return axios.put(
            API_URL_2 + "/addvisitlog/" + VisitId,
            {visitNotRegisteredLog},
            {headers: AuthenticateHeader()}
        );
    }

    RemoveVisitLogNotRegistered(VisitId) {
        return axios.put(
            API_URL_2 + "/removevisitlog/" + VisitId,
            {},
            {headers: AuthenticateHeader()}
        );
    }

    getVisitFromCode(code) {
        return axios.get(API_URL + "/code/" + code, {
            headers: AuthenticateHeader(),
        });
    }

    getVisitForUser(UserId) {
        return axios.get(API_URL + "/user/" + UserId, {
            headers: AuthenticateHeader(),
        });
    }

    getNotPayedVisits(UserId) {
        return axios.get(API_URL + "/notpayed/" + UserId, {
            headers: AuthenticateHeader(),
        });
    }

    getVisitForMechanic(UserId) {
        return axios.get(API_URL + "/allvisit/" + UserId, {
            headers: AuthenticateHeader(),
        });
    }

    getVisitForPropsUser(UserId) {
        return axios.get(API_URL + "/user/" + UserId, {
            headers: AuthenticateHeader(),
        });
    }

    addVisit(VisitDateTime, VisitTypeId, CarId, MechanicId) {
        return axios.post(
            API_URL,
            {VisitDateTime, VisitTypeId, CarId, MechanicId},
            {headers: AuthenticateHeader()}
        );
    }

    deleteVisit(VisitId) {
        return axios.delete(API_URL + "/" + VisitId, {
            headers: AuthenticateHeader(),
        });
    }

    UpdateVisit(VisitId, VisitDateTime, VisitTypeId, CarId, MechanicId) {
        return axios.put(
            API_URL + "/" + VisitId,
            {VisitDateTime, VisitTypeId, CarId, MechanicId},
            {headers: AuthenticateHeader()}
        );
    }

    addVisitMechanic(UserId, VisitDateTime, VisitTypeId, CarId, MechanicId) {
        return axios.post(
            API_URL + "/newvisitmechanic",
            {
                VisitDateTime,
                VisitTypeId,
                CarId,
                UserId,
                MechanicId,
            },
            {headers: AuthenticateHeader()}
        );
    }

    addPickup(
        VisitId,
        PickupDateTime,
        PickupCity,
        PickupStreet,
        PickupPostalCode
    ) {
        return axios.put(
            API_URL + "/addpickup/" + VisitId,
            {PickupDateTime, PickupCity, PickupStreet, PickupPostalCode},
            {headers: AuthenticateHeader()}
        );
    }

    addDelivery(VisitId, DeliveryCity, DeliveryStreet, DeliveryPostalCode) {
        return axios.put(
            API_URL + "/adddelivery/" + VisitId,
            {DeliveryCity, DeliveryStreet, DeliveryPostalCode},
            {headers: AuthenticateHeader()}
        );
    }

    UpdatePickup(
        VisitId,
        PickupDateTime,
        PickupCity,
        PickupStreet,
        PickupPostalCode
    ) {
        return axios.put(
            API_URL + "/updatepickup/" + VisitId,
            {PickupDateTime, PickupCity, PickupStreet, PickupPostalCode},
            {headers: AuthenticateHeader()}
        );
    }

    deletePickup(VisitId) {
        return axios.put(
            API_URL + "/deletepickup/" + VisitId,
            {},
            {headers: AuthenticateHeader()}
        );
    }

    isdone(VisitId) {
        return axios.put(
            API_URL + "/isdone/" + VisitId,
            {},
            {headers: AuthenticateHeader()}
        );
    }

    AddVisitLog(VisitId, VisitLog) {
        return axios.put(
            API_URL + "/addvisitlog/" + VisitId,
            {VisitLog},
            {headers: AuthenticateHeader()}
        );
    }

    RemoveVisitLog(VisitId) {
        return axios.put(
            API_URL + "/removevisitlog/" + VisitId,
            {},
            {headers: AuthenticateHeader()}
        );
    }

    deleteDelivery(VisitId) {
        return axios.put(
            API_URL + "/deletedelivery/" + VisitId,
            {},
            {headers: AuthenticateHeader()}
        );
    }

    deleteDateTime(VisitId) {
        return axios.put(
            API_URL + "/deletedeliverydatetime/" + VisitId,
            {},
            {headers: AuthenticateHeader()}
        );
    }

    visitpay(VisitId) {
        return axios.put(
            API_URL + "/visitpay/" + VisitId,
            {},
            {headers: AuthenticateHeader()}
        );
    }

    visitchoosepay(VisitId, PaymentTypeId) {
        return axios.put(
            API_URL + "/visitchoosepay/" + VisitId,
            {PaymentTypeId},
            {headers: AuthenticateHeader()}
        );
    }

    visitpayment(VisitId, PaymentCost) {
        return axios.put(
            API_URL + "/visitpaymentcost/" + VisitId,
            {PaymentCost},
            {headers: AuthenticateHeader()}
        );
    }

    visitpaymentupdate(VisitId, PaymentCost) {
        return axios.put(
            API_URL + "/visitpaymentcostupdate/" + VisitId,
            {PaymentCost},
            {headers: AuthenticateHeader()}
        );
    }

    AddDeliveryDateTime(VisitId, DeliveryDateTime) {
        return axios.put(
            API_URL + "/deliveryadddatetime/" + VisitId,
            {DeliveryDateTime},
            {headers: AuthenticateHeader()}
        );
    }

    UpdateDelivery(VisitId, DeliveryCity, DeliveryStreet, DeliveryPostalCode) {
        return axios.put(
            API_URL + "/updatedelivery/" + VisitId,
            {DeliveryCity, DeliveryStreet, DeliveryPostalCode},
            {headers: AuthenticateHeader()}
        );
    }
}

export default new VisitService();
