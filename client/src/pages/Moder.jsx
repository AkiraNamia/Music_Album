import React from "react";
import { Tab, Row, Col, Nav, Container } from "react-bootstrap";
import { observer } from "mobx-react-lite";

import ModerTable from "../components/moder/ModerTable.jsx";
import SongTable from "../components/moder/SongTable.jsx";

const Moder = observer(() => {
  return (
    <Tab.Container id="left-tabs-example" defaultActiveKey="first">
      <Container>
        <Row>
          <Col xs={3}>
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="first">Orders</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="second">Songs</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col sm={9}>
            <Tab.Content>
              <Tab.Pane eventKey="first">
                <ModerTable />
              </Tab.Pane>

              <Tab.Pane eventKey="second">
                <SongTable />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Container>
    </Tab.Container>
  );
});

export default Moder;
