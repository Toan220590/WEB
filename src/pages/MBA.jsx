import React, { useEffect, useState } from "react";
import axios from "axios";
import MbaForm from "../components/MbaForm";
import "./MBA.css"; // Import file CSS mới

const MBA = () => {
  const [data, setData] = useState([]);
  const [editingMba, setEditingMba] = useState(null);
  const [isCopying, setIsCopying] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios
      .get("http://ngoctoan90.pythonanywhere.com/api/may-bien-ap/")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleAdd = () => {
    setEditingMba({});
  };

  const handleEdit = (mba) => {
    setEditingMba(mba);
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://ngoctoan90.pythonanywhere.com/api/may-bien-ap/${id}/`)
      .then((response) => {
        fetchData();
      })
      .catch((error) => {
        console.error("Error deleting data:", error);
      });
  };

  const handleCopy = (mba) => {
    const { id, ...copyData } = mba; // Loại bỏ trường id
    setEditingMba(copyData);
    setIsCopying(true);
  };

  const handleFormSubmit = (formData) => {
    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    if (isCopying || !formData.id) {
      axios
        .post("http://ngoctoan90.pythonanywhere.com/api/may-bien-ap/", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          fetchData();
          setEditingMba(null);
          setIsCopying(false);
        })
        .catch((error) => {
          console.error("Error copying data:", error);
        });
    } else {
      axios
        .put(
          `http://ngoctoan90.pythonanywhere.com/api/may-bien-ap/${formData.id}/`,
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((response) => {
          fetchData();
          setEditingMba(null);
        })
        .catch((error) => {
          console.error("Error updating data:", error.response.data); // Kiểm tra lỗi chi tiết
        });
    }
  };

  const handleCancel = () => {
    setEditingMba(null);
    setIsCopying(false);
  };

  return (
    <div>
      {editingMba ? (
        <MbaForm
          initialData={editingMba}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
          isCopying={isCopying} // Truyền isCopying vào MbaForm
        />
      ) : (
        <div>
          {/* <button onClick={handleAdd} style={{ margin: "10px 0" }}>
            Thêm mới
          </button> */}
          <table>
            <thead>
              <tr>
                <th>Tên</th>
                <th>Vị trí</th>
                <th>Công suất</th>
                <th>Uc</th>
                <th>Uh</th>
                <th>Tổn hao không tải</th>
                <th>Tổn hao ngắn mạch</th>
                <th>Un (%)</th>
                <th>I0 (%)</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {data.map((mba) => (
                <tr key={mba.id}>
                  <td>{mba.ten}</td>
                  <td>{mba.vi_tri}</td>
                  <td>{mba.cong_suat}</td>
                  <td>{mba.uc}</td>
                  <td>{mba.uh}</td>
                  <td>{mba.ton_hao_khong_tai}</td>
                  <td>{mba.ton_hao_ngan_mach}</td>
                  <td>{mba.un_phan_tram}</td>
                  <td>{mba.i0_phan_tram}</td>
                  <td>
                    <button onClick={() => handleEdit(mba)}>Sửa</button>
                    <button onClick={() => handleDelete(mba.id)}>Xóa</button>
                    <button onClick={() => handleCopy(mba)}>Bản sao</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MBA;
