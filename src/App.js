import { useState, useEffect } from "react";

export default function App() {
  const [roomsData, setRoomsData] = useState(() => {
    const storedData = localStorage.getItem("roomsData");
    return storedData ? JSON.parse(storedData) : {
      "Lab PPLG": [],
      "Lab DKV": [],
      "Lab TJKT": [],
      "Lab MPLB": []
    };
  });
  const [selectedRoom, setSelectedRoom] = useState(""); 

  useEffect(() => {
    localStorage.setItem("roomsData", JSON.stringify(roomsData));
  }, [roomsData]);

  function handleAddItems(item) {
    setRoomsData((prevRoomsData) => {
      const updatedRoomsData = { ...prevRoomsData };
      updatedRoomsData[selectedRoom] = [...updatedRoomsData[selectedRoom], item];
      return updatedRoomsData;
    });
  }

  function handleRemoveItem(id) {
    setRoomsData((prevRoomsData) => {
      const updatedRoomsData = { ...prevRoomsData };
      updatedRoomsData[selectedRoom] = updatedRoomsData[selectedRoom].filter(
        (item) => item.id !== id
      );
      return updatedRoomsData;
    });
  }

  function handleUpdateItem(id) {
    setRoomsData((prevRoomsData) => {
      const updatedRoomsData = { ...prevRoomsData };
      updatedRoomsData[selectedRoom] = updatedRoomsData[selectedRoom].map(
        (item) => (item.id === id ? { ...item, packed: !item.packed } : item)
      );
      return updatedRoomsData;
    });
  }

  function handleEditDescription(id, newDescription) {
    setRoomsData((prevRoomsData) => {
      const updatedRoomsData = { ...prevRoomsData };
      updatedRoomsData[selectedRoom] = updatedRoomsData[selectedRoom].map(
        (item) =>
          item.id === id ? { ...item, description: newDescription } : item
      );
      return updatedRoomsData;
    });
  }

  return (
    <div className="app">
      <Logo />
      <Form
        onAddItems={handleAddItems}
        selectedRoom={selectedRoom}
        setSelectedRoom={setSelectedRoom}
      />
      <Packinglist
        items={roomsData[selectedRoom]}
        onRemoveItem={handleRemoveItem}
        onUpdateItem={handleUpdateItem}
        onUpdateDescription={handleEditDescription}
      />
      <Stats items={roomsData[selectedRoom]} />
    </div>
  );
}

function Logo() {
  return <h1> INVENTARIS BARANG 💻</h1>;
}

function Form({ onAddItems, selectedRoom, setSelectedRoom }) {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);

  function handleSubmit(e) {
    e.preventDefault();

    if (!description || !selectedRoom) return;

    const newItem = {
      description,
      quantity,
      packed: false,
      id: Date.now(),
    };
    onAddItems(newItem);

    setDescription("");
    setQuantity(1);
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>Yuk Periksa barang,apakah ada kehilangan😁📝</h3>
      <select
        value={selectedRoom}
        onChange={(e) => setSelectedRoom(e.target.value)}
      >
        <option value="">Pilih Ruangan</option>
        <option value="Lab PPLG">Lab PPLG</option>
        <option value="Lab DKV">Lab DKV</option>
        <option value="Lab TJKT">Lab TJKT</option>
        <option value="Lab MPLB">Lab MPLB</option>
      </select>
      <select
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      >
        {Array.from({ length: 50 }, (_, i) => (
          <option key={i + 1} value={i + 1}>{i + 1}</option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Barang baru"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button type="submit">Tambah</button>
    </form>
  );
}

function Packinglist({ items, onRemoveItem, onUpdateItem, onUpdateDescription }) {
  if (!items) {
    return (
      <div className="list">
        <h2>Daftar Barang</h2>
        <p>Belum ada barang di ruangan ini</p>
      </div>
    );
  }

  return (
    <div className="list">
      <ul>
        {items.map((item) => (
          <Item
            item={item}
            key={item.id}
            onRemoveItem={onRemoveItem}
            onUpdateItem={onUpdateItem}
            onUpdateDescription={onUpdateDescription}
          />
        ))}
      </ul>
    </div>
  );
}


function Item({ item, onRemoveItem, onUpdateItem, onUpdateDescription }) {
  function handleRemove() {
    onRemoveItem(item.id);
  }

  function handleEditDescription(e) {
    onUpdateDescription(item.id, e.target.value);
  }

  return (
    <li>
      <input
        type="checkbox"
        checked={item.packed}
        onChange={() => onUpdateItem(item.id)}
      />
      <input
        type="text"
        value={item.description}
        onChange={handleEditDescription}
        onBlur={(e) => onUpdateDescription(item.id, e.target.value)} // Update deskripsi saat input kehilangan fokus
      />
      <span style={item.packed ? { textDecoration: "line-through" } : {}}>
        {item.quantity} {item.description}
      </span>
      <button onClick={handleRemove}>❌</button>
      <button onClick={handleEditDescription}>✏️</button>
    </li>
  );
}

function Stats({ items }) {
  if (!items || !items.length)
    return (
      <p className="stats">
        <em>Mulai Tambahkan Barang Di Ruangan 😎</em>
      </p>
    );

  const numItems = items.length;
  const numPacked = items.filter((item) => item.packed).length;
  const percentage = Math.round((numPacked / numItems) * 100);
  return (
    <footer className="stats">
      <em>
        {percentage === 100
          ? "Barang Lengkap,Tidak Ada Yang Hilang "
          : `💼 Kamu punya ${numItems} barang di daftar, dan sudah ceklist ${numPacked}
        barang (${percentage}%)`}
      </em>
    </footer>
  );
}
