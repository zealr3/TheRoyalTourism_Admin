import React, { useState, useEffect } from "react";
import axios from "axios";

const AddDestination = () => {
  const [destinationData, setDestinationData] = useState({
    name: "",
    image: "",
    description: "",
    dtype: "domestic",
  });

  const [destError, setDestError] = useState("");
  const [destSuccess, setDestSuccess] = useState("");

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        console.log("API Response:", response.data);
        const response = await axios.get("http://localhost:5000/api/destinations");
        fetchDestinations(response.data);
        console.log("API Response:", response.data);
      } catch (error) {
        console.error("Error fetching destinations:", error);
      }
    };
    fetchDestinations();
  }, []);

  const handleDestinationChange = (e) => {
    setDestinationData({
      ...destinationData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDestinationSubmit = async (e) => {
    e.preventDefault();
    setDestError("");
    setDestSuccess("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setDestError("❌ Please sign in as an admin first.");
        return;
      }

      const response = await axios.post("http://localhost:5000/api/destinations", destinationData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        setDestSuccess("✅ Destination added successfully!");
        setDestinationData({ name: "", image: "", description: "", dtype: "domestic" });
      } else {
        setDestError("❌ Error adding destination.");
      }
    } catch (err) {
      console.error("Axios Error:", err.response?.status, err.response?.data);
      setDestError("❌ Error adding destination. Check console for details.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Add New Destination</h2>
        {destError && <p className="text-red-500 text-center mb-2">{destError}</p>}
        {destSuccess && <p className="text-green-500 text-center mb-2">{destSuccess}</p>}
        <form onSubmit={handleDestinationSubmit} className="space-y-4">
          <input type="text" name="name" value={destinationData.name} onChange={handleDestinationChange} placeholder="Destination Name" className="w-full px-3 py-2 border rounded-md" required />
          <input type="text" name="image" value={destinationData.image} onChange={handleDestinationChange} placeholder="Image URL" className="w-full px-3 py-2 border rounded-md" required />
          <textarea name="description" value={destinationData.description} onChange={handleDestinationChange} placeholder="Description" className="w-full px-3 py-2 border rounded-md" required></textarea>
          <select name="dtype" value={destinationData.dtype} onChange={handleDestinationChange} className="w-full px-3 py-2 border rounded-md" required>
            <option value="domestic">Domestic</option>
            <option value="international">International</option>
          </select>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">Add Destination</button>
        </form>
      </div>
    </div>
  );
};

export default AddDestination;
