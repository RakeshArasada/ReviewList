import React, { useEffect, useState } from "react";
import firebase from "firebase/compat/app"; // Import Firebase
import "firebase/compat/database"; // Import Firebase Realtime Database

// Initialize Firebase with your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCCLW8F2Ayh6Bz2Nvkj3q36ucbNpp3DY34",
  authDomain: "drivermanagement-ffa9a.firebaseapp.com",
  projectId: "drivermanagement-ffa9a",
  storageBucket: "drivermanagement-ffa9a.appspot.com",
  messagingSenderId: "48862497107",
  appId: "1:48862497107:web:3a03b02345768516b4f9a6"
};

firebase.initializeApp(firebaseConfig);

function ReviewList() {
  const [listData, setListData] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Fetch driver data from Firebase when the component mounts
    const database = firebase.database();
    const driversRef = database.ref("drivers");

    driversRef.on("value", (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const driversArray = Object.values(data);
        setListData(driversArray);
      }
    });

    return () => {
      // Unsubscribe from the Firebase Realtime Database when the component unmounts
      driversRef.off("value");
    };
  }, []);

  const filteredListData = listData
    .filter((item) => {
      const searchTerm = search.toLowerCase();
      const driverName = item.driverName ? item.driverName.toLowerCase() : "";
      const customerName = item.customerName
        ? item.customerName.toLowerCase()
        : "";
      const orderId = item.orderId ? item.orderId.toString() : "";

      return (
        orderId.includes(searchTerm) ||
        driverName.includes(searchTerm) ||
        customerName.includes(searchTerm)
      );
    })
    .map((item, index) => ({
      ...item,
      no: "" // Add a "no" property with an empty value
    }))
    .filter((item) => item.no !== ""); // Exclude items with an empty "no" value
  
  

  return (
    <div className="container">
      <div className="card">
        <div className="card-title">
          <h2>Review List of Drivers</h2>
          <br />
          <input
            type="text"
            placeholder="Search..."
            className="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="card-body">
          <table className="table table-bordered">
            <thead className="bg-dark text-white">
              <tr>
                <th>No</th>
                <th>Order ID</th>
                <th>Customer Name</th>
                <th>Driver Name</th>
                <th>Date & Time</th>
                <th>Ratings</th>
                <th>Comments</th>
              </tr>
            </thead>
            <tbody>
              {filteredListData.map((item, index) => (
                <tr key={index}>
                  {/* <td>{index + 1}</td> */}
                  <td>{item.orderId}</td>
                  <td>{item.customerName}</td>
                  <td>{item.driverName}</td>
                  <td>{item.dateTime}</td>
                  <td>{item.ratings}</td>
                  <td>{item.comments}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ReviewList;
