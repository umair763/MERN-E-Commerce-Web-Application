import { useState, useEffect } from "react";
import { PageHeader } from "../../../../common";
import { Plus } from "lucide-react";
import { SettingsTableResp, SettingsEditDialogue, SettingsCreateDialogue } from "../settings";
import { useToast } from "../../../../common";

const BaseUrl = import.meta.env.VITE_API_URL;

export const SuperAdminSettings = () => {
  const { success, error } = useToast();
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState(null);

  const fetchSettings = async () => {
    try {
      const response = await fetch(`${BaseUrl}/api/settings`, {
        credentials: "include",
      });
      const result = await response.json();
      if (response.ok) {
        setSettings(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleEdit = (setting) => {
    setSelectedSetting(setting);
    setShowEdit(true);
  };

  const handleEditSuccess = () => {
    setShowEdit(false);
    setSelectedSetting(null);
    fetchSettings();
    success("Setting updated successfully");
  };

  const handleCreateSuccess = () => {
    setShowCreate(false);
    fetchSettings();
    success("Setting created successfully");
  };

  return (
    <div>
      <div className="ml-3 mr-3">
        <PageHeader
          breadcrumbs={["Super Admin", "Settings"]}
          title="System Settings"
          subtitle="Manage system configuration"
          buttonLabel="Add Setting"
          buttonIcon={Plus}
          showButton={true}
          onButtonClick={() => setShowCreate(true)}
        />
      </div>

      <div className="ml-3 mr-3">
        <div className="bg-white rounded-xl border border-gray-200">
          <SettingsTableResp
            settings={settings}
            loading={loading}
            onEdit={handleEdit}
          />
        </div>
      </div>

      <SettingsCreateDialogue
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onSuccess={handleCreateSuccess}
      />

      {showEdit && selectedSetting && (
        <SettingsEditDialogue
          isOpen={showEdit}
          setting={selectedSetting}
          onClose={() => {
            setShowEdit(false);
            setSelectedSetting(null);
          }}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
};
