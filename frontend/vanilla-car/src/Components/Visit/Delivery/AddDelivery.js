import React, {Component} from "react";
import {Button, Modal, Row, Stack} from "react-bootstrap";
import VisitService from "../../../Services/VisitService";
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

export class AddDelivery extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChangeDeliveryCity = this.onChangeDeliveryCity.bind(this);
        this.onChangeDeliveryStreet = this.onChangeDeliveryStreet.bind(this);
        this.onChangeDeliveryPostalCode =
            this.onChangeDeliveryPostalCode.bind(this);

        this.state = {
            DeliveryCity: "",
            DeliveryStreet: "",
            DeliveryPostalCode: "",
            loading: false,
            message: "",
        };
    }

    onChangeDeliveryCity(e) {
        this.setState({
            DeliveryCity: e.target.value,
        });
    }

    onChangeDeliveryStreet(e) {
        this.setState({
            DeliveryStreet: e.target.value,
        });
    }

    onChangeDeliveryPostalCode(e) {
        this.setState({
            DeliveryPostalCode: e.target.value,
        });
    }

    async handleSubmit(e) {
        e.preventDefault();
        if (this.state.DeliveryCity === "") {
            await this.setState({
                DeliveryCity: this.props.clientcity,
            });
        }
        if (this.state.DeliveryStreet === "") {
            await this.setState({
                DeliveryStreet: this.props.clientstreet,
            });
        }
        if (this.state.DeliveryPostalCode === "") {
            await this.setState({
                DeliveryPostalCode: this.props.clientpostalcode,
            });
        }

        this.setState({
            message: "",
            loading: true,
        });

        this.form.validateAll();

        if (this.checkBtn.context._errors.length === 0) {
            VisitService.addDelivery(
                this.props.visitid,
                this.state.DeliveryCity,
                this.state.DeliveryStreet,
                this.state.DeliveryPostalCode
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
                            Dodaj adres dostawy
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
                                        <label htmlFor="manufacturer">
                                            Tutaj możesz zlecić dostawę po skończonej wizycie, dokładny
                                            termin dostawy zobaczysz po zakcpetowaniu ze strony
                                            warsztatu
                                        </label>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="name">Miasto</label>
                                        <Input
                                            type="text"
                                            className="form-control"
                                            name="name"
                                            maxlength="50"
                                            value={this.props.clientcity}
                                            onChange={this.onChangeDeliveryCity}
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
                                            value={this.props.clientstreet}
                                            onChange={this.onChangeDeliveryStreet}
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
                                            value={this.props.clientpostalcode}
                                            onChange={this.onChangeDeliveryPostalCode}
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
