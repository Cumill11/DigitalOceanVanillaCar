import React, {Component} from "react";
import {Route, Switch} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import logo from "./k.svg";

import AuthenticateService from "./Services/AuthenticateService";
import Home from "./Home";
import Register from "./Components/User/Register";
import Login from "./Components/User/Login";
import RecoverConfirm from "./Components/User/PasswordRecoveryConfirm";
import Profile from "./Components/User/Profile";
import Admin from "./Components/Admin/Admin";
import AdminAllUsers from "./Components/Admin/AdminAllUsers";
import Mechanic from "./Components/Mechanic/Mechanic";
import Boss from "./Components/Boss/Boss";
import Car from "./Components/Car/Car";
import EmailConfirm from "./Components/User/EmailConfirm";
import Visit from "./Components/Visit/Visit";
import Events from "./Other/Events";
import AllCars from "./Components/Car/AllCars";
import AllClients from "./Components/Boss/AllClients";
import ShowAllVisitForMechanic from "./Components/Visit/Mechanic/ShowAllVisitForMechanic";
import {Container, Nav, Navbar} from "react-bootstrap";
import VisitCode from "./Components/Visit/VisitCode";
import NotRegistered from "./Components/Visit/NotRegistered/NotRegistered";
import VisitCodeNotRegistered from "./Components/Visit/NotRegistered/VisitCodeNotRegistered";
import NotRegisteredVisits from "./Components/Boss/NotRegisteredVisits";
import AllMechanics from "./Components/Boss/AllMechanics";

class App extends Component {
    constructor(props) {
        super(props);
        this.logOut = this.logOut.bind(this);

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
                },

                (error) => {
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();
                    if (error.response && error.response.status) {
                        Events.dispatch("logout");
                    }
                }
            )
        }
        ;


        if (user) {
            this.setState({
                currentUser: user,
            });
        }

        Events.on("logout", () => {
            this.logOut();
        });
    }

    componentWillUnmount() {
        Events.remove("logout");
    }

    logOut() {
        AuthenticateService.logout();
        this.setState({
            currentUser: undefined,
        });
    }

    render() {
        const {currentUser, getUserById} = this.state;
        return (
            <div>
                <div>
                    <Navbar collapseOnSelect expand="sm" bg="dark" variant="dark">
                        <Container>
                            <Navbar.Brand href="/">
                                <img
                                    alt=""
                                    src={logo}
                                    width="30"
                                    height="30"
                                    className="d-inline-block align-top"
                                />
                                {"  "}
                                VanillaCar
                            </Navbar.Brand>
                            <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                            {currentUser ? (
                                <>
                                    <Navbar.Collapse id="responsive-navbar-nav">
                                        <Nav className="me-auto">
                                            {getUserById.roleId === 4 && (
                                                <>
                                                    <Nav.Link href="/boss">Panel szefa</Nav.Link>
                                                    <Nav.Link href="/allclients">
                                                        Wszyscy klienci
                                                    </Nav.Link>
                                                    <Nav.Link href="/allmechanics">
                                                        Wszyscy mechanicy
                                                    </Nav.Link>
                                                    <Nav.Link href="/allcars">
                                                        Wszystkie samochody
                                                    </Nav.Link>
                                                    <Nav.Link href="/notregisteredvisits">
                                                        Wizyty bez rejestracji
                                                    </Nav.Link>

                                                </>
                                            )}
                                            {getUserById.roleId === 3 && (
                                                <>
                                                    <Nav.Link href="/admin">Panel admina</Nav.Link>
                                                    <Nav.Link href="/adminusers">
                                                        Wszyscy klienci
                                                    </Nav.Link>
                                                </>
                                            )}
                                            {getUserById.roleId === 2 && (
                                                <>
                                                    <Nav.Link href="/mechanic">Panel mechanika</Nav.Link>
                                                    <Nav.Link href="/mechanicvisit">Wizyty</Nav.Link>
                                                </>
                                            )}
                                            {getUserById.roleId === 1 && (
                                                <>
                                                    <Nav.Link href="/profile">Panel klienta</Nav.Link>
                                                    <Nav.Link href="/car">Samochody</Nav.Link>
                                                    <Nav.Link href="/visit">Wizyty</Nav.Link>
                                                </>
                                            )}
                                        </Nav>
                                        <Nav>
                                            <Nav.Link href="/login" onClick={this.logOut}>
                                                Wyloguj
                                            </Nav.Link>
                                            */}
                                        </Nav>
                                    </Navbar.Collapse>
                                </>
                            ) : (
                                <>
                                    <Navbar.Collapse id="responsive-navbar-nav">
                                        <Nav className="me-auto">
                                            <Nav.Link href="/login">Zaloguj</Nav.Link>
                                            <Nav.Link href="/register">Zarejestruj</Nav.Link>
                                            <Nav.Link href="/notregistered">
                                                Wizyta bez rejestracji
                                            </Nav.Link>
                                        </Nav>
                                    </Navbar.Collapse>
                                </>
                            )}
                        </Container>
                    </Navbar>

                </div>
                <div className="footer bg-dark text-center">
                    <p>&copy; VanillaCar | Kamil Kowalczyk 2021-2022</p>
                </div>

                <div className="container mt-3 mb-5">
                    <Switch>
                        <Route exact path={["/", "/home"]} component={Home}/>
                        <Route exact path="/code" component={VisitCode}/>
                        <Route exact path="/codenotregistered" component={VisitCodeNotRegistered}/>


                        <Route exact path="/profile" component={Profile}/>
                        <Route exact path="/car" component={Car}/>
                        <Route exact path="/visit" component={Visit}/>


                        <Route exact path="/mechanic" component={Mechanic}/>
                        <Route exact path="/mechanicvisit" component={ShowAllVisitForMechanic}/>


                        <Route exact path="/admin" component={Admin}/>
                        <Route exact path="/adminusers" component={AdminAllUsers}/>


                        <Route exact path="/boss" component={Boss}/>
                        <Route exact path="/allclients" component={AllClients}/>
                        <Route exact path="/allmechanics" component={AllMechanics}/>
                        <Route exact path="/notregisteredvisits" component={NotRegisteredVisits}/>
                        <Route exact path="/allcars" component={AllCars}/>


                        <Route exact path="/login" component={Login}/>
                        <Route exact path="/register" component={Register}/>
                        <Route exact path="/emailconfirm" component={EmailConfirm}/>
                        <Route exact path="/recoverconfirm" component={RecoverConfirm}/>
                        <Route exact path="/notregistered" component={NotRegistered}/>


                    </Switch>
                </div>
            </div>

        );
    }
}

export default App;
