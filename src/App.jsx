import React, { useState } from "react";

const SegmentApp = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [segmentName, setSegmentName] = useState("");
  const [selectedSchemas, setSelectedSchemas] = useState([]);
  const [availableSchemas, setAvailableSchemas] = useState([
    { label: "First Name", value: "first_name" },
    { label: "Last Name", value: "last_name" },
    { label: "Gender", value: "gender" },
    { label: "Age", value: "age" },
    { label: "Account Name", value: "account_name" },
    { label: "City", value: "city" },
    { label: "State", value: "state" },
  ]);
  const [newSchema, setNewSchema] = useState("");
  const [customSchemaName, setCustomSchemaName] = useState("");
  const [showCustomSchemaInput, setShowCustomSchemaInput] = useState(false);

  // Function to handle adding a new schema
  const handleAddNewSchema = () => {
    if (newSchema) {
      const selectedSchemaObj = availableSchemas.find((schema) => schema.value === newSchema);
      setSelectedSchemas([...selectedSchemas, selectedSchemaObj]); // Add full object for label/value pair
      setAvailableSchemas(availableSchemas.filter((schema) => schema.value !== newSchema));
      setNewSchema(""); // Reset the dropdown
    }
  };

  // Function to handle adding a custom schema
  const handleAddCustomSchema = () => {
    if (customSchemaName.trim()) {
      const newCustomSchema = { label: customSchemaName, value: customSchemaName.toLowerCase().replace(/\s/g, "_") };
      setAvailableSchemas([...availableSchemas, newCustomSchema]);
      setCustomSchemaName("");
      setShowCustomSchemaInput(false); // Hide the input box after adding the schema
    }
  };

  // Function to handle changing schema
  const handleChangeSchema = (index, newValue) => {
    const updatedSchemas = [...selectedSchemas];
    const oldSchema = updatedSchemas[index].value;

    // Restore the old schema to the available list
    const schemaToRestore = availableSchemas.find((s) => s.value === oldSchema);
    setAvailableSchemas([...availableSchemas, schemaToRestore]);

    // Update with the new schema
    const selectedSchemaObj = availableSchemas.find((schema) => schema.value === newValue);
    updatedSchemas[index] = selectedSchemaObj;
    setSelectedSchemas(updatedSchemas);
    setAvailableSchemas(availableSchemas.filter((schema) => !updatedSchemas.some((s) => s.value === schema.value)));
  };

  // Function to handle removing a schema
  const handleRemoveSchema = (index) => {
    const removedSchema = selectedSchemas[index];
    setSelectedSchemas(selectedSchemas.filter((_, i) => i !== index));
    setAvailableSchemas([...availableSchemas, removedSchema]);
  };

  // Function to save the segment data
  const handleSaveSegment = () => {
    const schemaData = selectedSchemas.map((schema) => ({ [schema.value]: schema.label }));

    const dataToSend = {
      segment_name: segmentName,
      schema: schemaData,
    };

    console.log("Sending data to server:", dataToSend);
    handleReset(); // Reset all state after saving
  };

  // Function to reset all state variables
  const handleReset = () => {
    setSegmentName("");
    setSelectedSchemas([]);
    setAvailableSchemas([
      { label: "First Name", value: "first_name" },
      { label: "Last Name", value: "last_name" },
      { label: "Gender", value: "gender" },
      { label: "Age", value: "age" },
      { label: "Account Name", value: "account_name" },
      { label: "City", value: "city" },
      { label: "State", value: "state" },
    ]);
    setNewSchema("");
    setCustomSchemaName("");
    setShowCustomSchemaInput(false);
    setShowPopup(false); // Close the popup
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <button
        onClick={() => setShowPopup(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        Save Segment
      </button>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-[600px]"> {/* Made the popup wider */}
            <h2 className="text-lg font-bold mb-4">Saving Segment</h2>

            <input
              type="text"
              placeholder="Enter the Name of the Segment"
              value={segmentName}
              onChange={(e) => setSegmentName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg mb-4"
            />

            <p className="text-gray-600 mb-4">
              To save your segment, you need to add the schemas to build the query.
            </p>

            <div className="border rounded-lg p-4 bg-blue-50 mb-4">
              {selectedSchemas.map((schema, index) => (
                <div key={index} className="flex items-center mb-2">
                  <select
                    value={schema.value}
                    onChange={(e) => handleChangeSchema(index, e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg mr-2"
                  >
                    <option value={schema.value}>{schema.label}</option>
                    {availableSchemas.map((schemaOption) => (
                      <option key={schemaOption.value} value={schemaOption.value}>
                        {schemaOption.label}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleRemoveSchema(index)}
                    className="bg-red-500 text-white p-2 rounded-lg"
                  >
                    Remove
                  </button>
                </div>
              ))}

              <div className="flex items-center mb-2">
                <select
                  value={newSchema}
                  onChange={(e) => setNewSchema(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg mr-2"
                >
                  <option value="">Add schema to segment</option>
                  {availableSchemas.map((schema) => (
                    <option key={schema.value} value={schema.value}>
                      {schema.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAddNewSchema}
                  className="bg-blue-500 text-white p-2 rounded-lg"
                >
                  Add
                </button>
              </div>

              {/* Create custom schema */}
              <div className="flex items-center mb-2">
                {showCustomSchemaInput ? (
                  <>
                    <input
                      type="text"
                      placeholder="Create new schema"
                      value={customSchemaName}
                      onChange={(e) => setCustomSchemaName(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg mr-2"
                    />
                    <button
                      onClick={handleAddCustomSchema}
                      className="bg-green-500 text-white p-2 rounded-lg"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => setShowCustomSchemaInput(false)}
                      className="text-red-500 p-2 ml-2"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <a
                    href="#!"
                    onClick={() => setShowCustomSchemaInput(true)}
                    className="text-blue-500 underline cursor-pointer"
                  >
                    +Add Custom Schema
                  </a>
                )}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={handleSaveSegment}
                className="px-4 py-2 bg-green-500 text-white rounded-lg"
              >
                Save the Segment
              </button>

              <button
                onClick={handleReset}
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SegmentApp;
