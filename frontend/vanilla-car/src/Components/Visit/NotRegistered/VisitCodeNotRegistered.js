import React, {useEffect, useRef, useState} from "react";
import {BrowserRouter as Router, useLocation} from "react-router-dom";
import {Button, Col, Container, ListGroup, ListGroupItem, Row,} from "react-bootstrap";
import VisitService from "../../../Services/VisitService";
import ReactToPrint from "react-to-print";
import QRCode from "qrcode.react";

export default function VisitCodeNotRegistered() {
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
        VisitService.getVisitFromCodeNotRegistered(code)
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
                                                    <strong>W??a??ciciel</strong>
                                                </ListGroupItem>
                                                <ListGroupItem>E-mail: {visit.userEmail}</ListGroupItem>
                                                <ListGroupItem>
                                                    Telefon: {visit.userTelephone}
                                                </ListGroupItem>
                                                <ListGroupItem>
                                                    <strong>Wizyta</strong>
                                                </ListGroupItem>
                                                <ListGroupItem>
                                                    Imi?? i nazwisko mechanika: {visit.mechanic.userName}{" "}
                                                    {visit.mechanic.userSurname.slice(0, visit.mechanic.userSurname.length - (visit.mechanic.userSurname.length - 1)) + "..."}
                                                </ListGroupItem>
                                                <ListGroupItem>
                                                    Kod wizyty: {visit.visitNotRegisteredCode}
                                                </ListGroupItem>
                                                <ListGroupItem>
                                                    informacje o wizycie:{" "}
                                                    {visit.visitNotRegisteredLog === null ? (
                                                        <div>Jeszcze nie dodano opisu wizyty</div>
                                                    ) : (
                                                        <div>{visit.visitNotRegisteredLog}</div>
                                                    )}
                                                </ListGroupItem>
                                                <ListGroupItem>
                                                    Termin wizyty:{" "}
                                                    {visit.visitNotRegisteredDateTime
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
                                                        <div>Przegl??d</div>
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
                                                            Zap??acono?{" "}
                                                            {visit.payment.isPayed === true ? (
                                                                <div>tak</div>
                                                            ) : (
                                                                <div>
                                                                    nie<br></br>
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
                                    <ListGroup>
                                        {visit.visitNotRegisteredCode === undefined ? (
                                            <div></div>
                                        ) : (
                                            <>
                                                <ListGroupItem>
                                                    <strong>Kod QR wizyty</strong>
                                                </ListGroupItem>
                                                <ListGroupItem className="d-flex justify-content-center">
                                                    <QRCode
                                                        id="123456"
                                                        value={
                                                            "https://do.vanillacar.me/codenotregistered?code=" +
                                                            visit.visitNotRegisteredCode
                                                        }
                                                        size={210}
                                                        level={"H"}
                                                        includeMargin={true}
                                                    />{" "}
                                                </ListGroupItem>
                                            </>
                                        )}
                                    </ListGroup>
                                </Col>
                            ))}

                            <p class="text-center">
                                <b>
                                    Aby edytowa?? lub usun???? wizyt??, skontaktuj si?? z warsztatem
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
