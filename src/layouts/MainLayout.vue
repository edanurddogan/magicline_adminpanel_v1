<!--https://quasar.dev/style/color-palette#brand-colors-->
<script setup>
//import LocaleSwitcher from "src/components/LocaleSwitcher.vue";
//import { useMenuStore } from "src/stores/menu";
//const user = useUserStore();
</script>
<template>
  <q-layout view="lHh Lpr lFf" :lang="$i18n.locale">
    <q-header
      elevated
      class="bg-primary text-white"
      height-hint="98"
      v-model="layoutStore.isHeaderVisible"
    >
      <q-toolbar>
        <q-btn
          dense
          flat
          round
          icon="menu"
          @click="layoutStore.toggleLeftDrawer"
        />
        <!-- :src="`src/assets/logo/${firm.code}/logo.png`" -->
        <!-- src="~/assets/logo/logo.png" -->
        <q-img
          :src="brandAssets.logo"
          spinner-color="white"
          fit="fill"
          position="left center"
          style="max-height: 45px; max-width: 45px"
        />
        <!--<q-toolbar-title> {{ $t("productTitle") }} </q-toolbar-title>-->
        <q-img
          v-if="false"
          class="q-ml-xl"
          :src="`~/assets/logo/${firm.code}/magicline_logo.png`"
          spinner-color="white"
          fit="contain"
          position="left center"
          style="max-height: 65px; max-width: 35px"
        />
        <q-toolbar-title> {{ productName }} </q-toolbar-title>
        <q-space />
        <notification-module />
        <q-btn
          dense
          flat
          round
          icon="settings"
          @click="layoutStore.toggleRightDrawer"
        />
      </q-toolbar>

      <!--<q-tabs align="left">
        <q-route-tab to="/calendar" label="Page One" />
        <q-route-tab to="/page2" label="Page Two" />
        <q-route-tab to="/page3" label="Page Three" />
      </q-tabs>-->
    </q-header>

    <q-drawer
      show-if-above
      v-model="layoutStore.isLeftDrawerOpen"
      side="left"
      behavior="desktop"
      elevated
      :width="300"
      :breakpoint="400"
    >
      <q-scroll-area style="height: calc(100% - 100px); margin-top: 100px">
        <q-list padding class="menu-list">
          <q-item clickable v-ripple to="/index" active-class="active-item">
            <q-item-section avatar>
              <q-icon name="space_dashboard" />
            </q-item-section>
            <q-item-section> {{ $t("pages.dashboard") }} </q-item-section>
          </q-item>

          <!--Headquarter-->
          <q-item
            v-if="false"
            clickable
            v-ripple
            to="/headquarters"
            active-class="active-item"
            v-show="menuVisible.headquarters"
          >
            <q-item-section avatar>
              <q-icon name="business_center" />
            </q-item-section>
            <q-item-section> {{ $t("pages.headquarters") }} </q-item-section>
          </q-item>

          <!--Calendar-->
          <q-item
            clickable
            v-ripple
            to="/calendar"
            active-class="active-item"
            v-show="menuVisible.calendar"
          >
            <q-item-section avatar>
              <q-icon name="event_available" />
            </q-item-section>
            <q-item-section> {{ $t("pages.calendar") }} </q-item-section>
          </q-item>

          <!-- Şarj İşlemleri-->
          <q-item
            clickable
            v-ripple
            to="/transactionReport"
            active-class="active-item"
            v-show="menuVisible.employees"
          >
            <q-item-section avatar>
              <q-icon name="ev_station" />
            </q-item-section>
            <q-item-section>
              {{ $t("reports.transactionTrackingPanel") }}
            </q-item-section>
          </q-item>

          <!-- Active Charges -->
          <q-item
            clickable
            v-ripple
            to="/ongoingTransactions"
            active-class="active-item"
            v-show="menuVisible.employees"
          >
            <q-item-section avatar>
              <q-icon name="flash_on" />
            </q-item-section>
            <q-item-section>
              {{ $t("reports.ongoingTransactions") }}
            </q-item-section>
          </q-item>

          <!--Technical Service-->
          <q-expansion-item
            v-if="false"
            icon="handyman"
            label="Teknik Servis"
            v-show="menuVisible.technicalService"
          >
            <q-list class="q-pl-lg">
              <!--<q-item
      clickable
      v-ripple
      to="/technicalserviceentrance"
      active-class="active-item"
      v-show="menuVisible.employees"
    >
      <q-item-section avatar>
        <q-icon name="post_add" />
      </q-item-section>
      <q-item-section>
        {{ $t("technicalService.technicalServiceEntrance") }}
      </q-item-section>
    </q-item>

    <q-item
      clickable
      v-ripple
      to="/technicalserviceentrance"
      active-class="active-item"
      v-show="menuVisible.users"
    >
      <q-item-section avatar>
        <q-icon name="assignment_turned_in" />
      </q-item-section>
      <q-item-section>
        {{ $t("technicalService.technicalServiceOutlet") }}
      </q-item-section>
    </q-item>-->
              <q-item
                clickable
                v-ripple
                to="/technicalServiceList"
                active-class="active-item"
                v-show="menuVisible.technicalService"
              >
                <q-item-section avatar>
                  <q-icon name="checklist" />
                </q-item-section>
                {{ $t("technicalService.technicalServiceList") }}
              </q-item>

              <q-item
                clickable
                v-ripple
                to="/technicalServices/frontDesk"
                active-class="active-item"
                v-show="menuItemShowSingel('technicalService/frontDesk')"
              >
                <q-item-section avatar>
                  <q-icon name="add_to_queue" />
                </q-item-section>
                {{ $t("technicalService.frontDesk") }}
              </q-item>
              <q-item
                clickable
                v-ripple
                to="/technicalServices/engineering"
                active-class="active-item"
                v-show="menuItemShowSingel('technicalService/engineering')"
              >
                <q-item-section avatar>
                  <q-icon name="engineering" />
                </q-item-section>
                {{ $t("technicalService.technician") }}
              </q-item>
              <q-item
                clickable
                v-ripple
                to="/technicalServices/warehouse"
                active-class="active-item"
                v-show="menuItemShowSingel('technicalService/warehouse')"
              >
                <q-item-section avatar>
                  <q-icon name="warehouse" />
                </q-item-section>
                {{ $t("technicalService.warehouse") }}
              </q-item>
              <q-item
                clickable
                v-ripple
                to="/technicalServices/dataForm"
                active-class="active-item"
                v-show="menuItemShowSingel('technicalService/dataForm')"
              >
                <q-item-section avatar>
                  <q-icon name="backup" />
                </q-item-section>
                {{ $t("technicalService.dataForm") }}
              </q-item>
              <q-item
                clickable
                v-ripple
                to="/technicalServices/callCenter"
                active-class="active-item"
                v-show="menuItemShowSingel('technicalService/callCenter')"
              >
                <q-item-section avatar>
                  <q-icon name="phone_callback" />
                </q-item-section>
                {{ $t("technicalService.callCenter") }}
              </q-item>
              <!-- technician assignment -->
              <q-item
                clickable
                v-ripple
                to="/technicianassignment"
                active-class="active-item"
                v-show="menuVisible.technicianassignment"
              >
                <q-item-section avatar>
                  <q-icon name="engineering" />
                </q-item-section>
                {{ $t("technicalService.technicianAssignment") }}
              </q-item>
            </q-list>
          </q-expansion-item>

          <!--Production-->
          <q-expansion-item
            v-if="false"
            icon="precision_manufacturing"
            :label="$t('pages.production')"
            v-show="menuVisible.production"
          >
            <q-list class="q-pl-lg">
              <q-item
                clickable
                to="/productionOrders"
                active-class="active-item"
              >
                <q-item-section avatar>
                  <q-icon name="precision_manufacturing" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    {{ $t("pages.productions") }}
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item
                clickable
                to="/productionProcesses"
                active-class="active-item"
              >
                <q-item-section avatar>
                  <q-icon name="airline_stops" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    {{ $t("production.productionProcesses") }}
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item to="/recipes" active-class="active-item">
                <q-item-section avatar>
                  <q-icon name="note_alt" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    {{ $t("pages.recipes") }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>

          <!--Stock-->
          <q-expansion-item
            v-if="false"
            icon="category"
            :label="$t('pages.stock')"
            v-show="menuVisible.stocks"
          >
            <q-list class="q-pl-lg">
              <q-item to="/productslist" active-class="active-item">
                <q-item-section avatar>
                  <q-icon name="view_list" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    {{ $t("pages.products") }}
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item to="/materialslist" active-class="active-item">
                <q-item-section avatar>
                  <q-icon name="memory" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    {{ $t("pages.materials") }}
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item to="/lostorstolen" active-class="active-item">
                <q-item-section avatar>
                  <q-icon name="policy" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    {{ $t("pages.lostOrStolen") }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>

          <!--Definations-->
          <q-expansion-item icon="toc" :label="$t('pages.definations')">
            <q-list class="q-pl-lg">
              <q-item to="/vehicles" active-class="active-item">
                <q-item-section avatar>
                  <q-icon name="directions_car" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    {{ $t("vehicle.vehicles") }}
                  </q-item-label>
                </q-item-section>

                <q-item-section side>
                  {{ $t("vehicle.brandModel") }}
                </q-item-section>
              </q-item>
              <q-item to="/dealers" active-class="active-item">
                <q-item-section avatar>
                  <q-icon name="groups" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    {{ $t("dealer.dealers") }}
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item to="/RfidCardList" active-class="active-item">
                <q-item-section avatar>
                  <q-icon name="contactless" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    {{ $t("rfid.rfidCardList") }}
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item to="/pricelist" active-class="active-item">
                <q-item-section avatar>
                  <q-icon name="price_change" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    {{ $t("priceList.priceList") }}
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item to="/discountlist" active-class="active-item">
                <q-item-section avatar>
                  <q-icon name="percent" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    {{ $t("pages.discountList") }}
                  </q-item-label>
                </q-item-section>
              </q-item>
              <!-- Connector Types -->
              <q-item to="/stationConnectorTypes" active-class="active-item">
                <q-item-section avatar>
                  <q-icon name="settings_input_svideo" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    {{ $t("station.connectorType") }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>

          <!--Bulk Sms Mail-->
          <q-expansion-item
            v-if="true"
            icon="outgoing_mail"
            :label="$t('bulkSmsEmail.bulkSmsEmail')"
          >
            <q-list class="q-pl-lg">
              <q-item to="/bulkSmsEmail" active-class="active-item">
                <q-item-section avatar>
                  <q-icon name="forum" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    {{ $t("bulkSmsEmail.sendSmsEmail") }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>

          <!--Station-->
          <q-expansion-item
            icon="charging_station"
            :label="$t('station.station')"
          >
            <q-list class="q-pl-lg">
              <!-- Regions-->
              <q-item to="/stationregion" active-class="active-item">
                <q-item-section avatar>
                  <q-icon name="location_on" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    {{ $t("region.regions") }}
                  </q-item-label>
                </q-item-section>
                <q-item-section> </q-item-section>
              </q-item>
              <!-- Stations -->
              <q-item to="/stations" active-class="active-item">
                <q-item-section avatar>
                  <q-icon name="ev_station" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    {{ $t("station.stations") }}
                  </q-item-label>
                </q-item-section>
              </q-item>
              <!-- Station Actions Eski -->
              <!-- <q-item
                to="/stationactions"
                v-if="false"
                active-class="active-item"
              >
                <q-item-section avatar>
                  <q-icon name="on_device_training" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    {{ $t("station.stationActions") }}
                  </q-item-label>
                </q-item-section>
              </q-item> -->
              <!-- Station Actions V2 -->
              <q-item
                to="/stationActions"
                v-if="true"
                active-class="active-item"
              >
                <q-item-section avatar>
                  <q-icon name="on_device_training" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    {{ $t("station.stationActions") }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>

          <!-- Requests
          <q-item to="/requests" active-class="active-item">
            <q-item-section avatar>
              <q-icon name="hail" />
            </q-item-section>
            <q-item-section>
              <q-item-label>
                {{ $t("pages.requests") }}
              </q-item-label>
            </q-item-section>
          </q-item> -->

          <!--Firm-->
          <q-expansion-item
            icon="business"
            :label="$t('pages.firm')"
            v-show="menuVisible.firms"
          >
            <q-list class="q-pl-lg">
              <q-item to="/firmslist" active-class="active-item">
                <q-item-section avatar>
                  <q-icon name="view_list" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    {{ $t("pages.firms") }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>

          <!--Offers-->
          <q-expansion-item
            v-if="false"
            icon="file_present"
            :label="$t('pages.offers')"
            v-show="menuVisible.orders"
          >
            <q-list class="q-pl-lg">
              <q-item
                to="/offers/0"
                active-class="active-item"
                v-show="menuVisible.orders"
              >
                <q-item-section avatar>
                  <q-icon name="description" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    {{ $t("pages.purchaseOffers") }}
                  </q-item-label>
                </q-item-section> </q-item
              ><!--@click="showLoading"-->
              <q-item
                v-if="false"
                to="/offers/1"
                active-class="active-item"
                v-show="menuVisible.orders"
              >
                <q-item-section avatar>
                  <q-icon name="description" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    {{ $t("pages.sellOffers") }}
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item
                v-if="false"
                to="/offers/3"
                active-class="active-item"
                v-show="menuVisible.orders"
              >
                <q-item-section avatar>
                  <q-icon name="description" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    {{ $t("order.outsourceOrders") }}
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item
                v-if="false"
                to="/orders/2"
                active-class="active-item"
                v-show="menuVisible.orders"
              >
                <q-item-section avatar>
                  <q-icon name="description" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    {{ $t("order.technicalServiceOrders") }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>

          <!--Employees and Other Users-->
          <q-expansion-item
            icon="people"
            :label="$t('pages.persons')"
            v-show="
              menuVisible.employees ||
              menuVisible.customers ||
              menuVisible.users
            "
          >
            <q-list class="q-pl-lg">
              <!-- Employees -->
              <q-item
                clickable
                v-ripple
                to="/employees"
                active-class="active-item"
                v-show="menuVisible.employees"
              >
                <q-item-section avatar>
                  <q-icon name="people" />
                </q-item-section>
                <q-item-section> {{ $t("pages.employees") }} </q-item-section>
              </q-item>

              <!-- Customers -->
              <q-item
                clickable
                v-ripple
                to="/customers"
                active-class="active-item"
                v-show="menuVisible.customers"
              >
                <q-item-section avatar>
                  <q-icon name="diversity_3" />
                </q-item-section>
                <q-item-section> {{ $t("pages.customers") }} </q-item-section>
              </q-item>

              <!-- Users -->
              <q-item
                v-if="false"
                clickable
                v-ripple
                to="/users"
                active-class="active-item"
                v-show="menuVisible.users"
              >
                <q-item-section avatar>
                  <q-icon name="people" />
                </q-item-section>
                <q-item-section> {{ $t("pages.users") }} </q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>

          <!--Call Center -->
          <q-expansion-item
            icon="call"
            :label="$t('pages.callCenter')"
            v-show="menuVisible.reports"
          >
            <q-list class="q-pl-lg">
              <!-- Çağrı Merkezi -->
              <q-item to="/callCenter" active-class="active-item">
                <q-item-section avatar>
                  <q-icon name="report_problem" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    {{ $t("callCenter.complaintIdentification") }}
                  </q-item-label>
                </q-item-section>
              </q-item>
              <!-- Çağrı Merkezi Kayıtları -->
              <q-item to="/solutionManagement" active-class="active-item">
                <q-item-section avatar>
                  <q-icon name="help_center" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    {{ $t("callCenter.solutionManagement") }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>

          <!--Logs -->
          <q-expansion-item
            icon="article"
            :label="$t('reports.logs')"
            v-show="menuItemShowEmployeeGroupId()"
          >
            <q-list class="q-pl-lg">
              <!-- OCPP  -->
              <q-item to="/ocppOutLogs" active-class="active-item">
                <q-item-section avatar>
                  <q-icon name="view_timeline" />
                </q-item-section>
                <q-item-section>
                  <q-item-label> OCPP Logs </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>

          <!--Report-->
          <q-expansion-item
            icon="query_stats"
            :label="$t('pages.reports')"
            v-show="menuVisible.reports"
          >
            <q-list class="q-pl-lg">
              <!-- Cari Extre -->
              <q-item
                v-if="false"
                to="/accountStatement/"
                active-class="active-item"
                v-show="menuVisible.orders"
              >
                <q-item-section avatar>
                  <q-icon name="description" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    {{ $t("pages.AccountStatement") }}
                  </q-item-label>
                </q-item-section>
              </q-item>
              <!-- Station Based Report -->
              <q-item
                clickable
                v-ripple
                to="/stationbasedreport"
                active-class="active-item"
                v-show="menuVisible.employees"
              >
                <q-item-section avatar>
                  <q-icon name="article" />
                </q-item-section>
                <q-item-section>
                  {{ $t("reports.stationUsageReport") }}
                </q-item-section>
              </q-item>
              <!-- Station Based Report Monthly -->
              <q-item
                clickable
                v-ripple
                to="/stationbasedreportmonthly"
                active-class="active-item"
                v-show="menuVisible.employees"
              >
                <q-item-section avatar>
                  <q-icon name="article" />
                </q-item-section>
                <q-item-section>
                  {{ $t("reports.stationReportMonthly") }}
                </q-item-section>
              </q-item>
              <!-- Bayi Kullanım İşlemleri-->
              <q-item
                clickable
                v-ripple
                to="/dealerUsageReport"
                active-class="active-item"
                v-show="menuVisible.employees"
                v-if="true"
              >
                <q-item-section avatar>
                  <q-icon name="article" />
                </q-item-section>
                <q-item-section>
                  {{ $t("reports.dealerUsageReport") }}
                </q-item-section>
              </q-item>
              <!-- Station Logs -->
              <q-item
                clickable
                v-ripple
                to="/stationLogs"
                active-class="active-item"
                v-show="menuVisible.employees"
              >
                <q-item-section avatar>
                  <q-icon name="article" />
                </q-item-section>
                <q-item-section>
                  {{ $t("reports.stationLogs") }}
                </q-item-section>
              </q-item>
              <!-- Payments -->
              <q-item to="/payments" v-if="false" active-class="active-item">
                <q-item-section avatar>
                  <q-icon name="credit_card" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    {{ $t("payments") }}
                  </q-item-label>
                </q-item-section>
              </q-item>
              <!-- İstasyon Durumu -->
              <q-item
                to="/stationreport"
                active-class="active-item"
                v-show="menuVisible.orders"
              >
                <q-item-section avatar>
                  <q-icon name="description" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    {{ $t("reports.stationReport") }}
                  </q-item-label>
                </q-item-section>
              </q-item>

              <!-- Bayi Raporu -->
              <q-item
                clickable
                v-ripple
                to="/dealerUsageReport"
                active-class="active-item"
                v-show="menuVisible.employees"
                v-if="false"
              >
                <q-item-section avatar>
                  <q-icon name="dynamic_form" />
                </q-item-section>
                <q-item-section>
                  {{ $t("reports.dealerUsageReport") }}
                </q-item-section>
              </q-item>

              <q-item
                v-if="false"
                to="/PendingOrderReportGroupByFirm"
                active-class="active-item"
                v-show="menuVisible.orders"
              >
                <q-item-section avatar>
                  <q-icon name="description" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    {{ $t("reports.PendingOrderReportGroupByFirm") }}
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item
                v-if="false"
                to="/orderReport/1"
                active-class="active-item"
                v-show="menuVisible.orders"
              >
                <q-item-section avatar>
                  <q-icon name="description" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    {{ $t("reports.OrderReport") }}
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item
                v-if="false"
                to="/recipecontentreport"
                active-class="active-item"
              >
                <q-item-section avatar>
                  <q-icon name="note_alt" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    {{ $t("pages.recipeReport") }}
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item
                v-if="false"
                clickable
                v-ripple
                to="/test"
                active-class="active-item"
                v-show="menuVisible.employees"
              >
                <q-item-section avatar>
                  <q-icon name="post_add" />
                </q-item-section>
                <q-item-section>
                  {{ $t("reports.sectorReport") }}
                </q-item-section>
              </q-item>
              <!-- Add allFirmsAverageMaturityReport-->
              <q-item
                v-if="false"
                clickable
                v-ripple
                to="/AllFirmsAverageMaturityReport"
                active-class="active-item"
                v-show="menuVisible.employees"
              >
                <q-item-section avatar>
                  <q-icon name="post_add" />
                </q-item-section>
                <q-item-section>
                  {{ $t("reports.allFirmsAverageMaturityReport") }}
                </q-item-section>
              </q-item>
              <!-- Add averageMaturityReport-->
              <q-item
                v-if="false"
                clickable
                v-ripple
                active-class="active-item"
                v-show="menuVisible.employees"
                to="/AverageMaturityReport"
              >
                <q-item-section avatar>
                  <q-icon name="post_add" />
                </q-item-section>
                <q-item-section>
                  {{ $t("reports.averageMaturityReport") }}
                </q-item-section>
              </q-item>

              <!-- Add entityReport-->
              <q-item
                v-if="false"
                clickable
                v-ripple
                to="/EntityReport"
                active-class="active-item"
                v-show="menuVisible.employees"
              >
                <q-item-section avatar>
                  <q-icon name="post_add" />
                </q-item-section>
                <q-item-section>
                  {{ $t("reports.accountStatement") }}
                </q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>
        </q-list>
      </q-scroll-area>

      <q-img
        class="absolute-top"
        src="~/assets/profilebg.jpg"
        style="height: 100px"
      >
        <div class="absolute-bottom bg-transparent row">
          <q-avatar size="56px" class="q-mb-sm">
            <q-img
              :src="profilePhotoUrl || ''"
              placeholder-src="~/assets/user.png"
            >
              <template v-slot:error>
                <q-img src="~/assets/user.png"> </q-img>
              </template>
            </q-img>
          </q-avatar>
          <div class="q-px-md">
            <div class="text-subtitle1">
              {{ user?.name }} {{ user?.surname }}
            </div>
            <div class="text-caption text-grey">
              {{ user?.title }}
            </div>
          </div>
        </div>
      </q-img>
    </q-drawer>

    <q-drawer
      overlay
      v-model="layoutStore.rightDrawerOpen"
      side="right"
      behavior="mobile"
      elevated
      class="flex inline shadow-box shadow-7"
    >
      <div class="column">
        <div class="q-pl-md q-pr-md">
          <div class="row q-pt-md">
            <q-chip
              class="on-left shadow-2 glossy"
              square
              color="primary"
              text-color="white"
              icon-right="person"
            >
              {{ user?.name }}
              {{ user?.surname }}
            </q-chip>
            <q-space />
            <locale-switcher />
            <q-space />
            <q-btn
              dense
              flat
              round
              icon="arrow_forward_ios"
              @click="layoutStore.toggleRightDrawer"
            />
          </div>
        </div>
        <div class="row q-pl-md q-pt-md">
          <q-toggle
            class="q-pr-xl"
            v-model="darkMode"
            color="white"
            :label="$t('darkmode')"
            @click="darkswitch"
          />
        </div>
        <div class="row q-pl-md q-pt-md" v-if="false">
          <q-input
            filled
            v-model="selectedColor"
            :rules="['anyColor']"
            class="my-input"
          >
            <template v-slot:append>
              <q-icon name="colorize" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-color v-model="selectedColor" dark class="my-picker" />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div
          class="row q-ml-xs q-mb-xl"
          style="position: absolute; bottom: 0; left: 0; width: 100%"
        >
          <!-- :src="`src/assets/logo/${firm.code}/logo2.png`" -->
          <!-- src="~/assets/logo/logo_yatay.png" -->
          <q-img
            :src="brandAssets.logo2"
            spinner-color="white"
            fit="contain"
          >
          </q-img>
          <div class="column q-pl-md q-pb-md">
            <div>{{ productName }}</div>
            <!-- <div>{{ author }}</div> -->
            <div>v {{ version }}</div>
            <div>
              © {{ new Date().getFullYear() }} Copyright All rights reserved.
            </div>
            <div>
              Supported by
              <a href="https://www.infaura.com" target="_blank">Infaura</a>
            </div>
          </div>
          <div>
            <q-space />
          </div>
        </div>
        <div
          class="column q-pr-md"
          style="position: absolute; bottom: 0; right: 0"
        >
          <div>
            <q-space />
            <q-btn
              icon="logout"
              color="red"
              class="text-capitalize bg-info q-pa-sm q-ma-md"
              @click="logout"
            >
              {{ $t("logout") }}
            </q-btn>
          </div>
        </div>
      </div>
    </q-drawer>
    <q-page-container>
      <router-view
        @authcontrol="getAuth"
        @userControl="userUpdate"
        @leftMenuOpen="leftMenuUpdate(true)"
        @leftMenuClose="leftMenuUpdate(false)"
        @headerShow="headerShow(true)"
      />
    </q-page-container>

    <q-footer
      elevated
      class="bg-grey-8 text-white"
      v-model="layoutStore.isFooterVisible"
      v-if="false"
    >
      <q-toolbar>
        <q-toolbar-title
          class="text-subtitle2 text-center"
          style="font-size: 15px"
        >
          <!--src="~/assets/logo/magicline_logo.png"-->
          <q-img
            :src="brandAssets.logo2"
            spinner-color="white"
            fit="scale-down"
            position="left center"
            style="height: 25px"
          >
            ©
            {{ new Date().getFullYear() }} Copyright All rights reserved. - Made
            with <q-icon color="negative" name="favorite" /> by Infaura for a
            better web.
          </q-img>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script>
import { ref } from "vue";
const menusettings = useMenuStore();
import {
  useQuasar,
  LocalStorage,
  Cookies,
  Platform,
  setCssVar,
  AddressbarColor,
  Dark,
  Loading,
  QSpinnerGears,
} from "quasar";
import { version } from "../../package.json";
import { productName } from "../../package.json";
import { author } from "../../package.json";
import { firm } from "../../package.json";
import { useLayoutStore } from "../stores/layout";
import { useUserStore } from "../stores/user";
import { useMenuStore } from "src/stores/menu";
import NotificationModule from "src/components/NotificationModule.vue";
import LocaleSwitcher from "src/components/LocaleSwitcher.vue";
import { brandAssets } from "src/utils/brand-assets";
const layoutStore = useLayoutStore();
const userStore = useUserStore();
export default {
  components: { LocaleSwitcher, NotificationModule },
  created() {
    //this.$q.addressbarColor.set("#a2e3fa");
    //this.$watch(
    //  () => this.$q.appVisible,
    //  (state) => {
    //    //if (state) document.title = `aktif`;
    //    //else document.title = `pasif`;
    //    //this.$logger.log("appVisible", this.$q.appVisible);
    //  }
    //);
    /*this.$q.loadingBar.setDefaults({
      color: "cyan-13",
      size: "15px",
      position: "bottom",
      //reverse: true,
    });*/
  },
  setup() {
    //const $q = useQuasar();
    //this.$q.addressbarColor.set();
    //const $q = useQuasar();
    // const leftDrawerOpen = ref(false);
    // return {
    //   leftDrawerOpen,
    //   toggleLeftDrawer() {
    //     leftDrawerOpen.value = !leftDrawerOpen.value;
    //   },
    // };
  },
  data() {
    return {
      darkMode: false,
      brandAssets,
      link: "Dashboard",
      rightDrawerOpen: false,
      mobile: false,
      selectedColor: "#FF00FFCC",
      user: {},
      auth: {},
      profilePhotoUrl: "",
      menuVisible: {
        employees: true,
        users: true,
        customers: true,
        production: true,
        productions: true,
        stocks: true,
        firms: true,
        orders: true,
        headquarters: true,
        calendar: true,
        production: true,
        finance: true,
        technicalService: true,
        technicianassignment: true,
        reports: true,
      },
    };
  },
  mounted() {
    this.init();

    if (userStore.isAuthenticated) {
      layoutStore.openLeftDrawer();
    } else {
      layoutStore.closeLeftDrawer();
    }
    //try {
    //  this.$logger.log("Bu sadece geliştirme ortamında gözükecek!");
    //  this.$logger.warn("Bu bir uyarı mesajıdır!");
    //  this.$logger.error("Bu hata her ortamda görünecek!");
    //  this.$logger.crit(
    //    "Bu hata her ortamda görünecek! ve Sistem yöneticisine mail gönderilecektir"
    //  );
    //} catch (error) {
    //  this.$logger.log(error);
    //}
    Cookies.set("FixAura", "FixAura", {
      expires: 1,
    });

    //this.$logger.log("NODE_ENV", process.env.NODE_ENV);
  },
  methods: {
    pad(number) {
      return (number < 10 ? "0" : "") + number;
    },
    init() {
      try {
        this.layoutStore.toggleRightDrawer;
        //this.layout.closeRightDrawer();
        this.layoutStore.hideFooter();
      } catch (error) {}

      try {
        this.darkMode = LocalStorage.getItem("darkMode");
        Dark.set(this.darkMode);
      } catch (error) {
        Dark.set(false);
      }
      try {
        if (Platform.is.mobile) {
          this.mobile = true;
        }
      } catch (error) {}
      try {
        this.user = LocalStorage.getItem("userinfo");
      } catch (error) {
        this.$logger.log(error);
      }
      try {
        // this.layout.closeRightDrawer();
      } catch (error) {
        this.$logger.log(error);
      }
      this.userUpdate();
      this.getAuth();
      this.getLocalLanguage();
      //this.getUserPhoto();
    },
    async getLocalLanguage() {
      try {
        var lang = "";
        if (LocalStorage.has("language"))
          var lang = LocalStorage.getItem("language");
        else {
          var lang = "tr";
          LocalStorage.set("language", lang);
        }
        this.$i18n.locale = lang;
        this.$q.lang.set(lang);
      } catch (error) {}
    },
    async userUpdate() {
      try {
        this.user = LocalStorage.getItem("userinfo");
        //this.$logger.log('user Update', this.user);
      } catch (error) {
        this.$logger.log(error);
      }
    },
    async getAuth() {
      try {
        this.user = LocalStorage.getItem("userinfo");
        this.auth = LocalStorage.getItem("authority");
        this.layoutStore.showHeader();
        this.layoutStore.openLeftDrawer();
        this.layoutStore.showFooter();
      } catch (error) {}
      this.menuItemShow();
    },
    async leftMenuUpdate(status) {
      if (status) layoutStore.openLeftDrawer();
      else layoutStore.closeLeftDrawer();
    },

    async headerShow(status) {
      if (status) layoutStore.showHeader();
      else layoutStore.hideHeader();
    },
    async menuItemShow() {
      try {
        this.menuItemShowAll();
        if (this.auth.authName == "employee") {
          //this.$logger.log(".employeeGroup", this.user.employeeGroup);
          if (this.user.employeeGroup.id != 1) {
            this.menuItemHideAll();
          } else {
            this.menuItemShowAll();
          }

          if (
            this.user.employeeGroup.id == 5 ||
            this.user.employeeGroup.id == 9
          ) {
            this.menuVisible.employees = false;
            this.menuVisible.customers = false;
            this.menuVisible.users = false;
            this.menuVisible.production = true;
            this.menuVisible.productions = true;
            this.menuVisible.stocks = true;
            this.menuVisible.firms = false;
            this.menuVisible.orders = true;
            this.menuVisible.headquarters = false;
            this.menuVisible.calendar = false;
            this.menuVisible.production = false;
            this.menuVisible.finance = false;
            this.menuVisible.technicalService = true;
            this.menuVisible.reports = false;
          }
        }
        if (this.auth.authName == "vendor") {
          this.menuItemHideAll();
        }
        //this.$logger.log("menuVisible", this.menuVisible);
      } catch (error) {
        this.$logger.log("menuItemShow error", error);
      }
    },
    menuItemShowEmployeeGroupId() {
      try {
        let visible = false;
        if (this.user.employeeGroupId === 1) visible = true;

        return visible;
      } catch (error) {
        console.log("menuItemShow error", error);
      }
    },
    async menuItemHideAll() {
      /*this.menusettings.showHeadquarters(false);
      this.menusettings.showEmployees(false);
      this.menusettings.showUsers(false);
      this.menusettings.showVendors(false);*/
    },
    async menuItemShowAll() {
      /*this.menusettings.showHeadquarters(true);
      this.menusettings.showEmployees(true);
      this.menusettings.showUsers(true);
      this.menusettings.showVendors(true);*/
    },

    menuItemShowSingel(item) {
      try {
        //this.$logger.log("auth", this.auth);
        //this.$logger.log("user", this.user);
        //this.$logger.log("item", item);

        if (
          this.auth.employeeGroup.id == 2 &&
          item == "technicalService/engineering"
        )
          return true;
        else return false;
      } catch (error) {
        this.$logger.log("menuItemShow error", error);
      }
    },
    async darkswitch() {
      //Dark.set(this.darkMode);
      Dark.toggle();
      LocalStorage.set("darkMode", Dark.isActive);
      this.darkMode = Dark.isActive;

      if (this.darkMode) {
        //setCssVar("primary", "#1b5389cc");
        //setCssVar("primary", this.selectedColor);
        setCssVar("primary", "#1976d2cc");
      } else {
        //setCssVar("primary", "#1976d2ff");
        //setCssVar("primary", this.selectedColor);
        setCssVar("primary", "#1976d2");
      }
    },
    logout() {
      this.$router.push({ path: "/login" });
      LocalStorage.remove("_token");
      LocalStorage.remove("authority");
      LocalStorage.remove("userinfo");
    },

    async getUserPhoto() {
      try {
        const response = this.$api
          .get("getEmployeePhoto/" + this.user.id)
          .then((resp) => {
            this.$logger.log("profile", resp.data);
            if (resp.data == "")
              this.profilePhotoUrl =
                "../src/assets/employeeProfile/default.png";
            else
              this.profilePhotoUrl =
                "../src/assets/employeeProfile/" + resp.data;
          });
      } catch (error) {}
    },

    async showLoading() {
      this.$logger.log("$q", this.$q);
      this.$logger.log("loading", this.$q.loading);
      Loading.show({
        spinner: QSpinnerGears,
        message:
          '<b>Sayfa Yükleniyor</b><br/><span class="text-amber text-italic">Lütfen Bekleyin...</span>',
        html: true,
      });

      // hiding in 3s
      /*timer = setTimeout(() => {
        this.$q.loading.hide();
        timer = void 0;
      }, 3000);*/
    },

    bottomSheet(grid) {
      this.$q
        .bottomSheet({
          message: "Bottom Sheet message",
          grid,
          actions: [
            {
              label: "Drive",
              img: "https://cdn.quasar.dev/img/logo_drive_128px.png",
              id: "drive",
            },
            {
              label: "Keep",
              img: "https://cdn.quasar.dev/img/logo_keep_128px.png",
              id: "keep",
            },
            {
              label: "Google Hangouts",
              img: "https://cdn.quasar.dev/img/logo_hangouts_128px.png",
              id: "calendar",
            },
            {
              label: "Calendar",
              img: "https://cdn.quasar.dev/img/logo_calendar_128px.png",
              id: "calendar",
            },
            {},
            {
              label: "Share",
              icon: "share",
              id: "share",
            },
            {
              label: "Upload",
              icon: "cloud_upload",
              color: "primary",
              id: "upload",
            },
            {},
            {
              label: "John",
              avatar: "https://cdn.quasar.dev/img/boy-avatar.png",
              id: "john",
            },
          ],
        })
        .onOk((action) => {
          this.$logger.log("Action chosen:", action.id);
          this.$logger.log("Action chosen:", action);
        })
        .onCancel(() => {
          this.$logger.log("Dismissed");
        })
        .onDismiss(() => {
          this.$logger.log("I am triggered on both OK and Cancel");
        });
    },

    /* 
      Paletin HEX Kodları ile Özeti
      #16B233 – Ana Yeşil (Primary)
      #18641C – Koyu Yeşil (Dark)
      #C8FACC – Açık Yeşil
      #FFEB3B – Enerji Sarısı
      #00B4D8 – Elektrik Mavisi
      #232B2B – Koyu Gri
      #F5F5F5 – Pastel Gri
      #FFFFFF – Beyaz
      */
  },
};
</script>
<style lang="sass" scoped>
.menu-list .q-item
  border-radius: 0 32px 32px 0
  margin-right: 16px
</style>
<style lang="sass">
.active-item
  color: white
  background: $primary
</style>
