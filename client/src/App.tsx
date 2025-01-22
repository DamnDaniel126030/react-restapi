import { useEffect, useState } from 'react'
import './App.css'

import { ShopList } from './shopList'

function App() {

  let nextId = 2;

  const [data, setData] = useState<ShopList[]>([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newData, setNewData] = useState<Partial<ShopList>>({product_name: "", quantity: 0, unit_of_measure: ""})
  const [editData, setEditData] = useState<Partial<ShopList> | null>(null);
  const [editMode, setEditMode] = useState(false);


  useEffect(() => {
    fetchData();
  }, [])

  const fetchData = () => {
    fetch('http://localhost:5000/items')   //https://retoolapi.dev/UC7nHD/data
      .then((response) => {
        if (!response.ok){
          throw new Error("Response failure")
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      })
  }

  if (loading){
    return <p>Loading...</p>
  }
  if (error) {
    return <p>There was an error loading in: {error}</p>
  }

  const addItem = async (newItem: Partial<ShopList>) => {
    try {
      if (newItem.product_name != null && newItem.quantity != null && newItem.unit_of_measure != null){
        const response = await fetch('http://localhost:5000/items', {
          method: "POST",
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify({
            ...newItem
          })
        })
        if (!response.ok){
          throw new Error("There was an error adding the item")
        }
      }
      else{
        alert("No inputs can be empty!");
      }
      fetchData();
    }
    catch (error) {
      console.error("POST request error: ", error);
    }
  }

  const deleteItem = async (id: number) => {
    try {
      const response = await fetch('http://localhost:5000/items/' + id, {
        method: "DELETE"
      })
      if (!response.ok) {
        throw new Error("There was an error deleting this item") 
      }
      fetchData();
      editModeOff();
    }
    catch (error) {
      console.error("DELETE request error: ", error);
    }
  }

  const editItem = async(id: number, updatedItem: Partial<ShopList>) => {
    try {
      const response = await fetch('http://localhost:5000/items/' + id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...updatedItem
        })
      })
      if (!response.ok){
        throw new Error("There was an error editing this item")
      }
      fetchData();
    }
    catch (error) {
      console.error("PUT request error: ", error)
    }
  }
  
  const editModeOn = (item: ShopList, id: number) => {
    setEditData(item);
    setEditMode(true);
  }

  const editModeOff = () => {
    setEditData(null);
    setEditMode(false);
  }

  if(!editMode){
    return (
      <>
        <h1>Shop List</h1>
        { newData && (
          <form onSubmit={(e) => {
            e.preventDefault();
            const newItem :Partial<ShopList> = {
              id: nextId,
              product_name: newData.product_name,
              quantity: newData.quantity,
              unit_of_measure: newData.unit_of_measure
            };
            nextId++;
            addItem(newItem);
            newData.product_name = "";
            newData.quantity = 0;
            newData.unit_of_measure = "";
          }}>
            
          <label htmlFor='product_name'>Product:</label>
          <input type="text" value={newData.product_name} onChange={(e) => {
            setNewData((prevData) => ( {
              ...prevData,
              product_name: e.target.value,
            }))
          }} />
  
          <label htmlFor="quantity">Quantity:</label>
          <input type="number" value={newData.quantity} onChange={(e) => {
            setNewData((prevData) => ({
              ...prevData,
              quantity: parseInt(e.target.value)
            }));
          }} />
  
          <label htmlFor="unit_of_measure">Unit of measure:</label>
          <input type="text" value={newData.unit_of_measure} onChange={(e) => {
            setNewData((prevData) => ({
              ...prevData,
              unit_of_measure: e.target.value
            }))
          }} />
  
          <button type='submit'>Add Item</button>
        
          </form>
        )}
        <br />
        <table>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.product_name}</td>
              <td>{item.quantity}</td>
              <td>{item.unit_of_measure}</td>
              <td>
                <button onClick={() => editModeOn(item, item.id)}>Edit item</button>
              </td>
              <td>
                <button onClick={() => deleteItem(item.id)}>Delete item</button>
              </td>
            </tr>
          ))}
        </table>
      </>
    )
  }
  else {
    return (
      <>
        <h1>Shop List</h1>
        { editData && (
          <form onSubmit={(e) => {
            e.preventDefault();
            if (editData.id) {
              setEditMode(false);
              editItem(editData.id, {product_name: editData.product_name, quantity: editData.quantity, unit_of_measure: editData.unit_of_measure})
            }
            editData.product_name = "";
            editData.quantity = 0;
            editData.unit_of_measure = "";
          }}>
          
          <label htmlFor='product_name'>Product:</label>
          <input type="text" value={editData.product_name} onChange={(e) => {
            setEditData((prevData) => ( {
              ...prevData,
              product_name: e.target.value,
            }))
          }} />
  
          <label htmlFor="quantity">Quantity:</label>
          <input type="number" value={editData.quantity} onChange={(e) => {
            setEditData((prevData) => ({
              ...prevData,
              quantity: parseInt(e.target.value)
            }));
          }} />
  
          <label htmlFor="unit_of_measure">Unit of measure:</label>
          <input type="text" value={editData.unit_of_measure} onChange={(e) => {
            setEditData((prevData) => ({
              ...prevData,
              unit_of_measure: e.target.value
            }))
          }} />
  
          <button type='submit'>Edit Item</button>
        
          </form>
        )}
        <br />
        <table>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.product_name}</td>
              <td>{item.quantity}</td>
              <td>{item.unit_of_measure}</td>
              <td>
                <button onClick={() => editModeOn(item, item.id)}>Edit item</button>
              </td>
              <td>
                <button onClick={() => deleteItem(item.id)}>Delete item</button>
              </td>
            </tr>
          ))}
        </table>
      </>
    )
  }
  
}

export default App
