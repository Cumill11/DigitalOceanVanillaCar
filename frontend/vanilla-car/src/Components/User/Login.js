import React, {Component} from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import AuthService from "../../Services/AuthenticateService";
import {Button, Card, Col, Container, Row} from "react-bootstrap";
import {PasswordRecovery} from "./PasswordRecovery";
import {ConfirmAccount} from "./ConfirmAccount";


const required = (value) => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                Pole wymagane
            </div>
        );
    }
};

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
        this.onChangeUserEmail = this.onChangeUserEmail.bind(this);
        this.onChangeUserPassword = this.onChangeUserPassword.bind(this);

        this.state = {
            UserEmail: "",
            UserPassword: "",
            loading: false,
            message: "",
            RecoveryShow: false,
            ConfirmShow: false
        };
    }

    onChangeUserEmail(e) {
        this.setState({
            UserEmail: e.target.value,
        });
    }

    onChangeUserPassword(e) {
        this.setState({
            UserPassword: e.target.value,
        });
    }

    handleLogin(e) {
        e.preventDefault();

        this.setState({
            message: "",
            loading: true,
        });

        this.form.validateAll();

        if (this.checkBtn.context._errors.length === 0) {
            AuthService.login(this.state.UserEmail, this.state.UserPassword).then(
                (response) => {
                    if (response.roleid === 1) {
                        this.props.history.push("/profile");
                        window.location.reload();
                    } else if (response.roleid === 2) {
                        this.props.history.push("/mechanic");
                        window.location.reload();
                    } else if (response.roleid === 3) {
                        this.props.history.push("/admin");
                        window.location.reload();
                    } else if (response.roleid === 4) {
                        this.props.history.push("/boss");
                        window.location.reload();
                    }

                },
                (error) => {
                    const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();
                    if (error.response.status === 404) {
                        this.setState({
                            loading: false,
                            message:
                                "Podany email lub hasło jest nieprawidłowe lub konto nie jest potwierdzone",
                        });
                    } else if (error.response.status === 400) {
                        this.setState({
                            loading: false,
                            message:
                                "Podany email lub hasło jest nieprawidłowe",
                        });
                    } else
                        this.setState({
                            loading: false,
                            message: resMessage,
                        });
                }
            );
        } else {
            this.setState({
                loading: false,
            });
        }
    }


    render() {
        let RecoveryClose = () => this.setState({RecoveryShow: false});
        let ConfirmClose = () => this.setState({ConfirmShow: false});


        return (
            <div>
                <Container>
                    <Row className="justify-content-md-center">

                        <Col xs lg="4">
                            <div>
                                <Card>
                                    <Card.Header as="h3">Zaloguj</Card.Header>
                                    <Card.Body>
                                        <Form
                                            onSubmit={this.handleLogin}
                                            ref={(c) => {
                                                this.form = c;
                                            }}
                                        >
                                            <div className="form-group">
                                                <label htmlFor="email">Email</label>
                                                <Input
                                                    type="text"
                                                    className="form-control"
                                                    name="Email"
                                                    value={this.state.UserEmail}
                                                    onChange={this.onChangeUserEmail}
                                                    validations={[required]}
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="password">Hasło</label>
                                                <Input
                                                    type="password"
                                                    className="form-control"
                                                    name="password"
                                                    value={this.state.UserPassword}
                                                    onChange={this.onChangeUserPassword}
                                                    validations={[required]}
                                                />
                                            </div>


                                            <div className="d-grid gap-2 mt-4">
                                                <button
                                                    className="btn btn-primary btn-block"
                                                    disabled={this.state.loading}
                                                >
                                                    {this.state.loading && (
                                                        <span className="spinner-border spinner-border-sm"></span>
                                                    )}
                                                    <span>Zaloguj</span>
                                                </button>
                                            </div>

                                            {this.state.message && (
                                                <div className="form-group">
                                                    <div className="alert alert-danger" role="alert">
                                                        {this.state.message}
                                                    </div>
                                                </div>
                                            )}
                                            <CheckButton
                                                style={{display: "none"}}
                                                ref={(c) => {
                                                    this.checkBtn = c;
                                                }}
                                            />
                                        </Form>
                                    </Card.Body>
                                </Card>

                            </div>

                            <div className="d-grid gap-2 mt-4">
                                <Button
                                    className="mr-2"
                                    variant="secondary"
                                    onClick={() =>
                                        this.setState({
                                            RecoveryShow: true,

                                        })
                                    }
                                >
                                    Przypomnij hasło
                                </Button>
                                <PasswordRecovery
                                    show={this.state.RecoveryShow}
                                    onHide={RecoveryClose}
                                />


                                <Button
                                    className="mr-2"
                                    variant="secondary"
                                    onClick={() =>
                                        this.setState({
                                            ConfirmShow: true,

                                        })
                                    }
                                >
                                    Potwierdź konto
                                </Button>
                                <ConfirmAccount
                                    show={this.state.ConfirmShow}
                                    onHide={ConfirmClose}
                                />
                            </div>
                        </Col>
                    </Row>
                </Container>


            </div>
        );
    }
}
