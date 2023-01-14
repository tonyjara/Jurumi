import type { GroupBase, OptionsOrGroups } from 'chakra-react-select';
import { Select } from 'chakra-react-select';
import React from 'react';
import type { CostCategory, Project } from '@prisma/client';

export type ProjectComplete = Project & {
  costCategories: CostCategory[];
};

interface props {
  setSelectedProject: React.Dispatch<
    React.SetStateAction<{
      value: string;
      label: string;
    } | null>
  >;
  options: OptionsOrGroups<unknown, GroupBase<unknown>> | undefined;
}

const ProjectSelect = ({ setSelectedProject, options }: props) => {
  return (
    <div style={{ maxWidth: '300px' }}>
      <Select
        options={options}
        onChange={(e) => {
          //@ts-ignore
          setSelectedProject(e ?? null);
        }}
        // value={handleValue(field)}
        noOptionsMessage={() => 'No hay proyectos.'}
        placeholder="Seleccione un proyecto."
        isClearable={true}
        // isMulti={isMulti}
      />
    </div>
  );
};

export default ProjectSelect;
