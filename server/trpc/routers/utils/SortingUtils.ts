export const handleOrderBy = ({
  input,
}: {
  input: {
    sorting?:
      | {
          id: string;
          desc: boolean;
        }[]
      | null
      | undefined;
    pageIndex?: number | null | undefined;
    pageSize?: number | null | undefined;
  };
}) => {
  if (input.sorting && input.sorting[0]) {
    const prop = input.sorting[0];
    if (prop.id.includes('_')) {
      const split = prop.id.split('_');
      return {
        [split[0] as string]: {
          [split[1] as string]: prop.desc ? 'desc' : 'asc',
        },
      };
    }
    return { [prop.id]: prop.desc ? 'desc' : 'asc' };
  }
  return { createdAt: 'desc' } as any;
};
