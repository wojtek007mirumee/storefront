import algoliasearch from "algoliasearch";
import { SearchProductsDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";

const client = algoliasearch('G5M9P8PV54', 'e8bbe59eff970f75ff4bd03392492f81') // to one place

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
    const hasNextPage = page + 1 < nbPages
    return ({
        totalCount: nbHits,
        hasNextPage,
        nextPageParams: hasNextPage && {
            page: page + 1
        }
    })
}

const getProduct = ({
    variantId,
    slug,
    name,
    media,
    productPricing,
    categories
}) => ({
    id: variantId,
    slug: slug,
    name: name,
    thumbnail: {
        url: media[0]?.url,
        alt: name
    },
    category: {
        name: categories.lvl0
    },
    pricing: {
        priceRange: {
            start: {
                gross: {
                    currency: 'EUR',
                    amount: productPricing.priceRange.start.gross
                }
            },
            stop: {
                gross: {
                    currency: 'EUR',
                    amount: productPricing.priceRange.stop.gross
                }
            },
        }
    },

})
const a = {
    "productId": "UHJvZHVjdDoxMzU=",
    "variantId": "UHJvZHVjdFZhcmlhbnQ6MzU0",
    "name": "Team Shirt - M",
    "productName": "Team Shirt",
    "variantName": "M",
    "sku": "128223581",
    "attributes": {
        "Material": "Elastane",
        "Size": "M"
    },
    "media": [{
        "url": "https://woksinski.eu.saleor.cloud/thumbnail/UHJvZHVjdE1lZGlhOjE5/4096/",
        "type": "IMAGE"
    },
    {
        "url": "https://woksinski.eu.saleor.cloud/thumbnail/UHJvZHVjdE1lZGlhOjIw/4096/",
        "type": "IMAGE"
    }],
    "description": {
        "time": 1653425391562,
        "blocks": [{
            "id": "fMdfe0Bfpe",
            "data": { "text": "<b>One style fits all.</b> Get a look that works even when you are taking it easy. Relaxed wear for the fans." },
            "type": "paragraph"
        }],
        "version": "2.22.2"
    },
    "descriptionPlaintext": "One style fits all. Get a look that works even when you are taking it easy. Relaxed wear for the fans.",
    "slug": "team-shirt",
    "thumbnail": "https://woksinski.eu.saleor.cloud/thumbnail/UHJvZHVjdE1lZGlhOjE5/256/",
    "grossPrice": 200,
    "pricing": {
        "price": {
            "net": 40,
            "gross": 40
        },
        "onSale": false,
        "discount": {},
        "priceUndiscounted": {
            "net": 40,
            "gross": 40
        }
    },
    "productPricing": {
        "priceRange": {
            "start": {
                "gross": 200,
                "net": 200
            },
            "stop": {
                "gross": 200,
                "net": 200
            }
        },
        "priceRangeUndiscounted": {
            "start": {
                "gross": 200,
                "net": 200
            },
            "stop": {
                "gross": 200,
                "net": 200
            }
        }
    },
    "inStock": true,
    "categories": {
        "lvl0": "Apparel",
        "lvl1": "Apparel > Shirts",
        "lvl2": "Apparel > Shirts > T-shirts"
    },
    "collections": [],
    "metadata": {},
    "variantMetadata": {},
    "otherVariants": ["UHJvZHVjdFZhcmlhbnQ6MzUz",
        "UHJvZHVjdFZhcmlhbnQ6MzU1",
        "UHJvZHVjdFZhcmlhbnQ6MzU2",
        "UHJvZHVjdFZhcmlhbnQ6MzU3"],
    "objectID": "UHJvZHVjdDoxMzU=_UHJvZHVjdFZhcmlhbnQ6MzU0",
    "_highlightResult": {
        "productId": {
            "value": "UHJvZHVjdDoxMzU=",
            "matchLevel": "none",
            "matchedWords": []
        },
        "variantId": {
            "value": "UHJvZHVjdFZhcmlhbnQ6MzU0",
            "matchLevel": "none",
            "matchedWords": []
        },
        "name": {
            "value": "Team Shirt - M",
            "matchLevel": "none",
            "matchedWords": []
        },
        "productName": {
            "value": "Team Shirt",
            "matchLevel": "none",
            "matchedWords": []
        },
        "variantName": {
            "value": "M",
            "matchLevel": "none",
            "matchedWords": []
        },
        "sku": {
            "value": "128223581",
            "matchLevel": "none",
            "matchedWords": []
        },
        "attributes": {
            "Material": {
                "value": "Elastane",
                "matchLevel": "none",
                "matchedWords": []
            },
            "Size": {
                "value": "M",
                "matchLevel": "none",
                "matchedWords": []
            }
        },
        "media": [{
            "url": {
                "value": "https://woksinski.eu.saleor.cloud/thumbnail/UHJvZHVjdE1lZGlhOjE5/4096/",
                "matchLevel": "none",
                "matchedWords": []
            },
            "type": {
                "value": "IMAGE",
                "matchLevel": "none",
                "matchedWords": []
            }
        },
        {
            "url": {
                "value": "https://woksinski.eu.saleor.cloud/thumbnail/UHJvZHVjdE1lZGlhOjIw/4096/",
                "matchLevel": "none",
                "matchedWords": []
            },
            "type": {
                "value": "IMAGE",
                "matchLevel": "none",
                "matchedWords": []
            }
        }],
        "description": {
            "time": {
                "value": "1653425391562",
                "matchLevel": "none",
                "matchedWords": []
            },
            "blocks": [{
                "id": {
                    "value": "fMdfe0Bfpe",
                    "matchLevel": "none",
                    "matchedWords": []
                },
                "data": {
                    "text": {
                        "value": "<b>One style fits <em>a</em>ll.</b> Get <em>a</em> look that works even when you <em>a</em>re taking it easy. Relaxed wear for the fans.",
                        "matchLevel": "full",
                        "fullyHighlighted": false,
                        "matchedWords": ["a"]
                    }
                },
                "type": {
                    "value": "paragraph",
                    "matchLevel": "none",
                    "matchedWords": []
                }
            }],
            "version": {
                "value": "2.22.2",
                "matchLevel": "none",
                "matchedWords": []
            }
        },
        "descriptionPlaintext": {
            "value": "One style fits <em>a</em>ll. Get <em>a</em> look that works even when you <em>a</em>re taking it easy. Relaxed wear for the fans.",
            "matchLevel": "full",
            "fullyHighlighted": false,
            "matchedWords": ["a"]
        },
        "slug": {
            "value": "team-shirt",
            "matchLevel": "none",
            "matchedWords": []
        },
        "thumbnail": {
            "value": "https://woksinski.eu.saleor.cloud/thumbnail/UHJvZHVjdE1lZGlhOjE5/256/",
            "matchLevel": "none",
            "matchedWords": []
        },
        "grossPrice": {
            "value": "200",
            "matchLevel": "none",
            "matchedWords": []
        },
        "pricing": {
            "price": {
                "net": {
                    "value": "40",
                    "matchLevel": "none",
                    "matchedWords": []
                },
                "gross": {
                    "value": "40",
                    "matchLevel": "none",
                    "matchedWords": []
                }
            },
            "priceUndiscounted": {
                "net": {
                    "value": "40",
                    "matchLevel": "none",
                    "matchedWords": []
                },
                "gross": {
                    "value": "40",
                    "matchLevel": "none",
                    "matchedWords": []
                }
            }
        },
        "productPricing": {
            "priceRange": {
                "start": {
                    "gross": {
                        "value": "200",
                        "matchLevel": "none",
                        "matchedWords": []
                    },
                    "net": {
                        "value": "200",
                        "matchLevel": "none",
                        "matchedWords": []
                    }
                },
                "stop": {
                    "gross": {
                        "value": "200",
                        "matchLevel": "none",
                        "matchedWords": []
                    },
                    "net": {
                        "value": "200",
                        "matchLevel": "none",
                        "matchedWords": []
                    }
                }
            },
            "priceRangeUndiscounted": {
                "start": {
                    "gross": {
                        "value": "200",
                        "matchLevel": "none",
                        "matchedWords": []
                    },
                    "net": {
                        "value": "200",
                        "matchLevel": "none",
                        "matchedWords": []
                    }
                },
                "stop": {
                    "gross": {
                        "value": "200",
                        "matchLevel": "none",
                        "matchedWords": []
                    },
                    "net": {
                        "value": "200",
                        "matchLevel": "none",
                        "matchedWords": []
                    }
                }
            }
        },
        "categories": {
            "lvl0": {
                "value": "<em>A</em>pparel",
                "matchLevel": "full",
                "fullyHighlighted": false,
                "matchedWords": ["a"]
            },
            "lvl1": {
                "value": "<em>A</em>pparel > Shirts",
                "matchLevel": "full",
                "fullyHighlighted": false,
                "matchedWords": ["a"]
            },
            "lvl2": {
                "value": "<em>A</em>pparel > Shirts > T-shirts",
                "matchLevel": "full",
                "fullyHighlighted": false,
                "matchedWords": ["a"]
            }
        },
        "otherVariants": [{
            "value": "UHJvZHVjdFZhcmlhbnQ6MzUz",
            "matchLevel": "none",
            "matchedWords": []
        },
        {
            "value": "UHJvZHVjdFZhcmlhbnQ6MzU1",
            "matchLevel": "none",
            "matchedWords": []
        },
        {
            "value": "UHJvZHVjdFZhcmlhbnQ6MzU2",
            "matchLevel": "none",
            "matchedWords": []
        },
        {
            "value": "UHJvZHVjdFZhcmlhbnQ6MzU3",
            "matchLevel": "none",
            "matchedWords": []
        }]
    }
}

export const fetchFiltersAlgoliaInfra = async ({
    search
    // searchParams,
    // variables,
    // revalidate
}) => {
    try {
        // console.log('variables', variables)

        const index = client.initIndex("channel-pln.PLN.products");
        // Search the index and print the results
        const { facets: filterCategoriesMap } = await index.search(search, {
            facets: ['*']
        })
        // const { products } = await executeGraphQL(SearchProductsDocument, {
        //     variables,
        //     revalidate
        // });
        // console.log('rest', rest)
        return {
            isSuccess: true,
            filterCategoriesMap
            // products: hits.map(getProduct),
            // searchInfo: getSearchInfo(rest)
            // error: how error?
        }
    } catch (error) {
        return {
            isSuccess: false,
            error
        }
    }
}