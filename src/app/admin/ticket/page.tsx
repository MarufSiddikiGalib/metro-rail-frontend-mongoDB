"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/NavBar";
import AdminMenu from "@/components/AdminMenu";
import Link from "next/link";

interface Ticket {
  _id: string;
  type1: string;
  type2: string;
  passengerId: string;
  status: string; // assuming ticket has a status field for "Cancelled" or "Expired"
}

const TicketPage = () => {
  const router = useRouter();
  const [ticketList, setTicketList] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch ticket data from the API
  const fetchTickets = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/tickets`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data: Ticket[] = await res.json();
        // Assume data is a 2D array as in your stations page
       
        setTicketList(data);
      } else {
        console.error("Failed to fetch ticket list");
      }
    } catch (err) {
      console.error("Error fetching ticket list:", err);
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
    fetchTickets();
    // eslint-disable-next-line
  }, [router]);

  // not implement the stutus section yet
  // Delete ticket (only if status is Cancelled or Expired)
  const handleDelete = async (ticket: Ticket) => {   
    // if (ticket.STATUS !== "Cancelled" && ticket.STATUS !== "Expired") {
    //   alert("You can only delete tickets that are Cancelled or Expired.");
    //   return;
    // }
    const token = localStorage.getItem("token");
    if (!window.confirm("Delete this ticket? This action cannot be undone.")) return;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/tickets/${ticket._id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      fetchTickets();
    } else {
      const err = await res.json();
      alert("Error: " + err.error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg font-semibold">
        Loading ticket data...
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <AdminMenu />
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-5xl mx-auto bg-white p-6 rounded-2xl shadow-xl">
          <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
            <h1 className="text-2xl font-bold text-gray-800">Admin Panel – Ticket List</h1>
            <Link
              href="/admin/passenger"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
            >
              + SEE Passenger
            </Link>
          </div>
          <div className="mb-4 p-3 bg-red-100 text-red-800 text-sm rounded border border-red-300">
            <strong>Warning:</strong> Only <b>Cancelled</b> or <b>Expired</b> tickets may be deleted.<br />
            Admins cannot add or update tickets from this panel.
          </div>
          {ticketList.length === 0 ? (
            <p className="text-gray-500">No ticket data found.</p>
          ) : (
            <table className="w-full border border-gray-200 text-sm">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="py-2 px-4 text-left">Ticket Number</th>
                  <th className="py-2 px-4 text-left">Type 1</th>
                  <th className="py-2 px-4 text-left">Type 2</th>
                  <th className="py-2 px-4 text-left">Passenger ID</th>
                  <th className="py-2 px-4 text-left">Status</th>
                  <th className="py-2 px-4 text-left">Delete</th>
                </tr>
              </thead>
              <tbody>
                {ticketList.map((ticket) => (
                  <tr key={ticket._id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">{ticket._id}</td>
                    <td className="py-2 px-4">{ticket.type1}</td>
                    <td className="py-2 px-4">{ticket.type2}</td>
                    <td className="py-2 px-4">{ticket.passengerId}</td>
                    <td className="py-2 px-4">{ticket.status}</td>
                    <td className="py-2 px-4">
                      <button
                        onClick={() => handleDelete(ticket)}

                        className={"text-red-600 underline hover:text-red-800 transition "}

                        // not implemented the status section yet
                        // className={`text-red-600 underline hover:text-red-800 transition ${
                        //   ticket.STATUS === "Cancelled" || ticket.STATUS === "Expired"
                        //     ? ""
                        //     : "opacity-50 cursor-not-allowed"
                        // }`}
                        // disabled={ticket.STATUS !== "Cancelled" && ticket.STATUS !== "Expired"}
                        // title={
                        //   ticket.STATUS === "Cancelled" || ticket.STATUS === "Expired"
                        //     ? "Delete ticket"
                        //     : "Can only delete Cancelled or Expired tickets"
                        // }
                        
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="mt-6">
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketPage;