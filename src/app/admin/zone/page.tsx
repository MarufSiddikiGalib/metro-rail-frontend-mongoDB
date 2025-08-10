"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/NavBar";
import AdminMenu from "@/components/AdminMenu";

interface Zone {
  _id: string;
  ZONENAME: string;
}

const ZonePage = () => {
  const router = useRouter();
  const [ZoneList, setZoneList] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);

  // Added later for the CRUD operations
  const [name, setName] = useState("");
  const [editId, setEditId] = useState<string | null>(null);

  
    // Fetch staff data from the API
    const fetchZone = async () => {

      setLoading(true);
      const token = localStorage.getItem("token");

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/zone`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data: Zone[] = await res.json();
          setZoneList(data);
        } else {
          console.error("Failed to fetch zone");
        }
      } catch (err) {
        console.error("Error fetching zone:", err);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/admin/login");
        return;
      }

      fetchZone();
     }, [router]);

 // Update 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const url = editId
      ? `${process.env.NEXT_PUBLIC_API_URL}api/zone/${editId}`
      : `${process.env.NEXT_PUBLIC_API_URL}api/zone`;
    const method = editId ? "PUT" : "POST";
    const body = JSON.stringify({ ZoneName: name });

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body,
    });

    if (res.ok) {
      fetchZone();
      setName("");
      setEditId(null);
    } else {
      const err = await res.json();
      alert("Error: " + err.error);
    }
  };

 // Delete zone
  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("Delete this Zone ?")) return;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/zone/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      fetchZone();
    } else {
      const err = await res.json();
      alert("Error: " + err.error);
    }
  };
 // Edit Zone
  const handleEdit = (zone: Zone) => {
    setEditId(zone._id);
    setName(zone.ZONENAME);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-lg font-semibold">
      Loading Zone data...
    </div>;
  }


  // Logout Logic  now in components/LogoutButton.tsx
  // const handleLogout = () => {
  //   localStorage.removeItem("token");
  //   router.push("/admin/login");
  // };

  

  return (
    <div>
    <Navbar />
    <AdminMenu />
    {/* Main container with padding and background */}
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Admin Panel – Zone List</h1>



 {/* Staff Form */}
 <form onSubmit={handleSubmit} className="mb-6 flex gap-4 items-end">
          <div>
            <label className="block text-sm mb-1">Zone Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded px-2 py-1"
              required
            />
          </div>
          
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {editId ? "Update" : "Add"}
          </button>
          {editId && (
            <button
              type="button"
              onClick={() => {
                setEditId(null);
                setName("");
                
              }}
              className="ml-2 text-gray-600 underline"
            >
              Cancel
            </button>
          )}
        </form>



{/* Staff Table */}
        {ZoneList.length === 0 ? (
          <p className="text-gray-500">No Zone data found.</p>
        ) : (
          <table className="w-full border border-gray-200 text-sm">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-2 px-4 text-left">ID</th>
                <th className="py-2 px-4 text-left">Zone Name</th>
                <th className="py-2 px-4 text-left">Upadte/Delete</th>
                
              </tr>
            </thead>
            <tbody>
              {ZoneList.map((zone) => (
                <tr key={zone._id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{zone._id}</td>
                  <td className="py-2 px-4">{zone.ZONENAME}</td>
                
                {/* Button integration and function call after click the button */}
                  <td className="py-2 px-4 flex gap-2">
                    <button
                      onClick={() => handleEdit(zone)}
                      className="text-blue-600 underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(zone._id)}
                      className="text-red-600 underline"
                    >
                      Delete
                    </button>
                  </td>
                
                
                
                </tr>
              ))}
            </tbody>
          </table>
        )}

      <div>
      
    </div>

      </div>
    </div>
    </div>
  );
};

export default ZonePage;
