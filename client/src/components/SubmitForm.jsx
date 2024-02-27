import React, { useEffect, useContext, useState } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import { Context } from "../main.jsx";
import { useForm } from "react-hook-form";

const SubmitForm = observer(({ handleContinue }) => {
  const { order } = useContext(Context);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const [countriesData, setCountriesData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [phoneCode, setPhoneCode] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = require("../utils/countries_states_cities.json");
        setCountriesData(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    const selectedCountryData = countriesData.find(
      (country) => country.name === selectedCountry
    );
    if (selectedCountryData) {
      setPhoneCode(`+${selectedCountryData.phone_code}`);
    } else {
      setPhoneCode("");
    }
  }, [selectedCountry, countriesData]);
  const handleCountryChange = (event) => {
    const selectedCountry = event.target.value;
    setValue("selectedCountry", selectedCountry);
    setSelectedCountry(selectedCountry);
    setSelectedState("");
    setSelectedCity("");

    const countryData = countriesData.find(
      (country) => country.name === selectedCountry
    );
    if (countryData) {
      setStates(countryData.states || []);
    }
  };

  const handleStateChange = (event) => {
    const selectedState = event.target.value;
    setValue("selectedState", selectedState);
    setSelectedState(selectedState);
    setSelectedCity("");

    const countryData = countriesData.find(
      (country) => country.name === selectedCountry
    );
    const stateData = countryData?.states.find(
      (state) => state.name === selectedState
    );
    if (stateData) {
      setCities(stateData.cities || []);
    } else {
      setCities([]);
    }
  };
  const handleCityChange = (event) => {
    const selectedCity = event.target.value;
    setValue("selectedCity", selectedCity);
    setSelectedCity(selectedCity);
  };

  const onSubmit = (data) => {
    const formData = {
      country: data.selectedCountry,
      firstName: data.firstName,
      lastName: data.lastName,
      city: data.selectedCity,
      countryRegion: data.selectedState,
      address: data.address,
      zipCode: data.zipCode,
      phoneNumber: `${phoneCode}${data.phoneNumber}`,
    };

    let updatedInfo = order.infos;
    if (Array.isArray(updatedInfo)) {
      updatedInfo = updatedInfo.map((infoItem, index) =>
        index === 0 ? { ...infoItem, ...formData } : infoItem
      );
      order.setInfo(updatedInfo);
      handleContinue();
      console.log(order);
    }
  };

  const validateState = (value) => {
    if (selectedCountry) {
      const countryData = countriesData.find(
        (country) => country.name === selectedCountry
      );
      if (countryData && countryData.states && countryData.states.length > 0) {
        return !!value || "Выберите область";
      }
    }
    return true;
  };

  const validateCity = (value) => {
    if (selectedCountry) {
      const countryData = countriesData.find(
        (country) => country.name === selectedCountry
      );
      if (
        countryData &&
        (!countryData.states || countryData.states.length === 0)
      ) {
        return !!value || "Выберите город";
      }
      const stateData = countryData?.states.find(
        (state) => state.name === selectedState
      );
      if (stateData && stateData.cities && stateData.cities.length > 0) {
        return !!value || "Выберите город";
      }
    }
    return true;
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridFirstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              className={`mt-3 ${errors.firstName ? "is-invalid" : ""}`}
              placeholder="First name"
              {...register("firstName", {
                required: "Введите имя",
              })}
            />
          </Form.Group>
          {errors.firstName && (
            <div className="invalid-feedback">{errors.firstName.message}</div>
          )}
          <Form.Group as={Col} controlId="formGridLastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              className={`mt-3 ${errors.lastName ? "is-invalid" : ""}`}
              placeholder="Last name"
              {...register("lastName", {
                required: "Введите фамилию",
              })}
            />
            {errors.lastName && (
              <div className="invalid-feedback">{errors.lastName.message}</div>
            )}
          </Form.Group>
        </Row>
        <Form.Group className="mb-3" controlId="formGridEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" placeholder="Enter email" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formGridCountry">
          <Form.Label>Country</Form.Label>
          <Form.Select
            {...register("selectedCountry", {
              required: "Выберите страну",
            })}
            onChange={handleCountryChange}
          >
            <option value="">Select Country</option>
            {countriesData.map((country, index) => (
              <option key={index} value={country.name}>
                {country.name}
              </option>
            ))}
          </Form.Select>
          {errors.selectedCountry && (
            <div className="invalid-feedback">
              {errors.selectedCountry.message}
            </div>
          )}
        </Form.Group>
        <Form.Group className="mb-3" controlId="formGridState">
          <Form.Label>State</Form.Label>
          <Form.Select
            {...register("selectedState", {
              validate: validateState,
            })}
            onChange={handleStateChange}
          >
            <option value="">Select State</option>
            {states.map((state, index) => (
              <option key={index} value={state.name}>
                {state.name}
              </option>
            ))}
          </Form.Select>
          {errors.selectedState && (
            <div className="invalid-feedback">
              {errors.selectedState.message}
            </div>
          )}
        </Form.Group>

        <Form.Group className="mb-3" controlId="formGridCity">
          <Form.Label>City</Form.Label>
          <Form.Select
            {...register("selectedCity", {
              validate: validateCity,
            })}
            onChange={handleCityChange}
          >
            <option value="">Select City</option>
            {cities.map((city, index) => (
              <option key={index} value={city.name}>
                {city.name}
              </option>
            ))}
          </Form.Select>
          {errors.selectedCity && (
            <div className="invalid-feedback">
              {errors.selectedCity.message}
            </div>
          )}
        </Form.Group>
        <Form.Group className="mb-3" controlId="formGridAddress1">
          <Form.Label>Address</Form.Label>
          <Form.Control
            className={`mt-3 ${errors.address ? "is-invalid" : ""}`}
            placeholder="Address"
            {...register("address", {
              required: "Введите адрес",
            })}
          />
        </Form.Group>
        {errors.address && (
          <div className="invalid-feedback">{errors.address.message}</div>
        )}
        <Row className="mb-3">
          <Form.Group controlId="formPhoneCode">
            <Form.Label>Phone number:</Form.Label>
            <div className="input-group">
              <span className="input-group-text">{phoneCode}</span>
              <Form.Control
                className={`mt-3 ${errors.phoneNumber ? "is-invalid" : ""}`}
                placeholder="Phone number"
                {...register("phoneNumber", {
                  required: "Введите номер телефона",
                })}
                type="number"
              />
            </div>
          </Form.Group>
          {errors.phoneNumber && (
            <div className="invalid-feedback">{errors.phoneNumber.message}</div>
          )}
          <Form.Group as={Col} controlId="formGridZip">
            <Form.Label>Zip</Form.Label>
            <Form.Control
              className={`mt-3 ${errors.zipCode ? "is-invalid" : ""}`}
              placeholder="Zip"
              {...register("zipCode", {
                required: "Введите индекс",
                pattern: {
                  value: /^\d{6}$/,
                  message: "Индекс должен состоять из 6 цифр",
                },
              })}
              type="number"
            />
          </Form.Group>
          {errors.zipCode && (
            <div className="invalid-feedback">{errors.zipCode.message}</div>
          )}
        </Row>

        <Button className="but" type="submit">
          Submit
        </Button>
      </Form>
    </Container>
  );
});

export default SubmitForm;
