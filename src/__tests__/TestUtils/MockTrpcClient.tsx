export {};
// export const TRPCWrapper = ({ children }: { children: ReactNode }) => {
//   const [queryClient] = useState(() => new QueryClient());
//   const [trpcClient] = useState(() =>
//     trpc.createClient({
//       links: [
//         httpBatchLink({
//           url: platformSpecificLocalHostUrl,
//           fetch: async (input, init?) => {
//             const fetch = getFetch();
//             return fetch(input, {
//               ...init,
//               // credentials: "include",
//             });
//           },
//         }),
//       ],
//     })
//   );

//   return (
//     <trpc.Provider client={trpcClient} queryClient={queryClient}>
//       <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
//     </trpc.Provider>
//   );
// };
