import React, {Component} from "react";
import {Link, Redirect} from "react-router-dom";
import {Accordion, Button, Col, Container, ListGroup, ListGroupItem, Row,} from "react-bootstrap";
import AuthenticateService from "../../../Services/AuthenticateService";
import Events from "../../../Other/Events";
import VisitService from "../../../Services/VisitService";
import AccordionBody from "react-bootstrap/AccordionBody";
import {UpdatePayment} from "../Payment/UpdatePayment";
import {AddDateTime} from "../Delivery/AddDateTime";
import {AddPayment} from "../Payment/AddPayment";
import {AddLog} from "./AddLog";
import {UpdateVisitMechanic} from "./UpdateVisitMechanic";
import {AddVisitMechanic} from "./AddVisitMechanic";
import {AddDelivery} from "../Delivery/AddDelivery";
import QRCode from "qrcode.react";
import {UpdateVisitNotRegistered} from "../NotRegistered/UpdateVisitNotRegistered";
import {AddLogNotRegistered} from "../NotRegistered/AddLogNotRegistered";
import {AddPaymentNotRegistered} from "../NotRegistered/AddPaymentNotRegistered";
import {UpdatePaymentNotRegistered} from "../NotRegistered/UpdatePaymentNotRegistered";
import {MechanicManual} from "../../Manual/MechanicManual";

export default class ShowAllVisitForMechanic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: null,
            userReady: false,
            currentUser: {},
            allUsers: [],
            getUserById: {},
            allcar: [],
            notregistered: [
                {
                    visitNotRegisteredId: "",
                    visitNotRegisteredDateTime: "",
                    userEmail: "",
                    userTelephone: "",
                    visitNotRegisteredLog: "",
                    isDone: false,
                    visitNotRegisteredCode: "",
                    visitTypeId: "",
                    payment: {
                        paymentCost: "",
                        paymentTypeId: "",
                        isPayed: false,
                    },
                },
            ],
            uservisit: [
                {
                    visitDateTime: "",
                    isDelivery: "",
                    visitTypeId: "",
                    visitCode: "",
                    mechanicId: "",
                    user: {
                        userId: "",
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
            UserVisitShow: false,
            PaymentUpdateShow: false,
            LogAddShow: false,
            VisitAddShow: false,
            VisitUpdateShow: false,
            DeliveryAddTimeShow: false,

            LogAddShowNotRegistered: false,
            VisitUpdateShowNotRegistered: false,
            PaymentAddShowNotRegistered: false,
            PaymentUpdateShowNotRegistered: false,
            ManualShow: false
        };
    }

    componentDidMount() {
        const currentUser = AuthenticateService.getCurrentUser();

        if (!currentUser) this.setState({redirect: "/login"});
        this.setState({currentUser: currentUser, userReady: true});
        if (currentUser === null) {
        } else {
            if (currentUser.roleid === 1 || currentUser.roleid === 4 || currentUser.roleid === 3) this.setState({redirect: "/profile"});
            AuthenticateService.getUser(currentUser.id).then(
                (response) => {
                    if (response === undefined) {
                        Events.dispatch("logout");
                        this.props.history.push("/");
                        window.location.reload();

                    } else {
                        this.setState({
                            getUserById: response.data,
                        })
                    }
                    ;
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

        AuthenticateService.getAllUsers().then(
            (response) => {
                if (response === undefined) {
                    Events.dispatch("logout");
                    this.props.history.push("/");
                    window.location.reload();

                } else {
                    this.setState({
                        allUsers: response.data,
                    })
                }
                ;
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
        if (currentUser === null) {
        } else {
            VisitService.getVisitForMechanic(currentUser.id).then(
                (response) => {
                    if (response === undefined) {
                        Events.dispatch("logout");
                        this.props.history.push("/");
                        window.location.reload();

                    } else {
                        this.setState({
                            uservisit: response.data,
                        })
                    }
                    ;
                    this.setState({
                        uservisit: this.state.uservisit.sort(function (a, b) {
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
            )
        }
        ;
        if (currentUser === null) {
        } else {
            VisitService.getVisitForMechanicNotRegistered(currentUser.id).then(
                (response) => {
                    if (response === undefined) {
                        Events.dispatch("logout");
                        this.props.history.push("/");
                        window.location.reload();

                    } else {
                        this.setState({
                            notregistered: response.data,
                        })
                    }
                    ;
                    this.setState({
                        notregistered: this.state.notregistered.sort(function (a, b) {
                            return a.visitNotRegisteredId - b.visitNotRegisteredId;
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
            )
        }
        ;
    }

    deletedatetime(visitId) {
        if (window.confirm("Jesteś pewny?")) {
            VisitService.deleteDateTime(visitId).then(
                () => {
                    window.location.reload();
                },
                (error) => {
                }
            );
        }
    }

    isdone(visitId) {
        if (window.confirm("Jesteś pewny?")) {
            VisitService.isdone(visitId).then(
                () => {
                    window.location.reload();
                },
                (error) => {
                }
            );
        }
    }

    isdoneNotRegistered(visitId) {
        if (window.confirm("Jesteś pewny?")) {
            VisitService.isdoneNotRegistered(visitId).then(
                () => {
                    window.location.reload();
                },
                (error) => {
                }
            );
        }
    }

    RemoveVisitLog(visitId) {
        if (window.confirm("Jesteś pewny?")) {
            VisitService.RemoveVisitLog(visitId).then(
                () => {
                    window.location.reload();
                },
                (error) => {
                }
            );
        }
    }

    RemoveVisitLogNotRegistered(visitId) {
        if (window.confirm("Jesteś pewny?")) {
            VisitService.RemoveVisitLogNotRegistered(visitId).then(
                () => {
                    window.location.reload();
                },
                (error) => {
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

    deletevisitNotRegistered(visitId) {
        if (window.confirm("Jesteś pewny?")) {
            VisitService.deleteVisitNotRegistered(visitId).then(
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

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect}/>;
        }

        const {
            uservisit,
            clientpostalcode,
            clientcity,
            clientstreet,
            currentUser,
            visitid,
            visitdatetime,
            paymentcost,
            visitlog,
            mechanicid,
            userid,
            visittypeid,
            carid,
            carmanufacturer,
            carmodel,
            carplates,
            notregistered,
        } = this.state;

        let ManualClose = () => this.setState({ManualShow: false});
        let DeliveryAddClose = () => this.setState({DeliveryAddShow: false});
        let PaymentAddClose = () => this.setState({PaymentAddShow: false});
        let PaymentUpdateClose = () => this.setState({PaymentUpdateShow: false});
        let LogAddClose = () => this.setState({LogAddShow: false});
        let VisitAddClose = () => this.setState({VisitAddShow: false});
        let VisitUpdateClose = () => this.setState({VisitUpdateShow: false});
        let DeliveryAddTimeClose = () =>
            this.setState({DeliveryAddTimeShow: false});
        let LogAddCloseNotRegistered = () =>
            this.setState({LogAddShowNotRegistered: false});
        let VisitUpdateCloseNotRegistered = () =>
            this.setState({VisitUpdateShowNotRegistered: false});
        let PaymentAddCloseNotRegistered = () =>
            this.setState({PaymentAddShowNotRegistered: false});
        let PaymentUpdateCloseNotRegistered = () =>
            this.setState({PaymentUpdateShowNotRegistered: false});

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
                            <AddVisitMechanic
                                show={this.state.VisitAddShow}
                                onHide={VisitAddClose}
                                mechanicid={mechanicid}
                            />
                            <MechanicManual show={this.state.ManualShow} onHide={ManualClose}/>
                        </header>
                        <Container>
                            <Row>
                                <Col>
                                    <Button
                                        className="mr-2"
                                        variant="primary"
                                        onClick={() =>
                                            this.setState({
                                                VisitAddShow: true,
                                                mechanicid: currentUser.id,
                                            })
                                        }
                                    >
                                        Nowa wizyta
                                    </Button>{" "}
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
                                </Col>
                            </Row>
                        </Container>
                        <div className="d-flex">
                            <hr className="my-auto flex-grow-1"></hr>
                            <div className="px-4">
                                <h3>Bieżące wizyty</h3>
                            </div>
                            <hr className="my-auto flex-grow-1"></hr>
                        </div>
                        {uservisit.map((uservisit) => (
                            <ListGroup>
                                {uservisit.isDone === false ? (
                                    <div>
                                        <Container>
                                            <Row>
                                                <Col>
                                                    <Accordion>
                                                        <Accordion.Item eventKey="0">
                                                            <Accordion.Header>
                                                                {uservisit.visitDateTime
                                                                    .replace("T", "")
                                                                    .substr("", "10")}
                                                            </Accordion.Header>
                                                            <AccordionBody>
                                                                <QRCode
                                                                    hidden
                                                                    id="123456"
                                                                    value={
                                                                        "https://vanillacar.me/code?code=" +
                                                                        uservisit.visitCode
                                                                    }
                                                                    size={290}
                                                                    level={"H"}
                                                                    includeMargin={true}
                                                                />
                                                                <ListGroup key={uservisit.visitId}>
                                                                    <ListGroupItem>
                                                                        <strong>Właściciel</strong>
                                                                    </ListGroupItem>
                                                                    <ListGroupItem>
                                                                        Imię: {uservisit.user.userName}
                                                                    </ListGroupItem>
                                                                    <ListGroupItem>
                                                                        Nazwisko: {uservisit.user.userSurname.slice(0, uservisit.user.userSurname.length - (uservisit.user.userSurname.length - 1)) + "..."}
                                                                    </ListGroupItem>
                                                                    <ListGroupItem>
                                                                        <strong>Wizyta</strong>
                                                                    </ListGroupItem>
                                                                    <ListGroupItem>
                                                                        Kod wizyty: {uservisit.visitCode}
                                                                    </ListGroupItem>
                                                                    <ListGroupItem>
                                                                        informacje o wizycie:{" "}
                                                                        {uservisit.visitLog === null ? (
                                                                            <div>Dodaj opis wizyty</div>
                                                                        ) : (
                                                                            <div>{uservisit.visitLog}</div>
                                                                        )}
                                                                    </ListGroupItem>
                                                                    <ListGroupItem>
                                                                        Termin wizyty:{" "}
                                                                        {uservisit.visitDateTime
                                                                            .replace("T", " ")
                                                                            .substr("", "16")}
                                                                    </ListGroupItem>
                                                                    <ListGroupItem>
                                                                        Typ wizyty:{" "}
                                                                        {uservisit.visitTypeId === 1 ? (
                                                                            <div>Naprawa mechaniczna</div>
                                                                        ) : uservisit.visitTypeId === 2 ? (
                                                                            <div>Naprawa elektryczna</div>
                                                                        ) : uservisit.visitTypeId === 3 ? (
                                                                            <div>Naprawa kompleksowa</div>
                                                                        ) : uservisit.visitTypeId === 4 ? (
                                                                            <div>Naprawa powypadkowa</div>
                                                                        ) : uservisit.visitTypeId === 5 ? (
                                                                            <div>Naprawa inne</div>
                                                                        ) : uservisit.visitTypeId === 6 ? (
                                                                            <div>Konsulatacja</div>
                                                                        ) : uservisit.visitTypeId === 7 ? (
                                                                            <div>Przegląd</div>
                                                                        ) : uservisit.visitTypeId === 8 ? (
                                                                            <div>Wymiana opon</div>
                                                                        ) : uservisit.visitTypeId === 9 ? (
                                                                            <div>Nie wiem</div>
                                                                        ) : uservisit.visitTypeId === 10 ? (
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
                                                                        {uservisit.car.carName.carNameManufacturer}
                                                                    </ListGroupItem>
                                                                    <ListGroupItem>
                                                                        Model samochodu:{" "}
                                                                        {uservisit.car.carName.carNameModel}
                                                                    </ListGroupItem>
                                                                    <ListGroupItem>
                                                                        Numer rejestracyjny:{" "}
                                                                        {uservisit.car.carPlates}
                                                                    </ListGroupItem>

                                                                    {uservisit.pickup !== null ? (
                                                                        <div>
                                                                            {" "}
                                                                            <ListGroupItem>
                                                                                <strong>Adres odbioru</strong>
                                                                            </ListGroupItem>
                                                                            <ListGroupItem>
                                                                                Data odbioru:{" "}
                                                                                {uservisit.pickup.pickupDateTime
                                                                                    .replace("T", " ")
                                                                                    .substr("", "16")}
                                                                            </ListGroupItem>
                                                                            <ListGroupItem>
                                                                                Miasto: {uservisit.pickup.pickupCity}
                                                                            </ListGroupItem>
                                                                            <ListGroupItem>
                                                                                Ulica: {uservisit.pickup.pickupStreet}
                                                                            </ListGroupItem>
                                                                            <ListGroupItem>
                                                                                Kod pocztowy:{" "}
                                                                                {uservisit.pickup.pickupPostalCode}
                                                                            </ListGroupItem>
                                                                        </div>
                                                                    ) : (
                                                                        <div></div>
                                                                    )}

                                                                    {uservisit.delivery !== null ? (
                                                                        <div>
                                                                            {" "}
                                                                            <ListGroupItem>
                                                                                <strong>Adres dostawy</strong>
                                                                            </ListGroupItem>
                                                                            <ListGroupItem>
                                                                                Data dostawy:{" "}
                                                                                {uservisit.delivery.deliveryDateTime ==
                                                                                null ? (
                                                                                    <div>Dodaj datę dostawy </div>
                                                                                ) : (
                                                                                    <div>
                                                                                        {uservisit.delivery.deliveryDateTime
                                                                                            .replace("T", " ")
                                                                                            .substr("", "16")}
                                                                                    </div>
                                                                                )}
                                                                            </ListGroupItem>
                                                                            <ListGroupItem>
                                                                                Miasto:{" "}
                                                                                {uservisit.delivery.deliveryCity}
                                                                            </ListGroupItem>
                                                                            <ListGroupItem>
                                                                                Ulica:{" "}
                                                                                {uservisit.delivery.deliveryStreet}
                                                                            </ListGroupItem>
                                                                            <ListGroupItem>
                                                                                Kod pocztowy:{" "}
                                                                                {uservisit.delivery.deliveryPostalCode}
                                                                            </ListGroupItem>
                                                                        </div>
                                                                    ) : (
                                                                        <div></div>
                                                                    )}

                                                                    {uservisit.payment !== null ? (
                                                                        <div>
                                                                            <ListGroupItem>
                                                                                <strong>Koszt</strong>
                                                                            </ListGroupItem>
                                                                            <ListGroupItem>
                                                                                Koszt naprawy:{" "}
                                                                                {uservisit.payment.paymentCost}
                                                                                <br></br>
                                                                            </ListGroupItem>
                                                                            <ListGroupItem>
                                                                                Metoda płatności:{" "}
                                                                                {uservisit.payment.paymentTypeId ===
                                                                                4 ? (
                                                                                    <div>Gotówka</div>
                                                                                ) : uservisit.payment.paymentTypeId ===
                                                                                3 ? (
                                                                                    <div>Karta</div>
                                                                                ) : uservisit.payment.paymentTypeId ===
                                                                                2 ? (
                                                                                    <div>Blik</div>
                                                                                ) : uservisit.payment.paymentTypeId ===
                                                                                1 ? (
                                                                                    <div>Inne</div>
                                                                                ) : (
                                                                                    <div>Nie wybrano</div>
                                                                                )}
                                                                            </ListGroupItem>
                                                                            <ListGroupItem>
                                                                                Zapłacono?{" "}
                                                                                {uservisit.payment.isPayed === true ? (
                                                                                    <div>tak</div>
                                                                                ) : (
                                                                                    <div>nie</div>
                                                                                )}
                                                                            </ListGroupItem>
                                                                        </div>
                                                                    ) : (
                                                                        <div></div>
                                                                    )}

                                                                    <ListGroupItem>
                                                                        <strong>Akcje</strong>
                                                                    </ListGroupItem>
                                                                    <ListGroupItem>
                                                                        <Container>
                                                                            <Row>
                                                                                {uservisit.payment !== null ? (<></>) : (
                                                                                    <Col>
                                                                                        <div className="d-grid gap-2">
                                                                                            <Button
                                                                                                className="mr-2"
                                                                                                variant="secondary"
                                                                                                onClick={() => {
                                                                                                    this.setState({
                                                                                                        VisitUpdateShow: true,
                                                                                                        visitid: uservisit.visitId,
                                                                                                        visitdatetime:
                                                                                                        uservisit.visitDateTime,
                                                                                                        visittypeid:
                                                                                                        uservisit.visitTypeId,
                                                                                                        carid: uservisit.car.carId,
                                                                                                        carmanufacturer: uservisit.car.carName.carNameManufacturer,
                                                                                                        carmodel: uservisit.car.carName.carNameModel,
                                                                                                        carplates: uservisit.car.carPlates,
                                                                                                        userid: uservisit.user.userId,
                                                                                                        mechanicid: uservisit.mechanicId
                                                                                                    });
                                                                                                }}
                                                                                            >
                                                                                                Edytuj wizytę
                                                                                            </Button>
                                                                                            <UpdateVisitMechanic
                                                                                                show={this.state.VisitUpdateShow}
                                                                                                onHide={VisitUpdateClose}
                                                                                                visitid={visitid}
                                                                                                visitdatetime={visitdatetime}
                                                                                                visittypeid={visittypeid}
                                                                                                carid={carid}
                                                                                                carmanufacturer={carmanufacturer}
                                                                                                carmodel={carmodel}
                                                                                                carplates={carplates}
                                                                                                userid={userid}
                                                                                                mechanicid={mechanicid}
                                                                                            />

                                                                                            <Button
                                                                                                className="mr-2"
                                                                                                variant="danger"
                                                                                                onClick={() =>
                                                                                                    this.deletevisit(
                                                                                                        uservisit.visitId
                                                                                                    )
                                                                                                }
                                                                                            >
                                                                                                Odwołaj wizytę
                                                                                            </Button>

                                                                                        </div>
                                                                                    </Col>)}


                                                                                <Col>
                                                                                    <div className="d-grid gap-2">
                                                                                        {uservisit.delivery === null ? (
                                                                                            <>
                                                                                                {" "}
                                                                                                <Button
                                                                                                    className="mr-2"
                                                                                                    variant="primary"
                                                                                                    onClick={() => {
                                                                                                        if (
                                                                                                            uservisit.user
                                                                                                                .clientAddress === null
                                                                                                        ) {
                                                                                                            this.setState({
                                                                                                                DeliveryAddShow: true,
                                                                                                                visitid:
                                                                                                                uservisit.visitId,
                                                                                                            });
                                                                                                        } else {
                                                                                                            this.setState({
                                                                                                                DeliveryAddShow: true,
                                                                                                                visitid:
                                                                                                                uservisit.visitId,
                                                                                                                clientcity:
                                                                                                                uservisit.user
                                                                                                                    .clientAddress
                                                                                                                    .clientCity,
                                                                                                                clientstreet:
                                                                                                                uservisit.user
                                                                                                                    .clientAddress
                                                                                                                    .clientStreet,
                                                                                                                clientpostalcode:
                                                                                                                uservisit.user
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
                                                                                            </>
                                                                                        ) : (
                                                                                            <>
                                                                                                {" "}
                                                                                                {uservisit.delivery
                                                                                                    .deliveryDateTime === null ? (
                                                                                                    <>
                                                                                                        {" "}
                                                                                                        <Button
                                                                                                            className="mr-2"
                                                                                                            variant="primary"
                                                                                                            onClick={() => {
                                                                                                                this.setState({
                                                                                                                    DeliveryAddTimeShow: true,
                                                                                                                    visitid:
                                                                                                                    uservisit.visitId,
                                                                                                                    visitdatetime:
                                                                                                                    uservisit.visitDateTime,
                                                                                                                });
                                                                                                            }}
                                                                                                        >
                                                                                                            Dodaj datę
                                                                                                            dostawy
                                                                                                        </Button>
                                                                                                        <AddDateTime
                                                                                                            show={
                                                                                                                this.state
                                                                                                                    .DeliveryAddTimeShow
                                                                                                            }
                                                                                                            onHide={
                                                                                                                DeliveryAddTimeClose
                                                                                                            }
                                                                                                            visitid={visitid}
                                                                                                            visitdatetime={
                                                                                                                visitdatetime
                                                                                                            }
                                                                                                        />
                                                                                                    </>
                                                                                                ) : (
                                                                                                    <>
                                                                                                        <Button
                                                                                                            className="mr-2"
                                                                                                            variant="secondary"
                                                                                                            onClick={() => {
                                                                                                                this.setState({
                                                                                                                    DeliveryAddShow: true,
                                                                                                                    visitid:
                                                                                                                    uservisit.visitId,
                                                                                                                    visitdatetime:
                                                                                                                    uservisit.visitDateTime,
                                                                                                                });
                                                                                                            }}
                                                                                                        >
                                                                                                            Edytuj datę
                                                                                                            dostawy
                                                                                                        </Button>
                                                                                                        <div></div>
                                                                                                        <Button
                                                                                                            className="mr-2"
                                                                                                            variant="danger"
                                                                                                            onClick={() =>
                                                                                                                this.deletedelivery(
                                                                                                                    uservisit.visitId
                                                                                                                )
                                                                                                            }
                                                                                                        >
                                                                                                            Odwołaj
                                                                                                            dostawę
                                                                                                        </Button>
                                                                                                        <AddDateTime
                                                                                                            show={
                                                                                                                this.state
                                                                                                                    .DeliveryAddShow
                                                                                                            }
                                                                                                            onHide={DeliveryAddClose}
                                                                                                            visitid={visitid}
                                                                                                            visitdatetime={
                                                                                                                visitdatetime
                                                                                                            }
                                                                                                        />
                                                                                                    </>
                                                                                                )}
                                                                                            </>
                                                                                        )}
                                                                                    </div>
                                                                                </Col>
                                                                                <Col>
                                                                                    <div className="d-grid gap-2">
                                                                                        {uservisit.visitLog === null ? (
                                                                                            <>
                                                                                                {" "}
                                                                                                <Button
                                                                                                    className="mr-2"
                                                                                                    variant="primary"
                                                                                                    onClick={() => {
                                                                                                        this.setState({
                                                                                                            LogAddShow: true,
                                                                                                            visitid:
                                                                                                            uservisit.visitId,
                                                                                                            visitlog:
                                                                                                            uservisit.visitlog,
                                                                                                        });
                                                                                                    }}
                                                                                                >
                                                                                                    Dodaj opis wizyty
                                                                                                </Button>
                                                                                                <AddLog
                                                                                                    show={this.state.LogAddShow}
                                                                                                    onHide={LogAddClose}
                                                                                                    visitid={visitid}
                                                                                                    visitlog={visitlog}
                                                                                                />
                                                                                            </>
                                                                                        ) : (
                                                                                            <>
                                                                                                <Button
                                                                                                    className="mr-2"
                                                                                                    variant="secondary"
                                                                                                    onClick={() => {
                                                                                                        this.setState({
                                                                                                            LogAddShow: true,
                                                                                                            visitid:
                                                                                                            uservisit.visitId,
                                                                                                            visitlog:
                                                                                                            uservisit.visitlog,
                                                                                                        });
                                                                                                    }}
                                                                                                >
                                                                                                    Edytuj opis wizyty
                                                                                                </Button>
                                                                                                <div></div>
                                                                                                <Button
                                                                                                    className="mr-2"
                                                                                                    variant="danger"
                                                                                                    onClick={() =>
                                                                                                        this.RemoveVisitLog(
                                                                                                            uservisit.visitId
                                                                                                        )
                                                                                                    }
                                                                                                >
                                                                                                    Usuń opis wizyty
                                                                                                </Button>
                                                                                                <AddLog
                                                                                                    show={this.state.LogAddShow}
                                                                                                    onHide={LogAddClose}
                                                                                                    visitid={visitid}
                                                                                                    visitlog={visitlog}
                                                                                                />
                                                                                            </>
                                                                                        )}
                                                                                    </div>
                                                                                </Col>
                                                                                <Col>
                                                                                    <div className="d-grid gap-2">
                                                                                        {uservisit.payment === null ? (
                                                                                            <>
                                                                                                <Button
                                                                                                    className="mr-2"
                                                                                                    variant="primary"
                                                                                                    onClick={() => {
                                                                                                        this.setState({
                                                                                                            PaymentAddShow: true,
                                                                                                            visitid:
                                                                                                            uservisit.visitId,
                                                                                                        });
                                                                                                    }}
                                                                                                >
                                                                                                    Dodaj płatność
                                                                                                </Button>
                                                                                                <AddPayment
                                                                                                    show={
                                                                                                        this.state.PaymentAddShow
                                                                                                    }
                                                                                                    onHide={PaymentAddClose}
                                                                                                    visitid={visitid}
                                                                                                />
                                                                                            </>
                                                                                        ) : (
                                                                                            <>
                                                                                                <Button
                                                                                                    className="mr-2"
                                                                                                    variant="secondary"
                                                                                                    onClick={() => {
                                                                                                        this.setState({
                                                                                                            PaymentUpdateShow: true,
                                                                                                            visitid:
                                                                                                            uservisit.visitId,
                                                                                                            paymentcost:
                                                                                                            uservisit.payment
                                                                                                                .paymentCost,
                                                                                                        });
                                                                                                    }}
                                                                                                >
                                                                                                    Edytuj koszt
                                                                                                </Button>
                                                                                                <UpdatePayment
                                                                                                    show={
                                                                                                        this.state.PaymentUpdateShow
                                                                                                    }
                                                                                                    onHide={PaymentUpdateClose}
                                                                                                    visitid={visitid}
                                                                                                    paymentcost={paymentcost}
                                                                                                />
                                                                                                {uservisit.payment.isPayed ===
                                                                                                true ? (
                                                                                                    <>
                                                                                                        <Button
                                                                                                            className="mr-2"
                                                                                                            variant="success"
                                                                                                            onClick={() =>
                                                                                                                this.isdone(
                                                                                                                    uservisit.visitId
                                                                                                                )
                                                                                                            }
                                                                                                        >
                                                                                                            Potwierdź
                                                                                                            skończenie
                                                                                                            wizyty
                                                                                                        </Button>
                                                                                                    </>
                                                                                                ) : (
                                                                                                    <div></div>
                                                                                                )}
                                                                                            </>
                                                                                        )}
                                                                                    </div>
                                                                                </Col>
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
                                                            to={"/code?code=" + uservisit.visitCode}
                                                            className="btn btn-primary text-center"
                                                        >
                                                            Podsumowanie
                                                        </Link>
                                                        <QRCode
                                                            className="ms-5 mb-3 mt-3"
                                                            id="123456"
                                                            value={
                                                                "https://vanillacar.me/code?code=" +
                                                                uservisit.visitCode
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

                        {/*/////////////////////////////////////////////////////////////////////////////////*/}

                        <div className="d-flex">
                            <hr className="my-auto flex-grow-1"></hr>
                            <div className="px-4">
                                <h3>Bieżące wizyty bez rejestracji</h3>
                            </div>
                            <hr className="my-auto flex-grow-1"></hr>
                        </div>
                        {notregistered.map((uservisit) => (
                            <ListGroup>
                                {uservisit.isDone === false ? (
                                    <div>
                                        <Container>
                                            <Row>
                                                <Col>
                                                    {" "}
                                                    <Accordion>
                                                        <Accordion.Item eventKey="0">
                                                            <Accordion.Header>
                                                                {uservisit.visitNotRegisteredDateTime
                                                                    .replace("T", "")
                                                                    .substr("", "10")}
                                                            </Accordion.Header>
                                                            <AccordionBody>
                                                                <QRCode
                                                                    hidden
                                                                    id="123456"
                                                                    value={
                                                                        "https://vanillacar.me/codenotregistered?code=" +
                                                                        uservisit.visitNotRegisteredCode
                                                                    }
                                                                    size={290}
                                                                    level={"H"}
                                                                    includeMargin={true}
                                                                />
                                                                <ListGroup key={uservisit.visitNotRegisteredId}>
                                                                    <ListGroupItem>
                                                                        <strong>Właściciel</strong>
                                                                    </ListGroupItem>
                                                                    <ListGroupItem>
                                                                        E-mail: {uservisit.userEmail}
                                                                    </ListGroupItem>
                                                                    <ListGroupItem>
                                                                        Telefon: {uservisit.userTelephone}
                                                                    </ListGroupItem>
                                                                    <ListGroupItem>
                                                                        <strong>Wizyta</strong>
                                                                    </ListGroupItem>
                                                                    <ListGroupItem>
                                                                        Kod wizyty:{" "}
                                                                        {uservisit.visitNotRegisteredCode}
                                                                    </ListGroupItem>
                                                                    <ListGroupItem>
                                                                        informacje o wizycie:{" "}
                                                                        {uservisit.visitNotRegisteredLog ===
                                                                        null ? (
                                                                            <div>Dodaj opis wizyty</div>
                                                                        ) : (
                                                                            <div>
                                                                                {uservisit.visitNotRegisteredLog}
                                                                            </div>
                                                                        )}
                                                                    </ListGroupItem>
                                                                    <ListGroupItem>
                                                                        Termin wizyty:{" "}
                                                                        {uservisit.visitNotRegisteredDateTime
                                                                            .replace("T", " ")
                                                                            .substr("", "16")}
                                                                    </ListGroupItem>
                                                                    <ListGroupItem>
                                                                        Typ wizyty:{" "}
                                                                        {uservisit.visitTypeId === 1 ? (
                                                                            <div>Naprawa mechaniczna</div>
                                                                        ) : uservisit.visitTypeId === 2 ? (
                                                                            <div>Naprawa elektryczna</div>
                                                                        ) : uservisit.visitTypeId === 3 ? (
                                                                            <div>Naprawa kompleksowa</div>
                                                                        ) : uservisit.visitTypeId === 4 ? (
                                                                            <div>Naprawa powypadkowa</div>
                                                                        ) : uservisit.visitTypeId === 5 ? (
                                                                            <div>Naprawa inne</div>
                                                                        ) : uservisit.visitTypeId === 6 ? (
                                                                            <div>Konsulatacja</div>
                                                                        ) : uservisit.visitTypeId === 7 ? (
                                                                            <div>Przegląd</div>
                                                                        ) : uservisit.visitTypeId === 8 ? (
                                                                            <div>Wymiana opon</div>
                                                                        ) : uservisit.visitTypeId === 9 ? (
                                                                            <div>Nie wiem</div>
                                                                        ) : uservisit.visitTypeId === 10 ? (
                                                                            <div>Inne</div>
                                                                        ) : (
                                                                            <div></div>
                                                                        )}
                                                                    </ListGroupItem>
                                                                    {uservisit.payment !== null ? (
                                                                        <div>
                                                                            {" "}
                                                                            <ListGroupItem>
                                                                                <strong>Koszt</strong>
                                                                            </ListGroupItem>
                                                                            <ListGroupItem>
                                                                                Koszt naprawy:{" "}
                                                                                {uservisit.payment.paymentCost}
                                                                            </ListGroupItem>
                                                                            <ListGroupItem>
                                                                                Zapłacono?{" "}
                                                                                {uservisit.payment.isPayed === true ? (
                                                                                    <div>tak</div>
                                                                                ) : (
                                                                                    <div>nie</div>
                                                                                )}
                                                                            </ListGroupItem>
                                                                        </div>
                                                                    ) : (
                                                                        <div></div>
                                                                    )}
                                                                    <ListGroupItem>
                                                                        <b>Akcje</b>
                                                                    </ListGroupItem>
                                                                    <ListGroupItem>
                                                                        <Container>
                                                                            <Row>
                                                                                {uservisit.payment !== null ? (<></>) : (
                                                                                    <Col>
                                                                                        <div className="d-grid gap-2">
                                                                                            <Button
                                                                                                className="mr-2"
                                                                                                variant="secondary"
                                                                                                onClick={() => {
                                                                                                    this.setState({
                                                                                                        VisitUpdateShowNotRegistered: true,
                                                                                                        visitid:
                                                                                                        uservisit.visitNotRegisteredId,
                                                                                                        visitdatetime:
                                                                                                        uservisit.visitNotRegisteredDateTime,
                                                                                                        visittypeid:
                                                                                                        uservisit.visitTypeId,
                                                                                                        userid: currentUser.id,
                                                                                                    });
                                                                                                }}
                                                                                            >
                                                                                                Edytuj wizytę
                                                                                            </Button>
                                                                                            <UpdateVisitNotRegistered
                                                                                                show={
                                                                                                    this.state
                                                                                                        .VisitUpdateShowNotRegistered
                                                                                                }
                                                                                                onHide={
                                                                                                    VisitUpdateCloseNotRegistered
                                                                                                }
                                                                                                visitid={visitid}
                                                                                                visitdatetime={visitdatetime}
                                                                                                visittypeid={visittypeid}
                                                                                                userid={userid}
                                                                                            />

                                                                                            <Button
                                                                                                className="mr-2"
                                                                                                variant="danger"
                                                                                                onClick={() =>
                                                                                                    this.deletevisitNotRegistered(
                                                                                                        uservisit.visitNotRegisteredId
                                                                                                    )
                                                                                                }
                                                                                            >
                                                                                                Odwołaj wizytę
                                                                                            </Button>
                                                                                        </div>
                                                                                    </Col>)}

                                                                                <Col>
                                                                                    {" "}
                                                                                    <div className="d-grid gap-2">
                                                                                        {uservisit.visitNotRegisteredLog ===
                                                                                        null ? (
                                                                                            <>
                                                                                                {" "}
                                                                                                <Button
                                                                                                    className="mr-2"
                                                                                                    variant="primary"
                                                                                                    onClick={() => {
                                                                                                        this.setState({
                                                                                                            LogAddShowNotRegistered: true,
                                                                                                            visitid:
                                                                                                            uservisit.visitNotRegisteredId,
                                                                                                        });
                                                                                                    }}
                                                                                                >
                                                                                                    Dodaj opis wizyty
                                                                                                </Button>
                                                                                                <AddLogNotRegistered
                                                                                                    show={
                                                                                                        this.state
                                                                                                            .LogAddShowNotRegistered
                                                                                                    }
                                                                                                    onHide={
                                                                                                        LogAddCloseNotRegistered
                                                                                                    }
                                                                                                    visitid={visitid}
                                                                                                    visitlog={visitlog}
                                                                                                />
                                                                                            </>
                                                                                        ) : (
                                                                                            <>
                                                                                                <Button
                                                                                                    className="mr-2"
                                                                                                    variant="secondary"
                                                                                                    onClick={() => {
                                                                                                        this.setState({
                                                                                                            LogAddShowNotRegistered: true,
                                                                                                            visitid:
                                                                                                            uservisit.visitNotRegisteredId,
                                                                                                        });
                                                                                                    }}
                                                                                                >
                                                                                                    Edytuj opis wizyty
                                                                                                </Button>
                                                                                                <div></div>
                                                                                                <Button
                                                                                                    className="mr-2"
                                                                                                    variant="danger"
                                                                                                    onClick={() =>
                                                                                                        this.RemoveVisitLogNotRegistered(
                                                                                                            uservisit.visitNotRegisteredId
                                                                                                        )
                                                                                                    }
                                                                                                >
                                                                                                    Usuń opis wizyty
                                                                                                </Button>
                                                                                                <AddLogNotRegistered
                                                                                                    show={
                                                                                                        this.state
                                                                                                            .LogAddShowNotRegistered
                                                                                                    }
                                                                                                    onHide={
                                                                                                        LogAddCloseNotRegistered
                                                                                                    }
                                                                                                    visitid={visitid}
                                                                                                />
                                                                                            </>
                                                                                        )}
                                                                                    </div>
                                                                                </Col>
                                                                                <Col>
                                                                                    <div className="d-grid gap-2">
                                                                                        {uservisit.payment === null ? (
                                                                                            <>
                                                                                                <Button
                                                                                                    className="mr-2"
                                                                                                    variant="primary"
                                                                                                    onClick={() => {
                                                                                                        this.setState({
                                                                                                            PaymentAddShowNotRegistered: true,
                                                                                                            visitid:
                                                                                                            uservisit.visitNotRegisteredId,
                                                                                                        });
                                                                                                    }}
                                                                                                >
                                                                                                    Dodaj płatność
                                                                                                </Button>
                                                                                                <AddPaymentNotRegistered
                                                                                                    show={
                                                                                                        this.state
                                                                                                            .PaymentAddShowNotRegistered
                                                                                                    }
                                                                                                    onHide={
                                                                                                        PaymentAddCloseNotRegistered
                                                                                                    }
                                                                                                    visitid={visitid}
                                                                                                />
                                                                                            </>
                                                                                        ) : (
                                                                                            <>
                                                                                                <Button
                                                                                                    className="mr-2"
                                                                                                    variant="secondary"
                                                                                                    onClick={() => {
                                                                                                        this.setState({
                                                                                                            PaymentUpdateShowNotRegistered: true,
                                                                                                            visitid:
                                                                                                            uservisit.visitNotRegisteredId,
                                                                                                            paymentcost:
                                                                                                            uservisit.payment
                                                                                                                .paymentCost,
                                                                                                        });
                                                                                                    }}
                                                                                                >
                                                                                                    Edytuj koszt
                                                                                                </Button>
                                                                                                <UpdatePaymentNotRegistered
                                                                                                    show={
                                                                                                        this.state
                                                                                                            .PaymentUpdateShowNotRegistered
                                                                                                    }
                                                                                                    onHide={
                                                                                                        PaymentUpdateCloseNotRegistered
                                                                                                    }
                                                                                                    visitid={visitid}
                                                                                                    paymentcost={paymentcost}
                                                                                                />

                                                                                                <Button
                                                                                                    className="mr-2"
                                                                                                    variant="success"
                                                                                                    onClick={() =>
                                                                                                        this.isdoneNotRegistered(
                                                                                                            uservisit.visitNotRegisteredId
                                                                                                        )
                                                                                                    }
                                                                                                >
                                                                                                    Potwierdź skończenie
                                                                                                    wizyty
                                                                                                </Button>
                                                                                            </>
                                                                                        )}
                                                                                    </div>
                                                                                </Col>
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
                                                            to={
                                                                "/codenotregistered?code=" +
                                                                uservisit.visitNotRegisteredCode
                                                            }
                                                            className="btn btn-primary text-center"
                                                        >
                                                            Podsumowanie
                                                        </Link>
                                                        <QRCode
                                                            className="ms-5 mb-3 mt-3"
                                                            id="123456"
                                                            value={
                                                                "https://vanillacar.me/codenotregistered?code=" +
                                                                uservisit.visitCode
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

                        {/*/////////////////////////////////////////////////////*/}
                        <div>
                            <div className="d-flex">
                                <hr className="my-auto flex-grow-1"></hr>
                                <div className="px-4">
                                    <h3>Historia wizyt</h3>
                                </div>
                                <hr className="my-auto flex-grow-1"></hr>
                            </div>

                            {uservisit.map((uservisit) => (
                                <ListGroup>
                                    {uservisit.isDone === true ? (
                                        <div>
                                            <Container>
                                                <Row>
                                                    <Col>
                                                        {" "}
                                                        <Accordion>
                                                            <Accordion.Item eventKey="0">
                                                                <Accordion.Header>
                                                                    {uservisit.visitDateTime
                                                                        .replace("T", "")
                                                                        .substr("", "10")}
                                                                </Accordion.Header>
                                                                <AccordionBody>
                                                                    <QRCode
                                                                        hidden
                                                                        id="123456"
                                                                        value={
                                                                            "https://vanillacar.me/code?code=" +
                                                                            uservisit.visitCode
                                                                        }
                                                                        size={290}
                                                                        level={"H"}
                                                                        includeMargin={true}
                                                                    />
                                                                    <ListGroup key={uservisit.visitId}>
                                                                        <ListGroupItem>
                                                                            <strong>Właściciel</strong>
                                                                        </ListGroupItem>
                                                                        <ListGroupItem>
                                                                            Imię: {uservisit.user.userName}
                                                                        </ListGroupItem>
                                                                        <ListGroupItem>
                                                                            Nazwisko: {uservisit.user.userSurname.slice(0, uservisit.user.userSurname.length - (uservisit.user.userSurname.length - 1)) + "..."}
                                                                        </ListGroupItem>
                                                                        <ListGroupItem>
                                                                            <strong>Wizyta</strong>
                                                                        </ListGroupItem>
                                                                        <ListGroupItem>
                                                                            Kod wizyty: {uservisit.visitCode}
                                                                        </ListGroupItem>
                                                                        <ListGroupItem>
                                                                            informacje o wizycie:{" "}
                                                                            {uservisit.visitLog === null ? (
                                                                                <div>Dodaj opis wizyty</div>
                                                                            ) : (
                                                                                <div>{uservisit.visitLog}</div>
                                                                            )}
                                                                        </ListGroupItem>
                                                                        <ListGroupItem>
                                                                            Termin wizyty:{" "}
                                                                            {uservisit.visitDateTime
                                                                                .replace("T", " ")
                                                                                .substr("", "16")}
                                                                        </ListGroupItem>
                                                                        <ListGroupItem>
                                                                            Typ wizyty:{" "}
                                                                            {uservisit.visitTypeId === 1 ? (
                                                                                <div>Naprawa mechaniczna</div>
                                                                            ) : uservisit.visitTypeId === 2 ? (
                                                                                <div>Naprawa elektryczna</div>
                                                                            ) : uservisit.visitTypeId === 3 ? (
                                                                                <div>Naprawa kompleksowa</div>
                                                                            ) : uservisit.visitTypeId === 4 ? (
                                                                                <div>Naprawa powypadkowa</div>
                                                                            ) : uservisit.visitTypeId === 5 ? (
                                                                                <div>Naprawa inne</div>
                                                                            ) : uservisit.visitTypeId === 6 ? (
                                                                                <div>Konsulatacja</div>
                                                                            ) : uservisit.visitTypeId === 7 ? (
                                                                                <div>Przegląd</div>
                                                                            ) : uservisit.visitTypeId === 8 ? (
                                                                                <div>Wymiana opon</div>
                                                                            ) : uservisit.visitTypeId === 9 ? (
                                                                                <div>Nie wiem</div>
                                                                            ) : uservisit.visitTypeId === 10 ? (
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
                                                                            {
                                                                                uservisit.car.carName
                                                                                    .carNameManufacturer
                                                                            }
                                                                        </ListGroupItem>
                                                                        <ListGroupItem>
                                                                            Model samochodu:{" "}
                                                                            {uservisit.car.carName.carNameModel}
                                                                        </ListGroupItem>
                                                                        <ListGroupItem>
                                                                            Numer rejestracyjny:{" "}
                                                                            {uservisit.car.carPlates}
                                                                        </ListGroupItem>
                                                                        {uservisit.pickup !== null ? (
                                                                            <div>
                                                                                {" "}
                                                                                <ListGroupItem>
                                                                                    <strong>Adres odbioru</strong>
                                                                                </ListGroupItem>
                                                                                <ListGroupItem>
                                                                                    Data odbioru:{" "}
                                                                                    {uservisit.pickup.pickupDateTime
                                                                                        .replace("T", " ")
                                                                                        .substr("", "16")}
                                                                                </ListGroupItem>
                                                                                <ListGroupItem>
                                                                                    Miasto: {uservisit.pickup.pickupCity}
                                                                                </ListGroupItem>
                                                                                <ListGroupItem>
                                                                                    Ulica: {uservisit.pickup.pickupStreet}
                                                                                </ListGroupItem>
                                                                                <ListGroupItem>
                                                                                    Kod pocztowy:{" "}
                                                                                    {uservisit.pickup.pickupPostalCode}
                                                                                </ListGroupItem>
                                                                            </div>
                                                                        ) : (
                                                                            <div></div>
                                                                        )}
                                                                        {uservisit.delivery !== null ? (
                                                                            <div>
                                                                                {" "}
                                                                                <ListGroupItem>
                                                                                    <strong>Adres dostawy</strong>
                                                                                </ListGroupItem>
                                                                                <ListGroupItem>
                                                                                    Miasto:{" "}
                                                                                    {uservisit.delivery.deliveryCity}
                                                                                </ListGroupItem>
                                                                                <ListGroupItem>
                                                                                    Ulica:{" "}
                                                                                    {uservisit.delivery.deliveryStreet}
                                                                                </ListGroupItem>
                                                                                <ListGroupItem>
                                                                                    Kod pocztowy:{" "}
                                                                                    {
                                                                                        uservisit.delivery
                                                                                            .deliveryPostalCode
                                                                                    }
                                                                                </ListGroupItem>
                                                                            </div>
                                                                        ) : (
                                                                            <div></div>
                                                                        )}
                                                                        {uservisit.payment !== null ? (
                                                                            <div>
                                                                                {" "}
                                                                                <ListGroupItem>
                                                                                    <strong>Koszt</strong>
                                                                                </ListGroupItem>
                                                                                <ListGroupItem>
                                                                                    Koszt naprawy:{" "}
                                                                                    {uservisit.payment.paymentCost}
                                                                                </ListGroupItem>
                                                                                <ListGroupItem>
                                                                                    Metoda płatności:{" "}
                                                                                    {uservisit.payment.paymentTypeId ===
                                                                                    4 ? (
                                                                                        <div>Gotówka</div>
                                                                                    ) : uservisit.payment
                                                                                        .paymentTypeId === 3 ? (
                                                                                        <div>Karta</div>
                                                                                    ) : uservisit.payment
                                                                                        .paymentTypeId === 2 ? (
                                                                                        <div>Blik</div>
                                                                                    ) : uservisit.payment
                                                                                        .paymentTypeId === 1 ? (
                                                                                        <div>Inne</div>
                                                                                    ) : (
                                                                                        <div></div>
                                                                                    )}
                                                                                </ListGroupItem>
                                                                                <ListGroupItem>
                                                                                    Zapłacono?{" "}
                                                                                    {uservisit.payment.isPayed ===
                                                                                    true ? (
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
                                                                to={"/code?code=" + uservisit.visitCode}
                                                                className="btn btn-primary text-center"
                                                            >
                                                                Podsumowanie
                                                            </Link>
                                                            <QRCode
                                                                className="ms-5 mb-3 mt-3"
                                                                id="123456"
                                                                value={
                                                                    "https://vanillacar.me/code?code=" +
                                                                    uservisit.visitCode
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

                        <div className="d-flex">
                            <hr className="my-auto flex-grow-1"></hr>
                            <div className="px-4">
                                <h3>Historia wizyt bez rejestracji</h3>
                            </div>
                            <hr className="my-auto flex-grow-1"></hr>
                        </div>
                        {notregistered.map((uservisit) => (
                            <ListGroup>
                                {uservisit.isDone === true ? (
                                    <div>
                                        <Container>
                                            <Row>
                                                <Col>
                                                    {" "}
                                                    <Accordion>
                                                        <Accordion.Item eventKey="0">
                                                            <Accordion.Header>
                                                                {uservisit.visitNotRegisteredDateTime
                                                                    .replace("T", "")
                                                                    .substr("", "10")}
                                                            </Accordion.Header>
                                                            <AccordionBody>
                                                                <QRCode
                                                                    hidden
                                                                    id="123456"
                                                                    value={
                                                                        "https://vanillacar.me/codenotregistered?code=" +
                                                                        uservisit.visitNotRegisteredCode
                                                                    }
                                                                    size={290}
                                                                    level={"H"}
                                                                    includeMargin={true}
                                                                />
                                                                <ListGroup key={uservisit.visitNotRegisteredId}>
                                                                    <ListGroupItem>
                                                                        <strong>Właściciel</strong>
                                                                    </ListGroupItem>
                                                                    <ListGroupItem>
                                                                        E-mail: {uservisit.userEmail}
                                                                    </ListGroupItem>
                                                                    <ListGroupItem>
                                                                        Telefon: {uservisit.userTelephone}
                                                                    </ListGroupItem>
                                                                    <ListGroupItem>
                                                                        <strong>Wizyta</strong>
                                                                    </ListGroupItem>
                                                                    <ListGroupItem>
                                                                        Kod wizyty:{" "}
                                                                        {uservisit.visitNotRegisteredCode}
                                                                    </ListGroupItem>
                                                                    <ListGroupItem>
                                                                        informacje o wizycie:{" "}
                                                                        {uservisit.visitNotRegisteredLog ===
                                                                        null ? (
                                                                            <div>Dodaj opis wizyty</div>
                                                                        ) : (
                                                                            <div>
                                                                                {uservisit.visitNotRegisteredLog}
                                                                            </div>
                                                                        )}
                                                                    </ListGroupItem>
                                                                    <ListGroupItem>
                                                                        Termin wizyty:{" "}
                                                                        {uservisit.visitNotRegisteredDateTime
                                                                            .replace("T", " ")
                                                                            .substr("", "16")}
                                                                    </ListGroupItem>
                                                                    <ListGroupItem>
                                                                        Typ wizyty:{" "}
                                                                        {uservisit.visitTypeId === 1 ? (
                                                                            <div>Naprawa mechaniczna</div>
                                                                        ) : uservisit.visitTypeId === 2 ? (
                                                                            <div>Naprawa elektryczna</div>
                                                                        ) : uservisit.visitTypeId === 3 ? (
                                                                            <div>Naprawa kompleksowa</div>
                                                                        ) : uservisit.visitTypeId === 4 ? (
                                                                            <div>Naprawa powypadkowa</div>
                                                                        ) : uservisit.visitTypeId === 5 ? (
                                                                            <div>Naprawa inne</div>
                                                                        ) : uservisit.visitTypeId === 6 ? (
                                                                            <div>Konsulatacja</div>
                                                                        ) : uservisit.visitTypeId === 7 ? (
                                                                            <div>Przegląd</div>
                                                                        ) : uservisit.visitTypeId === 8 ? (
                                                                            <div>Wymiana opon</div>
                                                                        ) : uservisit.visitTypeId === 9 ? (
                                                                            <div>Nie wiem</div>
                                                                        ) : uservisit.visitTypeId === 10 ? (
                                                                            <div>Inne</div>
                                                                        ) : (
                                                                            <div></div>
                                                                        )}
                                                                    </ListGroupItem>
                                                                    {uservisit.payment !== null ? (
                                                                        <div>
                                                                            {" "}
                                                                            <ListGroupItem>
                                                                                <strong>Koszt</strong>
                                                                            </ListGroupItem>
                                                                            <ListGroupItem>
                                                                                Koszt naprawy:{" "}
                                                                                {uservisit.payment.paymentCost}
                                                                            </ListGroupItem>
                                                                            <ListGroupItem>
                                                                                Zapłacono?{" "}
                                                                                {uservisit.payment.isPayed === true ? (
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
                                                            to={
                                                                "/codenotregistered?code=" +
                                                                uservisit.visitNotRegisteredCode
                                                            }
                                                            className="btn btn-primary text-center"
                                                        >
                                                            Podsumowanie
                                                        </Link>
                                                        <QRCode
                                                            className="ms-5 mb-3 mt-3"
                                                            id="123456"
                                                            value={
                                                                "https://vanillacar.me/codenotregistered?code=" +
                                                                uservisit.visitCode
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
                ) : (
                    <div></div>
                )}
            </div>
        );
    }
}
