import React, {Component} from "react";
import {Button, Modal, Row, Stack} from "react-bootstrap";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import CarService from "../../Services/CarService";
import Events from "../../Other/Events";
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
const vin = (value) => {
    if (value.length < 17 || value.length > 17) {
        return (
            <div className="alert alert-danger" role="alert">
                Vin musi miec 17 znaków
            </div>
        );
    }
};

export class UpdateCar extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChangeCarManufacturer = this.onChangeCarManufacturer.bind(this);
        this.onChangeCarModel = this.onChangeCarModel.bind(this);
        this.onChangeCarProductionYear = this.onChangeCarProductionYear.bind(this);
        this.onChangeCarFuelTypeId = this.onChangeCarFuelTypeId.bind(this);
        this.onChangeCarVin = this.onChangeCarVin.bind(this);
        this.onChangeCarPlates = this.onChangeCarPlates.bind(this);


        this.state = {
            CarModel: "",
            CarProductionYear: "",
            CarVin: "",
            CarPlates: "",
            FuelTypeId: "0",
            CarProduction: [],
            CarName: [],
            CarNameModel: [],
            loading: false,
            message: "",
            hidden: false,
            choosed: false,
        };
    }

    onChangeCarManufacturer(e) {
        this.setState({
            CarManufacturer: e.target.value,
            choosed: true
        });
    }

    onChangeCarModel(e) {
        this.setState({
            CarModel: e.target.value,
        });
    }

    onChangeCarProductionYear(e) {
        this.setState({
            CarProductionYear: e.target.value,
        });
    }

    onChangeCarFuelTypeId(e) {
        this.setState({FuelTypeId: e.target.value});
    }

    onChangeCarVin(e) {
        this.setState({
            CarVin: e.target.value,
        });
    }

    onChangeCarPlates(e) {
        this.setState({
            CarPlates: e.target.value,
        });
    }

    componentDidMount() {
        CarService.getProductionYear().then(
            (response) => {
                if (response === undefined) {
                    Events.dispatch("logout");
                    this.props.history.push("/");
                    window.location.reload();

                } else {
                    this.setState({
                        CarProduction: response.data,
                    })
                }
                ;
            },
            (error) => {
                this.setState({
                    content:
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString(),
                });

                if (error.response && error.response.status === 401) {
                    Events.dispatch("logout");
                }
            }
        );

        CarService.getName().then(
            (response) => {
                if (response === undefined) {
                    Events.dispatch("logout");
                    this.props.history.push("/");
                    window.location.reload();

                } else {
                    this.setState({
                        CarName: response.data,
                    })
                }
                ;
            },
            (error) => {
                this.setState({
                    content:
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString(),
                });

                if (error.response && error.response.status === 401) {
                    Events.dispatch("logout");
                }
            }
        );

    }

    getNames(name) {
        CarService.getNameModelCar(name).then(
            (response) => {
                if (response === undefined) {
                    Events.dispatch("logout");
                    this.props.history.push("/");
                    window.location.reload();

                } else {
                    this.setState({
                        CarNameModel: response.data,
                        choosed: false
                    })
                }
                ;
            },
            (error) => {
                this.setState({
                    content:
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString(),
                });

                if (error.response && error.response.status === 401) {
                    Events.dispatch("logout");
                }
            }
        );
    }

    async handleSubmit(e) {
        e.preventDefault();


        if (this.state.CarModel === "" || this.state.CarModel === 0) {
            await this.setState({
                CarModel: this.props.carnameid,
            });
        }
        if (this.state.CarProductionYear === "" || this.state.CarProductionYear === 0) {
            await this.setState({
                CarProductionYear: this.props.carproductionyearid,
            });
        }
        if (this.state.FuelTypeId === "0" || this.state.FuelTypeId === "") {
            await this.setState({
                FuelTypeId: this.props.fueltypeid,
            });
        }
        if (this.state.CarVin === "") {
            await this.setState({
                CarVin: this.props.carvin,
            });
        }
        if (this.state.CarPlates === "") {
            await this.setState({
                CarPlates: this.props.carplates,
            });
        }

        this.setState({
            message: "",
            loading: true,
        });

        this.form.validateAll();

        if (this.checkBtn.context._errors.length === 0) {
            CarService.updateCar(
                this.props.carid,
                this.state.CarModel,
                this.state.CarProductionYear,
                this.state.FuelTypeId,
                this.state.CarVin,
                this.state.CarPlates
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
        const {
            CarProduction, CarName, CarNameModel
        } = this.state;
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
                            Edytuj samochód
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
                                    <label htmlFor="name">Marka</label>
                                    <Select
                                        className="form-select"
                                        aria-label="Default select example"
                                        onChange={this.onChangeCarManufacturer}

                                    >
                                        <option value={this.props.carmanufacturer}>{this.props.carmanufacturer}</option>

                                        {CarName.map((CarName) => (

                                            <option value={CarName}>{CarName} </option>

                                        ))}
                                    </Select>
                                    {this.state.CarManufacturer === "" ? (<></>) : (<div>
                                        {this.state.choosed === true ? (
                                            <div> {this.getNames(this.state.CarManufacturer)}</div>) : (<div></div>)}
                                    </div>)}
                                    <label htmlFor="name">Model</label>
                                    <Select

                                        className="form-select"
                                        aria-label="Default select example"


                                        onChange={this.onChangeCarModel}

                                    >
                                        <option value={this.props.carmodel}>{this.props.carmodel}</option>


                                        {CarNameModel.map((CarNameModel) => (


                                            <option value={CarNameModel.carNameId}>{CarNameModel.carNameModel} </option>

                                        ))}

                                    </Select>


                                    <label htmlFor="name">Rok produkcji</label>
                                    <Select
                                        className="form-select"
                                        aria-label="Default select example"
                                        onChange={this.onChangeCarProductionYear}

                                    >
                                        <option
                                            value={this.props.carproductionyear}>{this.props.carproductionyear}</option>

                                        {CarProduction.map((CarProduction) => (

                                            <option
                                                value={CarProduction.carProductionId}>{CarProduction.carProductionYear} </option>

                                        ))}
                                    </Select>
                                    <label htmlFor="name">Typ paliwa</label>
                                    <Select
                                        className="form-select"
                                        aria-label="Default select example"
                                        value={this.state.FuelTypeId}
                                        onChange={this.onChangeCarFuelTypeId}

                                    >
                                        <option value={this.props.fueltypeid}> {this.props.fueltypeid === 1
                                            ? "Benzyna"
                                            : this.props.fueltypeid === 2
                                                ? "Diesel"
                                                : this.props.fueltypeid === 3
                                                    ? "Elektryczny"
                                                    : this.props.fueltypeid === 4
                                                        ? "Benzyna + LPG"
                                                        : this.props.fueltypeid === 5
                                                            ? "Benzyna + CNG"
                                                            : this.props.fueltypeid === 6
                                                                ? "Hybryda"
                                                                : this.props.fueltypeid === 7
                                                                    ? "Wodór"
                                                                    : this.props.fueltypeid === 8
                                                                        ? "Inne"
                                                                        : "błąd"}</option>
                                        <option value="1">Benzyna</option>
                                        <option value="2">Diesel</option>
                                        <option value="3">Elektryczny</option>
                                        <option value="4">Benzyna + LPG</option>
                                        <option value="5">Benzyna + CNG</option>
                                        <option value="6">Hybryda</option>
                                        <option value="7">Wodór</option>
                                        <option value="8">Inne</option>
                                    </Select>
                                    <div className="form-group">
                                        <label htmlFor="Vin">Numer VIN</label>
                                        <Input
                                            type="text"
                                            className="form-control"
                                            name="vin"
                                            value={this.props.carvin}
                                            onChange={this.onChangeCarVin}
                                            validations={[vin, required]}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="Plates">Numer rejestracyjny</label>
                                        <Input
                                            type="text"
                                            className="form-control"
                                            name="plates"
                                            pattern="[A-Za-z]{2,3} [0-9A-Za-z]{4,5}"
                                            value={this.props.carplates}
                                            onChange={this.onChangeCarPlates}
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
