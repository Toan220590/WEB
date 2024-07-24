import React, { useState, useEffect } from "react";
import "./MbaForm.css";

const MbaForm = ({ initialData, onSubmit, onCancel, isCopying }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({
        ...formData,
        [name]: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value || "",
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="mba-form">
      {Object.keys(formData).map((key) =>
        key === "id" && isCopying ? null : (
          <div key={key} className="form-group">
            <label>{key.replace(/_/g, " ")}</label>
            {key === "hinh_anh" ? (
              <input type="file" name={key} onChange={handleChange} />
            ) : (
              <input
                type="text"
                name={key}
                value={formData[key] || ""}
                onChange={handleChange}
              />
            )}
          </div>
        )
      )}
      <div className="form-actions">
        <button type="submit" className="save-button">
          Lưu
        </button>
        <button type="button" onClick={onCancel} className="cancel-button">
          Hủy
        </button>
      </div>
    </form>
  );
};

export default MbaForm;
