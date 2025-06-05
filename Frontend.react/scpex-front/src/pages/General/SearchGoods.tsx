import Button from "../../components/Fragments/Button";
import Paper from "../../components/Fragments/Paper"
import { Input } from '@headlessui/react';
import { ReactNode, useEffect, useState, useRef } from "react";
import ListItem from "../../components/Fragments/ListItem";
import Icon from "../../components/Fragments/Icon";
import BasicStatistics from "../../components/Fragments/BasicStatistics";
import List from "../../components/List";
import _ from "lodash";
import { isDebug } from "../../env";
import { api } from "../../axios";
import PageRequest from "../../models/PageRequest";
import { doInvalidCredentialAction } from "../../tools/AuthTools";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import Pageable from "../../models/Pageable";
import { getTotals } from "../../tools/misc";

export default function SearchGoods() {
    const [results, setResults] = useState<ListItem[]>([]);
    const [isNoResult, setIsNoResult] = useState(false);
    const [page, setPage] = useState(0);
    const [keyword, setKeyword] = useState("");
    const [sortingField, setSortingField] = useState<"name" | "singlePrice" | "amount">("name");
    const [sortingMethod, setSortingMethod] = useState<"asc" | "desc">("asc");
    const [totalPages, setTotalPages] = useState(0);
    const [input, setInput] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    let searchboxRef = useRef(null);

    async function search(keyword: string, page: number = 1, sortingField: "name" | "singlePrice" | "amount" = "name", sortingMethod: "asc" | "desc" = "asc") {
        let pr = new PageRequest(keyword, "name", sortingField, sortingMethod);
        console.log(keyword)
        pr.PageSize = 2;
        setIsNoResult(true);
        let results: ListItem[] = [];
        setResults(results);
        // setTotalPages(0);
        // setPage(1);
        try {
            let rs = await api.Stock.search(pr, page);
            let content = JSON.parse(rs.content) as Pageable;
            if (content.total == 0 && content.content.length == 0) {
                setIsNoResult(true);
            } else {
                setIsNoResult(false);
                results = content.content.map((item: any) => {
                    return <ListItem title={item.name} cover={item.image} price={item.singlePrice} detail={item.description} extra={<BasicStatistics category={item.category?.name ?? '-'} sold={'-'} instock={item.amount} />} onClick={() => {
                        navigate(`/view/warehouse/${item.id}`);
                    }} /> as unknown as ListItem;
                });
                setResults(results);
                setPage(content.pageable.pageNumber);
                setTotalPages(getTotals(content));
            }
        } catch (error: any) {
            if (error.message.includes("401")) {
                doInvalidCredentialAction(dispatch, navigate);
            }
        }
    }

    useEffect(() => {
        eval("publicSearchboxEffect()");
        console.log("Fired effect method");
    });

    function runSearch() {
        setInput(keyword);
        search(keyword, page, sortingField, sortingMethod);
    }

    return <Paper needRefresh>
        <div className="w-full sm:max-w-[85%] md:max-w-[60%] mx-auto h-full? grid grid-cols-1 grid-fill-paper items-center justify-items-center justify-center transition-all">
            <div id="wrapper-search-with-list" className="w-full transition-all">
                <div id="searchbox-cont" className="grid grid-cols-5 w-full shadow-lg rounded-lg overflow-hidden bg-translate text-xl border-2 border-transparent focus-within:border-slate-500 ">
                    <Input placeholder="Search something..." ref={searchboxRef} onFocus={(e) => { setKeyword(e.target.value) }} onChange={(e) => { setKeyword(e.target.value) }} id="searhBox"
                        className={`grow? col-span-4 bg-zinc-50 text-lg! fade-in z-[3] p-2! dark:bg-slate-500 outline-0 peer h-full text-slate-950 dark:text-white`}
                    />
                    <Button onClick={runSearch} paddingless
                        className="w-full px-2.5 pr-2 py-1 bg-slate-400 hover:bg-slate-500 active:bg-slate-500/70 text-white font-semibold" borderless >
                        <Icon pua="e721" /><span className="hidden md:inline-block pl-0 lg:pl-3"> Search!</span>
                    </Button>

                </div>


                {((results.length !== 0 || isNoResult)) &&
                    <div id="results" className="py-3 md:py-5" >
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-lg italic! mb-1 opacity-70 st">{input !== "" ? `Results of "${input}":` : "Results:"}</p >
                            <div className="flex items-center gap-2">
                                <label htmlFor="sortField" className="text-base">Sort by:</label>
                                <select
                                    id="sortField"
                                    className="border rounded px-2 py-1 text-base"
                                    value={sortingField}
                                    onChange={e => {
                                        setSortingField(e.target.value as "name" | "singlePrice" | "amount");
                                        setPage(0);
                                        search(keyword, 0, e.target.value as "name" | "singlePrice" | "amount", sortingMethod);
                                    }}
                                >
                                    <option value="name">Name</option>
                                    <option value="singlePrice">Price</option>
                                    <option value="amount">Stock</option>
                                </select>
                                <select
                                    id="sortMethod"
                                    className="border rounded px-2 py-1 text-base"
                                    value={sortingMethod}
                                    onChange={e => {
                                        setSortingMethod(e.target.value as "asc" | "desc");
                                        setPage(0);
                                        search(keyword, 0, sortingField, e.target.value as "asc" | "desc");
                                    }}
                                >
                                    <option value="asc">Asc</option>
                                    <option value="desc">Desc</option>
                                </select>
                            </div>
                        </div>
                        {results.length > 0 &&
                            <List>
                                {results.map(_ => <div key={Math.random()}>{_ as unknown as ReactNode}</div>)}
                            </List>
                        }
                    </div>
                }

                {/* Pagination controls using @headlessui/react */}
                {(totalPages > 0 && !isNoResult) &&
                    <div className="flex items-center justify-end gap-3 mt-4">
                        <p className="text-lg italic! mb-1 opacity-70 st">Page {page + 1} of {totalPages}</p >
                        <Button
                            className="rounded-lg px-3 py-1"
                            disable={page === 0}
                            onClick={() => {
                                if (page > 0) {
                                    setPage(page - 1);
                                    search(keyword, page - 1, sortingField, sortingMethod);
                                }
                            }}
                        >
                            Prev
                        </Button>
                        <Button
                            className="rounded-lg px-3 py-1"
                            disable={page === totalPages - 1}
                            onClick={() => {
                                // If there are results, allow next page
                                setPage(page + 1);
                                search(keyword, page + 1, sortingField, sortingMethod);
                            }}
                        >
                            Next
                        </Button>
                    </div>
                }
                {!(totalPages > 0 && !isNoResult) &&
                    <div className="text-center">
                        No Result for that...
                    </div>
                }
            </div>
        </div>
    </Paper>
}