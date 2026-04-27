import React, { useState } from "react";
import axios from "axios";

const UpdatePayment = ({ setPage }) => {
  const [id, setId] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [status, setStatus] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();
    setStatus("Updating...");

    try {
      const res = await axios.put(
        `http://localhost:5000/api/students/update/${id}`,
        { paidAmount },
      );

      setStatus("Payment Updated Successfully!");
      setId("");
      setPaidAmount("");
    } catch (error) {
      setStatus("Error: " + error.message);
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Update Payment</h2>

      <form
        onSubmit={handleUpdate}
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        <input
          type="text"
          placeholder="Student ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="New Paid Amount"
          value={paidAmount}
          onChange={(e) => setPaidAmount(e.target.value)}
          required
        />

        <button type="submit">Update Payment</button>
      </form>

      <button onClick={() => setPage("home")} style={{ marginTop: "20px" }}>
        ⬅ Back
      </button>

      <p>{status}</p>
    </div>
  );
};

export default UpdatePayment;
