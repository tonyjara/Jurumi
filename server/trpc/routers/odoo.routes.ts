import { z } from "zod";
import { router, protectedProcedure } from "../initTrpc";
import xmlrpc from "xmlrpc";
import { trpcClient } from "@/lib/utils/trpcClient";
import { appRouter } from "./router";
const ODOO_URL = process.env.ODOO_URL;
const ODOO_API_KEY = process.env.ODOO_API_KEY;
const ODOO_DB = process.env.ODOO_DB;
const ODOO_USER = process.env.ODOO_USER;

export const odooRouter = router({
  getVersion: protectedProcedure.mutation(async () => {
    const commonClient = xmlrpc.createClient({
      url: `${ODOO_URL}/xmlrpc/2/common`,
    });

    //Common client is a public route from odoo that returns the version of the server, it does not require authentication or an api key
    console.log("Connecting to database...");
    try {
      const output = await new Promise((resolve, reject) => {
        commonClient.methodCall("version", [], (error, output) => {
          if (error) {
            console.error("Error:", error);
            reject(error);
          } else {
            resolve(output);
          }
        });
      });
      console.log("Version:", output);
      return output;
    } catch (error) {
      console.error("Error:", error);
      return error;
    }
  }),
  getUserUuid: protectedProcedure.mutation(async () => {
    try {
      const commonClient = xmlrpc.createClient({
        url: `${ODOO_URL}/xmlrpc/2/common`,
      });
      const output = await new Promise((resolve, reject) => {
        commonClient.methodCall(
          "authenticate",
          [ODOO_DB, ODOO_USER, ODOO_API_KEY, {}],
          (error, output) => {
            if (error) {
              console.error("Error:", error);
              reject(error);
            } else {
              resolve(output);
            }
          },
        );
      });
      return output;
    } catch (error) {
      console.error("Error:", error);
      return error;
    }
  }),
  query: protectedProcedure
    // .input(
    //   z.object({
    //     model: z.string(),
    //     method: z.string(),
    //     where: z.string(),
    //     params: z.string(),
    //     uid: z.string(),
    //   }),
    // )
    .mutation(async ({ ctx }) =>
      // { input: { model, method, where, params, uid } }
      {
        console.log("Connecting to database...");
        try {
          const caller = appRouter.createCaller({ session: ctx.session });

          const modelsClient = xmlrpc.createClient({
            url: `${ODOO_URL}/xmlrpc/2/object`,
          });
          const uuid = await caller.odoo.getUserUuid();

          const output = await new Promise((resolve, reject) => {
            modelsClient.methodCall(
              "execute_kw",
              // [ODOO_DB, uuid, ODOO_API_KEY, model, method, where, params],
              [
                ODOO_DB,
                uuid,
                ODOO_API_KEY,
                "hr.expense",
                "name_search",
                ["340"],
                { limit: 10 },
              ],
              (error, output) => {
                if (error) {
                  console.error("Error:", error);
                  reject(error);
                } else {
                  resolve(output);
                }
              },
            );
          });
          console.log("Result:", output);
          return output;
        } catch (error) {
          console.error("Error:", error);
          return error;
        }
      },
    ),
});
