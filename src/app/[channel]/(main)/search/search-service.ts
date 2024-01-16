// Handler
import { searchProductsHandler } from "./use-case-handlers/search-product-handler";
import { getFiltersHandler } from "./use-case-handlers/get-filters-handler"
// BRAK podpowiedzi do auto importu
// INFRA
// Algolia
import { fetchSearchProductsAlgoliaInfra } from "./infrastructure/fetch-search-products-algolia";
import { fetchFiltersAlgoliaInfra } from "./infrastructure/fetch-filters-algolia";
// Saleor
import { fetchSearchProductsSaleorInfra } from "./infrastructure/fetch-search-products-saleor";
import { fetchFiltersSaleorInfra } from "./infrastructure/fetch-filters-saleor";

const searchService = {
    searchProducts: searchProductsHandler({
        fetchSearchProducts: fetchSearchProductsSaleorInfra,
        // fetchSearchProducts: fetchSearchProductsAlgoliaInfra, // should be searchProducts
    }),
    getFilters: getFiltersHandler({
        // fetchFilters: fetchFiltersSaleorInfra,
        fetchFilters: fetchFiltersAlgoliaInfra,
    })
}

export default searchService