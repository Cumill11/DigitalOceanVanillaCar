import React, {Component} from "react";
import {Button, Modal, Row, Stack} from "react-bootstrap";
import VisitService from "../../../Services/VisitService";
import Form from "react-validation/build/form";
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

export class AddLogNotRegistered extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChangeVisitLog = this.onChangeVisitLog.bind(this);

        this.state = {
            VisitLog: "",
            loading: false,
            message: "",
        };
    }

    onChangeVisitLog(e) {
        this.setState({
            VisitLog: e.target.value,
        });
    }

    async handleSubmit(e) {
        e.preventDefault();


        this.setState({
            message: "",
            loading: true,
        });

        this.form.validateAll();

        if (this.checkBtn.context._errors.length === 0) {
            VisitService.AddVisitLogNotRegistered(this.props.visitid, this.state.VisitLog).then(
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
                            Dodaj opis wizyty
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
                                        Opis wizyty
                                    </label>
                                    <textarea
                                        type="datetime-local"
                                        className="form-control"
                                        name="manufacturer"
                                        value={this.props.visitlog}
                                        onChange={this.onChangeVisitLog}
                                        validations={[required]}
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
