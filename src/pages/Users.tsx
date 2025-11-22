import React, { useEffect, useState, useMemo } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import { getBackendUrl } from "@/utils/backend";

type User = {
    id: string;
    uuid: string;
    name: string;
    email: string;
    role?: string;
    hospital?: string;
    clinic?: string;
    active?: boolean;
};
const ROLES = [
    { value: "admin", label: "Admin" },
    { value: "hospital admin", label: "Hospital Admin" },
    { value: "clinic admin", label: "Clinic Admin" },
    { value: "doctor", label: "Doctor" },
];

// Dummy hospital/clinic data for demo. Replace with API calls if needed.

const PAGE_SIZE = 10;

const Users: React.FC = () => {
    // Invite modal state
    const [showInvite, setShowInvite] = useState(false);
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteRole, setInviteRole] = useState("");
    const [inviteHospital, setInviteHospital] = useState("");
    const [inviteClinic, setInviteClinic] = useState("");
    const [inviteLoading, setInviteLoading] = useState(false);
    const [inviteError, setInviteError] = useState<string | null>(null);
    const [inviteSuccess, setInviteSuccess] = useState(false);
    const [hospitals, setHospitals] = useState<
        { id: string; name: string; uuid: string; clinics: { id: string; name: string; uuid: string }[] }[]
    >([]);
useEffect(() => {
    fetchUsers();
}, []);
    useEffect(() => {
        const token = localStorage.getItem("access_token");
        fetch(`${getBackendUrl()}/hospitals/`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then(data => {
                const hospitalsArr = (Array.isArray(data) ? data : data.hospitals).map((h: any) => ({
                    id: h.id,
                    name: h.name,
                    uuid: h.uuid,
                    clinics: h.clinics || [],
                }));
                setHospitals(hospitalsArr);
            })
            .catch(err => {
                console.error("Failed to fetch hospitals in Users page:", err);
            });
    }, []);
    const clinics =
        hospitals.find(h => h.id === inviteHospital || h.uuid === inviteHospital)?.clinics || [];
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

const fetchUsers = () => {
    const token = localStorage.getItem("access_token");
    setLoading(true);
    setError(null);
    fetch(`${getBackendUrl()}/users/`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then(res => {
            if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch users`);
            return res.json();
        })
        .then(data => {
            let usersArr = Array.isArray(data) ? data : data.users;
            usersArr = usersArr.map((u: any) => ({
                ...u,
                active: u.is_active,
            }));
            setUsers(usersArr);
            setLoading(false);
        })
        .catch(err => {
            setError(err.message || "Failed to load users. Please check if the backend is running.");
            setLoading(false);
        });
};
    const handleToggleActive = async (userUuid: string, currentActive: boolean) => {
        const token = localStorage.getItem("access_token");
        try {
            const res = await fetch(`${getBackendUrl()}/users/${userUuid}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ is_active: !currentActive }),
            });
            if (!res.ok) throw new Error("Failed to update user status");
            setUsers(users =>
                users.map(u =>
                    u.uuid === userUuid ? { ...u, active: !currentActive } : u
                )
            );
        } catch (err: any) {
            alert(err.message || "Failed to update user status");
        }
    };
    const filteredUsers = useMemo(() => {
        if (!search) return users;
        const lower = search.toLowerCase();
        return users.filter(u =>
            (u.email || "").toLowerCase().includes(lower) ||
            (u.role || "").toLowerCase().includes(lower) ||
            (u.hospital || "").toLowerCase().includes(lower) ||
            (u.clinic || "").toLowerCase().includes(lower) ||
            (u.name || "").toLowerCase().includes(lower)
        );
    }, [users, search]);
    useEffect(() => { setPage(1); }, [search]);

    // Pagination
    const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);
    const paginatedUsers = filteredUsers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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

 const handleSendInvite = async () => {
    setInviteLoading(true);
    setInviteError(null);
    setInviteSuccess(false);
    try {
        const payload: any = {
            email: inviteEmail,
            role: inviteRole,
        };
        if (inviteHospital) {
            payload.assigned_hospital_id = inviteHospital;
        }
        if (inviteClinic) {
            payload.assigned_clinic_id = inviteClinic;
        }
        const token = localStorage.getItem("access_token");
        const res = await fetch(`${getBackendUrl()}/invite`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to send invitation");
        setInviteSuccess(true);
        fetchUsers(); // update table after invite
        setTimeout(closeInvite, 1500);
    } catch (err: any) {
        setInviteError(err.message || "Failed to send invitation");
    } finally {
        setInviteLoading(false);
    }
};
    // Clinics for selected hospital

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto">
                <motion.div
                    className="glass-card p-8 rounded-2xl shadow-xl border border-border mt-8"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                        <h2 className="text-2xl font-bold text-primary">All Users</h2>
                        <div className="flex gap-2 w-full md:w-auto">
                            <input
                                type="text"
                                placeholder="Search users..."
                                className="px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary w-full md:w-64"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                            <button
                                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition"
                                onClick={() => setShowInvite(true)}
                            >
                                Invite User
                            </button>
                        </div>
                    </div>
                    {loading ? (
                        <div className="text-center text-muted-foreground py-10">Loading...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full border border-border rounded-xl overflow-hidden bg-background">
                                <thead>
                                    <tr className="bg-card text-foreground">
                                        <th className="p-3 text-left">Email</th>
                                        <th className="p-3 text-left">Role</th>
                                        <th className="p-3 text-left">Hospital</th>
                                        <th className="p-3 text-left">Clinic</th>
                                        <th className="p-3 text-left">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {error || paginatedUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="text-center text-muted-foreground py-8">
                                                {error ? "Nothing found." : "No users found."}
                                            </td>
                                        </tr>
                                    ) : (
                                        paginatedUsers.map(user => (
                                            <tr key={user.id} className="even:bg-muted">
                                                <td className="p-3">{user.email}</td>
                                                <td className="p-3">{user.role || "-"}</td>
                                                <td className="p-3">{user.hospital || "-"}</td>
                                                <td className="p-3">{user.clinic || "-"}</td>
                                                <td className="p-3">
                                                                                             <div className="flex items-center gap-3">
                                                    <button
                                                        type="button"
                                                        role="switch"
                                                        aria-checked={!!user.active}
                                                        onClick={() => handleToggleActive(user.uuid, !!user.active)}
                                                        className={`relative inline-flex flex-shrink-0 h-6 w-11 rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${user.active ? "bg-green-500" : "bg-gray-300"
                                                            }`}
                                                        aria-label={user.active ? "Disable user" : "Enable user"}
                                                    >
                                                        <span className="sr-only">{user.active ? "Disable user" : "Enable user"}</span>
                                                        <span
                                                            aria-hidden="true"
                                                            className={`pointer-events-none inline-block h-5 w-5 transform bg-white rounded-full shadow transition-transform duration-200 ease-in-out ${user.active ? "translate-x-5" : "translate-x-0"
                                                                }`}
                                                        />
                                                    </button>
                                                    <span className={`text-xs font-semibold ${user.active ? "text-green-600" : "text-gray-500"}`}>
                                                        {user.active ? "Enabled" : "Disabled"}
                                                    </span>
                                                </div> 
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="flex justify-center items-center gap-2 mt-6">
                                    <button
                                        className="px-3 py-1 rounded bg-muted text-foreground disabled:opacity-50"
                                        onClick={() => setPage(page - 1)}
                                        disabled={page === 1}
                                    >
                                        Prev
                                    </button>
                                    <span className="text-sm">
                                        Page {page} of {totalPages}
                                    </span>
                                    <button
                                        className="px-3 py-1 rounded bg-muted text-foreground disabled:opacity-50"
                                        onClick={() => setPage(page + 1)}
                                        disabled={page === totalPages}
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
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
                                            {hospitals.map(h => (
                                                <option key={h.uuid} value={h.uuid}>{h.name}</option>
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
                                            {clinics.map(c => (
                                                <option key={c.uuid} value={c.uuid}>{c.name}</option>
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
