import React, {Component} from "react";
import {Redirect} from "react-router-dom";
import {Button, Col, Container, ListGroup, ListGroupItem, Row,} from "react-bootstrap";
import AuthenticateService from "../../Services/AuthenticateService";
import {UpdateProfile} from "./UpdateProfile";
import {UpdatePassword} from "./UpdatePassword";
import {DeleteUser} from "./DeleteUser";
import {AddAddress} from "../Address/AddAddress";
import {UpdateAddress} from "../Address/UpdateAddress";
import Events from "../../Other/Events";
import {ShopReview} from "../Reviews/ShopReview";
import ReviewService from "../../Services/ReviewService";
import {ShowReview} from "../Reviews/ShowReview";
import {MechanicReview} from "../Reviews/MechanicReview";
import {ShowMechanicsReview} from "../Reviews/ShowMechanicsReview";
import VisitService from "../../Services/VisitService";

export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: null,
            userReady: false,
            currentUser: {},
            getUserById: {
                clientAddress: {
                    clientCity: "",
                    clientPostalCode: "",
                    clientStreet: "",
                },
                car: {
                    carManufacturer: "",
                    carModel: "",
                    carProductionYear: "",
                    carFuelType: "",
                    carVin: "",
                },
                payment: {
                    paymentCost: "",
                    paymentType: "",
                },
                visit: {
                    visitType: "",
                    visitDateTime: "",
                    visitLog: "",
                    delivery: {
                        deliveryCity: "",
                        deliveryStreet: "",
                        deliveryPostalCode: "",
                    },
                },
            },
            UserUpdateShow: false,
            UserUpdatePasswordShow: false,
            UserDeleteShow: false,
            UserAddAddressShow: false,
            UpdateAddressShow: false,
            AddReviewShow: false,
            ShowReviewShow: false,
            getReviews: [],
            getPayments: [
                {
                    visitDateTime: "",
                }
            ],
            AddReviewMechanicShow: false,
            MechanicReviewShow: false,
        };
    }

    componentDidMount() {
        const currentUser = AuthenticateService.getCurrentUser();
        if (!currentUser) this.setState({redirect: "/login"});
        this.setState({currentUser: currentUser, userReady: true});
        if (currentUser === null) {
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

                }
            );
        }
        if (currentUser === null) {
            Events.dispatch("logout");
        } else {
            VisitService.getNotPayedVisits(currentUser.id).then(
                (response) => {
                    if (response === undefined) {
                        Events.dispatch("logout");
                        this.props.history.push("/");
                        window.location.reload();

                    } else {
                        this.setState({
                            getPayments: response.data,
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

                }
            );
            if (currentUser === null) {
            } else {
                ReviewService.getReview(currentUser.id).then(
                    (response) => {
                        if (response === undefined) {
                            Events.dispatch("logout");
                            this.props.history.push("/");
                            window.location.reload();

                        } else {
                            this.setState({
                                getReviews: response.data,
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

                    }
                )
            }
            ;
        }
    }

    deleteUser(userid) {
        if (window.confirm("Jesteś pewny?")) {
            AuthenticateService.deleteuser(userid).then(
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
            getUserById,
            userid,
            useremail,
            username,
            usersurname,
            usertelephone,
            userdescription,
            clientcity,
            clientstreet,
            clientpostalcode,
            getReviews,
            getPayments,
        } = this.state;

        let UserUpdateClose = () => this.setState({UserUpdateShow: false});
        let UserUpdatePasswordClose = () =>
            this.setState({UserUpdatePasswordShow: false});
        let UserAddAddressClose = () =>
            this.setState({UserAddAddressShow: false});
        let UserDeleteClose = () => this.setState({UserDeleteShow: false});
        let UpdateAddressClose = () => this.setState({UpdateAddressShow: false});
        let AddReviewClose = () => this.setState({AddReviewShow: false});
        let ShowReviewClose = () => this.setState({ShowReviewShow: false});
        let AddReviewMechanicClose = () =>
            this.setState({AddReviewMechanicShow: false});
        let MechanicReviewClose = () =>
            this.setState({MechanicReviewShow: false});

        const element = (
            <h5 style={{color: "red"}}>
                <b>Uwaga! Masz nie opłacony rachunek</b>
            </h5>
        );

        if (getUserById.roleId === 3) {
            return <Redirect to="/admin"/>;
        }
        if (getUserById.roleId === 2) {
            return <Redirect to="/mechanic"/>;
        }
        if (getUserById.roleId === 4) {
            return <Redirect to="/boss"/>;
        }


        return (
            <div className="container">
                {this.state.userReady ? (
                    <div>
                        <header className="jumbotron"></header>

                        <Container fluid>
                            <div className="d-flex">
                                <hr className="my-auto flex-grow-1"></hr>
                                <div className="px-4">
                                    <h3>Panel klienta</h3>
                                </div>
                                <hr className="my-auto flex-grow-1"></hr>
                            </div>
                            {getPayments.length === 0 ? (

                                <p class="text-center">Dziękujemy za uregulowane płatności</p>
                            ) : (
                                <p className="text-center">

                                    {element} {getPayments.map((getPayments) => (
                                    <h6>Przejdź do wizyty z {getPayments.visitDateTime.replace("T", "")
                                        .substr("", "10")} i ureguluj należność</h6>

                                ))}  </p>)}
                            <Row>
                                <Col>
                                    <ListGroup>
                                        <ListGroupItem>
                                            Email: <strong> {getUserById.userEmail}</strong>
                                        </ListGroupItem>
                                        <ListGroupItem>
                                            Imię: <strong> {getUserById.userName}</strong>{" "}
                                        </ListGroupItem>
                                        <ListGroupItem>
                                            Nazwisko: <strong> {getUserById.userSurname}</strong>{" "}
                                        </ListGroupItem>
                                        <ListGroupItem>
                                            Numer telefonu:
                                            {getUserById.userTelephone === null ? (
                                                <strong> Nie dodałeś numeru telefonu</strong>
                                            ) : (
                                                <strong> {getUserById.userTelephone}</strong>
                                            )}
                                        </ListGroupItem>
                                    </ListGroup>

                                    {getUserById.clientAddress === null ? (
                                        <div className="d-grid gap-2 mt-4">
                                            <Button
                                                className="mr-2"
                                                variant="primary"
                                                onClick={() =>
                                                    this.setState({
                                                        UserAddAddressShow: true,
                                                        userid: getUserById.userId,
                                                    })
                                                }
                                            >
                                                Dodaj swój adres
                                            </Button>
                                            <AddAddress
                                                show={this.state.UserAddAddressShow}
                                                onHide={UserAddAddressClose}
                                                userid={userid}
                                            />
                                        </div>
                                    ) : (
                                        <div>
                                            <ListGroup className="mt-4">
                                                <ListGroupItem>
                                                    Miasto:{" "}
                                                    <strong>
                                                        {getUserById.clientAddress.clientCity}{" "}
                                                    </strong>
                                                </ListGroupItem>
                                                <ListGroupItem>
                                                    Ulica:{" "}
                                                    <strong>
                                                        {getUserById.clientAddress.clientStreet}{" "}
                                                    </strong>
                                                </ListGroupItem>
                                                <ListGroupItem>
                                                    Kod pocztowy:{" "}
                                                    <strong>
                                                        {getUserById.clientAddress.clientPostalCode}
                                                    </strong>
                                                </ListGroupItem>
                                            </ListGroup>
                                        </div>
                                    )}
                                </Col>
                                <Col xs={1}>

                                </Col>
                                <Col>
                                    {" "}
                                    <div className="d-grid gap-2">
                                        <Button
                                            className="mr-2"
                                            variant="secondary"
                                            onClick={() =>
                                                this.setState({
                                                    UserUpdateShow: true,
                                                    userid: getUserById.userId,
                                                    useremail: getUserById.userEmail,
                                                    username: getUserById.userName,
                                                    usersurname: getUserById.userSurname,
                                                    usertelephone: getUserById.userTelephone,
                                                    userdescription: getUserById.userDescription,
                                                })
                                            }
                                        >
                                            Edytuj profil
                                        </Button>
                                        <UpdateProfile
                                            show={this.state.UserUpdateShow}
                                            onHide={UserUpdateClose}
                                            userid={userid}
                                            useremail={useremail}
                                            username={username}
                                            usersurname={usersurname}
                                            usertelephone={usertelephone}
                                            userdescription={userdescription}
                                        />
                                        <Button
                                            className="mr-2"
                                            variant="secondary"
                                            onClick={() =>
                                                this.setState({
                                                    UserUpdatePasswordShow: true,
                                                    userid: getUserById.userId,
                                                })
                                            }
                                        >
                                            Edytuj hasło
                                        </Button>
                                        <UpdatePassword
                                            show={this.state.UserUpdatePasswordShow}
                                            onHide={UserUpdatePasswordClose}
                                            userid={userid}
                                        />
                                        <Button
                                            className="mr-2"
                                            variant="danger"
                                            onClick={() =>
                                                this.setState({
                                                    UserDeleteShow: true,
                                                    userid: getUserById.userId,
                                                })
                                            }
                                        >
                                            Usuń konto
                                        </Button>
                                        <DeleteUser
                                            show={this.state.UserDeleteShow}
                                            onHide={UserDeleteClose}
                                            userid={userid}
                                        />
                                        {getUserById.clientAddress !== null ? (
                                            <div className="d-grid gap-2">
                                                <Button
                                                    className="mr-2"
                                                    variant="secondary"
                                                    onClick={() =>
                                                        this.setState({
                                                            UpdateAddressShow: true,
                                                            userid: getUserById.userId,
                                                            clientcity: getUserById.clientAddress.clientCity,
                                                            clientstreet:
                                                            getUserById.clientAddress.clientStreet,
                                                            clientpostalcode:
                                                            getUserById.clientAddress.clientPostalCode
                                                        })
                                                    }
                                                >
                                                    Edytuj adres
                                                </Button>
                                                <UpdateAddress
                                                    show={this.state.UpdateAddressShow}
                                                    onHide={UpdateAddressClose}
                                                    userid={userid}
                                                    clientcity={clientcity}
                                                    clientstreet={clientstreet}
                                                    clientpostalcode={clientpostalcode}
                                                />
                                            </div>
                                        ) : (
                                            <></>
                                        )}
                                        {getReviews.length === 0 ? (
                                            <>
                                                <Button
                                                    className="mr-2"
                                                    variant="primary"
                                                    onClick={() =>
                                                        this.setState({
                                                            AddReviewShow: true,
                                                        })
                                                    }
                                                >
                                                    Oceń warsztat
                                                </Button>
                                                <ShopReview
                                                    show={this.state.AddReviewShow}
                                                    onHide={AddReviewClose}
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <Button
                                                    className="mr-2"
                                                    variant="primary"
                                                    onClick={() =>
                                                        this.setState({
                                                            ShowReviewShow: true,
                                                        })
                                                    }
                                                >
                                                    Zobacz swoją recenzje warsztatu
                                                </Button>
                                                <ShowReview
                                                    show={this.state.ShowReviewShow}
                                                    onHide={ShowReviewClose}
                                                />
                                            </>
                                        )}{" "}
                                        <Button
                                            className="mr-2"
                                            variant="primary"
                                            onClick={() =>
                                                this.setState({
                                                    AddReviewMechanicShow: true,
                                                })
                                            }
                                        >
                                            Oceń mechanika
                                        </Button>
                                        <MechanicReview
                                            show={this.state.AddReviewMechanicShow}
                                            onHide={AddReviewMechanicClose}
                                        />
                                        <Button
                                            className="mr-2"
                                            variant="primary"
                                            onClick={() =>
                                                this.setState({
                                                    MechanicReviewShow: true,
                                                })
                                            }
                                        >
                                            Zobacz swoją recenzje mechaników
                                        </Button>
                                        <ShowMechanicsReview
                                            show={this.state.MechanicReviewShow}
                                            onHide={MechanicReviewClose}
                                        />
                                    </div>
                                </Col>
                            </Row>
                        </Container>
                    </div>
                ) : null}
            </div>
        );
    }
}
