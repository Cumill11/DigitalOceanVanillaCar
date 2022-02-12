import React, {Component} from "react";
import {Redirect} from "react-router-dom";
import {Button, Table} from "react-bootstrap";
import AuthenticateService from "../../Services/AuthenticateService";
import Events from "../../Other/Events";
import {ShowMore} from "./ShowMore";
import CarService from "../../Services/CarService";
import VisitService from "../../Services/VisitService";

export default class AllClients extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: null,
            userReady: false,
            currentUser: {},
            allUsers: [
                {
                    userid: 1,
                },
            ],
            getUserById: {},
            UserVisitShow: false,
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
    }

    showuservisits(allUsers) {
        allUsers.map((allUsers) => (
            VisitService.getVisitForPropsUser(allUsers.userId).then(
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
                            return a.visitId - b.visitId
                        })
                    })
                },
            )))
    }

    showusercars(allUsers) {
        allUsers.map((allUsers) => (
            CarService.getCar(allUsers.userId).then(
                (response) => {
                    if (response === undefined) {
                        Events.dispatch("logout");
                        this.props.history.push("/");
                        window.location.reload();

                    } else {
                        this.setState({
                            car: response.data,
                            UserVisitShow: true,
                            userid: allUsers.userId,
                            username: allUsers.userName,
                            usersurname: allUsers.userSurname,
                            useremail: allUsers.userEmail
                        })
                    }
                    ;
                    this.setState({
                        car: this.state.car.sort(function (a, b) {
                            return a.carId - b.carId
                        })
                    })
                }
            )))
    }

    showmore(allUsers) {
        this.showuservisits(allUsers);
        this.showusercars(allUsers);
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect}/>;
        }

        const {allUsers, userid, username, usersurname, car, uservisit, useremail} = this.state;

        let UserVisitClose = () => this.setState({UserVisitShow: false});

        return (
            <div className="container">
                {this.state.userReady ? (
                    <div>
                        <header className="jumbotron">
                            <div className="d-flex">
                                <hr className="my-auto flex-grow-1"></hr>
                                <div className="px-4">
                                    <h3>Wszyscy klienci</h3>
                                </div>
                                <hr className="my-auto flex-grow-1"></hr>
                            </div>
                        </header>

                        <Table responsive className="mt-4" striped bordered hover size="sm">
                            <thead>
                            <tr>
                                <th class="text-center">E-Mail</th>
                                <th class="text-center">Imię</th>
                                <th class="text-center">Nazwisko</th>
                                <th class="text-center">Telefon</th>
                                <th class="text-center">Więcej</th>
                            </tr>
                            </thead>
                            <tbody>
                            {allUsers.map((allUsers) => (
                                <>
                                    {allUsers.roleId === 1 ? (<tr key={allUsers.userId}>
                                        <td className="text-center">{allUsers.userEmail}</td>
                                        <td className="text-center">{allUsers.userName}</td>
                                        <td className="text-center">{allUsers.userSurname.slice(0, allUsers.userSurname.length - (allUsers.userSurname.length - 1)) + "..."}</td>
                                        <td className="text-center">{allUsers.userTelephone === null ? (
                                            <div>Nie dodano numeru</div>) : (<>{allUsers.userTelephone}</>)}</td>
                                        <td align="center">
                                            {" "}
                                            <Button
                                                className="mr-2"
                                                variant="primary"
                                                onClick={() =>
                                                    this.showmore([allUsers])
                                                }
                                            >
                                                Więcej
                                            </Button>
                                            <ShowMore
                                                show={this.state.UserVisitShow}
                                                onHide={UserVisitClose}
                                                userid={userid}
                                                username={username}
                                                usersurname={usersurname}
                                                car={car}
                                                uservisit={uservisit}
                                                useremail={useremail}
                                            />
                                        </td>
                                    </tr>) : (<div></div>)}

                                </>))}
                            </tbody>
                        </Table>
                    </div>
                ) : null}
            </div>
        );
    }
}
