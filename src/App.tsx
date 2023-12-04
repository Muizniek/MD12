import { useState, useEffect } from "react";
import axios from "axios";
import './App.css';

interface IData {
  id: number;
  photo: string;
  name: string;
  age: string;
  country: string;
  hobby: string;
}

function App() {
  const [photo, setPhoto] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [hobby, setHobby] = useState<string>("");
  const [data, setData] = useState<IData[]>([]);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get<IData[]>("http://localhost:3001/data");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const validateForm = (): boolean => {
    return !!photo && !!name && !!age && !!country && !!hobby;
  };

  const addData = async () => {
    try {
      if (!validateForm()) {
        console.error("Please fill in all fields");
        return;
      }

      if (editingUserId !== null) {
        // If editing, perform update
        await axios.put(`http://localhost:3001/data/${editingUserId}`, {
          photo,
          name,
          age,
          country,
          hobby,
        });
        setEditingUserId(null); // Reset editing state
      } else {
        // If not editing, perform add
        const newData: IData = { photo, name, age, country, hobby } as IData;
        await axios.post("http://localhost:3001/data", newData);
      }

      fetchData();
      // Clear form fields after submission
      setPhoto("");
      setName("");
      setAge("");
      setCountry("");
      setHobby("");
    } catch (error) {
      console.error("Error adding/updating data:", error);
    }
  };

  const deleteData = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3001/data/${id}`);
      fetchData();
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const editData = (id: number) => {
    // Set editing mode and populate form fields with user data
    const userToEdit = data.find((item) => item.id === id);
    if (userToEdit) {
      setEditingUserId(id);
      setPhoto(userToEdit.photo);
      setName(userToEdit.name);
      setAge(userToEdit.age);
      setCountry(userToEdit.country);
      setHobby(userToEdit.hobby);
    }
  };

  return (
    <>
      <div className="App">
        <div className="input-container">
          <label htmlFor="photo">Photo link:</label>
          <input type="text" value={photo} onChange={(event) => setPhoto(event.target.value)} />
          <label htmlFor="name">Name:</label>
          <input type="text" placeholder='Bob' value={name} onChange={(event) => setName(event.target.value)} required />
          <label htmlFor="Age">Age:</label>
          <input type="number" value={age} onChange={(event) => setAge(event.target.value)} required />
          <label htmlFor="country">Country:</label>
          <input type="text" value={country} onChange={(event) => setCountry(event.target.value)} required />
          <label htmlFor="hobby">Hobby:</label>
          <input type="text" value={hobby} onChange={(event) => setHobby(event.target.value)} required />
          <button onClick={addData}>{editingUserId !== null ? "Update" : "Submit form"}</button>
        </div>
      </div>

      <div className='output-wrapper'>
        <h1 className="h1">Users</h1>
        <div className="card-container">
          {data.map((item) => (
            <div className="card" key={item.id}>
              <img src={item.photo} alt="User" />
              <div>
                <strong>Name:</strong> {item.name}
              </div>
              <div>
                <strong>Age:</strong> {item.age} years old
              </div>
              <div>
                <strong>Country:</strong> {item.country}
              </div>
              <div>
                <strong>Hobby:</strong> {item.hobby}
              </div>
              <div className="button-wrapper">
                <button onClick={() => editData(item.id)} id="edit-button">Edit</button>
                <button onClick={() => deleteData(item.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
