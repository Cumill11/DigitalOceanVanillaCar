import React, {Component} from "react";
import {Redirect} from "react-router-dom";
import {Button, Col, Container, ListGroup, ListGroupItem, Row} from "react-bootstrap";
import AuthenticateService from "../../Services/AuthenticateService";
import {DeleteUser} from "../User/DeleteUser";
import {MechanicUpdate} from "./MechanicUpdate";
import Events from "../../Other/Events";
import {UpdatePassword} from "../User/UpdatePassword";
import {ShowOneMechanicReview} from "../Reviews/ShowOneMechanicReview";
import './../../App.css';

export default class Mechanic extends Component {
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
            },
            UserUpdateShow: false,
            UserUpdatePasswordShow: false,
            UserDeleteShow: false,
            ShowReviewShow: false,
            MechanicReviewShow: false,
        };
    }

    componentDidMount() {
        const currentUser = AuthenticateService.getCurrentUser();
        if (!currentUser) this.setState({redirect: "/login"});
        this.setState({currentUser: currentUser, userReady: true});
        if (currentUser === null) {
        } else {
            if (currentUser.roleid === 1 || currentUser.roleid === 3 || currentUser.roleid === 4) this.setState({redirect: "/profile"});
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
        } = this.state;

        let UserUpdateClose = () => this.setState({UserUpdateShow: false});
        let UserUpdatePasswordClose = () =>
            this.setState({UserUpdatePasswordShow: false});
        let UserDeleteClose = () => this.setState({UserDeleteShow: false});
        let MechanicReviewClose = () => this.setState({MechanicReviewShow: false});


        return (
            <div className="container">
                {this.state.userReady ? (
                    <div>
                        <header className="jumbotron">

                        </header>

                        <Container fluid>
                            <div className="d-flex mb-4 mt-4">
                                <hr className="my-auto flex-grow-1"></hr>
                                <div className="px-4">
                                    <h3>Panel mechanika</h3>
                                </div>
                                <hr className="my-auto flex-grow-1"></hr>

                            </div>
                            <Row>
                                <Col>
                                    <ListGroup>
                                        <ListGroupItem>
                                            Email:<strong> {getUserById.userEmail}</strong></ListGroupItem>
                                        <ListGroupItem>Imię:<strong> {getUserById.userName}</strong></ListGroupItem>
                                        <ListGroupItem>Nazwisko:<strong> {getUserById.userSurname}</strong></ListGroupItem>
                                        <ListGroupItem> Numer telefonu:
                                            {getUserById.userTelephone === null ? (
                                                <strong> Nie dodałeś numeru telefonu</strong>
                                            ) : (
                                                <strong> {getUserById.userTelephone}</strong>
                                            )}</ListGroupItem>
                                        <ListGroupItem> Opis:<strong> {getUserById.userDescription}</strong>{" "}
                                        </ListGroupItem>

                                    </ListGroup>
                                </Col><Col xs={1}>
                            </Col>
                                <Col>
                                    <Container>
                                        <Row>
                                            <Col>
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
                                                    <MechanicUpdate
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


                                                    <Button
                                                        className="mr-2"
                                                        variant="primary"
                                                        onClick={() =>
                                                            this.setState({
                                                                MechanicReviewShow: true,
                                                            })
                                                        }
                                                    >
                                                        Zobacz swoje recenzje
                                                    </Button>
                                                    <ShowOneMechanicReview
                                                        show={this.state.MechanicReviewShow}
                                                        onHide={MechanicReviewClose}
                                                    /></div>
                                            </Col>

                                        </Row>
                                    </Container>
                                </Col>
                            </Row>
                        </Container>


                    </div>


                ) : null}
            </div>
        );
    }
}
