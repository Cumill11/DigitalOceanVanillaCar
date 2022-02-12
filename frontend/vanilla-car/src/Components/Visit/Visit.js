import React, {Component} from "react";
import {Link, Redirect} from "react-router-dom";
import {Accordion, Button, Col, Container, ListGroup, ListGroupItem, Row,} from "react-bootstrap";
import AuthenticateService from "../../Services/AuthenticateService";
import Events from "../../Other/Events";
import VisitService from "../../Services/VisitService";
import AccordionBody from "react-bootstrap/AccordionBody";

import {AddVisit} from "./AddVisit";
import {UpdateVisit} from "./UpdateVisit";
import {AddPickup} from "./Pickup/AddPickup";
import {UpdatePickup} from "./Pickup/UpdatePickup";
import {AddDelivery} from "./Delivery/AddDelivery";
import {UpdateDelivery} from "./Delivery/UpdateDelivery";
import {ChosePayment} from "./Payment/ChosePayment";
import QRCode from "qrcode.react";
import {UserManual} from "../Manual/UserManual";

export default class Visit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: null,
            userReady: false,
            currentUser: {},
            visit: [
                {
                    visitDateTime: "",
                    isDelivery: "",
                    visitTypeId: "",
                    visitCode: "",
                    user: {
                        userName: "",
                        userSurname: "",
                        userEmail: "",
                        userTelehpone: "",
                        clientAddress: {
                            clientCity: "",
                            clientStreet: "",
                            clientPostalCode: "",
                        },
                    },
                    car: {
                        carName: {
                            carNameId: "",
                            carNameManufacturer: "",
                            carNameModel: "",
                        },
                        carProduction: {
                            carProductionId: "",
                            carProductionYear: "",
                        },
                        carVin: "",
                        carPlates: "",
                        fuelTypeId: "",
                    },
                    delivery: {
                        deliveryCity: "",
                        deliveryStreet: "",
                        deliveryPostalCode: "",
                    },
                    pickup: {
                        pickupDateTime: "",
                        pickupCity: "",
                        pickupStreet: "",
                        pickupPostalCode: "",
                    },
                    payment: {
                        paymentCost: "",
                        paymentTypeId: "",
                        isPayed: false,
                    },
                },
            ],
            getMechanics: [],
            VisitAddShow: false,
            VisitUpdateShow: false,
            PickupAddShow: false,
            PickupUpdateShow: false,
            DeliveryAddShow: false,
            DeliveryUpdateShow: false,
            VisitPayShow: false,
            ManualShow: false
        };
    }

    componentDidMount() {
        const currentUser = AuthenticateService.getCurrentUser();

        if (!currentUser) this.setState({redirect: "/login"});
        this.setState({currentUser: currentUser, userReady: true});
        if (currentUser === null) {
            this.setState({redirect: "/login"});
        } else {
            AuthenticateService.getUser(currentUser.id).then(
                (response) => {
                    if (response === undefined) {
                        Events.dispatch("logout");
                        this.props.history.push("/");
                        window.location.reload();
                    } else {
                        this.setState({
                            getUserById: response.data,
                        });
                    }
                },

                (error) => {
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();
                    if (error.response.status === 401) {
                        Events.dispatch("logout");
                    }
                }
            );
        }
        if (currentUser === null) {
            Events.dispatch("logout");
        } else {
            if (
                currentUser.roleid === 4 ||
                currentUser.roleid === 2 ||
                currentUser.roleid === 3
            )
                this.setState({redirect: "/profile"});
            VisitService.getVisitForUser(currentUser.id).then(
                (response) => {
                    if (response === undefined) {
                        Events.dispatch("logout");
                        this.props.history.push("/");
                        window.location.reload();
                    } else {
                        this.setState({
                            visit: response.data,
                        });
                    }
                    this.setState({
                        visit: this.state.visit.sort(function (a, b) {
                            return a.visitId - b.visitId;
                        }),
                    });
                },
                (error) => {
                    this.setState({
                        content:
                            (error.response &&
                                error.response.data &&
                                error.response.data.message) ||
                            error.message ||
                            error.toString(),
                    });

                    if (error.response && error.response.status === 401) {
                        Events.dispatch("logout");
                    }
                }
            );
            AuthenticateService.getMechanics().then(
                (response) => {
                    if (response === undefined) {
                        Events.dispatch("logout");
                        this.props.history.push("/");
                        window.location.reload();
                    } else {
                        this.setState({
                            getMechanics: response.data,
                        });
                    }
                },

                (error) => {
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();
                    if (error.response.status === 401) {
                        Events.dispatch("logout");
                    }
                }
            );
        }
    }

    deletevisit(visitId) {
        if (window.confirm("Jesteś pewny?")) {
            VisitService.deleteVisit(visitId).then(
                () => {
                    window.location.reload();
                },
                (error) => {
                }
            );
        }
    }

    deletepickup(visitId) {
        if (window.confirm("Jesteś pewny?")) {
            VisitService.deletePickup(visitId).then(
                () => {
                    window.location.reload();
                },
                (error) => {
                }
            );
        }
    }

    deletedelivery(visitId) {
        if (window.confirm("Jesteś pewny?")) {
            VisitService.deleteDelivery(visitId).then(
                () => {
                    window.location.reload();
                },
                (error) => {
                }
            );
        }
    }

    payment(visitId) {
        if (window.confirm("Dziękujemy za wpłatę :)")) {
            VisitService.visitpay(visitId).then(
                () => {
                    window.location.reload();
                },
                (error) => {
                }
            );
        }
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect}/>;
        }

        const {
            visit,
            visitid,
            visitdatetime,
            visittypeid,
            carid,
            carmanufacturer,
            carmodel,
            carplates,
            pickupdatetime,
            pickupcity,
            pickupstreet,
            pickuppostalcode,
            deliverycity,
            deliverystreet,
            deliverypostalcode,
            clientcity,
            clientstreet,
            clientpostalcode,
            getMechanics,
            mechanicid,
            carnameid
        } = this.state;

        let ManualClose = () => this.setState({ManualShow: false});
        let VisitAddClose = () => this.setState({VisitAddShow: false});
        let VisitUpdateClose = () => this.setState({VisitUpdateShow: false});
        let PickupAddClose = () => this.setState({PickupAddShow: false});
        let PickupUpdateClose = () => this.setState({PickupUpdateShow: false});
        let DeliveryAddClose = () => this.setState({DeliveryAddShow: false});
        let DeliveryUpdateClose = () =>
            this.setState({DeliveryUpdateShow: false});
        let VisitPayClose = () => this.setState({VisitPayShow: false});
        const downloadQR = () => {
            const canvas = document.getElementById("123456");
            const pngUrl = canvas
                .toDataURL("image/png")
                .replace("image/png", "image/octet-stream");
            let downloadLink = document.createElement("a");
            downloadLink.href = pngUrl;
            downloadLink.download = "VanillaCar.png";
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        };

        return (
            <div className="container">
                {this.state.userReady ? (
                    <div>
                        <header className="jumbotron">
                            <Button
                                className="mt-2 mb-2"
                                variant="primary"
                                onClick={() =>
                                    this.setState({
                                        VisitAddShow: true,
                                    })
                                }
                            >
                                Nowa wizyta
                            </Button>

                            <Button
                                className="mt-2 mb-2 ms-2"
                                variant="primary"
                                onClick={() =>
                                    this.setState({
                                        ManualShow: true,
                                    })
                                }
                            >
                                Instrukcja
                            </Button>
                            <AddVisit show={this.state.VisitAddShow} onHide={VisitAddClose}/>
                            <UserManual show={this.state.ManualShow} onHide={ManualClose}/>

                            <div className="d-flex mb-4">
                                <hr className="my-auto flex-grow-1"></hr>
                                <div className="px-4">
                                    <h3>Bieżące wizyty</h3>
                                </div>
                                <hr className="my-auto flex-grow-1"></hr>
                            </div>

                            {visit.map((visit) => (
                                <ListGroup>
                                    {visit.isDone === false ? (
                                        <div>
                                            <Container>
                                                <Row>
                                                    <Col>
                                                        <Accordion>
                                                            <Accordion.Item eventKey="0">
                                                                <Accordion.Header>
                                                                    {visit.visitDateTime
                                                                        .replace("T", "")
                                                                        .substr("", "10")}
                                                                </Accordion.Header>
                                                                <AccordionBody>
                                                                    <QRCode
                                                                        hidden
                                                                        id="123456"
                                                                        value={
                                                                            "https://157.245.22.110/code?code=" +
                                                                            visit.visitCode
                                                                        }
                                                                        size={290}
                                                                        level={"H"}
                                                                        includeMargin={true}
                                                                    />

                                                                    <ListGroup key={visit.visitId}>
                                                                        <ListGroupItem>
                                                                            <strong>Właściciel</strong>
                                                                        </ListGroupItem>
                                                                        <ListGroupItem>
                                                                            Imię: {visit.user.userName}
                                                                        </ListGroupItem>
                                                                        <ListGroupItem>
                                                                            Nazwisko: {visit.user.userSurname}
                                                                        </ListGroupItem>
                                                                        <ListGroupItem>
                                                                            <strong>Wizyta</strong>
                                                                        </ListGroupItem>
                                                                        {getMechanics.map((getMechanics) => (
                                                                            <>
                                                                                {visit.mechanicId === getMechanics.userId ? (
                                                                                    <ListGroupItem>
                                                                                        Imię i nazwisko mechanika:{" "}
                                                                                        {getMechanics.userName}{" "}
                                                                                        {getMechanics.userSurname.slice(0, getMechanics.userSurname.length - (getMechanics.userSurname.length - 1)) + "..."}

                                                                                    </ListGroupItem>) : (<></>)}
                                                                            </>
                                                                        ))}
                                                                        <ListGroupItem>
                                                                            Kod wizyty: {visit.visitCode}
                                                                        </ListGroupItem>
                                                                        <ListGroupItem>
                                                                            informacje o wizycie:{" "}
                                                                            {visit.visitLog === null ? (
                                                                                <div>
                                                                                    Jeszcze nie dodano opisu wizyty
                                                                                </div>
                                                                            ) : (
                                                                                <div>{visit.visitLog}</div>
                                                                            )}
                                                                        </ListGroupItem>
                                                                        <ListGroupItem>
                                                                            Termin wizyty:{" "}
                                                                            {visit.visitDateTime
                                                                                .replace("T", " ")
                                                                                .substr("", "16")}
                                                                        </ListGroupItem>
                                                                        <ListGroupItem>
                                                                            Typ wizyty:{" "}
                                                                            {visit.visitTypeId === 1 ? (
                                                                                <div>Naprawa mechaniczna</div>
                                                                            ) : visit.visitTypeId === 2 ? (
                                                                                <div>Naprawa elektryczna</div>
                                                                            ) : visit.visitTypeId === 3 ? (
                                                                                <div>Naprawa kompleksowa</div>
                                                                            ) : visit.visitTypeId === 4 ? (
                                                                                <div>Naprawa powypadkowa</div>
                                                                            ) : visit.visitTypeId === 5 ? (
                                                                                <div>Naprawa inne</div>
                                                                            ) : visit.visitTypeId === 6 ? (
                                                                                <div>Konsulatacja</div>
                                                                            ) : visit.visitTypeId === 7 ? (
                                                                                <div>Przegląd</div>
                                                                            ) : visit.visitTypeId === 8 ? (
                                                                                <div>Wymiana opon</div>
                                                                            ) : visit.visitTypeId === 9 ? (
                                                                                <div>Nie wiem</div>
                                                                            ) : visit.visitTypeId === 10 ? (
                                                                                <div>Inne</div>
                                                                            ) : (
                                                                                <div></div>
                                                                            )}
                                                                        </ListGroupItem>
                                                                        <ListGroupItem>
                                                                            <strong>Samochód</strong>
                                                                        </ListGroupItem>
                                                                        <ListGroupItem>
                                                                            Marka samochodu:{" "}
                                                                            {visit.car.carName.carNameManufacturer}
                                                                        </ListGroupItem>
                                                                        <ListGroupItem>
                                                                            Model samochodu:{" "}
                                                                            {visit.car.carName.carNameModel}
                                                                        </ListGroupItem>
                                                                        <ListGroupItem>
                                                                            Numer rejestracyjny: {visit.car.carPlates}
                                                                        </ListGroupItem>
                                                                        {visit.pickup !== null ? (
                                                                            <div>
                                                                                {" "}
                                                                                <ListGroupItem>
                                                                                    <strong>Adres odbioru</strong>
                                                                                </ListGroupItem>
                                                                                <ListGroupItem>
                                                                                    Data odbioru:{" "}
                                                                                    {visit.pickup.pickupDateTime
                                                                                        .replace("T", " ")
                                                                                        .substr("", "16")}
                                                                                </ListGroupItem>
                                                                                <ListGroupItem>
                                                                                    Miasto: {visit.pickup.pickupCity}
                                                                                </ListGroupItem>
                                                                                <ListGroupItem>
                                                                                    Ulica: {visit.pickup.pickupStreet}
                                                                                </ListGroupItem>
                                                                                <ListGroupItem>
                                                                                    Kod pocztowy:{" "}
                                                                                    {visit.pickup.pickupPostalCode}
                                                                                </ListGroupItem>
                                                                            </div>
                                                                        ) : (
                                                                            <div></div>
                                                                        )}

                                                                        {visit.delivery !== null ? (
                                                                            <div>
                                                                                {" "}
                                                                                <ListGroupItem>
                                                                                    <strong>Adres dostawy</strong>
                                                                                </ListGroupItem>
                                                                                <ListGroupItem>
                                                                                    Data dostawy:{" "}
                                                                                    {visit.delivery.deliveryDateTime ==
                                                                                    null ? (
                                                                                        <div>Wkrótce zostanie
                                                                                            podana</div>
                                                                                    ) : (
                                                                                        <div>
                                                                                            {visit.delivery.deliveryDateTime
                                                                                                .replace("T", " ")
                                                                                                .substr("", "16")}
                                                                                        </div>
                                                                                    )}
                                                                                </ListGroupItem>
                                                                                <ListGroupItem>
                                                                                    Miasto: {visit.delivery.deliveryCity}
                                                                                </ListGroupItem>
                                                                                <ListGroupItem>
                                                                                    Ulica: {visit.delivery.deliveryStreet}
                                                                                </ListGroupItem>
                                                                                <ListGroupItem>
                                                                                    Kod pocztowy:{" "}
                                                                                    {visit.delivery.deliveryPostalCode}
                                                                                </ListGroupItem>{" "}
                                                                            </div>
                                                                        ) : (
                                                                            <></>
                                                                        )}
                                                                        {visit.payment !== null ? (
                                                                            <div>
                                                                                {" "}
                                                                                <ListGroupItem>
                                                                                    <strong>Koszt</strong>
                                                                                </ListGroupItem>
                                                                                <ListGroupItem>
                                                                                    Koszt naprawy:{" "}
                                                                                    {visit.payment.paymentCost}
                                                                                </ListGroupItem>
                                                                                <ListGroupItem>
                                                                                    Metoda płatności:{" "}
                                                                                    {visit.payment.paymentTypeId === 4 ? (
                                                                                        <div>Gotówka</div>
                                                                                    ) : visit.payment.paymentTypeId ===
                                                                                    3 ? (
                                                                                        <div>Karta</div>
                                                                                    ) : visit.payment.paymentTypeId ===
                                                                                    2 ? (
                                                                                        <div>Blik</div>
                                                                                    ) : visit.payment.paymentTypeId ===
                                                                                    1 ? (
                                                                                        <div>Inne</div>
                                                                                    ) : (
                                                                                        <div>Nie wybrano</div>
                                                                                    )}
                                                                                </ListGroupItem>
                                                                                <ListGroupItem>
                                                                                    Zapłacono?{" "}
                                                                                    {visit.payment.isPayed === true ? (
                                                                                        <div>tak</div>
                                                                                    ) : (
                                                                                        <div>
                                                                                            nie<br></br>
                                                                                            {visit.payment.paymentTypeId ===
                                                                                            null ? (
                                                                                                <div></div>
                                                                                            ) : (
                                                                                                <div></div>
                                                                                            )}
                                                                                        </div>
                                                                                    )}
                                                                                </ListGroupItem>
                                                                            </div>
                                                                        ) : (
                                                                            <div></div>
                                                                        )}
                                                                        <ListGroupItem>
                                                                            <Container>
                                                                                <Row>
                                                                                    {visit.payment !== null ? (<></>) : (
                                                                                        <Col>
                                                                                            {" "}
                                                                                            <div
                                                                                                className="d-grid gap-2">
                                                                                                {" "}
                                                                                                <Button
                                                                                                    className="mr-2"
                                                                                                    variant="secondary"
                                                                                                    onClick={() => {
                                                                                                        this.setState({
                                                                                                            VisitUpdateShow: true,
                                                                                                            visitid: visit.visitId,
                                                                                                            visitdatetime:
                                                                                                            visit.visitDateTime,
                                                                                                            visittypeid:
                                                                                                            visit.visitTypeId,
                                                                                                            carid: visit.car.carId,
                                                                                                            carnameid: visit.car.carName.carNameId,
                                                                                                            carmanufacturer: visit.car.carName.carNameManufacturer,
                                                                                                            carmodel: visit.car.carName.carNameModel,
                                                                                                            carplates: visit.car.carPlates,
                                                                                                            mechanicid: visit.mechanicId,
                                                                                                        })
                                                                                                    }}
                                                                                                >
                                                                                                    Edytuj wizytę
                                                                                                </Button>
                                                                                                <UpdateVisit
                                                                                                    show={
                                                                                                        this.state.VisitUpdateShow
                                                                                                    }
                                                                                                    onHide={VisitUpdateClose}
                                                                                                    visitid={visitid}
                                                                                                    visitdatetime={visitdatetime}
                                                                                                    visittypeid={visittypeid}
                                                                                                    carid={carid}
                                                                                                    carnameid={carnameid}
                                                                                                    carmanufacturer={carmanufacturer}
                                                                                                    carmodel={carmodel}
                                                                                                    carplates={carplates}
                                                                                                    mechanicid={mechanicid}
                                                                                                />
                                                                                                <Button
                                                                                                    className="mr-2"
                                                                                                    variant="danger"
                                                                                                    onClick={() =>
                                                                                                        this.deletevisit(
                                                                                                            visit.visitId
                                                                                                        )
                                                                                                    }
                                                                                                >
                                                                                                    Odwołaj wizytę
                                                                                                </Button>
                                                                                            </div>
                                                                                        </Col>)}


                                                                                    <Col>
                                                                                        {visit.pickup === null ? (
                                                                                            <div
                                                                                                className="d-grid gap-2">
                                                                                                <Button
                                                                                                    className="mr-2"
                                                                                                    variant="primary"
                                                                                                    onClick={() => {
                                                                                                        if (
                                                                                                            visit.user
                                                                                                                .clientAddress === null
                                                                                                        ) {
                                                                                                            this.setState({
                                                                                                                PickupAddShow: true,
                                                                                                                visitid: visit.visitId,
                                                                                                                visitdatetime:
                                                                                                                visit.visitDateTime,
                                                                                                            });
                                                                                                        } else {
                                                                                                            this.setState({
                                                                                                                PickupAddShow: true,
                                                                                                                visitid: visit.visitId,
                                                                                                                visitdatetime:
                                                                                                                visit.visitDateTime,
                                                                                                                clientcity:
                                                                                                                visit.user
                                                                                                                    .clientAddress
                                                                                                                    .clientCity,
                                                                                                                clientstreet:
                                                                                                                visit.user
                                                                                                                    .clientAddress
                                                                                                                    .clientStreet,
                                                                                                                clientpostalcode:
                                                                                                                visit.user
                                                                                                                    .clientAddress
                                                                                                                    .clientPostalCode,
                                                                                                            });
                                                                                                        }
                                                                                                    }}
                                                                                                >
                                                                                                    Dodaj odbiór
                                                                                                </Button>
                                                                                                <AddPickup
                                                                                                    show={
                                                                                                        this.state.PickupAddShow
                                                                                                    }
                                                                                                    onHide={PickupAddClose}
                                                                                                    visitid={visitid}
                                                                                                    visitdatetime={visitdatetime}
                                                                                                    clientcity={clientcity}
                                                                                                    clientstreet={clientstreet}
                                                                                                    clientpostalcode={
                                                                                                        clientpostalcode
                                                                                                    }
                                                                                                />
                                                                                            </div>
                                                                                        ) : (
                                                                                            <div
                                                                                                className="d-grid gap-2">
                                                                                                {" "}
                                                                                                <Button
                                                                                                    className="mr-2"
                                                                                                    variant="secondary"
                                                                                                    onClick={() =>
                                                                                                        this.setState({
                                                                                                            PickupUpdateShow: true,
                                                                                                            visitid: visit.visitId,
                                                                                                            pickupdatetime:
                                                                                                            visit.visitDateTime,
                                                                                                            pickupcity:
                                                                                                            visit.pickup.pickupCity,
                                                                                                            pickupstreet:
                                                                                                            visit.pickup
                                                                                                                .pickupStreet,
                                                                                                            pickuppostalcode:
                                                                                                            visit.pickup
                                                                                                                .pickupPostalCode,
                                                                                                        })
                                                                                                    }
                                                                                                >
                                                                                                    Edytuj odbiór
                                                                                                </Button>{" "}
                                                                                                <UpdatePickup
                                                                                                    show={
                                                                                                        this.state.PickupUpdateShow
                                                                                                    }
                                                                                                    onHide={PickupUpdateClose}
                                                                                                    visitid={visitid}
                                                                                                    pickupdatetime={
                                                                                                        pickupdatetime
                                                                                                    }
                                                                                                    pickupcity={pickupcity}
                                                                                                    pickupstreet={pickupstreet}
                                                                                                    pickuppostalcode={
                                                                                                        pickuppostalcode
                                                                                                    }
                                                                                                />
                                                                                                <Button
                                                                                                    className="mr-2"
                                                                                                    variant="danger"
                                                                                                    onClick={() =>
                                                                                                        this.deletepickup(
                                                                                                            visit.visitId
                                                                                                        )
                                                                                                    }
                                                                                                >
                                                                                                    Odwołaj odbiór
                                                                                                </Button>{" "}
                                                                                            </div>
                                                                                        )}
                                                                                    </Col>
                                                                                    <Col>
                                                                                        {visit.delivery === null ? (
                                                                                            <div
                                                                                                className="d-grid gap-2">
                                                                                                <Button
                                                                                                    className="mr-2"
                                                                                                    variant="primary"
                                                                                                    onClick={() => {
                                                                                                        if (
                                                                                                            visit.user
                                                                                                                .clientAddress === null
                                                                                                        ) {
                                                                                                            this.setState({
                                                                                                                DeliveryAddShow: true,
                                                                                                                visitid: visit.visitId,
                                                                                                            });
                                                                                                        } else {
                                                                                                            this.setState({
                                                                                                                DeliveryAddShow: true,
                                                                                                                visitid: visit.visitId,
                                                                                                                clientcity:
                                                                                                                visit.user
                                                                                                                    .clientAddress
                                                                                                                    .clientCity,
                                                                                                                clientstreet:
                                                                                                                visit.user
                                                                                                                    .clientAddress
                                                                                                                    .clientStreet,
                                                                                                                clientpostalcode:
                                                                                                                visit.user
                                                                                                                    .clientAddress
                                                                                                                    .clientPostalCode,
                                                                                                            });
                                                                                                        }
                                                                                                    }}
                                                                                                >
                                                                                                    Dodaj dostawę
                                                                                                </Button>
                                                                                                <AddDelivery
                                                                                                    show={
                                                                                                        this.state.DeliveryAddShow
                                                                                                    }
                                                                                                    onHide={DeliveryAddClose}
                                                                                                    visitid={visitid}
                                                                                                    clientcity={clientcity}
                                                                                                    clientstreet={clientstreet}
                                                                                                    clientpostalcode={
                                                                                                        clientpostalcode
                                                                                                    }
                                                                                                />
                                                                                            </div>
                                                                                        ) : (
                                                                                            <div
                                                                                                className="d-grid gap-2">
                                                                                                <Button
                                                                                                    className="mr-2"
                                                                                                    variant="secondary"
                                                                                                    onClick={() =>
                                                                                                        this.setState({
                                                                                                            DeliveryUpdateShow: true,
                                                                                                            visitid: visit.visitId,
                                                                                                            deliverycity:
                                                                                                            visit.delivery
                                                                                                                .deliveryCity,
                                                                                                            deliverystreet:
                                                                                                            visit.delivery
                                                                                                                .deliveryStreet,
                                                                                                            deliverypostalcode:
                                                                                                            visit.delivery
                                                                                                                .deliveryPostalCode,
                                                                                                        })
                                                                                                    }
                                                                                                >
                                                                                                    Edytuj dostawę
                                                                                                </Button>
                                                                                                <div></div>

                                                                                                <Button
                                                                                                    className="mr-2"
                                                                                                    variant="danger"
                                                                                                    onClick={() =>
                                                                                                        this.deletedelivery(
                                                                                                            visit.visitId
                                                                                                        )
                                                                                                    }
                                                                                                >
                                                                                                    Odwołaj dostawę
                                                                                                </Button>
                                                                                                <UpdateDelivery
                                                                                                    show={
                                                                                                        this.state
                                                                                                            .DeliveryUpdateShow
                                                                                                    }
                                                                                                    onHide={DeliveryUpdateClose}
                                                                                                    visitid={visitid}
                                                                                                    deliverycity={deliverycity}
                                                                                                    deliverystreet={
                                                                                                        deliverystreet
                                                                                                    }
                                                                                                    deliverypostalcode={
                                                                                                        deliverypostalcode
                                                                                                    }
                                                                                                />
                                                                                            </div>
                                                                                        )}
                                                                                    </Col>

                                                                                    {visit.payment === null ? (
                                                                                        <div></div>
                                                                                    ) : (
                                                                                        <>
                                                                                            {" "}
                                                                                            {visit.payment.isPayed ===
                                                                                            true ? (
                                                                                                <div></div>
                                                                                            ) : (
                                                                                                <Col>
                                                                                                    {" "}
                                                                                                    <div
                                                                                                        className="d-grid gap-2">
                                                                                                        {" "}
                                                                                                        <Button
                                                                                                            className="mr-2"
                                                                                                            variant="secondary"
                                                                                                            onClick={() =>
                                                                                                                this.setState({
                                                                                                                    VisitPayShow: true,
                                                                                                                    visitid:
                                                                                                                    visit.visitId,
                                                                                                                })
                                                                                                            }
                                                                                                        >
                                                                                                            Edytuj
                                                                                                            metodę
                                                                                                            płatności
                                                                                                        </Button>
                                                                                                        <ChosePayment
                                                                                                            show={
                                                                                                                this.state.VisitPayShow
                                                                                                            }
                                                                                                            onHide={VisitPayClose}
                                                                                                            visitid={visitid}
                                                                                                        />
                                                                                                        {visit.payment
                                                                                                            .paymentTypeId ===
                                                                                                        null ? (
                                                                                                            <div></div>
                                                                                                        ) : (
                                                                                                            <Button
                                                                                                                className="mr-2"
                                                                                                                variant="success"
                                                                                                                onClick={() =>
                                                                                                                    this.payment(
                                                                                                                        visit.visitId
                                                                                                                    )
                                                                                                                }
                                                                                                            >
                                                                                                                Zapłać
                                                                                                            </Button>
                                                                                                        )}
                                                                                                    </div>
                                                                                                </Col>
                                                                                            )}
                                                                                        </>
                                                                                    )}
                                                                                </Row>
                                                                            </Container>
                                                                        </ListGroupItem>
                                                                    </ListGroup>
                                                                </AccordionBody>
                                                            </Accordion.Item>
                                                        </Accordion>
                                                    </Col>
                                                    <Col xs lg="2">
                                                        <div className="d-grid gap-2">
                                                            <Link
                                                                to={"/code?code=" + visit.visitCode}
                                                                className="btn btn-primary text-center"
                                                            >
                                                                Podsumowanie
                                                            </Link>
                                                            <QRCode
                                                                className="ms-5 mb-3 mt-3"
                                                                id="123456"
                                                                value={
                                                                    "https://157.245.22.110/code?code=" +
                                                                    visit.visitCode
                                                                }
                                                                size={100}
                                                                level={"H"}
                                                                onClick={downloadQR}
                                                            />
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Container>
                                        </div>
                                    ) : (
                                        <div></div>
                                    )}
                                </ListGroup>
                            ))}

                            <div className="d-flex mb-4">
                                <hr className="my-auto flex-grow-1"></hr>
                                <div className="px-4">
                                    <h3>Historia wizyt</h3>
                                </div>
                                <hr className="my-auto flex-grow-1"></hr>
                            </div>
                        </header>
                        {visit.map((visit) => (
                            <ListGroup>
                                {visit.isDone === true ? (
                                    <div>
                                        <Container>
                                            <Row>
                                                <Col>
                                                    {" "}
                                                    <Accordion>
                                                        <Accordion.Item eventKey="0">
                                                            <Accordion.Header>
                                                                {visit.visitDateTime
                                                                    .replace("T", "")
                                                                    .substr("", "10")}
                                                            </Accordion.Header>
                                                            <AccordionBody>
                                                                <ListGroup key={visit.visitId}>
                                                                    <ListGroupItem>
                                                                        <strong>Właściciel</strong>
                                                                    </ListGroupItem>
                                                                    <ListGroupItem>
                                                                        Imię: {visit.user.userName}
                                                                    </ListGroupItem>
                                                                    <ListGroupItem>
                                                                        Nazwisko: {visit.user.userSurname}
                                                                    </ListGroupItem>
                                                                    <ListGroupItem>
                                                                        <strong>Wizyta</strong>
                                                                    </ListGroupItem>
                                                                    {getMechanics.map((getMechanics) => (
                                                                        <ListGroupItem>
                                                                            Imię i nazwisko mechanika:{" "}
                                                                            {getMechanics.userName}{" "}
                                                                            {getMechanics.userSurname.slice(0, getMechanics.userSurname.length - (getMechanics.userSurname.length - 1)) + "..."}

                                                                        </ListGroupItem>
                                                                    ))}
                                                                    <ListGroupItem>
                                                                        Kod wizyty: {visit.visitCode}
                                                                    </ListGroupItem>
                                                                    <ListGroupItem>
                                                                        informacje o wizycie:{" "}
                                                                        {visit.visitLog === null ? (
                                                                            <div>Jeszcze nie dodano opisu wizyty</div>
                                                                        ) : (
                                                                            <div>{visit.visitLog}</div>
                                                                        )}
                                                                    </ListGroupItem>

                                                                    <ListGroupItem>
                                                                        Termin wizyty:{" "}
                                                                        {visit.visitDateTime
                                                                            .replace("T", " ")
                                                                            .substr("", "16")}
                                                                    </ListGroupItem>
                                                                    <ListGroupItem>
                                                                        Typ wizyty:{" "}
                                                                        {visit.visitTypeId === 1 ? (
                                                                            <div>Naprawa mechaniczna</div>
                                                                        ) : visit.visitTypeId === 2 ? (
                                                                            <div>Naprawa elektryczna</div>
                                                                        ) : visit.visitTypeId === 3 ? (
                                                                            <div>Naprawa kompleksowa</div>
                                                                        ) : visit.visitTypeId === 4 ? (
                                                                            <div>Naprawa powypadkowa</div>
                                                                        ) : visit.visitTypeId === 5 ? (
                                                                            <div>Naprawa inne</div>
                                                                        ) : visit.visitTypeId === 6 ? (
                                                                            <div>Konsulatacja</div>
                                                                        ) : visit.visitTypeId === 7 ? (
                                                                            <div>Przegląd</div>
                                                                        ) : visit.visitTypeId === 8 ? (
                                                                            <div>Wymiana opon</div>
                                                                        ) : visit.visitTypeId === 9 ? (
                                                                            <div>Nie wiem</div>
                                                                        ) : visit.visitTypeId === 10 ? (
                                                                            <div>Inne</div>
                                                                        ) : (
                                                                            <div></div>
                                                                        )}
                                                                    </ListGroupItem>
                                                                    <ListGroupItem>
                                                                        <strong>Samochód</strong>
                                                                    </ListGroupItem>
                                                                    <ListGroupItem>
                                                                        Marka samochodu:{" "}
                                                                        {visit.car.carName.carNameManufacturer}
                                                                    </ListGroupItem>
                                                                    <ListGroupItem>
                                                                        Model samochodu:{" "}
                                                                        {visit.car.carName.carNameModel}
                                                                    </ListGroupItem>
                                                                    <ListGroupItem>
                                                                        Numer rejestracyjny: {visit.car.carPlates}
                                                                    </ListGroupItem>
                                                                    {visit.pickup !== null ? (
                                                                        <div>
                                                                            {" "}
                                                                            <ListGroupItem>
                                                                                <strong>Adres odbioru</strong>
                                                                            </ListGroupItem>
                                                                            <ListGroupItem>
                                                                                Data odbioru:{" "}
                                                                                {visit.pickup.pickupDateTime
                                                                                    .replace("T", " ")
                                                                                    .substr("", "16")}
                                                                            </ListGroupItem>
                                                                            <ListGroupItem>
                                                                                Miasto: {visit.pickup.pickupCity}
                                                                            </ListGroupItem>
                                                                            <ListGroupItem>
                                                                                Ulica: {visit.pickup.pickupStreet}
                                                                            </ListGroupItem>
                                                                            <ListGroupItem>
                                                                                Kod pocztowy:{" "}
                                                                                {visit.pickup.pickupPostalCode}
                                                                            </ListGroupItem>
                                                                        </div>
                                                                    ) : (
                                                                        <div></div>
                                                                    )}
                                                                    {visit.delivery !== null ? (
                                                                        <div>
                                                                            {" "}
                                                                            <ListGroupItem>
                                                                                <strong>Adres dostawy</strong>
                                                                            </ListGroupItem>
                                                                            <ListGroupItem>
                                                                                Miasto: {visit.delivery.deliveryCity}
                                                                            </ListGroupItem>
                                                                            <ListGroupItem>
                                                                                Ulica: {visit.delivery.deliveryStreet}
                                                                            </ListGroupItem>
                                                                            <ListGroupItem>
                                                                                Kod pocztowy:{" "}
                                                                                {visit.delivery.deliveryPostalCode}
                                                                            </ListGroupItem>
                                                                        </div>
                                                                    ) : (
                                                                        <div></div>
                                                                    )}
                                                                    {visit.payment !== null ? (
                                                                        <div>
                                                                            {" "}
                                                                            <ListGroupItem>
                                                                                <strong>Koszt</strong>
                                                                            </ListGroupItem>
                                                                            <ListGroupItem>
                                                                                Koszt naprawy:{" "}
                                                                                {visit.payment.paymentCost}
                                                                            </ListGroupItem>
                                                                            <ListGroupItem>
                                                                                Metoda płatności:{" "}
                                                                                {visit.payment.paymentTypeId === 4 ? (
                                                                                    <div>Gotówka</div>
                                                                                ) : visit.payment.paymentTypeId ===
                                                                                3 ? (
                                                                                    <div>Karta</div>
                                                                                ) : visit.payment.paymentTypeId ===
                                                                                2 ? (
                                                                                    <div>Blik</div>
                                                                                ) : visit.payment.paymentTypeId ===
                                                                                1 ? (
                                                                                    <div>Inne</div>
                                                                                ) : (
                                                                                    <div></div>
                                                                                )}
                                                                            </ListGroupItem>
                                                                            <ListGroupItem>
                                                                                Zapłacono?{" "}
                                                                                {visit.payment.isPayed === true ? (
                                                                                    <div>tak</div>
                                                                                ) : (
                                                                                    <div>nie</div>
                                                                                )}
                                                                            </ListGroupItem>
                                                                        </div>
                                                                    ) : (
                                                                        <div></div>
                                                                    )}
                                                                </ListGroup>
                                                            </AccordionBody>
                                                        </Accordion.Item>
                                                    </Accordion>
                                                </Col>
                                                <Col xs lg="2">
                                                    <div className="d-grid gap-2">
                                                        <Link
                                                            to={"/code?code=" + visit.visitCode}
                                                            className="btn btn-primary text-center"
                                                        >
                                                            Podsumowanie
                                                        </Link>
                                                        <QRCode
                                                            className="ms-5 mb-3 mt-3"
                                                            id="123456"
                                                            value={
                                                                "https://157.245.22.110/code?code=" +
                                                                visit.visitCode
                                                            }
                                                            size={100}
                                                            level={"H"}
                                                            onClick={downloadQR}
                                                        />
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Container>
                                    </div>
                                ) : (
                                    <div></div>
                                )}
                            </ListGroup>
                        ))}
                    </div>
                ) : null}
            </div>
        );
    }
}
