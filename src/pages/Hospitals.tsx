import React, { useEffect, useState, useMemo } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import { PlusIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { getBackendUrl } from "@/utils/backend";
type Clinic = { id: string; name: string };
type Hospital = {
  id: string;
  uuid: string; 
  name: string;
  users: number;
  maxUsers: number;
  clinics: Clinic[];
};


const Hospitals: React.FC = () => {
    const [hospitals, setHospitals] = useState<Hospital[]>([]);

useEffect(() => {
  const token = localStorage.getItem("access_token");
  fetch(`${getBackendUrl()}/hospitals/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(res => {
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      return res.json();
    })
    .then(data => {
      // Map max_users to maxUsers for all hospitals
      const hospitalsArr = (Array.isArray(data) ? data : data.hospitals).map((h: any) => ({
        ...h,
        users: h.users,
        maxUsers: h.max_users,   // <-- map max_users to maxUsers

      }));
      setHospitals(hospitalsArr);
    })
    .catch(err => {
      console.error("Failed to fetch hospitals:", err);
    });
}, []);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState<null | Hospital>(null);

  // Create hospital modal state
  const [newHospitalName, setNewHospitalName] = useState("");
  const [newMaxUsers, setNewMaxUsers] = useState<number>(10);
  const [newClinics, setNewClinics] = useState<Clinic[]>([]);
  const [newClinicName, setNewClinicName] = useState("");

  // Edit modal state
  const [editMaxUsers, setEditMaxUsers] = useState<number>(0);
  const [editClinics, setEditClinics] = useState<Clinic[]>([]);
  const [editClinicName, setEditClinicName] = useState("");

  // Filtered hospitals
  const filteredHospitals = useMemo(() => {
    if (!search) return hospitals;
    const lower = search.toLowerCase();
    return hospitals.filter(
      h =>
        h.name.toLowerCase().includes(lower) ||
        h.id.toLowerCase().includes(lower) ||
        h.clinics.some(c => c.name.toLowerCase().includes(lower))
    );
  }, [hospitals, search]);

  // Handlers
  const handleExpand = (id: string) => setExpanded(expanded === id ? null : id);

const handleCreateHospital = async () => {
  if (!newHospitalName.trim() || newMaxUsers < 1) return;
  const token = localStorage.getItem("access_token");
  const body = {
    name: newHospitalName,
    max_users: newMaxUsers,
    clinics: newClinics.length > 0 ? newClinics.map(c => c.name) : null,
  };
  try {
    const res = await fetch(`${getBackendUrl()}/hospitals/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error("Failed to create hospital");
    const created = await res.json();
    // Map max_users to maxUsers for the new hospital
    setHospitals(hospitals => [
      ...hospitals,
      { ...created, maxUsers: created.max_users }
    ]);
    setShowCreate(false);
    setNewHospitalName("");
    setNewMaxUsers(10);
    setNewClinics([]);
    setNewClinicName("");
  } catch (err: any) {
    alert(err.message || "Failed to create hospital");
  }
};
  const handleAddClinicToNew = () => {
    if (!newClinicName.trim()) return;
    setNewClinics([...newClinics, { id: `c${Date.now()}`, name: newClinicName }]);
    setNewClinicName("");
  };

const handleEditHospital = async () => {
  if (!showEdit) return;
  const token = localStorage.getItem("access_token");

  // Find newly added clinics (by name)
  const originalClinicNames = new Set(showEdit.clinics.map(c => c.name));
  const newClinicNames = editClinics
    .map(c => c.name)
    .filter(name => !originalClinicNames.has(name));

  const body = {
    hospital_uuid: showEdit.uuid,
    clinics: newClinicNames.length > 0 ? newClinicNames : null,
    max_users: editMaxUsers > 0 ? editMaxUsers : null,
  };

  try {
    const res = await fetch(`${getBackendUrl()}/clinics/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error("Failed to update clinics");

    // Update hospitals state locally
    setHospitals(hospitals =>
      hospitals.map(h =>
        h.uuid === showEdit.uuid
          ? {
              ...h,
              maxUsers: editMaxUsers,
              clinics: editClinics,
            }
          : h
      )
    );
    setShowEdit(null);
  } catch (err: any) {
    alert(err.message || "Failed to update clinics");
  }
};
  const handleAddClinicToEdit = () => {
    if (!editClinicName.trim()) return;
    setEditClinics([...editClinics, { id: `c${Date.now()}`, name: editClinicName }]);
    setEditClinicName("");
  };

  const openEditModal = (hospital: Hospital) => {
    setShowEdit(hospital);
    setEditMaxUsers(hospital.maxUsers);
    setEditClinics([...hospital.clinics]);
    setEditClinicName("");
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="glass-card p-8 rounded-2xl shadow-xl border border-border mt-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <h2 className="text-2xl font-bold text-primary">Hospitals</h2>
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="text"
                placeholder="Search hospitals..."
                className="px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary w-full md:w-64"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <button
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition"
                onClick={() => setShowCreate(true)}
              >
                Create Hospital
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-border rounded-xl overflow-hidden bg-background">
              <thead>
                <tr className="bg-card text-foreground">
                  <th className="p-3 text-left w-8"></th>
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Hospital Name</th>
                  <th className="p-3 text-left">Num Users</th>
                  <th className="p-3 text-left">Max Users</th>
                  <th className="p-3 text-left">Num Clinics</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredHospitals.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center text-muted-foreground py-8">
                      No hospitals found.
                    </td>
                  </tr>
                ) : (
                  filteredHospitals.map(hospital => (
                    <React.Fragment key={hospital.id}>
                      <tr className="even:bg-muted">
                        <td className="p-3">
                          <button
                            className="p-1 rounded-full bg-muted hover:bg-primary/20 transition"
                            style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}
                            onClick={() => handleExpand(hospital.id)}
                            aria-label={expanded === hospital.id ? "Collapse" : "Expand"}
                          >
                            <PlusIcon
                              className={`w-5 h-5 transition-transform ${expanded === hospital.id ? "rotate-45" : ""}`}
                            />
                          </button>
                        </td>
                        <td className="p-3">{hospital.id}</td>
                        <td className="p-3">{hospital.name}</td>
                        <td className="p-3">{hospital.users}</td>
                        <td className="p-3">{hospital.maxUsers}</td>
                        <td className="p-3">{hospital.clinics.length}</td>
                        <td className="p-3">
                          <button
                            className="px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-1"
                            onClick={() => openEditModal(hospital)}
                          >
                            <PencilSquareIcon className="w-4 h-4" />
                            Edit
                          </button>
                        </td>
                      </tr>
                      {expanded === hospital.id && (
                        <tr>
                          <td colSpan={7} className="bg-muted px-6 py-4">
                            <div>
                              <div className="font-semibold mb-2">Clinics:</div>
                              <ul className="list-disc list-inside space-y-1">
                                {hospital.clinics.map(clinic => (
                                  <li key={clinic.id}>{clinic.name}</li>
                                ))}
                              </ul>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Create Hospital Modal */}
      <AnimatePresence>
        {showCreate && (
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
                onClick={() => setShowCreate(false)}
                aria-label="Close"
              >
                ×
              </button>
              <h3 className="text-xl font-bold mb-4 text-primary">Create Hospital</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-primary">Hospital Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    value={newHospitalName}
                    onChange={e => setNewHospitalName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-primary">Maximum Number of Users</label>
                  <input
                    type="number"
                    min={1}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    value={newMaxUsers}
                    onChange={e => setNewMaxUsers(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-primary">Clinics</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                      value={newClinicName}
                      onChange={e => setNewClinicName(e.target.value)}
                      placeholder="Clinic name"
                    />
                    <button
                      className="px-3 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition"
                      onClick={handleAddClinicToNew}
                      type="button"
                    >
                      Add
                    </button>
                  </div>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    {newClinics.map(c => (
                      <li key={c.id}>{c.name}</li>
                    ))}
                  </ul>
                </div>
   <button
  className="w-full py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition"
  onClick={handleCreateHospital}
  type="button"
  disabled={!newHospitalName.trim() || newMaxUsers < 1}
>
  Create Hospital
</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Hospital Modal */}
      <AnimatePresence>
        {showEdit && (
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
                onClick={() => setShowEdit(null)}
                aria-label="Close"
              >
                ×
              </button>
              <h3 className="text-xl font-bold mb-4 text-primary">Edit Hospital</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-primary">Maximum Number of Users</label>
                  <input
                    type="number"
                    min={1}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    value={editMaxUsers}
                    onChange={e => setEditMaxUsers(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-primary">Clinics</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                      value={editClinicName}
                      onChange={e => setEditClinicName(e.target.value)}
                      placeholder="Clinic name"
                    />
                    <button
                      className="px-3 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition"
                      onClick={handleAddClinicToEdit}
                      type="button"
                    >
                      Add
                    </button>
                  </div>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    {editClinics.map(c => (
                      <li key={c.id}>{c.name}</li>
                    ))}
                  </ul>
                </div>
<button
  className={`w-full py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition
    ${editMaxUsers < 1 ||
      (
        editMaxUsers === showEdit?.maxUsers &&
        editClinics.length === showEdit?.clinics.length &&
        editClinics.every((c, i) => c.name === showEdit?.clinics[i].name)
      )
      ? "opacity-50 cursor-not-allowed"
      : ""
    }
  `}
  onClick={handleEditHospital}
  type="button"
  disabled={
    editMaxUsers < 1 ||
    (
      editMaxUsers === showEdit?.maxUsers &&
      editClinics.length === showEdit?.clinics.length &&
      editClinics.every((c, i) => c.name === showEdit?.clinics[i].name)
    )
  }
>
  Save Changes
</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default Hospitals;   