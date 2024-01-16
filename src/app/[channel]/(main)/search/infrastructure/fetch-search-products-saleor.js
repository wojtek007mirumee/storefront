import { SearchProductsDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";

const getSearchInfo = ({
    pageInfo,
    totalCount
}) => ({
    totalCount,
    hasNextPage: pageInfo.hasNextPage,
    nextPageParams: { cursor: pageInfo.endCursor }
})


export const fetchSearchProductsSaleorInfra = async ({
    searchParams,
    variables,
    revalidate
}) => {
    try {
        const cursor = typeof searchParams.cursor === "string" ? searchParams.cursor : null;
        // name  products doenst seem to fully coresspond with the content
        const { products } = await executeGraphQL(SearchProductsDocument, {
            variables: {
                ...variables,
                after: cursor,
            },
            revalidate
        });
        // console.log('products', products)
        return {
            isSuccess: true,
            products: products.edges.map((edge) => edge.node),
            searchInfo: getSearchInfo(products)
        }
    } catch (error) {
        return {
            isSuccess: false,
            error
        }
    }
}