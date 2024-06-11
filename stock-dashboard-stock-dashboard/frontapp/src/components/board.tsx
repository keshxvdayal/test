import React from "react";
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

const Dashboard = () => {
  const rerender = React.useReducer(() => ({}), {})[1];

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
};

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
    //no need to pass pageCount or rowCount with client-side pagination as it is calculated automatically
    state: {
      pagination,
    },
    // autoResetPageIndex: false, // turn off page index reset when sorting or filtering
  });

  return (
    <div className="d-flex flex-column flex-lg-row h-lg-full bg-surface-secondary">
      <div className="h-screen flex-grow-1 overflow-y-lg-auto">
        <Header />
        <main className="py-6 bg-surface-secondary">
          <div className="container-fluid">
            {/* Filter 1 */}
            <h3 className="text-slate-600">
              Stocks that went up for 3-5 consecutive days
            </h3>
            <br />
            <div className="row g-6 mb-6">
              <div className="col-12">
                <div className="d-flex flex-wrap gap-3">
                  {/* {consecutiveData.map((z, i) => (
                <Card key={i} {...z} />
              ))} */}
                </div>
              </div>
            </div>

            <h3 className="mb-0 p-4 text-3xl  font-bold text-indigo-500">
              STOCKS
            </h3>
            <div className="card shadow  mb-7">
              <div className=" h-2 border-t-2 rounded-2xl ">
                <div className="table-responsive rounded-2xl font-bold text-2xl bg-white">
                  <table className="table  border-slate-300  ">
                    <thead className="bg-indigo-800  font-medium text-xl p-6 h-10">
                      {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                          {headerGroup.headers.map((header) => (
                            <th
                              key={header.id}
                              colSpan={header.colSpan}
                              className="text-white font-bold text-xs "
                            >
                              <div
                                {...{
                                  className: header.column.getCanSort()
                                    ? "cursor-pointer select-none "
                                    : "",
                                  onClick:
                                    header.column.getToggleSortingHandler(),
                                }}
                                className=""
                              >
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                                {{
                                  asc: " 🔼",
                                  desc: " 🔽",
                                }[header.column.getIsSorted() as string] ??
                                  null}
                                {header.column.getCanFilter() ? (
                                  <div className="pb-3 pt-3">
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
                    <tbody className=" ">
                      {table.getRowModel().rows.map((row) => (
                        <tr
                          className="transition ease-in-out delay-150hover:-translate-y-1 hover:text-white hover:bg-indigo-500 duration-300"
                          key={row.id}
                        >
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
                </div>
                <div className="flex justify-center p-8 flex-wrap align-items-center gap-2 mt-3 ">
                  <div className="d-flex gap-2 mr-8">
                    <button
                      className="btn btn-outline-primary pr-3 pl-3"
                      onClick={() => table.firstPage()}
                      disabled={!table.getCanPreviousPage()}
                    >
                      {"<<"}
                    </button>
                    <button
                      className="btn btn-outline-primary p-3"
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                    >
                      {"<"}
                    </button>
                    <button
                      className="btn btn-outline-primary p-3"
                      onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}
                    >
                      {">"}
                    </button>
                    <button
                      className="btn btn-outline-primary p-3"
                      onClick={() => table.lastPage()}
                      disabled={!table.getCanNextPage()}
                    >
                      {">>"}
                    </button>
                  </div>
                  <span className="d-flex align-items-center gap-2">
                    <div className=" text-indigo-600 font-bold text-lg">
                      Page
                    </div>
                    <strong className=" text-lg text-black font-medium">
                      {table.getState().pagination.pageIndex + 1} of{" "}
                      {table.getPageCount().toLocaleString()}
                    </strong>
                  </span>
                  <span className="d-flex align-items-center gap-2 ml-3 text-sm p-2">
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
                      className="form-control "
                    />
                  </span>
                  <select
                    value={table.getState().pagination.pageSize}
                    onChange={(e) => {
                      table.setPageSize(Number(e.target.value));
                    }}
                    className="form-select"
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
        className="w-24 border shadow rounded p-2 form-select"
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
        className="w-24 border shadow rounded p-2 form-select"
      />
    </div>
  ) : (
    <input
      className="w-36 border shadow rounded p-2 form-select"
      onChange={(e) => column.setFilterValue(e.target.value)}
      onClick={(e) => e.stopPropagation()}
      placeholder={`Search...`}
      type="text"
      value={(columnFilterValue ?? "") as string}
    />
  );
}

export default Dashboard;
