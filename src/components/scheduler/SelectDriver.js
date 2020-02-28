import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import MapContainer from "../google-maps/MapContainer";
import React, {Component} from "react";
import {connect} from "react-redux";
import ProfileTable from "../profiles/ProfileTable";


class SelectDriver extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event){

    };

    render() {
        return (
            <Container className="SelectDriver" style={{minWidth: "100%"}}>
                <h1>Select Driver</h1>
                <Form>
                    <Form.Group as={Row}>
                        <Form.Label>Driver</Form.Label>
                        <Form.Check></Form.Check>
                        <Col>
                            <Form.Control type="search" id="search" placeholder="Search" onChange={this.handleChange}/>
                        </Col>
                        <Button id="search_button" onClick={this.handleSearch}>
                            Search
                        </Button>
                    </Form.Group>
                </Form>
                <ProfileTable mode={ "driver"}/>
                <Row>
                    <Col>
                        <Row>
                            Driver
                        </Row>
                        <Row>
                            Return Driver
                        </Row>
                    </Col>
                    <Col>
                        <MapContainer>Trip Summary</MapContainer>
                    </Col>
                    <Col>
                        <Row>
                            Trip Duration
                        </Row>
                        <Row>
                            Expected Traffic
                        </Row>
                    </Col>
                </Row>
            </Container>
        );
    }
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectDriver);