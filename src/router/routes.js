const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      //vue/multi-word-component-names
      {
        path: "/login",
        name: "login",
        component: () => import("src/pages/LoginPage.vue"),
        meta: { public: true },
      },
      {
        path: "/loginvendor",
        name: "loginvendor",
        component: () => import("src/pages/LoginVendorPage.vue"),
        meta: { public: true },
      },
      {
        path: "/index",
        component: () => import("pages/IndexPage.vue"),
      },
      {
        path: "/users",
        component: () => import("src/pages/UsersPage.vue"),
      },
      {
        path: "/customers",
        component: () => import("src/pages/CustomersPage.vue"),
      },
      {
        path: "/employees",
        component: () => import("src/pages/EmployeesPage.vue"),
      },
      {
        path: "/vendors",
        component: () => import("src/pages/VendorsPage.vue"),
      },
      {
        path: "/calendar",
        component: () => import("src/pages/CalendarPage.vue"),
      },
      {
        path: "/headquarters",
        component: () => import("src/pages/HeadquartersPage.vue"),
      },
      {
        path: "/productslist",
        component: () => import("src/pages/ProductsPage.vue"),
      },
      {
        path: "/materialslist",
        component: () => import("src/pages/MaterialsPage.vue"),
      },
      {
        path: "/lostorstolen",
        component: () => import("src/pages/LostOrStolenPage.vue"),
      },
      {
        path: "/firmslist",
        component: () => import("src/pages/FirmsPage.vue"),
      },
      {
        path: "/offers/:offerType",
        component: () => import("src/pages/OffersPage.vue"),
      },
      {
        path: "/technicalServiceList",
        component: () => import("src/pages/TechnicalServicePage.vue"),
      },
      {
        path: "/technicalServices/:type",
        component: () => import("src/pages/TechnicalServicePage.vue"),
      },
      {
        path: "/technicalserviceentrance",
        component: () =>
          import("src/components/forms/TechnicalServiceFrontDeskForm.vue"),
      },
      {
        path: "/technicianassignment",
        component: () => import("src/pages/TechnicianassignmentPage.vue"),
      },
      {
        path: "/authorizations",
        component: () => import("src/pages/Authorization.vue"),
      },
      {
        path: "/stockinout/:id",
        component: () => import("src/pages/StockInOutPage.vue"),
      },
      {
        path: "/invoices",
        component: () => import("src/pages/InvoicesPage.vue"),
      },
      {
        path: "/waybill",
        component: () => import("src/pages/WaybillPage.vue"),
      },
      {
        path: "/collectionPayment",
        component: () => import("src/pages/CollectionPaymentPage.vue"),
      },
      {
        path: "/cases",
        component: () => import("src/pages/CasePage.vue"),
      },
      {
        path: "/recipecontentreport",
        component: () => import("src/pages/RecipeContentReportPage.vue"),
      },
      {
        path: "/accountStatement",
        component: () => import("src/pages/AccountStatementPage.vue"),
      },
      {
        path: "/vehicles",
        component: () => import("src/pages/VehiclesPage.vue"),
      },
      {
        path: "/dealers",
        component: () => import("src/pages/DealersPage.vue"),
      },
      {
        path: "/RfidCardList",
        component: () => import("src/pages/RfidCardListPage.vue"),
      },
      {
        path: "/pricelist",
        component: () => import("src/pages/PricesListPage.vue"),
      },
      {
        path: "/discountlist",
        component: () => import("src/pages/DiscountListPage.vue"),
      },
      {
        path: "/stationConnectorTypes",
        component: () => import("src/pages/ConnectorTypesPage.vue"),
      },
      {
        path: "/bulkSmsEmail",
        component: () => import("src/pages/BulkSmsEmailPage.vue"),
      },
      {
        path: "/requests",
        component: () => import("src/pages/RequestsPage.vue"),
      },
      {
        path: "/stationregion",
        component: () => import("src/pages/StationRegionPage.vue"),
      },
      {
        path: "/stations",
        component: () => import("src/pages/StationsPage.vue"),
      },
      {
        path: "/paymenttransactions",
        component: () => import("src/pages/PaymentTransactionsPage.vue"),
      },
      {
        path: "/stationreport",
        component: () => import("src/pages/StationReportPage.vue"),
      },
      {
        path: "/regionreport",
        component: () => import("src/pages/RegionReportPage.vue"),
      },
      {
        path: "/stationbasedreport",
        component: () => import("src/pages/StationBasedReportPage.vue"),
      },
      {
        path: "/stationbasedreportmonthly",
        component: () => import("src/pages/StationBasedReportMonthlyPage.vue"),
      },
      {
        path: "/stationlogs",
        component: () => import("src/pages/StationLogsPage.vue"),
      },

      {
        path: "/ongoingTransactions",
        component: () => import("src/pages/OngoingTransactionsPage.vue"),
      },
      {
        path: "/transactionReport",
        component: () => import("src/pages/TransactionReportPage.vue"),
      },
      {
        path: "/dealerUsageReport",
        component: () => import("src/pages/DealerUsageReportPage.vue"),
      },
      {
        path: "/stationActions",
        component: () => import("src/pages/StationActionsPage.vue"),
      },
      {
        path: "/callCenter",
        component: () => import("src/pages/CallCenterPage.vue"),
      },
      {
        path: "/ocppOutLogs",
        component: () => import("src/pages/OcppOutLogsPage.vue"),
      },
      {
        path: "/solutionManagement",
        component: () => import("src/pages/SolutionManagement.vue"),
      },
      {
        path: "/payments",
        component: () => import("src/pages/PaymentsPage.vue"),
      },
      {
        path: "/mglTR",
        component: () => import("src/pages/mglTRPage.vue"),
      },
      {
        path: "/:catchAll(.*)*",
        component: () => import("pages/ErrorNotFound.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
