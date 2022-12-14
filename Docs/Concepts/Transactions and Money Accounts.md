# Transactions

Transactions are the only kind of operation that can extract or add money from bank accounts.
They can be either a:

- Money Requests
- Imbursements
- Expense return

The way money accounts keep themselves up to date is by refering to the last transaction executed.
This workflow is inspired in the following _[article]("https://dba.stackexchange.com/questions/5608/writing-a-simple-bank-schema-how-should-i-keep-my-balances-in-sync-with-their-t")_.

The last transaction holds the opening balance, which is the last state of the account and the transaction amount which is the amount executed. By substratinc the latter with the opening balance you get the current balance of the account.

When creating further transactions, the transactions need to first find the latest transaction on the corresponding context and order by ID, since the id's of transactions are sequential INTS.
