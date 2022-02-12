import React, {useEffect, useRef, useState} from "react";
import {BrowserRouter as Router, useLocation} from "react-router-dom";
import {Button, Col, Container, ListGroup, ListGroupItem, Row,} from "react-bootstrap";
import VisitService from "../../Services/VisitService";
import ReactToPrint from "react-to-print";

export default function VisitCode() {
    return (
        <Router>
            <Printing/>
        </Router>
    );
}

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function Printing() {
    const [visit, setVisit] = useState([{}]);
    let query = useQuery();
    let code = query.get("code");
    useEffect(() => {
    }, []);

    let componentRef = useRef(null);

    useEffect(() => {
        VisitService.getVisitFromCode(code)
            .then((visit) => {
                setVisit([visit.data]);
            })
            .catch((err) => {
            });
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    let wizyta = "";
    visit.map((visit) => (wizyta = visit.visitDateTime));

    return (
        <div>
            <div>
                <Container>
                    <div ref={(el) => (componentRef = el)}>
                        <Row>
                            <div className="d-flex">
                                <hr className="my-auto flex-grow-1"></hr>
                                <div className="px-4">
                                    <h3 className="mt-4">Vanilla Car</h3>
                                </div>
                                <hr className="my-auto flex-grow-1"></hr>
                            </div>
                            {visit.map((visit) => (
                                <Col className="m-4">
                                    {visit.isDone === false || visit.isDone === true ? (
                                        <div>
                                            <ListGroup key={visit.visitId}>
                                                <ListGroupItem>
                                                    <strong>Właściciel</strong>
                                                </ListGroupItem>
                                                <ListGroupItem>
                                                    Imię i nazwisko
                                                    klienta: {visit.user.userName} {visit.user.userSurname.slice(0, visit.user.userSurname.length - (visit.user.userSurname.length - 1)) + "..."}

                                                </ListGroupItem>
                                                <ListGroupItem>
                                                    <strong>Wizyta</strong>
                                                </ListGroupItem>
                                                <ListGroupItem>
                                                    Imię i nazwisko mechanika: {visit.mechanic.userName}{" "}
                                                    {visit.mechanic.userSurname.slice(0, visit.mechanic.userSurname.length - (visit.mechanic.userSurname.length - 1)) + "..."}
                                                </ListGroupItem>
                                                <ListGroupItem>
                                                    Kod wizyty: {visit.visitCode}
                                                </ListGroupItem>
                                                <ListGroupItem>
                                                    informacje o wizycie:{" "}
                                                    {visit.visitLog === null ? (
                                                        <div>Jeszcze nie dodano opisu wizyty</div>
                                                    ) : (
                                                        <div>{visit.visitLog}</div>
                                                    )}
                                                </ListGroupItem>
                                                <ListGroupItem>
                                                    Termin wizyty:{" "}
                                                    {visit.visitDateTime
                                                        .replace("T", " ")
                                                        .substr("", "16")}
                                                </ListGroupItem>
                                                <ListGroupItem>
                                                    Typ wizyty:{" "}
                                                    {visit.visitTypeId === 1 ? (
                                                        <div>Naprawa mechaniczna</div>
                                                    ) : visit.visitTypeId === 2 ? (
                                                        <div>Naprawa elektryczna</div>
                                                    ) : visit.visitTypeId === 3 ? (
                                                        <div>Naprawa kompleksowa</div>
                                                    ) : visit.visitTypeId === 4 ? (
                                                        <div>Naprawa powypadkowa</div>
                                                    ) : visit.visitTypeId === 5 ? (
                                                        <div>Naprawa inne</div>
                                                    ) : visit.visitTypeId === 6 ? (
                                                        <div>Konsulatacja</div>
                                                    ) : visit.visitTypeId === 7 ? (
                                                        <div>Przegląd</div>
                                                    ) : visit.visitTypeId === 8 ? (
                                                        <div>Wymiana opon</div>
                                                    ) : visit.visitTypeId === 9 ? (
                                                        <div>Nie wiem</div>
                                                    ) : visit.visitTypeId === 10 ? (
                                                        <div>Inne</div>
                                                    ) : (
                                                        <div></div>
                                                    )}
                                                </ListGroupItem>
                                                <ListGroupItem>
                                                    <strong>Samochód</strong>
                                                </ListGroupItem>
                                                <ListGroupItem>
                                                    Marka samochodu:{" "}
                                                    {visit.car.carName.carNameManufacturer}
                                                </ListGroupItem>
                                                <ListGroupItem>
                                                    Model samochodu: {visit.car.carName.carNameModel}
                                                </ListGroupItem>
                                                <ListGroupItem>
                                                    Numer rejestracyjny: {visit.car.carPlates}
                                                </ListGroupItem>
                                            </ListGroup>
                                        </div>
                                    ) : (
                                        <div></div>
                                    )}
                                </Col>
                            ))}
                            {visit.map((visit) => (
                                <Col className="m-4">
                                    {visit.isDone === false || visit.isDone === true ? (
                                        <div>
                                            <ListGroup>
                                                {visit.pickup !== null ? (
                                                    <div>
                                                        {" "}
                                                        <ListGroupItem>
                                                            <strong>Adres odbioru</strong>
                                                        </ListGroupItem>
                                                        <ListGroupItem>
                                                            Data odbioru:{" "}
                                                            {visit.pickup.pickupDateTime
                                                                .replace("T", " ")
                                                                .substr("", "16")}
                                                        </ListGroupItem>
                                                        <ListGroupItem>
                                                            Miasto: {visit.pickup.pickupCity}
                                                        </ListGroupItem>
                                                        <ListGroupItem>
                                                            Ulica: {visit.pickup.pickupStreet}
                                                        </ListGroupItem>
                                                        <ListGroupItem>
                                                            Kod pocztowy: {visit.pickup.pickupPostalCode}
                                                        </ListGroupItem>
                                                    </div>
                                                ) : (
                                                    <div></div>
                                                )}

                                                {visit.delivery !== null ? (
                                                    <div>
                                                        {" "}
                                                        <ListGroupItem>
                                                            <strong>Adres dostawy</strong>
                                                        </ListGroupItem>
                                                        <ListGroupItem>
                                                            Data dostawy:{" "}
                                                            {visit.delivery.deliveryDateTime == null ? (
                                                                <div>Wkrótce zostanie podana</div>
                                                            ) : (
                                                                <div>
                                                                    {visit.delivery.deliveryDateTime
                                                                        .replace("T", " ")
                                                                        .substr("", "16")}
                                                                </div>
                                                            )}
                                                        </ListGroupItem>
                                                        <ListGroupItem>
                                                            Miasto: {visit.delivery.deliveryCity}
                                                        </ListGroupItem>
                                                        <ListGroupItem>
                                                            Ulica: {visit.delivery.deliveryStreet}
                                                        </ListGroupItem>
                                                        <ListGroupItem>
                                                            Kod pocztowy: {visit.delivery.deliveryPostalCode}
                                                        </ListGroupItem>{" "}
                                                    </div>
                                                ) : (
                                                    <></>
                                                )}
                                                {visit.payment !== null ? (
                                                    <div>
                                                        {" "}
                                                        <ListGroupItem>
                                                            <strong>Koszt</strong>
                                                        </ListGroupItem>
                                                        <ListGroupItem>
                                                            Koszt naprawy: {visit.payment.paymentCost}
                                                        </ListGroupItem>
                                                        <ListGroupItem>
                                                            Metoda płatności:{" "}
                                                            {visit.payment.paymentTypeId === 4 ? (
                                                                <div>Gotówka</div>
                                                            ) : visit.payment.paymentTypeId === 3 ? (
                                                                <div>Karta</div>
                                                            ) : visit.payment.paymentTypeId === 2 ? (
                                                                <div>Blik</div>
                                                            ) : visit.payment.paymentTypeId === 1 ? (
                                                                <div>Inne</div>
                                                            ) : (
                                                                <div>Nie wybrano</div>
                                                            )}
                                                        </ListGroupItem>
                                                        <ListGroupItem>
                                                            Zapłacono?{" "}
                                                            {visit.payment.isPayed === true ? (
                                                                <div>tak</div>
                                                            ) : (
                                                                <div>
                                                                    nie<br></br>
                                                                    {visit.payment.paymentTypeId === null ? (
                                                                        <div></div>
                                                                    ) : (
                                                                        <div></div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </ListGroupItem>
                                                    </div>
                                                ) : (
                                                    <div></div>
                                                )}
                                            </ListGroup>
                                        </div>
                                    ) : (
                                        <div></div>
                                    )}
                                </Col>
                            ))}

                            <p class="text-center">
                                <b>
                                    Aby edytować lub usunąć wizytę, zaloguj się na swoje konto,

                                </b>
                            </p>
                        </Row>
                    </div>
                    {" "}
                    <ReactToPrint
                        documentTitle={wizyta}
                        trigger={() => (
                            <div className="d-flex justify-content-center">
                                <Button className="mb-4" variant="primary">
                                    Drukuj
                                </Button>
                            </div>
                        )}
                        content={() => componentRef}
                    />
                </Container>
            </div>
        </div>
    );
}
