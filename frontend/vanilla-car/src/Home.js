import React, {Component} from "react";
import {Col, Container, Row} from "react-bootstrap";
import {Link} from "react-router-dom";
import logo from "./k.svg";
import AuthenticateService from "./Services/AuthenticateService";
import Events from "./Other/Events";

export default class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            getUserById: {
                roleId: "",
            },
            currentUser: undefined,
        };
    }

    componentDidMount() {
        const user = AuthenticateService.getCurrentUser();
        if (user === null) {
        } else {
            AuthenticateService.getUser(user.id).then((response) => {
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
            });
        }

        if (user) {
            this.setState({
                currentUser: user,
            });
        }

        Events.on("logout", () => {
            this.logOut();
        });
    }

    render() {
        const {currentUser} = this.state;
        return (
            <div>

                <div className="jumbotron">
                    <Container>

                        <img
                            alt=""
                            src={logo}
                            width="200"
                            height="200"
                            className="rounded mx-auto d-block"
                        />
                        <h1 className="display-3 text-center"> Vanilla Car</h1>
                        <p className="text-center">Aplikacja internetowa do rezerwacji wizyt w warsztacie
                            samochodowym</p>
                    </Container>
                </div>


                {!currentUser ? (


                    <Container>
                        <hr></hr>
                        <Row>

                            <Col className="md-4"><h2>Logowanie</h2>
                                <p>Jeżeli masz już konto w naszym serwisie, zaloguj się aby dodać nową wizytę </p>
                                <p><Link
                                    to="/login"
                                    className="btn btn-primary text-center"
                                >Zaloguj &raquo;
                                </Link>
                                </p>
                            </Col>

                            <Col className="md-4"><h2>Rejestracja</h2>
                                <p>Jeżeli nie masz konta w naszym serwisie, zarejestruj się aby mieć całą wizytę napraw
                                    w
                                    jednym miejscu </p>
                                <p><Link
                                    to="/register"
                                    className="btn btn-primary text-center"
                                >Zarejestruj &raquo;
                                </Link>
                                </p>
                            </Col>
                            <Col className="md-4"><h2>Wizyty bez rejestracji</h2>
                                <p>Jeżeli nie chcesz rejestrować się w naszym serwisie, tutaj możesz zarezerwować
                                    wizytę </p>
                                <p><Link
                                    to="/notregistered"
                                    className="btn btn-primary text-center"
                                >Wizyta bez rejestracji &raquo;
                                </Link>
                                </p>
                            </Col>


                        </Row>
                    </Container>) : (<div></div>)}
            </div>
        );
    }
}
