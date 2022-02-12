import React, {Component} from "react";
import {Button, Modal, Row, Stack} from "react-bootstrap";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import AuthenticateService from "../../Services/AuthenticateService";
import Select from "react-validation/build/select";

const NotChoosedRole = (value) => {
    if (value === "0") {
        return (
            <div className="alert alert-danger" role="alert">
                Proszę wybrać rolę
            </div>
        );
    }
};

export class UpdateRole extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChangeroleId = this.onChangeroleId.bind(this);

        this.state = {
            loading: false,
            message: "",
        };
    }

    onChangeroleId(e) {
        this.setState({
            roleId: e.target.value,
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
            AuthenticateService.UpdateRole(this.props.userid, this.state.roleId).then(
                () => {
                    window.location.reload();
                },
                (error) => {
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();
                    if (error.response && error.response.status === 500) {
                        this.setState({
                            loading: false,
                            message: "Wybierz rolę",
                        });
                    }
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
                            Edytuj rolę użytkownika
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
                                        <label htmlFor="description">E-mail</label>
                                        <Input
                                            type="text"
                                            className="form-control"
                                            name="description"
                                            value={this.props.useremail}
                                            disabled
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="description">Imię</label>
                                        <Input
                                            type="text"
                                            className="form-control"
                                            name="description"
                                            value={this.props.username}
                                            disabled
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="description">Obecna rola</label>
                                        <Input
                                            type="text"
                                            className="form-control"
                                            name="description"
                                            value={this.props.roleid === 1 ? (
                                                "Użytkownik"
                                            ) : this.props.roleid === 2 ? (
                                                "Mechanik"
                                            ) : this.props.roleid === 3 ? (
                                                "Admin"
                                            ) : this.props.roleid === 4 ? (
                                                "Szef"
                                            ) : (<div></div>)}
                                            disabled
                                        />
                                    </div>

                                    <label htmlFor="name">Wybór roli</label>
                                    <Select
                                        className="form-select"
                                        aria-label="Default select example"

                                        onChange={this.onChangeroleId}
                                        validations={[NotChoosedRole]}
                                    >
                                        <option value="0">Wybierz nową rolę</option>
                                        <option value="1">Użytkownik</option>
                                        <option value="2">Mechanik</option>
                                        <option value="3">Admin</option>
                                        <option value="4">Szef</option>
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
