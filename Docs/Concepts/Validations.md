# Validations

## Form validations live in the validartions folder src/lib/validations

### The file should export only the following things in the following order

1. The type or interface with the explicit inputs that the form will use, extended out of an existing type or interface. The name of the type or interface is constructed like this: 'Form' + BaseTypeName + ('create' | 'edit').

2. The validation object. This object should be a z.lazy that takes in the type previously created as it's own. It's name is constructed like this: 'validate' + BaseTypeName + 'create' | 'edit' if applies.

3. Default data for the form. It should be based on the first type and the name is constructed like this: 'default' + BaseTypeName + ('create' | 'edit') + 'data'.
