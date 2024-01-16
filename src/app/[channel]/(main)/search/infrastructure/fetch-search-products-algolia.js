import algoliasearch from "algoliasearch";
import { SearchProductsDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";

const client = algoliasearch("G5M9P8PV54", "e8bbe59eff970f75ff4bd03392492f81");

// nbHits: 68,
// page: 0,
// nbPages: 4,
// hitsPerPage: 20,
// exhaustiveNbHits: true,
// exhaustiveTypo: true,
// exhaustive: { nbHits: true, typo: true },
// query: 'a',
// params: 'query=a',
const getSearchInfo = ({
	nbHits,
	page,
	nbPages,
	hitsPerPage,
	exhaustiveNbHits,
	exhaustiveTypo,
	exhaustive,
	query,
	params,
}) => {
	const hasNextPage = page + 1 < nbPages;
	return {
		totalCount: nbHits,
		hasNextPage,
		nextPageParams: hasNextPage && {
			page: page + 1,
		},
	};
};

const getProduct = ({ variantId, slug, name, media, productPricing, categories }) => ({
	id: variantId,
	slug: slug,
	name: name,
	thumbnail: {
		url: media[0]?.url,
		alt: name,
	},
	category: {
		name: categories.lvl0,
	},
	pricing: {
		priceRange: {
			start: {
				gross: {
					currency: "EUR",
					amount: productPricing.priceRange.start.gross,
				},
			},
			stop: {
				gross: {
					currency: "EUR",
					amount: productPricing.priceRange.stop.gross,
				},
			},
		},
	},
});

export const fetchSearchProductsAlgoliaInfra = async ({ searchParams, variables, revalidate }) => {
	try {
		// console.log('variables', variables)

		const index = client.initIndex("channel-pln.PLN.products");
		// Search the index and print the results
		const { hits, ...rest } = await index.search(variables.search, {
			page: searchParams.page,
		});
		// const { products } = await executeGraphQL(SearchProductsDocument, {
		//     variables,
		//     revalidate
		// });
		// console.log('rest', rest)
		return {
			isSuccess: true,
			products: hits.map(getProduct),
			searchInfo: getSearchInfo(rest),
			// error: how error?
		};
	} catch (error) {
		return {
			isSuccess: false,
			error,
		};
	}
};
