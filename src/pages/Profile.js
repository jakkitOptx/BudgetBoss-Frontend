import React from "react";

const Profile = () => {
  const user = JSON.parse(localStorage.getItem("user")); // ดึงข้อมูล user จาก localStorage

  return (
    <div className="max-w-3xl mx-auto mt-8 bg-white shadow p-6 rounded-md">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      {user && (
        <div>
          <p>
            <strong>First Name:</strong> {user.firstName}
          </p>
          <p>
            <strong>Last Name:</strong> {user.lastName}
          </p>
          <p>
            <strong>Username:</strong> {user.username}
          </p>
          <p>
            <strong>Level:</strong> {user.level}
          </p>
        </div>
      )}
    </div>
  );
};

export default Profile;
