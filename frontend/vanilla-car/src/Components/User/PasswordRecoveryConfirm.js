import React, {Component} from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

import AuthenticateService from "../../Services/AuthenticateService";
import {isEmail} from "validator";
import {Card, Col, Container, Row} from "react-bootstrap";

const required = (value) => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                Pole wymagane
            </div>
        );
    }
};
const email = (value) => {
    if (!isEmail(value)) {
        return (
            <div className="alert alert-danger" role="alert">
                Podaj prawidłowy E-mail
            </div>
        );
    }
};
const vpassword = (value) => {
    if (value.length <= 5 || value.length > 40) {
        return (
            <div className="alert alert-danger" role="alert">
                Hasło musi mieć minimum 6 znaków
            </div>
        );
    }
};

export default class PasswordRecoveryConfirm extends Component {
    constructor(props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
        this.onChangeUserCode = this.onChangeUserCode.bind(this);
        this.onChangeUserEmail = this.onChangeUserEmail.bind(this);
        this.onChangeUserPassword = this.onChangeUserPassword.bind(this);
        this.onChangeUserConfirmPassword =
            this.onChangeUserConfirmPassword.bind(this);

        this.state = {
            UserCode: "",
            UserEmail: "",
            UserPassword: "",
            UserConfirmPassword: "",
            loading: false,
            message: "",
        };
    }

    onChangeUserCode(e) {
        this.setState({
            UserCode: e.target.value,
        });
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

    onChangeUserConfirmPassword(e) {
        this.setState({
            UserConfirmPassword: e.target.value,
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
            AuthenticateService.recoverconfirm(
                this.state.UserCode,
                this.state.UserEmail,
                this.state.UserPassword,
                this.state.UserConfirmPassword
            ).then(
                () => {
                    this.props.history.push("/login");
                    window.location.reload();
                },
                (error) => {
                    const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();
                    if (error.response.status === 400) {
                        this.setState({
                            loading: false,
                            message:
                                "Podany kod jest nieprawidłowy lub podano błędne powtórzone hasło",
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
        return (
            <div>
                <Container>
                    <Row className="justify-content-md-center">

                        <Col xs lg="4">
                            <div>
                                <Card>
                                    <Card.Header as="h3">Zmiana hasła</Card.Header>
                                    <Card.Body>
                                        <Form
                                            onSubmit={this.handleLogin}
                                            ref={(c) => {
                                                this.form = c;
                                            }}
                                        >
                                            <div className="form-group">
                                                <label htmlFor="text">Kod z maila</label>
                                                <Input
                                                    type="text"
                                                    className="form-control"
                                                    name="text"
                                                    value={this.state.UserCode}
                                                    onChange={this.onChangeUserCode}
                                                    validations={[required]}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="email">Email</label>
                                                <Input
                                                    type="text"
                                                    className="form-control"
                                                    name="Email"
                                                    value={this.state.UserEmail}
                                                    onChange={this.onChangeUserEmail}
                                                    validations={[required, email]}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="password">Nowe hasło</label>
                                                <Input
                                                    type="password"
                                                    className="form-control"
                                                    name="password"
                                                    value={this.state.UserPassword}
                                                    onChange={this.onChangeUserPassword}
                                                    validations={[required, vpassword]}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="password">Powtórz hasło</label>
                                                <Input
                                                    type="password"
                                                    className="form-control"
                                                    name="Password"
                                                    value={this.state.UserConfirmPassword}
                                                    onChange={this.onChangeUserConfirmPassword}
                                                    validations={[required, vpassword]}
                                                />
                                            </div>

                                            <div className="form-group">

                                                <button
                                                    className="btn btn-primary btn-block mt-4"
                                                    disabled={this.state.loading}
                                                >
                                                    {this.state.loading && (
                                                        <span className="spinner-border spinner-border-sm"></span>
                                                    )}
                                                    <span>Zmień hasło</span>
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

                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}
