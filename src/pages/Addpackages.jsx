import React, { useState, useEffect } from "react";
import axios from "axios";

const AddPackage = () => {
  const [packageData, setPackageData] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    destinationId: "",
  });

  const [destinations, setDestinations] = useState([]);
  const [pkgError, setPkgError] = useState("");
  const [pkgSuccess, setPkgSuccess] = useState("");

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/destinations");
        console.log("Fetched destinations:", res.data);  // Log response here
        setDestinations(res.data);
      } catch (err) {
        console.error("Failed to load destinations", err);
      }
    };
  
    fetchDestinations();
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPackageData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPkgError("");
    setPkgSuccess("");

    try {
      const token = localStorage.getItem("token");
      console.log("Token:", token);
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      console.log("Submitting package:", packageData);
      const response = await axios.post(
        "http://localhost:5000/api/packages/",
        { ...packageData, destinationId: Number(packageData.destinationId) },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setPkgSuccess("✅ Package added successfully!");
        setPackageData({
          name: "",
          price: "",
          description: "",
          image: "",
          destinationId: "",
        });
      }
    } catch (error) {
      console.error("Error adding package:", error.response?.data || error.message);
      setPkgError(
        error.response?.data?.message || error.response?.data?.error || error.message || "❌ Error adding package. Check console for details."
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Add New Package</h2>

        {pkgError && <p className="text-red-500 text-center mb-2">{pkgError}</p>}
        {pkgSuccess && <p className="text-green-500 text-center mb-2">{pkgSuccess}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={packageData.name}
            onChange={handleChange}
            placeholder="Package Name"
            className="w-full px-3 py-2 border rounded-md"
            required
          />
          <input
            type="number"
            name="price"
            value={packageData.price}
            onChange={handleChange}
            placeholder="Price"
            className="w-full px-3 py-2 border rounded-md"
            required
          />
          <textarea
            name="description"
            value={packageData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full px-3 py-2 border rounded-md"
            required
          />
          <input
            type="text"
            name="image"
            value={packageData.image}
            onChange={handleChange}
            placeholder="Image URL"
            className="w-full px-3 py-2 border rounded-md"
            required
          />
          {packageData.image && packageData.image.startsWith("data:image") && (
            <img
              src={packageData.image}
              alt="Preview"
              className="w-full h-40 object-cover mt-2 rounded-md"
              onError={() => console.log("Image preview failed to load")}
            />
          )}
          <select
            name="destinationId"
            value={packageData.destinationId}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          >
            <option value="">Select Destination</option>
            {destinations.length > 0 ? (
              destinations.map((dest) => (
                <option key={dest.did} value={dest.did}>
                  {dest.name}
                </option>
              ))
            ) : (
              <option disabled>Loading destinations...</option>
            )}
          </select>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
          >
            Add Package
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPackage;