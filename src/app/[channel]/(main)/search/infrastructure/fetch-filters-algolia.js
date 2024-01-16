import algoliasearch from "algoliasearch";
import { SearchProductsDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";

const client = algoliasearch("G5M9P8PV54", "e8bbe59eff970f75ff4bd03392492f81"); // to one place

export const fetchFiltersAlgoliaInfra = async ({
	search,
	// searchParams,
	// variables,
	// revalidate
}) => {
	try {
		// console.log('variables', variables)

		const index = client.initIndex("channel-pln.PLN.products");
		// Search the index and print the results
		const { facets: filterCategoriesMap } = await index.search(search, {
			facets: ["*"],
		});
		// const { products } = await executeGraphQL(SearchProductsDocument, {
		//     variables,
		//     revalidate
		// });
		// console.log('rest', rest)
		return {
			isSuccess: true,
			filterCategoriesMap,
			// products: hits.map(getProduct),
			// searchInfo: getSearchInfo(rest)
			// error: how error?
		};
	} catch (error) {
		return {
			isSuccess: false,
			error,
		};
	}
};
