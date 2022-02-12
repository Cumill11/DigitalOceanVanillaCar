import React, {Component} from "react";
import {Redirect} from "react-router-dom";
import {Button, Container, Table} from "react-bootstrap";
import AuthenticateService from "../../Services/AuthenticateService";
import {UpdateRole} from "./UpdateRole";
import Events from "../../Other/Events";


export default class AdminAllUsers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: null,
            userReady: false,
            currentUser: {},
            allUsers: [],
            getUserById: {},
            UserUpdateShow: false,
            UserUpdateRoleShow: false,
            UserUpdatePasswordShow: false,
            UserDeleteShow: false,
        };
    }

    componentDidMount() {
        const currentUser = AuthenticateService.getCurrentUser();

        if (!currentUser) this.setState({redirect: "/login"});
        this.setState({currentUser: currentUser, userReady: true});
        if (currentUser === null) {
        } else {
            if (currentUser.roleid === 2 || currentUser.roleid === 1 || currentUser.roleid === 4) this.setState({redirect: "/profile"});
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
                this.setState({
                    allUsers: this.state.allUsers.sort(function (a, b) {
                        return a.userId - b.userId
                    })
                })
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

    deleteUser(userId) {
        if (window.confirm("Jesteś pewny?")) {
            AuthenticateService.deleteadmin(userId).then(
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
            userid,
            allUsers,
            roleid,
            useremail,
            username,
            usersurname,

        } = this.state;

        let UserUpdateRoleClose = () =>
            this.setState({UserUpdateRoleShow: false});

        return (
            <div className="container">
                {this.state.userReady ? (
                    <div>
                        <header className="jumbotron"></header>
                        <Container fluid>
                            <div className="d-flex mt-4">
                                <hr className="my-auto flex-grow-1"></hr>
                                <div className="px-4">
                                    <h3>Wszyscy klienci</h3>
                                </div>

                                <hr className="my-auto flex-grow-1"></hr>
                            </div>


                            <Table responsive className="mt-4" striped bordered hover size="sm">
                                <thead>
                                <tr>
                                    <th class="text-center">E-Mail</th>
                                    <th class="text-center">Imię</th>
                                    <th class="text-center">Nazwisko</th>
                                    <th class="text-center">Telefon</th>
                                    <th class="text-center">Rola</th>
                                    <th class="text-center">Zmiana Roli</th>
                                    <th class="text-center">Usuń użytkownika</th>
                                </tr>
                                </thead>
                                <tbody>
                                {allUsers.map((allUsers) => (
                                    <tr key={allUsers.userId}>
                                        <td class="text-center">{allUsers.userEmail}</td>
                                        <td class="text-center">{allUsers.userName}</td>
                                        <td className="text-center">{allUsers.userSurname.slice(0, allUsers.userSurname.length - (allUsers.userSurname.length - 1)) + "..."}</td>
                                        <td class="text-center">{allUsers.userTelephone}</td>
                                        <td class="text-center">
                                            {allUsers.roleId === 2
                                                ? "Mechanik"
                                                : allUsers.roleId === 3
                                                    ? "Admin"
                                                    : allUsers.roleId === 1
                                                        ? "Użytkownik"
                                                        : allUsers.roleId === 4
                                                            ? "Szef"
                                                            : "błąd"}
                                        </td>

                                        <td align="center">
                                            <Button
                                                className="mr-2"
                                                variant="secondary"
                                                onClick={() =>
                                                    this.setState({
                                                        UserUpdateRoleShow: true,
                                                        userid: allUsers.userId,
                                                        roleid: allUsers.roleId,
                                                        useremail: allUsers.userEmail,
                                                        username: allUsers.userName,
                                                        usersurname: allUsers.userSurname,
                                                    })
                                                }
                                            >
                                                Edytuj
                                            </Button>
                                            <UpdateRole
                                                show={this.state.UserUpdateRoleShow}
                                                onHide={UserUpdateRoleClose}
                                                userid={userid}
                                                roleid={roleid}
                                                useremail={useremail}
                                                username={username}
                                                usersurname={usersurname}
                                            />
                                        </td>

                                        <td align="center">
                                            <Button
                                                className="mr-2"
                                                variant="danger"
                                                onClick={() => this.deleteUser(allUsers.userId)}
                                            >
                                                Usuń
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table> </Container>
                    </div>
                ) : null}
            </div>
        );
    }
}
