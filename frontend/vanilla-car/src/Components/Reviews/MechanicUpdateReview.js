import React, {Component} from "react";
import {Button, Modal, Row, Stack} from "react-bootstrap";
import ReviewService from "../../Services/ReviewService";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import Select from "react-validation/build/select";


const required = (value) => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                Pole wymagane
            </div>
        );
    }
};

export class MechanicUpdateReview extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChangeMechanicReviewName = this.onChangeMechanicReviewName.bind(this);
        this.onChangeMechanicReviewScoreId = this.onChangeMechanicReviewScoreId.bind(this);

        this.state = {
            MechanicReviewName: "",
            MechanicReviewScoreId: "",
            loading: false,
            message: "",
        };
    }

    onChangeMechanicReviewName(e) {
        this.setState({
            MechanicReviewName: e.target.value,
        });
    }

    onChangeMechanicReviewScoreId(e) {
        this.setState({
            MechanicReviewScoreId: e.target.value,
        });
    }

    async handleSubmit(e) {
        e.preventDefault();
        if (this.state.MechanicReviewName === "") {
            await this.setState({
                MechanicReviewName: this.props.mechanicreviewname,
            });
        }
        if (
            this.state.MechanicReviewScoreId === "0" ||
            this.state.MechanicReviewScoreId === ""
        ) {
            await this.setState({
                MechanicReviewScoreId: this.props.mechanicreviewscoreid,
            });
        }

        this.setState({
            message: "",
            loading: true,
        });

        this.form.validateAll();

        if (this.checkBtn.context._errors.length === 0) {
            ReviewService.mechanicUpdateReview(
                this.props.mechanicreviewid,
                this.state.MechanicReviewName,
                this.state.MechanicReviewScoreId
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
                            Edytuj ocenę
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
                                        <label htmlFor="name">Opis</label>
                                        <Input
                                            type="text"
                                            className="form-control"
                                            name="name"
                                            value={this.props.mechanicreviewname}
                                            onChange={this.onChangeMechanicReviewName}
                                            validations={[required]}
                                        />
                                    </div>
                                    <label htmlFor="name">Ocena</label>
                                    <Select
                                        className="form-select"
                                        aria-label="Default select example"

                                        onChange={this.onChangeMechanicReviewScoreId}

                                    >
                                        <option value={this.props.mechanicreviewscoreid}>
                                            {this.props.mechanicreviewscoreid === 1
                                                ? "⋆"
                                                : this.props.mechanicreviewscoreid === 2
                                                    ? "⋆⋆"
                                                    : this.props.mechanicreviewscoreid === 3
                                                        ? "⋆⋆⋆"
                                                        : this.props.mechanicreviewscoreid === 4
                                                            ? "⋆⋆⋆⋆"
                                                            : this.props.mechanicreviewscoreid === 5
                                                                ? "⋆⋆⋆⋆⋆" : (<></>)}</option>
                                        <option value="1">⋆</option>
                                        <option value="2">⋆⋆</option>
                                        <option value="3">⋆⋆⋆</option>
                                        <option value="4">⋆⋆⋆⋆</option>
                                        <option value="5">⋆⋆⋆⋆⋆</option>
                                    </Select>
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
                                    <Button
                                        className="ms-auto ps-5 pe-5"
                                        variant="danger"
                                        onClick={this.props.onHide}
                                    >
                                        Anuluj
                                    </Button>
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
