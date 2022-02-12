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

const NotSunday = (value) => {
    let date=new Date(value);
    let localedate=date.toLocaleDateString("en-EN", { weekday: 'long' });
    if (localedate==="Sunday") {
        return (
            <div className="alert alert-danger" role="alert">
                W niedziele, warsztat jest nieczynny
            </div>
        );
    }
};
const minimaldate = (value) => {
    let curdate = new Date().toLocaleString("sv-SE", {hour12: false}).replace(',', '').slice(0, 16)
    let curval = value.replace('T', ' ')
    if (curval < curdate) {
        return (
            <div className="alert alert-danger" role="alert">
                Wybrana została zła data
            </div>
        );
    }
};

export class UpdatePickup extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChangePickupDateTime = this.onChangePickupDateTime.bind(this);
        this.onChangePickupCity = this.onChangePickupCity.bind(this);
        this.onChangePickupStreet = this.onChangePickupStreet.bind(this);
        this.onChangePickupPostalCode = this.onChangePickupPostalCode.bind(this);

        this.state = {
            PickupCity: "",
            PickupStreet: "",
            PickupPostalCode: "",
            PickupDateTime: "",
            loading: false,
            message: "",
        };
    }

    onChangePickupDateTime(e) {
        this.setState({
            PickupDateTime: e.target.value,
        });
    }

    onChangePickupCity(e) {
        this.setState({
            PickupCity: e.target.value,
        });
    }

    onChangePickupStreet(e) {
        this.setState({
            PickupStreet: e.target.value,
        });
    }

    onChangePickupPostalCode(e) {
        this.setState({
            PickupPostalCode: e.target.value,
        });
    }

    async handleSubmit(e) {
        e.preventDefault();
        if (this.state.PickupDateTime === "") {
            await this.setState({
                PickupDateTime: this.props.pickupdatetime,
            });
        }
        if (this.state.PickupCity === "") {
            await this.setState({
                PickupCity: this.props.pickupcity,
            });
        }
        if (this.state.PickupStreet === "") {
            await this.setState({
                PickupStreet: this.props.pickupstreet,
            });
        }
        if (this.state.PickupPostalCode === "") {
            await this.setState({
                PickupPostalCode: this.props.pickuppostalcode,
            });
        }

        this.setState({
            message: "",
            loading: true,
        });

        this.form.validateAll();

        if (this.checkBtn.context._errors.length === 0) {
            VisitService.UpdatePickup(
                this.props.visitid,
                this.state.PickupDateTime,
                this.state.PickupCity,
                this.state.PickupStreet,
                this.state.PickupPostalCode
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
        let time = new Date(this.props.pickupdatetime);

        time.setHours(time.getHours() - 3);

        let start = new Date(this.props.pickupdatetime);
        start.setDate(start.getDate() - 1);

        let min = start.toLocaleString("sv-SE", {hour12: false});
        let before = time.toLocaleString("sv-SE", {hour12: false});


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
                            Dodaj adres odbioru
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
                                        <label className="mb-2" htmlFor="manufacturer">
                                            Możesz wybrać datę i czas odbioru do jednego dnia przed
                                            wizytą i maksymalnie do 3h przed wizytą
                                        </label>

                                        <label htmlFor="manufacturer">
                                            Data i godzina odbioru
                                        </label>
                                        <Input
                                            type="datetime-local"
                                            className="form-control"
                                            name="manufacturer"
                                            value={this.props.pickupdatetime}
                                            min={min}
                                            max={before}
                                            onChange={this.onChangePickupDateTime}
                                            validations={[required,NotSunday,minimaldate]}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="name">Miasto</label>
                                        <Input
                                            type="text"
                                            className="form-control"
                                            name="name"
                                            maxlength="50"
                                            value={this.props.pickupcity}
                                            onChange={this.onChangePickupCity}
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
                                            value={this.props.pickupstreet}
                                            onChange={this.onChangePickupStreet}
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
                                            value={this.props.pickuppostalcode}
                                            onChange={this.onChangePickupPostalCode}
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
