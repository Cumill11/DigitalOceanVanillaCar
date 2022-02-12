import React, {Component} from "react";
import {Button, Modal, Row, Stack} from "react-bootstrap";
import AuthenticateService from "../../Services/AuthenticateService";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
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
const telephone = (value) => {
    if (value.length <= 8 || value.length > 16) {
        return (
            <div className="alert alert-danger" role="alert">
                Numer musi miec 9 cyfr
            </div>
        );
    }
};

export class MechanicUpdate extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChangeUserEmail = this.onChangeUserEmail.bind(this);
        this.onChangeUserName = this.onChangeUserName.bind(this);
        this.onChangeUserSurname = this.onChangeUserSurname.bind(this);
        this.onChangeUserTelephone = this.onChangeUserTelephone.bind(this);
        this.onChangeUserPassword = this.onChangeUserPassword.bind(this);
        this.onChangeUserDescription = this.onChangeUserDescription.bind(this);

        this.state = {
            UserEmail: "",
            UserName: "",
            UserSurname: "",
            UserTelephone: "",
            UserPassword: "",
            UserDescription: "",
            loading: false,
            message: "",
        };
    }

    onChangeUserEmail(e) {
        this.setState({
            UserEmail: e.target.value,
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

    onChangeUserTelephone(e) {
        this.setState({
            UserTelephone: e.target.value,
        });
    }

    onChangeUserPassword(e) {
        this.setState({
            UserPassword: e.target.value,
        });
    }

    onChangeUserDescription(e) {
        this.setState({
            UserDescription: e.target.value,
        });
    }

    async handleSubmit(e) {
        e.preventDefault();

        if (this.state.UserEmail === "") {
            await this.setState({
                UserEmail: this.props.useremail,
            });
        }
        if (this.state.UserName === "") {
            await this.setState({
                UserName: this.props.username,
            });
        }
        if (this.state.UserSurname === "") {
            await this.setState({
                UserSurname: this.props.usersurname,
            });
        }
        if (this.state.UserTelephone === "") {
            await this.setState({
                UserTelephone: this.props.usertelephone,
            });
        }
        if (this.state.UserDescription === "") {
            await this.setState({
                UserDescription: this.props.userdescription,
            });
        }

        this.setState({
            message: "",
            loading: true,
        });

        this.form.validateAll();
        if (this.checkBtn.context._errors.length === 0) {
            AuthenticateService.updatemechanic(
                this.props.userid,
                this.state.UserEmail,
                this.state.UserPassword,
                this.state.UserName,
                this.state.UserSurname,
                this.state.UserTelephone,
                this.state.UserDescription
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
                            Edytuj profil
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
                                        <label htmlFor="email">Email</label>
                                        <Input
                                            type="email"
                                            className="form-control"
                                            name="email"
                                            value={this.props.useremail}
                                            onChange={this.onChangeUserEmail}
                                            validations={[required, email]}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="name">Imię</label>
                                        <Input
                                            type="text"
                                            className="form-control"
                                            name="text"
                                            maxlength="50"
                                            value={this.props.username}
                                            onChange={this.onChangeUserName}
                                            validations={[required]}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="surname">Nazwisko</label>
                                        <Input
                                            type="text"
                                            className="form-control"
                                            name="text"
                                            maxlength="50"
                                            value={this.props.usersurname}
                                            onChange={this.onChangeUserSurname}
                                            validations={[required]}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="telephone">Telefon</label>
                                        <Input
                                            type="number"
                                            className="form-control"
                                            name="telephone"
                                            pattern="[0-9]{9}|[0-9]{3} [0-9]{3} [0-9]{3}|[+0-9]{3,4} [0-9]{9}|[+0-9]{3,4} [0-9]{3} [0-9]{3} [0-9]{3}"
                                            minlength="9"
                                            maxlength="15"
                                            value={this.props.usertelephone}
                                            onChange={this.onChangeUserTelephone}
                                            validations={[required, telephone]}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="description">Opis</label>
                                        <Input
                                            type="text"
                                            className="form-control"
                                            name="text"
                                            maxlength="100"
                                            value={this.props.userdescription}
                                            onChange={this.onChangeUserDescription}
                                            validations={[required]}
                                        />
                                    </div>

                                    <div className="form-group mt-4">
                                        <label htmlFor="password">Potwierdź hasłem</label>
                                        <Input
                                            type="password"
                                            className="form-control"
                                            name="password"
                                            value={this.state.UserPassword}
                                            onChange={this.onChangeUserPassword}
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
                                        <span>Ok</span>
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
