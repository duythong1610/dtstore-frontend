import React, { useMemo } from "react";
import { Divider, Table } from "antd";
import { useState } from "react";
import Loading from "../LoadingComponent/Loading";
import { Excel } from "antd-table-saveas-excel";
const TableComponent = (props) => {
  const [selectionType, setSelectionType] = useState("checkbox");
  const [rowSelectedKey, setRowSelectedKey] = useState("");
  const {
    isLoading = false,
    data: dataSource = [],
    columns = [],
    handleDeleteMany,
  } = props;

  const newColumnExport = useMemo(() => {
    const arr = columns?.filter((col) => col.dataIndex !== "action");
    return arr;
  }, [columns]);

  console.log({ newColumnExport });

  const exportExcel = () => {
    const excel = new Excel();
    excel
      .addSheet("test")
      .addColumns(newColumnExport)
      .addDataSource(dataSource, {
        str2Percent: true,
      })
      .saveAs("Excel.xlsx");
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setRowSelectedKey(selectedRowKeys);
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User",
      // Column configuration not to be checked
      name: record.name,
    }),
  };

  const handleDeleteAll = () => {
    handleDeleteMany(rowSelectedKey);
  };

  return (
    <div>
      <Divider />

      <Loading isLoading={isLoading}>
        {rowSelectedKey.length > 0 && (
          <div
            style={{
              background: "blue",
              color: "#fff",
              fontWeight: "bold",
              padding: "10px",
              cursor: "pointer",
            }}
            onClick={handleDeleteAll}
          >
            Xóa tất cả
          </div>
        )}
        <button onClick={exportExcel}>Export Excel</button>
        <Table
          id="table-xls"
          rowSelection={{
            type: selectionType,
            ...rowSelection,
          }}
          columns={columns}
          dataSource={dataSource}
          {...props}
        />
      </Loading>
    </div>
  );
};

export default TableComponent;
