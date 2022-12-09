import { CloseIcon, Search2Icon } from '@chakra-ui/icons';
import { InputGroup, Input, InputRightElement } from '@chakra-ui/react';
import React from 'react';

const TableSearchbar = ({
  searchValue,
  setSearchValue,
  type,
  placeholder,
}: {
  searchValue: string;
  setSearchValue: (value: React.SetStateAction<string>) => void;
  type: 'text' | 'number';
  placeholder: string;
}) => {
  const hasLength = !!searchValue.length;
  return (
    <InputGroup>
      <Input
        type={type}
        value={searchValue}
        onChange={(x) => setSearchValue(x.target.value)}
        variant={'flushed'}
        placeholder={placeholder}
      />
      <InputRightElement
        onClick={() => hasLength && setSearchValue('')}
        cursor={hasLength ? 'pointer' : 'auto'}
      >
        {hasLength ? <CloseIcon /> : <Search2Icon />}
      </InputRightElement>
    </InputGroup>
  );
};

export default TableSearchbar;
