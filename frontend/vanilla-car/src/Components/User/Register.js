import React, {Component} from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import {isEmail} from "validator";
import {Redirect} from "react-router-dom";
import AuthService from "../../Services/AuthenticateService";
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
                Hasło musi mieć mimimum 6 znaków
            </div>
        );
    }
};

export default class Register extends Component {
    state = {redirect: null};

    constructor(props) {
        super(props);
        this.handleRegister = this.handleRegister.bind(this);
        this.onChangeUserEmail = this.onChangeUserEmail.bind(this);
        this.onChangeUserPassword = this.onChangeUserPassword.bind(this);
        this.onChangeUserConfirmPassword =
            this.onChangeUserConfirmPassword.bind(this);
        this.onChangeUserName = this.onChangeUserName.bind(this);
        this.onChangeUserSurname = this.onChangeUserSurname.bind(this);

        this.state = {
            UserEmail: "",
            UserPassword: "",
            UserConfirmPassword: "",
            UserName: "",
            UserSurname: "",
            loading: false,
            successful: false,
            message: "",
            hidden: false,
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

    onChangeUserConfirmPassword(e) {
        this.setState({
            UserConfirmPassword: e.target.value,
        });
    }

    onChangeUserName(e) {
        this.setState({
            UserName: e.target.value,
        });
    }

    onChangeUserSurname(e) {
        this.setState({
            UserSurname: e.target.value,
        });
    }

    handleRegister(e) {
        e.preventDefault();

        this.setState({
            message: "",
            successful: false,
            loading: true,
        });

        this.form.validateAll();

        if (this.checkBtn.context._errors.length === 0) {
            AuthService.register(
                this.state.UserEmail,
                this.state.UserPassword,
                this.state.UserConfirmPassword,
                this.state.UserName,
                this.state.UserSurname
            ).then(
                (response) => {
                    this.setState({
                        message: "Zarejestrowano",
                        successful: true,
                    });
                    this.setState({redirect: "/login"});
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
                                "Podany email jest już wykorzystany, lub podano błędne powtórzone hasło",
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
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect}/>;
        }

        return (
            <div>
                <Container>
                    <Row className="justify-content-md-center">
                        <Col xs lg="4">
                            <Form
                                onSubmit={this.handleRegister}
                                ref={(c) => {
                                    this.form = c;
                                }}
                            >
                                {!this.state.successful && (
                                    <div>
                                        <Card>
                                            <Card.Header as="h3">Zarejestruj</Card.Header>
                                            <Card.Body>
                                                <div className="form-group">
                                                    <label htmlFor="email">Email</label>
                                                    <Input
                                                        type="text"
                                                        className="form-control"
                                                        name="email"
                                                        value={this.state.UserEmail}
                                                        onChange={this.onChangeUserEmail}
                                                        validations={[required, email]}
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
                                                        validations={[required, vpassword]}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="password">Potwierdź hasło</label>
                                                    <Input
                                                        type="password"
                                                        className="form-control"
                                                        name="password"
                                                        value={this.state.UserConfirmPassword}
                                                        onChange={this.onChangeUserConfirmPassword}
                                                        validations={[required, vpassword]}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="text">Imię</label>
                                                    <Input
                                                        type="text"
                                                        className="form-control"
                                                        name="text"
                                                        maxlength="50"
                                                        value={this.state.UserName}
                                                        onChange={this.onChangeUserName}
                                                        validations={[required]}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="text">Nazwisko</label>
                                                    <Input
                                                        type="text"
                                                        className="form-control"
                                                        name="text"
                                                        maxlength="50"
                                                        value={this.state.UserSurname}
                                                        onChange={this.onChangeUserSurname}
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
                                                        <span>Zarejestruj</span>
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
                                            </Card.Body>
                                        </Card>
                                    </div>
                                )}
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}
