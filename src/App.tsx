import { useEffect, useState } from 'react'
import './App.css'

import { ShopList } from './shopList'

function App() {

  let nextId = 2;

  const [data, setData] = useState<ShopList[]>([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newData, setNewData] = useState<Partial<ShopList>>({product_name: "", quantity: 0, unit_of_measure: ""})


  useEffect(() => {
    fetchData();
  }, [])

  const fetchData = () => {
    fetch('https://retoolapi.dev/UC7nHD/data')
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
        const response = await fetch('https://retoolapi.dev/UC7nHD/data', {
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
      const response = await fetch('https://retoolapi.dev/UC7nHD/data' + id, {
        method: "DELETE"
      })
      if (!response.ok) {
        throw new Error("There was an error deleting this item") 
      }
      fetchData();
    }
    catch (error) {
      console.error("DELETE request error: ", error);
    }
  }

  const editItem = async(id: number, updatedItem: Partial<ShopList>) => {
    try {
      const response = await fetch('https://retoolapi.dev/UC7nHD/data' + id, {
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
        }}>
          
        {/* <label htmlFor='product_name'>Product:</label>
        <input type="text" value={""} onChange={(e) => {
          setNewData((prevData) => {
            ...prevData,
            product_name: e.target.value
          })
        }} /> */}



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
              <button onClick={() => editItem(item)}>Edit item</button>
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

export default App
