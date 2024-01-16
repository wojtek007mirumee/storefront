import { notFound, redirect } from "next/navigation";
import { OrderDirection, ProductOrderField } from "@/gql/graphql";
import { Pagination } from "@/ui/components/Pagination";
import { ProductList } from "@/ui/components/ProductList";
import { ProductsPerPage } from "@/app/config";
import searchService from './search-service'

export const metadata = {
	title: "Search products · Saleor Storefront example",
	description: "Search products in Saleor Storefront example",
};

export default async function Page({
	searchParams,
	params,
}: {
	searchParams: Record<"query" | "cursor", string | string[] | undefined>;
	params: { channel: string };
}) {

	const searchValue = searchParams.query;
	if (!searchValue) {
		notFound();
	}

	if (Array.isArray(searchValue)) {
		const firstValidSearchValue = searchValue.find((v) => v.length > 0);
		if (!firstValidSearchValue) {
			notFound();
		}
		redirect(`/search?${new URLSearchParams({ query: firstValidSearchValue }).toString()}`);
	}

	// how to check if algolia is sending two requests?
	// should be fetch parallel
	// change params to have no api specific but marina domain speicifc language

	// druga opcja to miec jeden handler na strone i oba calle zrobic w handlerze
	// bo w sumie to oba przyjmuja search i oba tez beda przyjmowac filtry incoming
	// wtedy moze da rade jakos algolie w jeden call zamknac
	const { products, searchInfo, error: productsError } = await searchService.searchProducts({
		searchParams,
		variables: {
			first: ProductsPerPage,
			search: searchValue,
			sortBy: ProductOrderField.Rating,
			sortDirection: OrderDirection.Asc,
			channel: params.channel, // how to use in algolia isn't it what you put in init index?
		},
		revalidate: 60,
	})
	const { filterCategoriesMap, error: fitlersError } = await searchService.getFilters({
		search: searchValue,
		// searchParams,
		// variables: {
		// 	first: ProductsPerPage,
		// 	search: searchValue,
		// 	sortBy: ProductOrderField.Rating,
		// 	sortDirection: OrderDirection.Asc,
		// 	channel: params.channel,
		// },
		revalidate: 60,
	})

	if (productsError) {
		return <div>productsError:{JSON.stringify(productsError)}</div>
	}

	if (fitlersError) {
		return <div>fitlersError:{JSON.stringify(fitlersError)}</div>
	}

	// executeGraphQL(SearchProductsDocument, {
	// 	variables: {
	// 		first: ProductsPerPage,
	// 		search: searchValue,
	// 		after: cursor,
	// 		sortBy: ProductOrderField.Rating,
	// 		sortDirection: OrderDirection.Asc,
	// 		channel: params.channel,
	// 	},
	// 	revalidate: 60,
	// });

	/// czyli chcemy wszystko to co otrzymalismy od backendu pozniej zeby przeszlo przez domain objects, 
	// , a wczesniej w infra zeby zmapowac wszystkie rzeczy ktore trzeba na jakis jeden okreslony standard ktorego potrzebujemy 
	// spytac jak w BE to robia z
	// 	1 najpierw okreslic co jest potrzebne z danego handlera
	// 	2 odebranie z api odpowiednich wartosci i przejscie ich przez translator


	if (!products) {
		notFound();
	}

	const newSearchParams = new URLSearchParams({
		query: searchValue,
		...(searchInfo.nextPageParams ?? {}),
	});

	return (
		<div className="flex">
			<aside>
				{Object.entries(filterCategoriesMap).map(([category, filtersMap]) => (
					<section className="py-3">
						<h2>{category}</h2>
						{/* Jak z niezgodnymi nazwami pod wglezedem i18n */}
						<ul className="ml-2">
							{Object.entries(filtersMap).map(([filterName, productAmount]) => (
								<li>{filterName} {productAmount}</li>
							))}
						</ul>
					</section>
				))}
			</aside>
			<section className="mx-auto max-w-7xl p-8 pb-16">
				{searchInfo.totalCount && searchInfo.totalCount > 0 ? (
					<div>
						<h1 className="pb-8 text-xl font-semibold">Search results for &quot;{searchValue}&quot;:</h1>
						<ProductList products={
							products//.edges.map((edge) => edge.node)
						} />
						<Pagination
							pageInfo={{
								...searchInfo,
								basePathname: `/search`,
								urlSearchParams: newSearchParams,
							}}
						/>
					</div>
				) : (
					<h1 className="mx-auto pb-8 text-center text-xl font-semibold">Nothing found :(</h1>
				)}
			</section>
		</div>
	);
}
