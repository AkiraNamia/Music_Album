import React, { useContext, useEffect, useState } from "react";
import { Row, Col, Container, Button, Form } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import { Context } from "../main.jsx";
import { fetchOneUser, changeName } from "../http/userAPI";
import OrderHistory from "../components/OrderHistory.jsx";

const UserPage = observer(() => {
  const { user } = useContext(Context);
  const [profile, setProfile] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    if (user.id) {
      fetchOneUser(user.id).then((data) => {
        setProfile(data);
      });
    }
  }, [user.id]);

  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };

  const handleSaveName = async () => {
    await changeName(user.id, newName);
    setProfile({ ...profile, name: newName });
    setEditMode(false);
  };

  return (
    <Container style={{ marginBottom: "150px" }}>
      <header className="bg-dark text-white text-center py-4">
        <h1>User profile</h1>
      </header>
      <main className="p-4">
        <Container>
          <Row className="mb-4">
            <Col>
              <section className="user-info">
                <h2>User information</h2>
                <div className="d-flex align-items-center">
                  <div>
                    {!editMode ? (
                      <p>
                        <strong>Name:</strong> {profile.name}
                      </p>
                    ) : (
                      <Form>
                        <Form.Group>
                          <Form.Control
                            type="text"
                            placeholder="Enter new name"
                            value={newName}
                            onChange={handleNameChange}
                          />
                        </Form.Group>
                      </Form>
                    )}
                  </div>
                  <div className="ml-2">
                    {!editMode ? (
                      <Button
                        className="but"
                        variant="primary"
                        onClick={() => setEditMode(true)}
                      >
                        Change name
                      </Button>
                    ) : (
                      <Button
                        className="but"
                        variant="success"
                        onClick={handleSaveName}
                      >
                        Save
                      </Button>
                    )}
                  </div>
                </div>
                <p>
                  <strong>Email:</strong> {profile.email}
                </p>
              </section>
            </Col>
            <Col>
              <Container>Current orders</Container>
              <OrderHistory id={user.id} isNow={true} />
            </Col>
          </Row>
          <hr />
          <Container>OrderHistory</Container>
          <OrderHistory id={user.id} isNow={false} />
        </Container>
      </main>
    </Container>
  );
});

export default UserPage;
