import { Select } from '@chakra-ui/react';
import React from 'react';
import { trpcClient } from '../../../lib/utils/trpcClient';
import { handleUseMutationAlerts } from '../../Toasts & Alerts/MyToast';

const OrganizationSelect = () => {
  const context = trpcClient.useContext();

  const { data } = trpcClient.org.getMyOrgs.useQuery();
  const { data: myPrefs } = trpcClient.preferences.getMyPreferences.useQuery();

  const { mutate, isLoading } =
    trpcClient.preferences.upsertSelectedOrg.useMutation(
      handleUseMutationAlerts({
        successText: 'Has cambiado de Org.!',
        callback: () => {
          context.preferences.getMyPreferences.invalidate();
        },
      })
    );

  const options = () => {
    if (!data?.organizations)
      return <option>No eres parte de ninguna organización.</option>;
    return data.organizations?.map((opt) => (
      <option key={opt.id} value={opt.id}>
        {opt.displayName}
      </option>
    ));
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value.length) {
      mutate({ organizationId: value });
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <Select
        value={myPrefs?.selectedOrganization}
        isDisabled={isLoading}
        onChange={handleOnChange}
        variant="flushed"
        placeholder="Seleccione una org..."
      >
        {options()}
      </Select>
    </div>
  );
};

export default OrganizationSelect;
