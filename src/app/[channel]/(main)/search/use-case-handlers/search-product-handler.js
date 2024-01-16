export const searchProductsHandler = ({
    fetchSearchProducts
}) => async ({
    searchParams,
    variables,
    revalidate
}) => {
        const { products, searchInfo, isSuccess, error } = await fetchSearchProducts({ variables, revalidate, searchParams })

        return { products, searchInfo, isSuccess, error }
    }