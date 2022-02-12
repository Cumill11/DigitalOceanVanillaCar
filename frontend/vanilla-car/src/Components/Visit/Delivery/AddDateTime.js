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
const minimalhour = (value) => {
    let curval = value.replace('T', ' ').slice(11)
    let hours=curval.slice(0,-3).toString();
    if (parseInt(hours) <10||parseInt(hours)>18) {
        return (
            <div className="alert alert-danger" role="alert">
                Zapisy na wizytę prowadzone są od 10 do 18
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

export class AddDateTime extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChangeDeliveryDateTime = this.onChangeDeliveryDateTime.bind(this);

        this.state = {
            DeliveryDateTime: "",
            loading: false,
            message: "",
        };
    }

    onChangeDeliveryDateTime(e) {
        this.setState({
            DeliveryDateTime: e.target.value,
        });
    }

    async handleSubmit(e) {
        e.preventDefault();
        var time = new Date(this.props.visitdatetime);

        time.setHours(time.getHours() + 1);

        var start = new Date(this.props.visitdatetime);
        start.setDate(start.getDate() + 14);

        var after = time.toLocaleString("sv-SE", {hour12: false});
        var fixedafter =
            after.replace(" ", "").slice(0, 10) +
            "T" +
            after.slice(10).replace(" ", "");

        if (this.state.DeliveryDateTime === "") {
            await this.setState({
                DeliveryDateTime: fixedafter,
            });
        }

        this.setState({
            message: "",
            loading: true,
        });

        this.form.validateAll();

        if (this.checkBtn.context._errors.length === 0) {
            VisitService.AddDeliveryDateTime(
                this.props.visitid,
                this.state.DeliveryDateTime
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
        var time = new Date(this.props.visitdatetime);

        time.setHours(time.getHours() + 1);

        var start = new Date(this.props.visitdatetime);
        start.setDate(start.getDate() + 14);

        var max = start.toLocaleString("sv-SE", {hour12: false});
        var after = time.toLocaleString("sv-SE", {hour12: false});

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
                            Dodaj datę dostawy
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
                                <div className="form-group mb-4">
                                    <label htmlFor="manufacturer">
                                        Data i godzina dostawy
                                    </label>
                                    <Input
                                        type="datetime-local"
                                        className="form-control"
                                        name="manufacturer"
                                        value={after}
                                        min={this.props.visitdatetime}
                                        max={max}
                                        onChange={this.onChangeDeliveryDateTime}
                                        validations={[required,NotSunday,minimalhour,minimaldate]}
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
