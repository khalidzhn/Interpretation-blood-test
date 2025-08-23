import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";

type User = {
  id: string;
  name: string;
  email: string;
};

const ROLES = [
  { value: "admin", label: "Admin" },
  { value: "hospital admin", label: "Hospital Admin" },
  { value: "clinic admin", label: "Clinic Admin" },
  { value: "doctor", label: "Doctor" },
];

// Dummy hospital/clinic data for demo. Replace with API calls if needed.
const HOSPITALS = [
  { id: "h1", name: "General Hospital" },
  { id: "h2", name: "City Hospital" },
];
const CLINICS = {
  h1: [
    { id: "c1", name: "Cardiology" },
    { id: "c2", name: "Neurology" },
  ],
  h2: [
    { id: "c3", name: "Pediatrics" },
    { id: "c4", name: "Orthopedics" },
  ],
};

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Invite modal state
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("");
  const [inviteHospital, setInviteHospital] = useState("");
  const [inviteClinic, setInviteClinic] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteSuccess, setInviteSuccess] = useState(false);

  useEffect(() => {
    fetch("http://backend-dev.eba-jfrvuvms.us-west-2.elasticbeanstalk.com/users/")
      .then(res => {
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setUsers(data);
        } else if (data && Array.isArray(data.users)) {
          setUsers(data.users);
        } else {
          setUsers([]);
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Reset invite modal state when closed
  const closeInvite = () => {
    setShowInvite(false);
    setInviteEmail("");
    setInviteRole("");
    setInviteHospital("");
    setInviteClinic("");
    setInviteError(null);
    setInviteSuccess(false);
    setInviteLoading(false);
  };

  // Determine if send button should be enabled
  const canSend =
    inviteEmail &&
    inviteRole &&
    (
      inviteRole === "admin" ||
      (inviteRole === "hospital admin" && inviteHospital) ||
      ((inviteRole === "clinic admin" || inviteRole === "doctor") && inviteHospital && inviteClinic)
    );

  // Handle send invitation
  const handleSendInvite = async () => {
    setInviteLoading(true);
    setInviteError(null);
    setInviteSuccess(false);
    try {
      const payload: any = {
        email: inviteEmail,
        role: inviteRole,
      };
      if (inviteRole !== "admin") {
        payload.hospitalId = inviteHospital;
      }
      if (inviteRole === "clinic admin" || inviteRole === "doctor") {
        payload.clinicId = inviteClinic;
      }
      const res = await fetch("http://backend-dev.eba-jfrvuvms.us-west-2.elasticbeanstalk.com/send-invitation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to send invitation");
      setInviteSuccess(true);
      setTimeout(closeInvite, 1500);
    } catch (err: any) {
      setInviteError(err.message || "Failed to send invitation");
    } finally {
      setInviteLoading(false);
    }
  };

  // Clinics for selected hospital
  const clinicsForHospital = inviteHospital ? CLINICS[inviteHospital] || [] : [];

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="glass-card p-8 rounded-2xl shadow-xl border border-border mt-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-primary">All Users</h2>
            <button
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition"
              onClick={() => setShowInvite(true)}
            >
              Invite User
            </button>
          </div>
          {loading ? (
            <div className="text-center text-muted-foreground py-10">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-border rounded-xl overflow-hidden bg-background">
                <thead>
                  <tr className="bg-card text-foreground">
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {error || users.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-center text-muted-foreground py-8">
                        {error ? "Nothing found." : "No users found."}
                      </td>
                    </tr>
                  ) : (
                    users.map(user => (
                      <tr key={user.id} className="even:bg-muted">
                        <td className="p-3">{user.id}</td>
                        <td className="p-3">{user.name}</td>
                        <td className="p-3">{user.email}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>

      {/* Invite User Modal */}
      <AnimatePresence>
        {showInvite && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-background rounded-2xl p-8 shadow-2xl w-full max-w-md border border-border relative"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <button
                className="absolute top-4 right-4 text-xl text-muted-foreground hover:text-primary"
                onClick={closeInvite}
                aria-label="Close"
              >
                ×
              </button>
              <h3 className="text-xl font-bold mb-4 text-primary">Invite User</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-primary">Email</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    value={inviteEmail}
                    onChange={e => setInviteEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-primary">Role</label>
                  <select
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                    value={inviteRole}
                    onChange={e => {
                      setInviteRole(e.target.value);
                      setInviteHospital("");
                      setInviteClinic("");
                    }}
                    required
                  >
                    <option value="">Select role</option>
                    {ROLES.map(role => (
                      <option key={role.value} value={role.value}>{role.label}</option>
                    ))}
                  </select>
                </div>
                {(inviteRole === "hospital admin" || inviteRole === "clinic admin" || inviteRole === "doctor") && (
                  <div>
                    <label className="block text-sm font-medium mb-1 text-primary">Hospital</label>
                    <select
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                      value={inviteHospital}
                      onChange={e => {
                        setInviteHospital(e.target.value);
                        setInviteClinic("");
                      }}
                      required
                    >
                      <option value="">Select hospital</option>
                      {HOSPITALS.map(h => (
                        <option key={h.id} value={h.id}>{h.name}</option>
                      ))}
                    </select>
                  </div>
                )}
                {(inviteRole === "clinic admin" || inviteRole === "doctor") && inviteHospital && (
                  <div>
                    <label className="block text-sm font-medium mb-1 text-primary">Clinic</label>
                    <select
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                      value={inviteClinic}
                      onChange={e => setInviteClinic(e.target.value)}
                      required
                    >
                      <option value="">Select clinic</option>
                      {clinicsForHospital.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                )}
                {inviteError && (
                  <div className="text-red-600 text-sm">{inviteError}</div>
                )}
                {inviteSuccess && (
                  <div className="text-green-600 text-sm">Invitation sent!</div>
                )}
                <button
                  className={`w-full py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition disabled:opacity-50`}
                  disabled={!canSend || inviteLoading}
                  onClick={handleSendInvite}
                  type="button"
                >
                  {inviteLoading ? "Sending..." : "Send"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default Users;