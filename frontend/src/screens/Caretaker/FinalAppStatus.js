import React, { useState, useEffect } from "react";
import "../../styles/tailwind.css";
import axios from "axios";
import { useAuth } from "../../contexts/authContext";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
const ApplicationList = ({ applications, data, setData, idx }) => {
  const [openDropdown, setOpenDropdown] = useState({});
  const navigate = useNavigate();
  const dropdownRefs = {};
  const { currentUser } = useAuth();

  const handleApplicationClick = (appId) => {
    // Add logic for handling the click on an application
    // console.log(`Application ${appId} clicked`);
    navigate(`./application/${appId}`);
  };

  const handleClickOutside = (event, appId) => {
    if (dropdownRefs[appId] && !dropdownRefs[appId].contains(event.target)) {
      setOpenDropdown({ ...openDropdown, [appId]: false });
    }
  };
  useEffect(() => {
    const handleDocumentClick = (event) => {
      for (const appId in openDropdown) {
        handleClickOutside(event, appId);
      }
    };

    document.addEventListener("mousedown", handleDocumentClick);

    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
    };
  }, [openDropdown]);
  // console.log("applications:", applications);
  if (!applications) {
    return <div>Loading...</div>;
  }
  // console.log(currentUser)
  return (
    <div className="overflow-y-auto">
      <ul className="divide-y divide-gray-300">
        {applications.map((app) => {
          const isHidden = 0;
          const isDisabled = 0;
          // console.log("inside loop:", app);
          // console.log("Application:",app.application_id,"isHidden:", isHidden, "isDisabled:", isDisabled);
          return (
            !isHidden && (
              <li key={app.application_id} className="py-2">
                <div
                  className={`border border-gray-200 p-3 rounded bg-gray-100 flex items-center justify-between ${
                    isDisabled ? "opacity-50" : ""
                  }`}
                >
                  <div>
                    <p
                      className="text-m font-medium text-gray-900 cursor-pointer"
                      onClick={() => handleApplicationClick(app.application_id)}
                    >
                      {app.student} - {app.faculty} - {app.application_id}
                    </p>
                    <p
                      className={`text-sm text-${
                        app.status === "Pending Faculty Approval"
                          ? "green"
                          : isDisabled
                          ? "gray"
                          : "text-gray-600"
                      }`}
                    >
                      Status: {app.status}
                    </p>
                  </div>
                  {!isDisabled && (
                    <div
                      className="mt-2 relative group"
                      ref={(ref) => (dropdownRefs[app.id] = ref)}
                    >
                      {/* <button
                        type="button"
                        className={`bg-blue-500 text-white px-4 py-2 rounded group-hover:bg-blue-600 flex items-center focus:outline-none`}
                        onClick={() => handleButtonClick(app.application_id)}
                      >
                        <span className="mr-2">Action</span>
                        <svg
                          className={`h-4 w-4 transition-transform ${
                            openDropdown[app.application_id]
                              ? "transform rotate-180"
                              : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          ></path>
                        </svg>
                      </button>
                      {openDropdown[app.application_id] && (
                        <div className="absolute z-10 mt-2 bg-white border border-gray-200 shadow-lg rounded">
                          <button type="button" className={`block w-full text-left px-4 py-2 text-gray-800 ${
                            data.some(
                              (action) =>
                                action.appId === app.application_id &&
                                action.action === (currentUser.is_hod ? 2 : 1)
                            )
                              ? "bg-green-400 text-white hover:bg-green-400 focus:outline-none" // Selected state
                              : "hover:bg-gray-100 border focus:outline-none"
                          }` // Default or non-selected state
                            }
                            onClick={() =>
                              handleActionClick(
                                app.application_id,
                                currentUser.is_hod ? 2 : 1
                              )
                            }
                          >
                            Approve
                          </button>
                        </div>
                      )} */}
                    </div>
                  )}
                </div>
              </li>
            )
          );
        })}
      </ul>
    </div>
  );
};

const ApplicationStatus = () => {
  // Sample data for applications
  const initialApplications = [
    {
      application_id: 1,
      student: "Application 1",
      status: "Active",
      faculty: "Faculty 1",
    },
    {
      application_id: 2,
      student: "Application 2",
      status: "Pending",
      faculty: "Faculty 1",
    },
    // { application_id: 3, student: 'Application 3', status: 'Inactive' , faculty: "Faculty 1""},
    // { application_id: 4, student: 'Application 4', status: 'Active' , faculty: "Faculty 1"},
    // { application_id: 5, student: 'Application 5', status: 'Inactive' , faculty: "Faculty 1""},
    // { application_id: 6, student: 'Application 6', status: 'Pending' , faculty:  "Faculty 1""},
    // { application_id: 7, student: 'Application 7', status: 'Active' , faculty: "Faculty 1"},
    // { application_id: 8, student: 'Application 8', status: 'Pending' , faculty:  "Faculty 1""},
    {
      application_id: 9,
      student: "Application 9",
      status: "Inactive",
      faculty: "Faculty 1",
    },
  ];

  const backendUrl = process.env.REACT_APP_BASE_URL;
  // State to manage applications
  const { currentUser } = useAuth();
  const [data, setData] = useState([]);
  const [applications, setApplications] = useState(null);
  // const [applications] = useState(initialApplications);
  // console.log("applications:", applications);
  useEffect(() => {
    axios
      .get(`${backendUrl}/api/view_final_applications`, { withCredentials: true })
      .then((res) => {
        console.log("here:", res.data.data);
        setApplications(res.data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  const handleSubmit = () => {
    axios
      .post(
        `${backendUrl}/api/update_application`,
        { data },
        { withCredentials: true }
      )
      .then((res) => {
        // console.log(res.data);
        alert("Data updated successfully");
        // trigger reload
        window.location.reload();
      })
      .catch((error)=>{
        console.log(error);
        toast.error("An error occurred");
      });
  };
  return (
    <div className="p-8 border border-gray-200 rounded">
      <h1 className="text-3xl font-bold mb-4">Application Status</h1>
      {applications && applications.hod && <h4>Faculty Approval</h4>}
      <ApplicationList
        applications={applications ? applications.own : null}
        data={data}
        setData={setData}
        idx={1}
      />
      {applications && applications.hod && <h4>HOD Approval</h4>}
      {applications && applications.hod && (
        <ApplicationList
          applications={applications ? applications.hod : null}
          data={data}
          setData={setData}
          idx={2}
        />
      )}
      <div className="mt-4 flex justify-center">
        <button
          type="button"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => handleSubmit()}
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default ApplicationStatus;
