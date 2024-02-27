import React, { useState } from "react";
import { Tab, Row, Col, Nav, Container } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import AlbumTable from "../components/admin/AlbumTable";
import { Button } from "react-bootstrap";
import CreateAlbum from "../components/modals/CreateAlbum.jsx";
import CreateArtist from "../components/modals/CreateArtist.jsx";
import ModeratorTable from "../components/admin/ModeratorTable.jsx";
import AddModerator from "../components/modals/AddModerator.jsx";
import ArtistTable from "../components/admin/ArtistTable.jsx";
import GenreTable from "../components/admin/GenreTable.jsx";
import CreateGenre from "../components/modals/CreateGenre.jsx";

const Admin = observer(() => {
  const [artistVisible, setArtistVisible] = useState(false);
  const [albumVisible, setAlbumVisible] = useState(false);

  const [moderVisible, setmoderVisible] = useState(false);
  const [genreVisible, setGenreVisible] = useState(false);

  return (
    <Tab.Container id="left-tabs-example" defaultActiveKey="first">
      <Container>
        <Row>
          <Col xs={3}>
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="first">Albums</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="second">Moderators</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="third">Artists</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="fourth">Genres</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col sm={9}>
            <Tab.Content>
              <Tab.Pane eventKey="first">
                <Button
                  className="but"
                  style={{ width: "30%" }}
                  onClick={() => setAlbumVisible(true)}
                >
                  Add
                </Button>
                <CreateAlbum
                  show={albumVisible}
                  onHide={() => setAlbumVisible(false)}
                />
                <AlbumTable />
              </Tab.Pane>
              <Tab.Pane eventKey="second">
                <Button
                  className="but"
                  style={{ width: "30%" }}
                  onClick={() => setmoderVisible(true)}
                >
                  Add
                </Button>
                <AddModerator
                  show={moderVisible}
                  onHide={() => setmoderVisible(false)}
                />

                <ModeratorTable />
              </Tab.Pane>
            </Tab.Content>
            <Tab.Content>
              <Tab.Pane eventKey="third">
                <Button
                  className="but"
                  style={{ width: "30%" }}
                  onClick={() => setArtistVisible(true)}
                >
                  Add
                </Button>
                <CreateArtist
                  show={artistVisible}
                  onHide={() => setArtistVisible(false)}
                />
                <ArtistTable />
              </Tab.Pane>
              <Tab.Pane eventKey="fourth">
                <Button
                  className="but"
                  style={{ width: "30%" }}
                  onClick={() => setGenreVisible(true)}
                >
                  Add
                </Button>
                <CreateGenre
                  show={genreVisible}
                  onHide={() => setGenreVisible(false)}
                />
                <GenreTable />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Container>
    </Tab.Container>
  );
});

export default Admin;
