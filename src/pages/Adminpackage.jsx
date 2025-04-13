import React, { useEffect, useState } from "react";
import axios from "axios";

const ViewPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editData, setEditData] = useState(null);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Fetch all packages
  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/packages");
      setPackages(res.data);
      setError("");
    } catch (err) {
      console.error("Failed to load packages:", err);
      setError("Failed to load packages. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  // Delete package
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this package?")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to delete packages");
        return;
      }

      console.log("Deleting package with ID:", id);
      
      await axios.delete(`http://localhost:5000/api/packages/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPackages((prev) => prev.filter((pkg) => pkg.id !== id));
      setSuccess("Package deleted successfully!");
      setError("");
    } catch (err) {
      console.error("Delete error:", err);
      
      // More detailed error handling
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (err.response.status === 401) {
          setError("You are not authorized to delete packages");
        } else if (err.response.status === 404) {
          setError("Package not found. It may have been already deleted.");
          // Refresh packages list to sync with backend
          fetchPackages();
        } else {
          setError(`Failed to delete package: ${err.response.data?.error || err.response.statusText}`);
        }
      } else if (err.request) {
        // The request was made but no response was received
        setError("Server is not responding. Please try again later.");
      } else {
        // Something happened in setting up the request
        setError(`Failed to delete package: ${err.message}`);
      }
    }
  };

  // Save changes for edit
  const handleEditSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to edit packages");
        return;
      }

      console.log("Updating package:", editData);
      
      await axios.put(
        `http://localhost:5000/api/packages/${editData.id}`,
        {
          ...editData,
          price: parseFloat(editData.price),
          destinationId: parseInt(editData.destinationId, 10),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      setSuccess("Package updated successfully!");
      setEditData(null);
      setError("");
      fetchPackages(); // Refresh packages list
    } catch (err) {
      console.error("Update error:", err);
      
      // More detailed error handling
      if (err.response) {
        if (err.response.status === 401) {
          setError("You are not authorized to edit packages");
        } else if (err.response.status === 404) {
          setError("Package not found. It may have been deleted.");
          fetchPackages(); // Refresh packages list
        } else {
          setError(`Failed to update package: ${err.response.data?.error || err.response.statusText}`);
        }
      } else if (err.request) {
        setError("Server is not responding. Please try again later.");
      } else {
        setError(`Failed to update package: ${err.message}`);
      }
    }
  };

  const handleInputChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Package Management</h1>
      
      {/* Status Messages */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 relative">
          <span className="block sm:inline">{error}</span>
          <button 
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setError("")}
          >
            <span className="text-xl">&times;</span>
          </button>
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 relative">
          <span className="block sm:inline">{success}</span>
          <button 
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setSuccess("")}
          >
            <span className="text-xl">&times;</span>
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-2 text-gray-700">Loading packages...</p>
          </div>
        </div>
      ) : packages.length === 0 ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          <p>No packages found. Add some packages to get started.</p>
        </div>
      ) : (
        <>
          {/* Edit Modal */}
          {editData && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg w-96 shadow-lg max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Edit Package</h2>

                {["name", "price", "description", "image", "destinationId"].map((field) => (
                  <div key={field} className="mb-3">
                    <label className="block mb-1 capitalize font-medium">{field}</label>
                    <input
                      name={field}
                      value={editData[field] || ""}
                      onChange={handleInputChange}
                      className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      type={field === "price" || field === "destinationId" ? "number" : "text"}
                    />
                  </div>
                ))}

                <div className="flex justify-end gap-2 mt-6">
                  <button
                    className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                    onClick={() => setEditData(null)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    onClick={handleEditSave}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Packages List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div key={pkg.id} className="bg-white shadow rounded-lg overflow-hidden">
                <div className="relative">
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    className="h-48 w-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold">{pkg.name}</h3>
                  <p className="text-gray-600 my-2 line-clamp-2">{pkg.description}</p>
                  <p className="font-semibold text-lg text-green-600">₹ {pkg.price}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Destination: {pkg.destination?.name || "Unknown"}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <button
                      className="flex-1 bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
                      onClick={() => setEditData(pkg)}
                    >
                      Edit
                    </button>
                    <button
                      className="flex-1 bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                      onClick={() => handleDelete(pkg.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ViewPackages;