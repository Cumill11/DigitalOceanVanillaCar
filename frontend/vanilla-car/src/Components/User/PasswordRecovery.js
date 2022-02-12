import React, {Component} from "react";
import {Button, Modal, Row, Stack} from "react-bootstrap";
import Form from "react-validation/build/form";
import CheckButton from "react-validation/build/button";
import Input from "react-validation/build/input";
import AuthenticateService from "../../Services/AuthenticateService";
import {Redirect} from "react-router-dom";
import {isEmail} from "validator";

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

export class PasswordRecovery extends Component {
    constructor(props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
        this.onChangeUserEmail = this.onChangeUserEmail.bind(this);

        this.state = {
            UserEmail: "",
            loading: false,
            message: "",
        };
    }

    onChangeUserEmail(e) {
        this.setState({
            UserEmail: e.target.value,
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
            AuthenticateService.recover(this.state.UserEmail).then(
                () => {

                    this.setState({redirect: "/recoverconfirm"});
                },
                (error) => {
                    const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();

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
            <div className="container">
                <Modal
                    {...this.props}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Przypomnij hasło
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Form
                                onSubmit={this.handleLogin}
                                ref={(c) => {
                                    this.form = c;
                                }}>

                                <div className="form-group mb-4">
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

                                <Stack direction="horizontal" gap={3}>
                                    <button
                                        className="btn btn-primary btn-block ps-5 pe-5"
                                        disabled={this.state.loading}
                                    >
                                        {this.state.loading && (
                                            <span className="spinner-border spinner-border-sm"></span>
                                        )}
                                        <span>Przypomnij hasło</span>
                                    </button>
                                    <Button className="ms-auto ps-5 pe-5" variant="danger"
                                            onClick={this.props.onHide}>Anuluj</Button>
                                </Stack>

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
                        </Row>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}
