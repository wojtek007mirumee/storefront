'use client';
import algoliasearch from 'algoliasearch/lite';
import {
    SearchBox, useHits, useSearchBox,
} from 'react-instantsearch';
import { InstantSearchNext } from 'react-instantsearch-nextjs';


const searchClient = algoliasearch('G5M9P8PV54', 'e8bbe59eff970f75ff4bd03392492f81');

export default function Search() {
    return (
        <InstantSearchNext indexName="channel-pln.PLN.products" searchClient={searchClient}>
            <SearchBox />
            {/* other widgets */}
            <SearchResult />

        </InstantSearchNext>
    );
}



function SearchResult() {
    const b = useHits()
    const a = useSearchBox()
    console.log('a', a)
    console.log('b', b)
    return (
        <div>{b.hits.map(hit => (
            <p>
                {hit.productName}
            </p>
        ))}</div>
    );
}
