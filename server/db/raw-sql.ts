import prisma from "./client";

/** It was approved, accepted and expense reports still have not reached 100% */
/* export const beingReportedRawSqlShort = async () => { */
/*   return (await prisma.$queryRaw` */
/* select */
/* 	m."id" */
/* from */
/* 	"MoneyRequest" m */
/* join "MoneyRequestApproval" ma on */
/* 	m."id" = ma."moneyRequestId" */
/* join "_moneyRequestApprovers" mra on */
/* 	ma."accountId" = mra."A" */
/* left join ( */
/* 	select */
/* 		"moneyRequestId", */
/* 		SUM("amountSpent") as "totalSpent" */
/* 	from */
/* 		"ExpenseReport" */
/* 	group by */
/* 		"moneyRequestId" */
/* ) e  */
/* on */
/* 	m.id = e."moneyRequestId" */
/* where */
/* 	(e."totalSpent" < m."amountRequested" */
/* 		or e."totalSpent" is null) */
/* 	and m."status" = 'ACCEPTED' */
/* 	and m."wasCancelled" = false */
/* group by */
/* 	m."id" */
/* having */
/* 	COUNT(distinct mra."A") = ( */
/* 	select */
/* 		COUNT(*) */
/* 	from */
/* 		"_moneyRequestApprovers" */
/* 	where */
/* 		"B" = m."organizationId" */
/* );`) as any; */
/* }; */

/** It was approved, accepted and expense reports still have not reached 100% */
export const beingReportedRawSqlShort = async () => {
  return (await prisma.$queryRaw`
select
	m."id"
from
	"MoneyRequest" m
left join "MoneyRequestApproval" ma on
	m."id" = ma."moneyRequestId"
left join "_moneyRequestApprovers" mra on
	ma."accountId" = mra."A"
left join (
	select
		"moneyRequestId",
		SUM("amountSpent") as "totalSpent"
	from
		"ExpenseReport"
	group by
		"moneyRequestId"
) e on
	m."id" = e."moneyRequestId"
where
	(e."totalSpent" < m."amountRequested"
		or e."totalSpent" is null)
	and m."status" = 'ACCEPTED'
	and m."wasCancelled" = false
group by
	m."id"
having
	(
  COUNT(distinct mra."A") = (
	select
		COUNT(*)
	from
		"_moneyRequestApprovers"
	where
		"B" = m."organizationId"
  )
	or (
	select
		COUNT(*)
	from
		"_moneyRequestApprovers"
	where
		"B" = m."organizationId"
  ) = 0
);

`) as any;
};

/** It has been approved by all but the status is pending */
export const executionPengingRawSql = async () => {
  return (await prisma.$queryRaw`
select
	m."id"
from
	"MoneyRequest" m
left join "MoneyRequestApproval" ma on
	m."id" = ma."moneyRequestId"
left join "_moneyRequestApprovers" mra on
	ma."accountId" = mra."A"
	where m."status" = 'PENDING'
	and m."wasCancelled" = false
group by
	m."id"
having
	(
  COUNT(distinct mra."A") = (
	select
		COUNT(*)
	from
		"_moneyRequestApprovers"
	where
		"B" = m."organizationId"
  )
	or (
	select
		COUNT(*)
	from
		"_moneyRequestApprovers"
	where
		"B" = m."organizationId"
  ) = 0
);

`) as any;
};
