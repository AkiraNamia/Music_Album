import React from "react";
import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { observer } from "mobx-react-lite";
import { Container } from "react-bootstrap";

import { fetchModerators } from "../../http/userAPI";
import UpdateModerator from "../modals/UpdateModerator.jsx";

const ModeratorTable = observer(() => {
  const [moderators, setModerators] = useState([]);

  const [selectedModer, setSelectedModer] = useState(null); // Новое состояние
  const [moderEdVisible, setModerEdVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchModerators();
        setModerators(data);
      } catch (error) {
        console.error("Error fetching moderators:", error);
      }
    };
    fetchData(); // Вызов асинхронной функции
  }, []);
  const handleRowClick = (moderId) => {
    // Найти выбранный альбом по albumId
    const selected = moderators.find((moder) => moder.id === moderId);
    setSelectedModer(selected);
    // Открыть модальное окно
    setModerEdVisible(true);
  };
  return (
    <Container>
      <div>
        {selectedModer && (
          <UpdateModerator
            key={selectedModer.id}
            show={moderEdVisible}
            onHide={() => setModerEdVisible(false)}
            moder={selectedModer}
          />
        )}
      </div>
      <Table striped bordered hover style={{ marginBottom: "150px" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {moderators?.map((moder) => (
            <tr
              key={moder.id}
              onClick={() => {
                handleRowClick(moder.id);
              }}
            >
              <td>{moder.id}</td>
              <td>{moder.name}</td>
              <td>{moder.email}</td>
              <td>{moder.role}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
});

export default ModeratorTable;
