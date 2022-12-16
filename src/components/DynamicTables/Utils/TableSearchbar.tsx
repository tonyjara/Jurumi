import { CloseIcon, Search2Icon } from '@chakra-ui/icons';
import { InputGroup, Input, InputRightElement, Text } from '@chakra-ui/react';
import { debounce } from 'lodash';
import React from 'react';

const TableSearchbar = ({
  searchValue,
  setSearchValue,
  type,
  placeholder,
  helperText,
}: {
  searchValue: string;
  setSearchValue: (value: React.SetStateAction<string>) => void;
  type: 'text' | 'number';
  placeholder: string;
  helperText?: string;
}) => {
  const hasLength = !!searchValue.length;

  return (
    <InputGroup flexDir={'column'}>
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
      <Text color={'gray.500'}>{helperText}</Text>
    </InputGroup>
  );
};

export default TableSearchbar;
