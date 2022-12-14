# Constraints

## This doc describes the constraints set to different parts of the application

### Transaction deletion or modification

To mantain a scalable and truetful record of transactions I have decided not to allow editing or deletion of transactions UNLESS they are the last transaction made. This way I can trust that the amounts are correct. Otherwhise deleting or modifying transactions would require modification of all consequent records. This is a security flaw and not practical whit a large dataset.

- TODO: Add the ability to create patching transactions in case they are needed.
