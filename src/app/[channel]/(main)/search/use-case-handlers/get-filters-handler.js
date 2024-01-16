export const getFiltersHandler = ({
    fetchFilters
}) => async ({
    search,
    // searchParams,
    // variables,
    revalidate
}) => {
        const { filterCategoriesMap, isSuccess, error } = await fetchFilters({
            search,
            revalidate
            //  variables, revalidate, searchParams
        })

        return { filterCategoriesMap, isSuccess, error }
    }