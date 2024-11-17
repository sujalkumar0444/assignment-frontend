import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { FaEdit, FaTrashAlt, FaSearch } from "react-icons/fa"; // Importing icons

const LandingPage = () => {
  const [cars, setCars] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
    images: [],
  });
  const [editCarId, setEditCarId] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCarDetails, setSelectedCarDetails] = useState(null);

  // Fetch all cars
  const fetchCars = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/api/list/cars");
      setCars(response.data);
    } catch (err) {
      setError(err.response ? err.response.data.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "images") {
      if (files.length > 10) {
        alert("You can only upload up to 10 images.");
        return;
      }
      setFormData({ ...formData, images: files });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Create or update a car
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("title", formData.title);
    form.append("description", formData.description);
    form.append("tags", formData.tags);

    Array.from(formData.images).forEach((file) => {
      form.append("images", file);
    });

    try {
      if (editCarId) {
        await axiosInstance.put(`/api/update/car/${editCarId}`, form);
      } else {
        await axiosInstance.post("/api/add/car", form);
      }
      // After submission, we fetch the updated cars list
      fetchCars();
      setFormData({ title: "", description: "", tags: "", images: [] });
      setEditCarId(null);
    } catch (err) {
      setError(err.response ? err.response.data.message : "An error occurred");
    }
  };

  // Delete a car
  const handleDelete = async (carId) => {
    try {
      await axiosInstance.delete(`/api/delete/car/${carId}`);
      // After deletion, we remove the car from the state directly instead of refetching from server
      setCars(cars.filter((car) => car._id !== carId));
    } catch (err) {
      setError(err.response ? err.response.data.message : "An error occurred");
    }
  };

  // Search cars
  const handleSearch = async () => {
    try {
      const response = await axiosInstance.get(`/api/search/car`, {
        params: { keyword: searchKeyword },
      });
      setCars(response.data);
    } catch (err) {
      setError(err.response ? err.response.data.message : "An error occurred");
    }
  };

  // Fetch car details for editing
  const handleEdit = (car) => {
    setEditCarId(car._id);
    setFormData({
      title: car.title,
      description: car.description,
      tags: car.tags.join(", "),
      images: [], 
    });
  };

  // Handle car details visibility toggle
  const toggleCarDetails = (carId) => {
    setSelectedCarDetails(selectedCarDetails === carId ? null : carId);
  };

  // Cancel Edit
  const handleCancel = () => {
    setEditCarId(null);
    setFormData({ title: "", description: "", tags: "", images: [] });
  };

  useEffect(() => {
    fetchCars();
  }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-800">Car Management Dashboard</h1>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500 text-white p-4 rounded-md mb-6 shadow-md">
          {error}
        </div>
      )}

      {/* Search Bar */}
      <div className="flex items-center gap-6 mb-8">
        <input
          type="text"
          placeholder="Search by keyword"
          className="border border-gray-300 rounded-lg p-4 w-2/3 text-lg"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700 transition duration-300"
        >
          <FaSearch size={20} />
        </button>
      </div>

      {/* Form for Add/Edit */}
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg mb-8">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800">
          {editCarId ? "Edit Car" : "Add New Car"}
        </h2>
        <div className="grid grid-cols-1 gap-6">
          <input
            type="text"
            name="title"
            placeholder="Car Title"
            value={formData.title}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg p-4 text-lg"
            required
          />
          <textarea
            name="description"
            placeholder="Car Description"
            value={formData.description}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg p-4 text-lg"
            required
          ></textarea>
          <input
            type="text"
            name="tags"
            placeholder="Tags (comma-separated)"
            value={formData.tags}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg p-4 text-lg"
          />
          <input
            type="file"
            name="images"
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg p-4"
            multiple
          />
        </div>
        <div className="flex justify-between mt-6">
          <button
            type="submit"
            className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg hover:bg-green-700 transition duration-300"
          >
            {editCarId ? "Update Car" : "Add Car"}
          </button>
          {editCarId && (
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-600 text-white px-8 py-4 rounded-lg text-lg hover:bg-gray-700 transition duration-300"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Car List */}
      {isLoading ? (
        <div className="text-center text-xl text-gray-700">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.length > 0 ? (
            cars.map((car) => (
              <div
                key={car._id}
                className="bg-white p-6 rounded-xl shadow-lg transition-transform transform hover:scale-105"
              >
                <h3
                  className="text-2xl font-semibold text-gray-800 mb-4 cursor-pointer"
                  onClick={() => toggleCarDetails(car._id)}
                >
                  {car.title}
                </h3>

                {/* Conditionally render car details */}
                {selectedCarDetails === car._id && (
                  <div className="text-lg text-gray-600">
                    <p className="mb-4">{car.description}</p>
                    <div className="flex gap-2 flex-wrap mb-4">
                      {car.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    {/* Display images with horizontal scroll */}
                    <div className="overflow-x-auto flex gap-4 mb-4">
                      {car.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img} 
                          alt={`Car image ${idx}`}
                          className="w-32 h-32 object-cover rounded-lg shadow-lg"
                        />
                      ))}
                    </div>
                    {/* Buttons for edit and delete */}
                    <div className="flex gap-4">
                      <button
                        onClick={() => handleEdit(car)}
                        className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600"
                      >
                        <FaEdit size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(car._id)}
                        className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700"
                      >
                        <FaTrashAlt size={20} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-xl text-gray-700">
            
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LandingPage;
