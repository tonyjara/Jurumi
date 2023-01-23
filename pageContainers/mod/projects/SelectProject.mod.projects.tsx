import { Spinner } from '@chakra-ui/react';
import type {
  GroupBase,
  OptionsOrGroups,
  DropdownIndicatorProps,
} from 'chakra-react-select';
import { Select, components } from 'chakra-react-select';
import React from 'react';

interface props {
  setSelectedProject: React.Dispatch<
    React.SetStateAction<{
      value: string;
      label: string;
    } | null>
  >;
  options: OptionsOrGroups<unknown, GroupBase<unknown>> | undefined;
  loading: boolean;
}
const ProjectSelect = ({ setSelectedProject, options, loading }: props) => {
  const DropdownIndicator = (
    props: JSX.IntrinsicAttributes &
      DropdownIndicatorProps<unknown, boolean, GroupBase<unknown>>
  ) => {
    return (
      <components.DropdownIndicator {...props}>
        <Spinner />
      </components.DropdownIndicator>
    );
  };
  return (
    <div style={{ maxWidth: '280px', width: '100%' }}>
      <Select
        instanceId={'unique-id'}
        options={options}
        onChange={(e) => {
          //@ts-ignore
          setSelectedProject(e ?? null);
        }}
        noOptionsMessage={() => 'No hay proyectos.'}
        placeholder="Seleccione un proyecto."
        isClearable={true}
        variant="flushed"
        components={{
          DropdownIndicator: loading ? DropdownIndicator : undefined,
        }}
      />
    </div>
  );
};

export default ProjectSelect;
