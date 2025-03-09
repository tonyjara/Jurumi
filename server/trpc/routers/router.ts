/**
 * This file contains the root router of your tRPC-backend
 */
import { publicProcedure, router } from "../initTrpc";
import { moneyAccRouter } from "./moneyAcc.routes";
import { moneyRequestRouter } from "./moneyRequest.routes";
import { greetingRouter } from "./greeting.route";
import { orgRouter } from "./org.routes";
import { projectRouter } from "./project.routes";
import { accountsRouter } from "./account.routes";
import { transactionsRouter } from "./transactions/transaction.routes";
import { moneyApprovalRouter } from "./moneyApproval.routes";
import { preferencesRouter } from "./preferences.routes";
import { magicLinksRouter } from "./magicLinks.routes";
import { taxPayerRouter } from "./taxPayer.routes";
import { expenseReportsRouter } from "./ExpenseReport.routes";
import { imbursementsRouter } from "./imbursements.routes";
import { seedRouter } from "./seed.routes";
import { expenseReturnsRouter } from "./ExpenseReturn.routes";
import { notificationsRouter } from "./notifications.routes";
import { membersRouter } from "./members.routes";
import { galleryRouter } from "./gallery.routes";
import { searchableImageRouter } from "./searchableImage.routes";
import { reportsRouter } from "./reports.routes";
import { contractsRouter } from "./contracts.routes";
import { odooRouter } from "./odoo.routes";

export const appRouter = router({
  account: accountsRouter,
  contracts: contractsRouter,
  expenseReport: expenseReportsRouter,
  expenseReturn: expenseReturnsRouter,
  gallery: galleryRouter,
  greeting: greetingRouter,
  healthcheck: publicProcedure.query(() => "yay!"),
  imbursement: imbursementsRouter,
  magicLinks: magicLinksRouter,
  members: membersRouter,
  moneyAcc: moneyAccRouter,
  moneyApprovals: moneyApprovalRouter,
  moneyRequest: moneyRequestRouter,
  notifications: notificationsRouter,
  odoo: odooRouter,
  org: orgRouter,
  preferences: preferencesRouter,
  project: projectRouter,
  reports: reportsRouter,
  searchableImage: searchableImageRouter,
  seed: seedRouter,
  taxPayer: taxPayerRouter,
  transaction: transactionsRouter,
});
export type AppRouter = typeof appRouter;
