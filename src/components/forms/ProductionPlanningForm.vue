<template>
  <div>
    <q-card class="q-ma-xs col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <q-card-section class="q-pa-xs">
        <q-list class="row">
          <q-item>
            <q-item-section>
              <q-input
                dense
                disable
                :label="$t('order.orderno')"
                v-model="formModel.order.orderNo"
              />
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-input
                dense
                disable
                :label="$t('production.firmname')"
                v-model="formModel.order.firm.name"
              />
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-input
                dense
                disable
                :label="$t('production.productionno')"
                v-model="formModel.order.description"
              />
            </q-item-section>
          </q-item>
          <q-space />
          <q-item>
            <q-item-section>
              <q-btn
                dense
                icon="low_priority"
                class="text-capitalize bg-primary q-px-md q-mx-md"
                text-color="white"
                @click="productionProcessSequenceFormVisibile = true"
              >
                {{ $t("production.productionProcessSequence") }}
              </q-btn>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-btn
                dense
                icon="save"
                class="text-capitalize bg-primary q-px-md q-ma-xs"
                text-color="white"
                @click="saveChanges"
              >
                {{ $t("authorization.savechanges") }}
              </q-btn>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>

    <!-- <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <q-item-section v-if="formModel.order">
        <q-select
          :disable="mode === 'details'"
          outlined
          v-model="formModel.order.firm"
          :options="firmFull"
          @filter="filterFirm"
          option-value="id"
          option-label="commercialTitle"
          :label="$t('order.orderfirm')"
          @update:model-value="(val) => firmSelected(val)"
        />
      </q-item-section>
    </q-item> -->

    <!-- <q-card-section>
          <q-list v-if="formModel.order" class="row">
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section v-if="formModel.order">
                <q-select
                  :disable="mode === 'details'"
                  outlined
                  v-model="formModel.order.firm"
                  :options="firmFull"
                  @filter="filterFirm"
                  option-value="id"
                  option-label="commercialTitle"
                  :label="$t('order.orderfirm')"
                  @update:model-value="(val) => firmSelected(val)"
                />
              </q-item-section>
            </q-item> -->

    <q-card>
      <q-card-section>
        <q-list>
          <q-item>
            <q-item-section>
              <q-select
                v-model="productionPlanningWithWareHouse.warehouse"
                outlined
                use-input
                transition-show="scale"
                transition-hide="scale"
                input-debounce="0"
                option-value="id"
                option-label="name"
                :label="$t('products.warehouse')"
                :options="warehouse"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      {{ $t("noresults") }}
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </div>
  <div style="max-width: 100%; max-height: 100%">
    <!--v-show="preparingProductionContent"-->
    <q-card class="q-ma-xs col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <q-splitter
        v-model="splitterModel"
        :limits="[30, 60]"
        style="max-width: 100%; max-height: 75%"
      >
        <template v-slot:before>
          <div class="q-pa-md">
            <div class="row text-h6 q-mb-md">
              {{ $t("production.productstobeproduced") }}
              <q-btn
                flat
                round
                dense
                icon="refresh"
                class="q-ml-md col-lg-1 col-md-1 col-sm-3 col-xs-2"
                @click="getProductionOrderList"
              >
                <q-tooltip>
                  {{ $t("refresh") }}
                </q-tooltip>
              </q-btn>
            </div>
            <q-input
              ref="filterRef"
              dense
              filled
              v-model="filter"
              :label="$t('search')"
            >
              <template v-slot:append>
                <q-icon
                  v-if="filter !== ''"
                  name="clear"
                  class="cursor-pointer"
                  @click="resetFilter"
                ></q-icon>
              </template>
            </q-input>

            <q-tree
              ref="producttree"
              :nodes="orderProductList"
              node-key="id"
              children-key="intermediateProduct"
              v-model:selected="selected"
              @update:selected="selectedNode"
              v-model:ticked="ticked"
              @update:ticked="tickedNode"
              v-bind:ticked="ticked"
              default-expand-all
              :filter="filter"
              :filter-method="myFilterMethod"
              class="col-lg-12 col-md-12 col-sm-12 col-xs-12"
            >
              <template v-slot:default-header="prop">
                <div
                  v-if="prop.node.stockCard"
                  class="text-weight-bold text-primary"
                >
                  {{ prop.node.stockCard.stockName }}

                  <q-btn
                    flat
                    round
                    icon="delete"
                    color="red-5"
                    @click="
                      productionDeleteFormVisibile = true;
                      productiontobedeleted = prop.node;
                    "
                    class="q-ml-xl"
                  >
                    <q-tooltip>
                      {{ $t("delete") }}
                    </q-tooltip>
                  </q-btn>
                </div>
              </template>
            </q-tree>
          </div>
        </template>

        <template v-slot:separator>
          <q-avatar
            color="primary"
            text-color="white"
            size="30px"
            icon="settings_ethernet"
          />
        </template>

        <template v-slot:after>
          <div class="q-pa-md">
            <div
              class="text-h6 q-mb-md"
              v-if="selectedProduction && selectedProduction.stockCard"
            >
              {{ selectedProduction.stockCard.stockCode }} -
              {{ selectedProduction.stockCard.stockName }}
            </div>
            <div class="text-h6 q-mb-md">{{ $t("recipes.recipecontent") }}</div>

            <q-table
              flat
              bordered
              :grid="isGrid"
              :hide-header="isGrid"
              class="statement-table"
              :rows="rows"
              :columns="recipeContentColumns"
              :loading="recipeContentLoading"
              :filter="filterRecipe"
              :loading-label="$t('loading')"
              :no-data-label="$t('production.nodatalabel')"
              :no-results-label="$t('noresultslabel')"
              row-key="id"
              @row-click="onRowClick"
            >
              <template v-slot:top="props">
                <div class="row col-12">
                  <q-input
                    class="col-lg-3 col-md-6 col-sm-12 col-xs-12"
                    bottom-slots
                    dense
                    debounce="300"
                    v-model="filterRecipe"
                    :placeholder="$t('search')"
                  >
                    <template v-slot:append
                      ><q-icon
                        v-if="filterRecipe !== ''"
                        name="close"
                        @click="filterRecipe = ''"
                        class="cursor-pointer"
                      />
                      <q-icon name="search" />
                    </template>
                  </q-input>
                  <q-btn
                    flat
                    round
                    dense
                    icon="add"
                    class="q-ml-md col-lg-1 col-md-1 col-sm-1 col-xs-1"
                    @click="onAdd"
                  >
                    <q-tooltip>
                      {{ $t("products.addproduct") }}
                    </q-tooltip>
                  </q-btn>
                  <q-btn
                    flat
                    round
                    dense
                    icon="refresh"
                    class="q-ml-md col-lg-1 col-md-1 col-sm-1 col-xs-1"
                    @click="getRecipeContent()"
                  >
                    <q-tooltip>
                      {{ $t("refresh") }}
                    </q-tooltip>
                  </q-btn>
                  <q-btn
                    flat
                    round
                    dense
                    :icon="
                      props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'
                    "
                    @click="props.toggleFullscreen"
                    class="q-ml-md col-lg-1 col-md-1 col-sm-1 col-xs-1"
                  >
                    <q-tooltip>
                      {{ $t("fullscreen") }}
                    </q-tooltip>
                  </q-btn>
                  <q-btn
                    flat
                    round
                    dense
                    :icon="isGrid ? 'list' : 'grid_on'"
                    @click="isGrid = !isGrid"
                    class="q-ml-md col-lg-1 col-md-1 col-sm-1 col-xs-1"
                  >
                    <q-tooltip v-close-popup>{{
                      isGrid ? "List" : "Grid"
                    }}</q-tooltip>
                  </q-btn>
                  <q-space />

                  <q-btn
                    :label="$t('print')"
                    class="float-right text-capitalize text-indigo-8 shadow-2 col-lg-2 col-md-2 col-sm-3 col-xs-3"
                    icon="print"
                    @click="printTable"
                  />

                  <q-btn
                    :label="$t('export')"
                    class="float-right text-capitalize text-indigo-8 shadow-2 col-lg-2 col-md-2 col-sm-3 col-xs-3"
                    icon="cloud_download"
                    @click="exportTable"
                  />
                  <q-btn
                    v-if="rows.length == 0"
                    label="Reçete oluştur"
                    class="float-right text-capitalize text-indigo-8 shadow-2 col-lg-2 col-md-2 col-sm-3 col-xs-3"
                    icon="add"
                    @click="createProductionOrderRecipe"
                  />
                </div>
              </template>

              <template #body-cell-warehouse="props">
                <q-td :props="props">
                  {{ props.row.warehouse.name }}
                  <q-btn
                    flat
                    round
                    icon="compare_arrows"
                    color="red-5"
                    @click="
                      changeWarehouse(props.row);
                      changeWarehouseFormVisibile = true;
                    "
                  >
                    <q-tooltip>
                      {{ $t("production.ChangeWarehouse") }}
                    </q-tooltip>
                  </q-btn>
                </q-td>
              </template>

              <template #body-cell-stockName="props">
                <q-td :props="props">
                  {{ props.row.insideStock.stockName }}
                  <q-btn
                    flat
                    round
                    :loading="changeProductButstonWait"
                    icon="compare_arrows"
                    color="red-5"
                    @click="changeProduct(props.row)"
                  >
                    <q-tooltip>
                      {{ $t("production.chooseequivalentproduct") }}
                    </q-tooltip>
                  </q-btn>
                </q-td>
              </template>

              <template #body-cell-action="props">
                <q-td :props="props">
                  <q-btn
                    flat
                    round
                    color="secondary"
                    icon="edprecision_manufacturingit"
                  >
                    <q-menu>
                      <q-list style="min-width: 100px">
                        <q-item
                          clickable
                          @click="addProduction(props.row)"
                          v-close-popup
                        >
                          <q-icon
                            color="secondary"
                            size="2em"
                            name="switch_access_shortcut_add"
                          />
                          {{ $t("production.addtocurrentproduction") }}
                        </q-item>
                        <q-item
                          clickable
                          @click="createProduction(props.row)"
                          v-close-popup
                        >
                          <q-icon color="primary" size="2em" name="add" />
                          {{ $t("production.createnewproduction") }}
                        </q-item>
                      </q-list>
                    </q-menu>
                    <q-tooltip>
                      {{ $t("production.addtoproduction") }}
                    </q-tooltip>
                  </q-btn>
                  <q-btn
                    flat
                    round
                    color="negative"
                    icon="delete_forever"
                    @click="
                      productionOrderRecipeDeleteFormVisibile = true;
                      productionOrderRecipetobedeleted = props.row;
                    "
                  >
                    <q-tooltip>
                      {{ $t("delete") }}
                    </q-tooltip>
                  </q-btn>
                </q-td>
              </template>

              <template v-slot:item="props">
                <div
                  class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
                  :style="props.selected ? 'transform: scale(0.95);' : ''"
                >
                  <q-card :class="props.selected ? 'bg-grey-2' : ''">
                    <q-list dense>
                      <q-item v-for="col in props.cols" :key="col.name">
                        <q-item-section>
                          <q-item-label>{{ col.label }}</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <q-item-section
                            v-if="col.name === 'action'"
                            class="row"
                          >
                            <div class="row">
                              <q-btn
                                flat
                                round
                                color="secondary"
                                icon="precision_manufacturing"
                                @click="onEdit(props.row)"
                              />
                              <q-btn
                                flat
                                round
                                color="negative"
                                icon="delete_forever"
                                @click="onDelete(props.row)"
                              />
                            </div>
                          </q-item-section>

                          <q-item-section
                            v-else-if="col.name === 'buysell'"
                            class="row"
                          >
                            <div class="row">
                              <q-icon
                                v-if="props.row.order.buysell"
                                :name="
                                  props.row.order.buysell == 'Satış'
                                    ? 'arrow_upward'
                                    : props.row.order.buysell == 'Alış'
                                    ? 'arrow_downward'
                                    : ''
                                "
                                :style="{
                                  color:
                                    props.row.order.buysell == 'Satış'
                                      ? '#24792E'
                                      : props.row.order.buysell == 'Alış'
                                      ? '#FF7100'
                                      : '#fff',
                                }"
                                style="font-size: 1.6em"
                              />
                              {{ props.row.order.buysell }}
                            </div>
                          </q-item-section>

                          <q-item-label v-else caption
                            ><p>{{ col.value }}</p></q-item-label
                          >
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-card>
                </div>
              </template>

              <template v-slot:no-data="{ icon, message, filterRecipe }">
                <div class="full-width row flex-center q-gutter-sm">
                  <q-icon
                    size="2em"
                    :name="filterRecipe ? 'filter_b_and_w' : icon"
                  />
                  <span> {{ message }}... </span>
                </div>
              </template>
            </q-table>
          </div>
        </template>
      </q-splitter>
    </q-card>
  </div>

  <!-- Update Dialog -->
  <q-dialog v-model="updateFormVisibile" persistent>
    <q-card class="q-pa-md">
      <q-card-section class="items-center row">
        <q-avatar icon="person_off" color="primary" text-color="white" />&nbsp;
        &nbsp; &nbsp; &nbsp;
        <h5>{{ $t("authorization.updateEmployeeGroupAuthority") }}</h5>
      </q-card-section>
      <q-card-section class="items-center row">
        <p>
          {{
            $t("authorization.updateEmployeeGroupAuthorityMessage").replace(
              "_groupName_",
              selectedEmployeeGroup.name
            )
          }}
        </p>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          :label="$t('cancel')"
          color="negative"
          v-close-popup
        /><q-space />
        <q-btn
          flat
          :label="$t('updatedata')"
          color="positive"
          v-on:click="saveChanges"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- Production Delete Dialog -->
  <q-dialog v-model="productionDeleteFormVisibile" persistent>
    <q-card class="q-pa-md">
      <q-card-section class="items-center row">
        <q-avatar icon="delete" color="negative" text-color="white" />&nbsp;
        &nbsp; &nbsp; &nbsp;
        <h5>{{ $t("production.SelectedProductionWillBeDeleted") }}</h5>
      </q-card-section>
      <q-card-section class="items-center row">
        <p>
          {{ productiontobedeleted.stockCard.stockCode }} -
          {{ productiontobedeleted.stockCard.stockName }}
        </p>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          :label="$t('cancel')"
          color="positive"
          v-close-popup
        /><q-space />
        <q-btn
          flat
          :label="$t('delete')"
          color="negative"
          v-on:click="
            subProductionControl(productiontobedeleted);
            productionDeleteFormVisibile = false;
          "
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- Production Order Delete Dialog -->
  <q-dialog v-model="productionOrderRecipeDeleteFormVisibile" persistent>
    <q-card class="q-pa-md">
      <q-card-section class="items-center row">
        <q-avatar icon="delete" color="negative" text-color="white" />
        &nbsp;&nbsp; &nbsp; &nbsp;
        <h5>{{ $t("production.ProductionRecipewillbeDeleted") }}</h5>
      </q-card-section>
      <q-card-section class="items-center row">
        <p>
          {{ productionOrderRecipetobedeleted.insideStock.stockCode }} -
          {{ productionOrderRecipetobedeleted.insideStock.stockName }}
        </p>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          :label="$t('cancel')"
          color="positive"
          v-close-popup
        /><q-space />
        <q-btn
          flat
          :label="$t('delete')"
          color="negative"
          v-on:click="
            deleteproductionOrderRecipe(productionOrderRecipetobedeleted);
            productionOrderRecipeDeleteFormVisibile = false;
          "
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- Choose Equivalent Product Dialog -->
  <q-dialog v-model="equivalentProductFormVisibile" persistent>
    <q-card class="q-pa-md">
      <q-card-section class="items-center row">
        <q-avatar
          icon="published_with_changes"
          color="primary"
          text-color="white"
        />
        &nbsp;&nbsp; &nbsp; &nbsp;
        <h6>
          {{
            $t("production.ReplaceEquivalentProduct")
              .replace(
                "_StockCardName_",
                selectedProduction.stockCard.stockCode +
                  " - " +
                  selectedProduction.stockCard.stockName
              )
              .replace("_productionno_", selectedProduction.productionNo)
              .replace(
                "_RecipeStockCardName_",
                productiontobereplaced.insideStock.stockCode +
                  " - " +
                  productiontobereplaced.insideStock.stockName
              )
            /*.replace(
                '_productionno_',
                selectedEquivalentProducts
                  ? selectedEquivalentProducts.stockCode +
                      ' - ' +
                      selectedEquivalentProducts.stockName
                  : $t('production.productSelectedBelow')
              )*/
          }}
        </h6>
      </q-card-section>
      <q-card-section class="items-center row">
        <q-select
          outlined
          dense
          use-input
          v-model="selectedEquivalentProducts"
          :options="filteredEquivalentProducts"
          @filter="filterEquivalentProduct"
          option-value="id"
          option-label="stockName"
          @update:model-value="
            getProductCountInWarehouse(selectedEquivalentProducts.id)
          "
          :label="$t('production.chooseequivalentproduct')"
        />
      </q-card-section>
      <q-card-section v-if="selectedEquivalentProducts">
        <p>
          {{ selectedEquivalentProducts.stockCode }} -
          {{ selectedEquivalentProducts.stockName }}
        </p>

        <q-table
          flat
          bordered
          :grid="isGrid"
          :hide-header="isGrid"
          class="statement-table"
          :rows="productCountInWarehouse"
          :columns="warehouseProductColumns"
          :loading="warehouseProductLoading"
          :filter="filterwarehouseProduct"
          :loading-label="$t('loading')"
          :no-data-label="$t('production.nodatalabel')"
          :no-results-label="$t('noresultslabel')"
          row-key="id"
        >
          <template v-slot:top="props">
            <div class="row col-12">
              <q-input
                class="col-lg-3 col-md-6 col-sm-12 col-xs-12"
                bottom-slots
                dense
                debounce="300"
                v-model="filterwarehouseProduct"
                :placeholder="$t('search')"
              >
                <template v-slot:append
                  ><q-icon
                    v-if="filterwarehouseProduct !== ''"
                    name="close"
                    @click="filterwarehouseProduct = ''"
                    class="cursor-pointer"
                  />
                  <q-icon name="search" />
                </template>
              </q-input>
              <q-btn
                flat
                round
                dense
                icon="refresh"
                class="q-ml-md col-lg-1 col-md-1 col-sm-1 col-xs-1"
                @click="
                  getProductCountInWarehouse(selectedEquivalentProducts.id)
                "
              >
                <q-tooltip>
                  {{ $t("refresh") }}
                </q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                dense
                :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
                @click="props.toggleFullscreen"
                class="q-ml-md col-lg-1 col-md-1 col-sm-1 col-xs-1"
              >
                <q-tooltip>
                  {{ $t("fullscreen") }}
                </q-tooltip>
              </q-btn>
            </div>
          </template>

          <template v-slot:no-data="{ icon, message, filterRecipe }">
            <div class="full-width row flex-center q-gutter-sm">
              <q-icon
                size="2em"
                :name="filterRecipe ? 'filter_b_and_w' : icon"
              />
              <span> {{ message }}... </span>
            </div>
          </template>
        </q-table>
      </q-card-section>

      <q-card-actions>
        <q-btn
          flat
          :label="$t('cancel')"
          color="negative"
          v-close-popup
          v-on:click="selectedEquivalentProducts = null"
        /><q-space />
        <q-btn
          flat
          :label="$t('production.ChangeProduct')"
          color="positive"
          v-close-popup
          v-on:click="onChangeProductSubmit(selectedEquivalentProducts)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- Change Warehouse Dialog -->
  <q-dialog v-model="changeWarehouseFormVisibile" persistent>
    <q-card class="q-pa-md">
      <q-card-section class="items-center row">
        <q-avatar
          icon="published_with_changes"
          color="primary"
          text-color="white"
        />
        &nbsp;&nbsp; &nbsp; &nbsp;
        <h6>{{ $t("production.ChangeWarehouse") }}</h6>
      </q-card-section>
      <q-card-section>
        <q-table
          flat
          bordered
          :grid="isGrid"
          :hide-header="isGrid"
          class="statement-table"
          :rows="productCountInWarehouse"
          :columns="warehouseProductColumns"
          :loading="warehouseProductLoading"
          :filter="filterwarehouseProduct"
          :loading-label="$t('loading')"
          :no-data-label="$t('production.nodatalabel')"
          :no-results-label="$t('noresultslabel')"
          row-key="id"
          @row-click="warehouseSelected"
        >
          <template v-slot:top="props">
            <div class="row col-12">
              <q-input
                class="col-lg-3 col-md-6 col-sm-12 col-xs-12"
                bottom-slots
                dense
                debounce="300"
                v-model="filterwarehouseProduct"
                :placeholder="$t('search')"
              >
                <template v-slot:append
                  ><q-icon
                    v-if="filterwarehouseProduct !== ''"
                    name="close"
                    @click="filterwarehouseProduct = ''"
                    class="cursor-pointer"
                  />
                  <q-icon name="search" />
                </template>
              </q-input>
              <q-btn
                flat
                round
                dense
                icon="refresh"
                class="q-ml-md col-lg-1 col-md-1 col-sm-1 col-xs-1"
                @click="getProductCountInWarehouse()"
              >
                <q-tooltip>
                  {{ $t("refresh") }}
                </q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                dense
                :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
                @click="props.toggleFullscreen"
                class="q-ml-md col-lg-1 col-md-1 col-sm-1 col-xs-1"
              >
                <q-tooltip>
                  {{ $t("fullscreen") }}
                </q-tooltip>
              </q-btn>
            </div>
          </template>

          <template v-slot:no-data="{ icon, message, filterRecipe }">
            <div class="full-width row flex-center q-gutter-sm">
              <q-icon
                size="2em"
                :name="filterRecipe ? 'filter_b_and_w' : icon"
              />
              <span> {{ message }}... </span>
            </div>
          </template>
        </q-table>
      </q-card-section>

      <q-card-section class="items-center row" v-if="selectedWarehouse">
        <p>
          {{
            $t("production.ChangeWarehouseMessage")
              .replace(
                "_productionStockCard_",
                selectedProduction.stockCard.stockCode +
                  " - " +
                  selectedProduction.stockCard.stockName
              )
              .replace(
                "_insideStockCard_",
                productiontobereplaced.insideStock.stockName
              )
              .replace("_Warehouse_", selectedWarehouse.warehouse.name)
          }}
        </p>
      </q-card-section>

      <q-card-actions>
        <q-btn
          flat
          :label="$t('cancel')"
          color="negative"
          v-close-popup
          v-on:click="selectedWarehouse = null"
        /><q-space />
        <q-btn
          flat
          :label="$t('production.ChangeWarehouse')"
          color="positive"
          v-close-popup
          v-on:click="onChangeWarehouseSubmit(selectedWarehouse.warehouseId)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- Production Process Sequence Form Dialog -->
  <q-dialog
    v-model="productionProcessSequenceFormVisibile"
    persistent
    :maximized="true"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card style="min-width: 40vw; max-height: 95vh">
      <q-card-section class="q-pa-none">
        <q-bar class="q-pa-lg">
          <q-icon name="category" />

          <q-toolbar-title
            ><span class="text-weight-bold">
              {{ $t("production.productionProcessSequence") }}
            </span></q-toolbar-title
          >
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="bg-white text-primary">{{
              $t("close")
            }}</q-tooltip>
          </q-btn>
        </q-bar>
      </q-card-section>
      <q-card-section style="max-height: 90vh" class="scroll q-pa-sm">
        <production-process-sequence-form
          class="q-pa-sm"
          v-model="formModel.orderItems[0].stockCard"
        />
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog
    dense
    v-model="formVisible"
    persistent
    :maximized="true"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card style="min-width: 40vw; max-height: 95vh">
      <q-card-section class="q-pa-none">
        <q-bar class="q-pa-lg">
          <q-icon name="note_alt" />

          <q-toolbar-title
            ><span class="text-weight-bold">{{ $t("recipes.recipes") }}</span>
            Add
          </q-toolbar-title>

          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="bg-white text-primary">{{
              $t("close")
            }}</q-tooltip>
          </q-btn>
        </q-bar>
      </q-card-section>
      <q-card-section style="max-height: 90vh" class="scroll q-pa-sm">
        <ProductionRecipe-form
          class="q-ma-none q-pa-none"
          v-model="selectedProduction"
          mode="add"
          @completed="onFormCompleted"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, computed } from "vue";
import ProductionProcessSequenceForm from "components/forms/ProductionProcessSequenceForm.vue";
import ProductionRecipeForm from "src/components/forms/ProductionRecipeForm.vue";

export default defineComponent({
  components: {
    ProductionProcessSequenceForm,
    ProductionRecipeForm,
  },
  setup(props, { emit }) {
    const formModel = computed({
      // Use computed to wrap the object
      get: () => props.modelValue,
      set: (value) => emit("update:modelValue", value),
    });

    this.$logger.log("x=>", formModel);
    return {
      formModel,
    };
  },
  emits: ["completed"],
  props: {
    modelValue: {
      type: Object,
      default: () => {},
    },
    mode: {
      type: String,
      default: "new",
    },
    orderItems: {
      default: [],
    },
  },
  data() {
    return {
      formVisible: false,
      warehouse: [],
      productionPlanningWithWareHouse: {
        selectedWarehouse: "",
        warehouse: { id: 0, name: "" },
        movement: "",
      },
      filter: "",
      filterRecipe: "",
      filterRef: null,
      selected: "",
      selectedProduction: "",
      ticked: [""],
      expanded: [""],
      define: "",

      orderProductList: [],

      employeeGroupFiltered: [],
      employeeGroupFull: [],
      employeeGroup: null,
      selectedEmployeeGroup: null,

      splitterModel: 30,
      splitterModel2: 60,

      employeeGroupFormVisibile: false,
      updateFormVisibile: false,
      productionDeleteFormVisibile: false,
      productiontobedeleted: {},
      productionOrderRecipeDeleteFormVisibile: false,
      productionOrderRecipetobedeleted: {},
      equivalentProductFormVisibile: false,
      equivalentProducts: [],
      filteredEquivalentProducts: [],
      selectedEquivalentProducts: null,
      changeProductButtonWait: false,
      productiontobereplaced: {},
      recipeContentLoading: false,
      warehouseProductLoading: false,
      preparingProductionContent: true,
      productCountInWarehouse: [],
      filterwarehouseProduct: "",
      productionProcessSequenceFormVisibile: false,

      changeWarehouseFormVisibile: false,
      selectedWarehouse: null,

      maximizedToggle: false,
      isGrid: false,
      rows: [],
    };
  },

  computed: {
    recipeContentColumns() {
      return [
        {
          name: "stockcode",
          label: this.$t("products.stockcode"),
          align: "left",
          field: (row) => row.insideStock.stockCode,
          sortable: true,
        },
        {
          name: "stockName",
          label: this.$t("products.productname"),
          align: "left",
          field: (row) => row.insideStock.stockName,
          sortable: true,
        },
        {
          name: "productionpiece",
          label: this.$t("production.productionpiece"),
          align: "center",
          field: (row) => row.piece,
          sortable: true,
        },
        {
          name: "totalpiece",
          label: this.$t("production.totalpiece"),
          align: "center",
          field: (row) => row.piece,
          sortable: true,
        },
        {
          name: "stockpiece",
          label: this.$t("products.stockpiece"),
          align: "center",
          field: (row) => row.piece,
          sortable: true,
        },
        {
          name: "warehouse",
          label: this.$t("products.warehouse"),
          align: "left",
          field: (row) => row.piece,
          sortable: true,
        },
        {
          name: "action",
          align: "center",
          label: this.$t("action"),
          field: "",
        },
      ];
    },
    warehouseProductColumns() {
      return [
        {
          name: "warehouse",
          label: this.$t("products.warehouse"),
          align: "left",
          field: (row) => row.warehouse.name,
          sortable: true,
        },
        {
          name: "piece",
          label: this.$t("products.stockpiece"),
          align: "left",
          field: (row) => row.piece,
          sortable: true,
        },
      ];
    },
  },
  async mounted() {
    /*TODO: İlk açılışta mevcut sipariş ürünleri için üretim emri var mı?
    varsa listeyi çek, yoksa önce üretim emri kaydet sonra listeyi çek*/
    document.title = "Magicline - Üretim Planlama";

    this.$logger.log("formModel =>", this.formModel);
    this.$logger.log("orderItems =>", this.orderItems);
    this.postProductionOrderList(this.formModel.order.id, this.orderItems);
    //this.getProductionOrderDetailList(this.formModel.order.id);
    this.init();
  },
  methods: {
    async init() {
      setTimeout(() => this.$refs.producttree.expandAll(), 200);
      this.getWarehouse();
    },
    //TODO-get warehouse for orderds
    async getWarehouse() {
      this.$api.get("warehouses").then((data) => {
        this.warehouse = data.data;
      });
    },
    myFilterMethod(node, filter) {
      //this.$logger.log('node', node);
      //this.$logger.log('filter', filter);
      const filt = filter.toLowerCase();

      return node.name && node.name.toLowerCase().indexOf(filt) > -1;
    },
    async createProductionOrderRecipe() {
      this.$logger.log("createProductionOrderRecipe");
      this.formVisible = true;
    },

    async exportTable() {},
    onRowClick(evt, row) {
      //this.$logger.log('evt on', evt);
      this.$logger.log("clicked on", row);
      //TODO: Seçilen ürün için depo stok sayısını ve toplam üretim ihtiyaç adedini göster
    },

    warehouseSelected(evt, row) {
      this.selectedWarehouse = row;
      this.$logger.log("selectedWarehouse", this.selectedWarehouse);
    },
    resetFilter() {
      this.filter = "";
      this.filterRef.focus();
    },
    tickedNode(node) {
      this.$logger.log("node", node);
    },
    labelName(node) {
      this.$logger.log("node", node);
    },

    selectedNode(node) {
      this.findProductId(this.orderProductList, node);
    },
    onFormCompleted() {
      this.formVisible = false;
      this.$logger.log("form completed");
      this.getList();
    },

    findProductId(opl, id) {
      opl.forEach((p) => {
        if (p.id == id) {
          this.getRecipeContent(p);
          return;
        } else if (p.intermediateProduct.length > 0) {
          this.findProductId(p.intermediateProduct, id);
        } else {
        }
      });
    },
    async getRecipeContent(p) {
      try {
        this.rows = [];
        this.selectedProduction = p;
        this.$logger.log("selectedProduction => ", this.selectedProduction);
        if (this.selected) {
          this.recipeContentLoading = true;
          const response = await this.$api.get(
            "getProductionOrderReceipe/" + this.selected
          );
          this.$logger.log("getProductionRecipe => ", response?.data);
          this.rows = response?.data;
        }
      } catch (error) {
        this.$logger.log(error);
        //this.selectedProduction = {};
      }
      this.recipeContentLoading = false;
    },

    async getSelectedProductionInfo(opl) {},

    async onAdd() {},
    nestedArrayFind(nestedArray) {
      for (let i = 0; i < nestedArray.length; i++) {
        const _node = nestedArray[i];
        if (_node.id == this.selected) {
          this.define = _node.detail;
          return _node;
        }
        if (_node.children) {
          this.nestedArrayFind(_node.children);
        }
      }
    },

    async getEmployeeGroup() {
      const response = this.$api.get("employeeGroups").then((data) => {
        this.$logger.log(data.data);
        this.employeeGroupFull = data.data.filter(
          (item) => item.name !== "Admin"
        );
      });
    },

    filterEmployeeGroup(val, update) {
      if (val === "") {
        update(() => {
          this.employeeGroupFiltered = this.employeeGroupFull;
        });
        return;
      }

      update(() => {
        this.employeeGroupFiltered = this.employeeGroupFull.filter(
          (v) => v.name.toLowerCase().indexOf(val.toLowerCase()) > -1
        );
      });
    },
    async postProductionOrderList(orderId, orderItems) {
      this.$q.notify({
        progress: true,
        type: "info",
        color: "info",
        message: this.$t(
          "production.creatingproductionorderfororderedproducts"
        ),
        caption: this.$t("processinprogress"),
      });
      const response = this.$api
        .post("postProductionOrderList/" + orderId, orderItems)
        .then((data) => {
          this.$logger.log("postProductionOrderList => ", data.data);
          this.orderProductList = data?.data;
          //TODO:
          this.productionPlanningWithWareHouse.warehouse =
            data?.data[0].warehouse;
          this.$q.notify({
            progress: true,
            type: "info",
            color: "info",
            message: this.$t("production.productionorderlistoftheordercreated"),
            caption: this.$t("success"),
          });
          setTimeout(() => this.$refs.producttree.expandAll(), 200);
        })
        .catch(function (error) {
          this.$q.notify({
            progress: true,
            type: "negative",
            message: this.$t("production.productionorderlistoftheordercreated"),
            caption: this.$t("success"),
          });
          this.$logger.log("error :", error);
        });
    },
    async getProductionOrderList() {
      const response = await this.$api
        .get("getProductionOrderlList/" + this.formModel.order.id)
        .then((response) => {
          this.orderProductList = response?.data;
          this.$logger.log("orderProductList => ", this.orderProductList);

          setTimeout(() => this.$refs.producttree.expandAll(), 200);
        })
        .catch(function (error) {
          this.$logger.log("error :", error);
        });
    },

    async changeProduct(production) {
      this.changeProductButtonWait = true;
      this.productiontobereplaced = production;
      this.getEquivalentProduct(production.insideStock.id);
    },

    async getEquivalentProduct(productId) {
      const response = this.$api
        .get("getEquivalentProduct/" + productId)
        .then((data) => {
          this.$logger.log(data.data);
          this.equivalentProducts = data.data.alternativeProduct;
          this.$logger.log("equivalentProducts", this.equivalentProducts);
          this.equivalentProductFormVisibile = true;
          this.changeProductButtonWait = false;
        })
        .catch((error) => {
          this.$logger.log("error", error);
          this.changeProductButtonWait = false;
        });
    },

    filterEquivalentProduct(val, update) {
      if (val === "") {
        update(() => {
          this.filteredEquivalentProducts = this.equivalentProducts;
        });
        return;
      }

      update(() => {
        this.filteredEquivalentProducts = this.equivalentProducts.filter(
          (v) => v.stockName.toLowerCase().indexOf(val.toLowerCase()) > -1
        );
      });
    },

    async getProductCountInWarehouse(productId) {
      this.warehouseProductLoading = true;
      this.productCountInWarehouse = [];
      const response = await this.$api
        .get("getProductCountInWarehouse/" + productId)
        .then((response) => {
          this.productCountInWarehouse = response?.data;
          this.$logger.log(
            "productCountInWarehouse => ",
            this.productCountInWarehouse
          );
          this.warehouseProductLoading = false;
        })
        .catch(function (error) {
          this.$logger.log("error :", error);
          this.warehouseProductLoading = false;
        });
    },
    async getProductionOrderDetailStatusSequences(productId) {
      const response = await this.$api
        .get("getProductionOrderStatusByStockCardId/" + productId)
        .then((response) => {
          this.productCountInWarehouse = response?.data;
          this.$logger.log(
            "productCountInWarehouse => ",
            this.productCountInWarehouse
          );
          this.warehouseProductLoading = false;
        })
        .catch(function (error) {
          this.$logger.log("error :", error);
          this.warehouseProductLoading = false;
        });
    },

    async onChangeProductSubmit(product) {
      this.productiontobereplaced.insideStockId = product.id;
      this.$logger.log(
        "selectedEquivalentProducts => ",
        this.productiontobereplaced
      );
      const response = await this.$api
        .put("productionOrderRecipes", this.productiontobereplaced)
        .then((response) => {
          this.$logger.log("productionOrderRecipe => ", response);
          this.selectedEquivalentProducts = null;
          this.selectedProduction = null;
          this.getRecipeContent();
          this.$q.notify({
            progress: true,
            type: "positive",
            textColor: "white",
            message: this.$t("production.productChanged"),
            caption: this.$t("success"),
          });
        })
        .catch(function (error) {
          this.$logger.log("error :", error);
          this.selectedEquivalentProducts = null;
        });
    },

    changeWarehouse(production) {
      this.$logger.log("changeWarehouse", production);
      this.productiontobereplaced = production;
      this.getProductCountInWarehouse(production.insideStockId);
    },

    async onChangeWarehouseSubmit(warehouseId) {
      this.productiontobereplaced.warehouseId = warehouseId;
      this.$logger.log(
        "selectedEquivalentProducts => ",
        this.productiontobereplaced
      );
      const response = await this.$api
        .put("productionOrderRecipes", this.productiontobereplaced)
        .then((response) => {
          this.$logger.log("productionOrderRecipe => ", response);
          this.selectedEquivalentProducts = null;
          this.selectedProduction = null;
          this.getRecipeContent();
          this.$q.notify({
            progress: true,
            type: "positive",
            textColor: "white",
            message: this.$t("production.warehouseChanged"),
            caption: this.$t("success"),
          });
        })
        .catch(function (error) {
          this.$logger.log("error :", error);
          this.selectedEquivalentProducts = null;
        });
    },
    addProduction(product) {
      this.$logger.log("addProduction", product);

      var prefixProductionNo = product.insideStock.stockType.code;
      var suffixProductionNo =
        new Date().getYear() +
        (new Date().getMonth() + 1).toString().padStart(2, "0") +
        new Date().getDate() +
        new Date().getSeconds() +
        product.insideStock.id.toString().padStart(4, "0");

      var productionOrder = {};
      productionOrder.productionNo = prefixProductionNo + suffixProductionNo;
      productionOrder.productionDate = Date();
      productionOrder.piece = product.piece;
      productionOrder.detail = product.detail;
      productionOrder.productionOrderId = this.selectedProduction.id;
      productionOrder.stockCardId = product.insideStock.id;
      productionOrder.orderId = this.formModel.order.id;
      productionOrder.warehouseId = product.warehouseId;
      productionOrder.productionOrderStatusId = 1;
      this.$logger.log("productionOrder", productionOrder);

      const response = this.$api
        .post("postputProductionOrder", productionOrder)
        .then((data) => {
          this.$logger.log("postputProductionOrder/", data.data);
          this.updateFormVisibile = false;
          this.$q.notify({
            progress: true,
            type: "positive",
            textColor: "white",
            message: this.$t(
              "production.creatingProductionOrderforSelectedProduct"
            ),
            caption: this.$t("success"),
          });
          this.getProductionOrderList();
        });
    },
    createProduction() {},

    subProductionControl(productionOrder) {
      this.$logger.log("DeleteNode => ", productionOrder.id);
      const response = this.$api
        .get("getSubProductionOrderCount/" + productionOrder.id)
        .then((data) => {
          this.$logger.log("getSubProductionOrderCount/", data.data);
          if (data.data > 0) {
            this.$q.notify({
              progress: true,
              type: "negative",
              textColor: "white",
              message: this.$t("production.FailedtoDeleteProduction"),
              caption: this.$t("error"),
            });
          } else {
            this.deleteProduction(productionOrder.id);
          }
        })
        .catch(function (error) {
          this.$logger.log("error :", error);
        });
    },
    deleteProduction(productionOrderId) {
      this.$logger.log("DeleteNode => ", productionOrderId);
      const response = this.$api
        .delete("deleteProductionOrder/" + productionOrderId)
        .then((data) => {
          this.$logger.log("deleteProductionOrder/", data.data);
          this.$q.notify({
            progress: true,
            type: "positive",
            textColor: "white",
            message: this.$t("production.ProductionInformationDeleted"),
            caption: this.$t("success"),
          });
          this.getProductionOrderList();
        })
        .catch(function (error) {
          this.$q.notify({
            progress: true,
            type: "negative",
            message: this.$t("error"),
          });
          this.$logger.log("error :", error);
        });
    },

    async deleteproductionOrderRecipe(productionOrderRecipe) {
      this.$logger.log("productionOrderRecipe => ", productionOrderRecipe);
      const response = this.$api
        .delete("productionOrderRecipes/" + productionOrderRecipe.id)
        .then((data) => {
          this.$logger.log("productionOrderRecipe/", data.data);
          this.$q.notify({
            progress: true,
            type: "positive",
            textColor: "white",
            message: this.$t("production.ProductionRecipeDeleted"),
            caption: this.$t("success"),
          });
          this.getRecipeContent();
        })
        .catch(function (error) {
          this.$q.notify({
            progress: true,
            type: "negative",
            message: this.$t("error"),
          });
          this.$logger.log("error :", error);
        });
    },

    async printTable() {},

    saveChanges() {
      this.orderProductList.forEach((productionOrder) => {
        try {
          productionOrder.warehouseId =
            this.productionPlanningWithWareHouse.warehouse.id;
          this.$api
            .put("productionOrders", JSON.stringify(productionOrder))
            .then((data) => {
              this.$logger.log("productionOrder/", data.data);
              this.updateFormVisibile = false;
              this.$q.notify({
                progress: true,
                type: "positive",
                textColor: "white",
                message: this.$t("success"),
                caption: this.$t("success"),
              });
            });
        } catch (error) {
          this.$logger.log("error", error);
        }
      });

      this.getProductionOrderList();
    },
  },
});
</script>
