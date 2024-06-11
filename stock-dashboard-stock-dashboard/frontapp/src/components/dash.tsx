import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import Header from "./header";

import {
  Column,
  ColumnDef,
  PaginationState,
  Table,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { makeData, Person } from "./makeData";

export function Card({ symbol = "stock", closingPrices = [] }) {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    // if (closingPrices.length > 1) {
    //   const prices = Object.values(closingPrices);
    //   const up = ((prices.at(-1) - prices[0]) * 100) / prices[0];
    //   setPercent(up.toFixed(2));
    // }
  }, [closingPrices]);

  return (
    <div className="card shadow border-0 min-w-[200px]">
      <div className="card-body">
        <div className="row items-center">
          <div className="col">
            <strong className="text-muted text-lg d-block mb-2">
              {symbol.split(".")[0]}
            </strong>
          </div>
          <div className="col-auto">
            <div className="icon icon-shape bg-primary text-white text-lg rounded-circle">
              <i className="bi bi-people"></i>
            </div>
          </div>
        </div>
        <div className="mt-2 mb-0 text-lg">
          <span className="badge badge-pill bg-soft-success text-success me-2">
            <i className="bi bi-arrow-up me-1"></i>
            {percent}%
          </span>
        </div>
      </div>
    </div>
  );
}

function App() {
  const rerender = React.useReducer(() => ({}), {})[1];
  const [consecutiveData, setConsecutiveData] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8082/get_consecutive")
      .then(async (res) => {
        const json = await res.json();
        if (json.error) {
          alert(json.error);
          return;
        }
        setConsecutiveData(json);
      })
      .catch((error) => {
        console.error("Error fetching consecutive data:", error);
      });
  }, []);

  const columns = React.useMemo<ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: "firstName",
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row.lastName,
        id: "lastName",
        cell: (info) => info.getValue(),
        header: () => <span>Last Name</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "age",
        header: () => "Age",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "visits",
        header: () => <span>Visits</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "status",
        header: "Status",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "progress",
        header: "Profile Progress",
        footer: (props) => props.column.id,
      },
    ],
    []
  );

  const [data, setData] = React.useState(() => makeData(100000));
  const refreshData = () => setData(() => makeData(100000));

  return (
    <>
      <MyTable
        {...{
          data,
          columns,
        }}
      />
      <hr />
      <div>
        <button onClick={() => rerender()}>Force Rerender</button>
      </div>
      <div>
        <button onClick={() => refreshData()}>Refresh Data</button>
      </div>
    </>
  );
}

function MyTable({
  data,
  columns,
}: {
  data: Person[];
  columns: ColumnDef<Person>[];
}) {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    columns,
    data,
    debugTable: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
  });

  return (
    <div className="d-flex flex-column flex-lg-row h-lg-full bg-surface-secondary">
      <div className="h-screen flex-grow-1 overflow-y-lg-auto">
        <Header />
        <main className="py-6 bg-surface-secondary">
          <div className="container-fluid">
            <h3 className="text-slate-600">
              Stocks that went up for 3-5 consecutive days
            </h3>
            <br />
            <div className="row g-6 mb-6">
              {/* <div className="flex gap-6">
                {consecutiveData.map((z, i) => (
                  <Card key={i} {...z} />
                ))}
              </div> */}
            </div>

            <h3 className="mb-0">STOCKS</h3>
            <div className="card shadow border-0 mb-7">
              <div className="p-2">
                <div className="h-2" />
                <table>
                  <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <th key={header.id} colSpan={header.colSpan}>
                            <div
                              {...{
                                className: header.column.getCanSort()
                                  ? "cursor-pointer select-none"
                                  : "",
                                onClick:
                                  header.column.getToggleSortingHandler(),
                              }}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {{
                                asc: " 🔼",
                                desc: " 🔽",
                              }[header.column.getIsSorted() as string] ?? null}
                              {header.column.getCanFilter() ? (
                                <div>
                                  <Filter
                                    column={header.column}
                                    table={table}
                                  />
                                </div>
                              ) : null}
                            </div>
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody>
                    {table.getRowModel().rows.map((row) => (
                      <tr key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="h-2" />
                <div className="flex items-center gap-2">
                  <button
                    className="border rounded p-1"
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                  >
                    {"<<"}
                  </button>
                  <button
                    className="border rounded p-1"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    {"<"}
                  </button>
                  <button
                    className="border rounded p-1"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    {">"}
                  </button>
                  <button
                    className="border rounded p-1"
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                  >
                    {">>"}
                  </button>
                  <span className="flex items-center gap-1">
                    <div>Page</div>
                    <strong>
                      {table.getState().pagination.pageIndex + 1} of{" "}
                      {table.getPageCount().toLocaleString()}
                    </strong>
                  </span>
                  <span className="flex items-center gap-1">
                    | Go to page:
                    <input
                      type="number"
                      defaultValue={table.getState().pagination.pageIndex + 1}
                      onChange={(e) => {
                        const page = e.target.value
                          ? Number(e.target.value) - 1
                          : 0;
                        table.setPageIndex(page);
                      }}
                      className="border p-1 rounded w-16"
                    />
                  </span>
                  <select
                    value={table.getState().pagination.pageSize}
                    onChange={(e) => {
                      table.setPageSize(Number(e.target.value));
                    }}
                  >
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                      <option key={pageSize} value={pageSize}>
                        Show {pageSize}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  Showing {table.getRowModel().rows.length.toLocaleString()} of{" "}
                  {table.getRowCount().toLocaleString()} Rows
                </div>
                <pre>
                  {JSON.stringify(table.getState().pagination, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function Filter({
  column,
  table,
}: {
  column: Column<any, any>;
  table: Table<any>;
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  return typeof firstValue === "number" ? (
    <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
      <input
        type="number"
        value={(columnFilterValue as [number, number])?.[0] ?? ""}
        onChange={(e) =>
          column.setFilterValue((old: [number, number]) => [
            e.target.value,
            old?.[1],
          ])
        }
        placeholder={`Min`}
        className="w-24 border shadow rounded"
      />
      <input
        type="number"
        value={(columnFilterValue as [number, number])?.[1] ?? ""}
        onChange={(e) =>
          column.setFilterValue((old: [number, number]) => [
            old?.[0],
            e.target.value,
          ])
        }
        placeholder={`Max`}
        className="w-24 border shadow rounded"
      />
    </div>
  ) : (
    <input
      className="w-36 border shadow rounded"
      onChange={(e) => column.setFilterValue(e.target.value)}
      onClick={(e) => e.stopPropagation()}
      placeholder={`Search...`}
      type="text"
      value={(columnFilterValue ?? "") as string}
    />
  );
}
