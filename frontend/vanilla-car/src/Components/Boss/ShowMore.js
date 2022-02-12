import React, {Component} from "react";
import {Accordion, Button, Col, Container, ListGroup, ListGroupItem, Modal, Row, Table,} from "react-bootstrap";
import AuthenticateService from "../../Services/AuthenticateService";
import Events from "../../Other/Events";
import VisitService from "../../Services/VisitService";
import AccordionBody from "react-bootstrap/AccordionBody";
import {Link, Redirect} from "react-router-dom";
import {AddVisitBoss} from "../Visit/AddVisitBoss";
import {AddDateTime} from "../Visit/Delivery/AddDateTime";
import {AddPayment} from "../Visit/Payment/AddPayment";
import {UpdatePayment} from "../Visit/Payment/UpdatePayment";
import {AddDelivery} from "../Visit/Delivery/AddDelivery";
import {AddLog} from "../Visit/Mechanic/AddLog";
import AccordionHeader from "react-bootstrap/AccordionHeader";
import QRCode from "qrcode.react";
import {UpdateVisitMechanic} from "../Visit/Mechanic/UpdateVisitMechanic";
import {BossManual} from "../Manual/BossManual";

export class ShowMore extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: null,
            userReady: false,
            currentUser: {},
            uservisit: [
                {
                    visitDateTime: "",
                    isDelivery: "",
                    visitTypeId: "",
                    visitCode: "",
                    user: {
                        userId: "",
                        userName: "",
                        userSurname: "",
                        UserEmail: "",
                        UserTelehpone: "",
                    },
                    car: {
                        carId: "",
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
                    payment: {
                        paymentCost: "",
                        paymentTypeId: "",
                        IsPayed: "",
                    },
                },
            ],
            VisitAddShow: false,
            VisitUpdateShow: false,
            DeliveryAddShow: false,
            show: false,
            allcar: [],
            PaymentAddShow: false,
            PaymentUpdateShow: false,
            getMechanics: [],
            car: [],
            ManualShow: false
        };
    }

    componentDidMount() {
        const currentUser = AuthenticateService.getCurrentUser();

        if (!currentUser) this.setState({redirect: "/login"});
        this.setState({currentUser: currentUser, userReady: true});
        if (currentUser === null) {
        } else {
            if (currentUser.roleid === 1 || currentUser.roleid === 2 || currentUser.roleid === 3) this.setState({redirect: "/profile"});
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
    }

    close() {
        this.setState({
            show: false,
        });
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

    handleClickUserDetail = (e) => {
        e.persist();
        e.preventDefault();

        this.props.onHide(e);
        this.setState({show: false});
    };

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


    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect}/>;
        }

        const {
            visitid,
            visitdatetime,
            visittypeid,
            userid,
            paymentcost,
            car,
            clientpostalcode,
            clientcity,
            clientstreet,
            visitlog,
            mechanicid,
            carid,
            carmanufacturer,
            carmodel,
            carplates,
        } = this.state;
        let ManualClose = () => this.setState({ManualShow: false});
        let VisitAddClose = () => this.setState({VisitAddShow: false});
        let VisitUpdateClose = () => this.setState({VisitUpdateShow: false});
        let DeliveryAddClose = () => this.setState({DeliveryAddShow: false});
        let PaymentAddClose = () => this.setState({PaymentAddShow: false});
        let PaymentUpdateClose = () => this.setState({PaymentUpdateShow: false});
        let LogAddClose = () => this.setState({LogAddShow: false});
        let DeliveryAddTimeClose = () =>
            this.setState({DeliveryAddTimeShow: false});
        const downloadQR = () => {
            const canvas = document.getElementById("123456");
            const pngUrl = canvas
                .toDataURL("image/png")
                .replace("image/png", "image/octet-stream");
            let downloadLink = document.createElement("a");
            downloadLink.href = pngUrl;
            downloadLink.download = "VanillaCar.png"
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        };

        return (
            <div className="container">
                <Modal
                    {...this.props}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    fullscreen
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            {this.props.username}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.props.uservisit === undefined ? (
                            <div></div>
                        ) : (
                            <div>
                                <Container>
                                    <Button
                                        className="mr-2"
                                        variant="primary"
                                        onClick={() =>
                                            this.setState({
                                                VisitAddShow: true,
                                                userid: this.props.userid,
                                                car: this.props.car,
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
                                    <BossManual show={this.state.ManualShow} onHide={ManualClose}/>
                                    <AddVisitBoss
                                        show={this.state.VisitAddShow}
                                        onHide={VisitAddClose}
                                        userid={userid}
                                        car={car}
                                    />
                                </Container>
                                <div className="d-flex">
                                    <hr className="my-auto flex-grow-1"></hr>
                                    <div className="px-4">
                                        <h3>Wizyty bieżące</h3>
                                    </div>
                                    <hr className="my-auto flex-grow-1"></hr>
                                </div>
                                {this.props.uservisit.map((uservisit) => (
                                    <ListGroup>
                                        {uservisit.isDone === false ? (
                                            <div>
                                                <Container>
                                                    <Row>
                                                        <Col> <Accordion>
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
                                                                            "https://157.245.22.110/code?code=" +
                                                                            uservisit.visitCode
                                                                        }
                                                                        size={290}
                                                                        level={"H"}
                                                                        includeMargin={true}
                                                                    />
                                                                    <ListGroup key={uservisit.visitId}>
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
                                                                            Numer
                                                                            rejestracyjny: {uservisit.car.carPlates}
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
                                                                                    Miasto: {uservisit.delivery.deliveryCity}
                                                                                </ListGroupItem>
                                                                                <ListGroupItem>
                                                                                    Ulica: {uservisit.delivery.deliveryStreet}
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
                                                                                    Koszt naprawy:<br></br>
                                                                                    {uservisit.payment.paymentCost}

                                                                                </ListGroupItem>
                                                                                <ListGroupItem>
                                                                                    Metoda płatności:{" "}
                                                                                    {uservisit.payment.paymentTypeId === 4 ? (
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
                                                                                            <div
                                                                                                className="d-grid gap-2">
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
                                                                                                                Dodaj
                                                                                                                datę
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
                                                                                                                Edytuj
                                                                                                                datę
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
                                                                                                                    this.state.DeliveryAddShow
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
                                                                                                                visitid: uservisit.visitId,
                                                                                                                visitlog:
                                                                                                                uservisit.visitlog,
                                                                                                            });
                                                                                                        }}
                                                                                                    >
                                                                                                        Dodaj opis
                                                                                                        wizyty
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
                                                                                                                visitid: uservisit.visitId,
                                                                                                                visitlog:
                                                                                                                uservisit.visitlog,
                                                                                                            });
                                                                                                        }}
                                                                                                    >
                                                                                                        Edytuj opis
                                                                                                        wizyty
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
                                                                                                                visitid: uservisit.visitId,
                                                                                                            });
                                                                                                        }}
                                                                                                    >
                                                                                                        Dodaj płatność
                                                                                                    </Button>
                                                                                                    <AddPayment
                                                                                                        show={this.state.PaymentAddShow}
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
                                                                                                                visitid: uservisit.visitId,
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
                                                        </Accordion></Col>
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
                                                                        "https://157.245.22.110/code?code=" +
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
                        )}
                        <div className="d-flex">
                            <hr className="my-auto flex-grow-1"></hr>
                            <div className="px-4">
                                <h3>Historia wizyt</h3>
                            </div>
                            <hr className="my-auto flex-grow-1"></hr>
                        </div>

                        {this.props.uservisit === undefined ? (
                            <div>brak wizyt</div>
                        ) : (
                            <div>
                                {" "}
                                {this.props.uservisit.map((uservisit) => (
                                    <ListGroup>
                                        {uservisit.isDone === true ? (
                                            <div>
                                                <Container>
                                                    <Row>
                                                        <Col> <Accordion>
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
                                                                            "https://157.245.22.110/code?code=" +
                                                                            uservisit.visitCode
                                                                        }
                                                                        size={290}
                                                                        level={"H"}
                                                                        includeMargin={true}
                                                                    />
                                                                    <ListGroup key={uservisit.visitId}>
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
                                                                            Numer
                                                                            rejestracyjny: {uservisit.car.carPlates}
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
                                                                                    Miasto: {uservisit.delivery.deliveryCity}
                                                                                </ListGroupItem>
                                                                                <ListGroupItem>
                                                                                    Ulica: {uservisit.delivery.deliveryStreet}
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
                                                                                    {uservisit.payment.paymentTypeId === 4 ? (
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
                                                                                        <div></div>
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
                                                                    </ListGroup>
                                                                </AccordionBody>
                                                            </Accordion.Item>
                                                        </Accordion></Col>
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
                                                                        "https://157.245.22.110/code?code=" +
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
                        )}

                        <div className="d-flex">
                            <hr className="my-auto flex-grow-1"></hr>
                            <div className="px-4">
                                <h3>Samochody</h3>
                            </div>
                            <hr className="my-auto flex-grow-1"></hr>
                        </div>

                        {this.props.car === undefined ? (
                            <div>brak samochodów</div>
                        ) : (
                            <div><Container>
                                <Accordion>
                                    <Accordion.Item eventKey="0">
                                        <AccordionHeader>
                                            Samochody
                                        </AccordionHeader>
                                        <AccordionBody>
                                            <Table className="mt-4" striped bordered hover size="sm" responsive>
                                                <thead>
                                                <tr>
                                                    <th class="text-center">Marka</th>
                                                    <th class="text-center">Model</th>
                                                    <th class="text-center">Rok produkcji</th>
                                                    <th class="text-center">Typ paliwa</th>
                                                    <th class="text-center">Numer VIN</th>
                                                    <th class="text-center">Numer rejestracyjny</th>
                                                </tr>
                                                </thead>
                                                {" "}
                                                <tbody>
                                                {" "}
                                                {this.props.car.map((car) => (
                                                    <tr key={car.carId}>
                                                        <td class="text-center">
                                                            {car.carName.carNameManufacturer}
                                                        </td>
                                                        <td class="text-center">
                                                            {car.carName.carNameModel}
                                                        </td>
                                                        <td class="text-center">
                                                            {car.carProduction.carProductionYear}
                                                        </td>
                                                        <td className="text-center">
                                                            {car.fuelTypeId === 1
                                                                ? "Benzyna"
                                                                : car.fuelTypeId === 2
                                                                    ? "Diesel"
                                                                    : car.fuelTypeId === 3
                                                                        ? "Elektryczny"
                                                                        : car.fuelTypeId === 4
                                                                            ? "Benzyna + LPG"
                                                                            : car.fuelTypeId === 5
                                                                                ? "Benzyna + CNG"
                                                                                : car.fuelTypeId === 6
                                                                                    ? "Hybryda"
                                                                                    : car.fuelTypeId === 7
                                                                                        ? "Wodór"
                                                                                        : car.fuelTypeId === 8
                                                                                            ? "Inne"
                                                                                            : "błąd"}
                                                        </td>
                                                        <td class="text-center">{car.carVin}</td>
                                                        <td class="text-center">{car.carPlates}</td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </Table>
                                        </AccordionBody>
                                    </Accordion.Item>
                                </Accordion></Container>
                            </div>
                        )}
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="danger" onClick={this.handleClickUserDetail}>
                            Powrót
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}
