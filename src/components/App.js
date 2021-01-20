import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import ContactForm from "./contactForm/ContactForm";
import ContactList from "./contactList/ContactList";
import Filter from "./filter/Filter";
import { Container } from "./AppStyled";

// ==== HOOKS ==========================================================
const initialState = {
  contacts: [
    { id: "id-1", name: "Rosie Simpson", number: "459-12-56" },
    { id: "id-2", name: "Hermione Kline", number: "443-89-12" },
    { id: "id-3", name: "Eden Clements", number: "645-17-79" },
    { id: "id-4", name: "Annie Copeland", number: "227-91-26" },
  ],

  filter: "",
};

const App = () => {
  const [state, setState] = useState({ ...initialState });

  useEffect(() => {
    const storageContacts = localStorage.getItem("contacts");
    storageContacts &&
      setState((prevState) => ({
        ...prevState,
        contacts: JSON.parse(storageContacts),
      }));
  }, []);

  useEffect(() => {
    localStorage.setItem("contacts", JSON.stringify(state.contacts));
  }, [state.contacts]);

  const changeFilter = (e) => {
    const { value } = e.target;
    setState((prevState) => ({ ...prevState, filter: value }));
  };

  const getFilteredContacts = () => {
    const { contacts, filter } = state;
    return contacts.filter((contact) =>
      contact.name.toLowerCase().includes(filter.toLowerCase())
    );
  };

  const addContact = (name, number) => {
    const { contacts } = state;
    const contact = { id: uuidv4(), name, number };
    if (!name || !number) {
      return alert("Please enter some contact information.");
    }
    contacts.some((cont) => cont.name.toLowerCase() === name.toLowerCase())
      ? alert(`${name} is already in contacts.`)
      : setState((prevState) => ({
          ...prevState,
          contacts: [...prevState.contacts, contact],
        }));
  };

  const deleteContact = (e) => {
    const contactId = e.target.dataset.id;
    setState((prevState) => ({
      ...prevState,
      contacts: [...prevState.contacts.filter(({ id }) => id !== contactId)],
      filter: "",
    }));
  };

  return (
    <Container>
      <h1>Phonebook</h1>
      <ContactForm onAddContact={addContact} />

      <h2>Contacts</h2>
      {state.contacts.length > 1 && (
        <Filter value={state.filter} onChangeFilter={changeFilter} />
      )}

      {state.contacts.length > 0 ? (
        <ContactList
          contacts={getFilteredContacts()}
          onDeleteContact={deleteContact}
        />
      ) : (
        <p>There are no contacts in current list.</p>
      )}
    </Container>
  );
};

export default App;
