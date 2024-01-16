import { AttributesListDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";

export const fetchFiltersSaleorInfra = async ({
	searchParams,
	// variables,
	revalidate,
}) => {
	try {
		// const cursor = typeof searchParams.cursor === "string" ? searchParams.cursor : null;
		// name  products doenst seem to fully coresspond with the content
		const { attributes } = await executeGraphQL(AttributesListDocument, {
			// variables: {
			//     ...variables,
			//     after: cursor,
			// },
			revalidate,
		});
		const filterCategoriesMap = attributes.edges.reduce(
			(categoryAcc, edge) => ({
				...categoryAcc,
				[edge.node.name]: edge.node.choices.edges.reduce(
					(filterAcc, edge) => ({
						...filterAcc,
						[edge.node.name]: null,
					}),
					{},
				),
			}),
			{},
		);

		// console.log('filterCategoriesMap', filterCategoriesMap)
		return {
			isSuccess: true,
			filterCategoriesMap,
			// products: products.edges.map((edge) => edge.node),
			// searchInfo: getSearchInfo(products)
		};
	} catch (error) {
		return {
			isSuccess: false,
			error,
		};
	}
};
