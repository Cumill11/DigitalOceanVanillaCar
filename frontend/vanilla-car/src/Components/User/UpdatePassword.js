import React, {Component} from "react";
import {Button, Modal, Row, Stack} from "react-bootstrap";
import AuthenticateService from "../../Services/AuthenticateService";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

const required = (value) => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                Pole wymagane
            </div>
        );
    }
};

export class UpdatePassword extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChangeUserOldPassword = this.onChangeUserOldPassword.bind(this);
        this.onChangeUserPassword = this.onChangeUserPassword.bind(this);
        this.onChangeUserConfirmPassword =
            this.onChangeUserConfirmPassword.bind(this);

        this.state = {
            UserOldPassword: "",
            UserPassword: "",
            UserConfirmPassword: "",
            loading: false,
            message: "",
        };
    }

    onChangeUserOldPassword(e) {
        this.setState({
            UserOldPassword: e.target.value,
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

    handleSubmit(e) {
        e.preventDefault();

        this.setState({
            message: "",
            loading: true,
        });

        this.form.validateAll();
        if (this.checkBtn.context._errors.length === 0) {
            AuthenticateService.updatepassword(
                this.props.userid,
                this.state.UserOldPassword,
                this.state.UserPassword,
                this.state.UserConfirmPassword
            ).then(
                () => {
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
                                "Podano błędne stare hasło lub powtórzone hasło",
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
            <div className="container">
                <Modal
                    {...this.props}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Edytuj Hasło
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Form
                                onSubmit={this.handleSubmit}
                                ref={(c) => {
                                    this.form = c;
                                }}
                            >
                                <div className="mb-4">
                                    <div className="form-group">
                                        <label htmlFor="password">Stare hasło</label>
                                        <Input
                                            type="password"
                                            className="form-control"
                                            name="password"
                                            value={this.state.UseOldPassword}
                                            onChange={this.onChangeUserOldPassword}
                                            validations={[required]}
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
                                            validations={[required]}
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
                                            validations={[required]}
                                        />
                                    </div>
                                </div>

                                <Stack direction="horizontal" gap={3}>
                                    <button
                                        className="btn btn-primary btn-block ps-5 pe-5"
                                        disabled={this.state.loading}
                                    >
                                        {this.state.loading && (
                                            <span className="spinner-border spinner-border-sm"></span>
                                        )}
                                        <span>Zmień hasło</span>
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
