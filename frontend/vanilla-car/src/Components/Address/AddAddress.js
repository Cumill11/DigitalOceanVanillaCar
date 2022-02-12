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

export class AddAddress extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChangeClientCity = this.onChangeClientCity.bind(this);
        this.onChangeClientStreet = this.onChangeClientStreet.bind(this);
        this.onChangeClientPostalCode = this.onChangeClientPostalCode.bind(this);

        this.state = {
            ClientCity: "",
            ClientStreet: "",
            ClientPostalCode: "",
            loading: false,
            message: "",
        };
    }

    onChangeClientCity(e) {
        this.setState({
            ClientCity: e.target.value,
        });
    }

    onChangeClientStreet(e) {
        this.setState({
            ClientStreet: e.target.value,
        });
    }

    onChangeClientPostalCode(e) {
        this.setState({
            ClientPostalCode: e.target.value,
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
            AuthenticateService.addaddress(
                this.props.userid,
                this.state.ClientCity,
                this.state.ClientStreet,
                this.state.ClientPostalCode,
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
                            Dodaj adres
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
                                        <label htmlFor="name">Miasto</label>
                                        <Input
                                            type="text"
                                            className="form-control"
                                            name="name"
                                            maxlength="50"
                                            value={this.state.ClientCity}
                                            onChange={this.onChangeClientCity}
                                            validations={[required]}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="description">Ulica</label>
                                        <Input
                                            type="text"
                                            className="form-control"
                                            name="description"
                                            maxlength="50"
                                            value={this.state.ClientStreet}
                                            onChange={this.onChangeClientStreet}
                                            validations={[required]}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="Category">Kod pocztowy</label>
                                        <Input
                                            type="text"
                                            className="form-control"
                                            name="category"
                                            pattern="[0-9]{2}-[0-9]{3}"
                                            value={this.state.ClientPostalCode}
                                            onChange={this.onChangeClientPostalCode}
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
