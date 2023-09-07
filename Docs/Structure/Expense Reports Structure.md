# Expense report's structure

An expense report is a justification for expenses made on an approved money request.
It requires a taxpayer and a picture of an invoice

## Creation

1. TaxPayer gets upserted.
2. Image gets upserted.
3. Transaction starts
4. Expense report gets created and taxPayer and Searchable image get connected to the row
5. Cost category transaction is created

### Side effects on creation

**Going over the requested amount**

Going over the requested amount automatically creates a reimbursement order.



## Edit



