import OrgMembershipPreferencesPage from "@/pageContainers/home/settings/OrgMembershipPreferencesPage.home.settings";
import SettingsLayout from "layouts/SettingsLayout";

const orgMembershipPreferences = () => {
  return (
    <SettingsLayout>
      <OrgMembershipPreferencesPage />
    </SettingsLayout>
  );
};

export default orgMembershipPreferences;
