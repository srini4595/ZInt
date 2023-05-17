import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
  } from "react";
  import { AgGridReact } from "ag-grid-react";
  import "ag-grid-community/styles/ag-grid.css";
  import "ag-grid-community/styles/ag-theme-alpine.css";
  import "./grid.scss";
  import axios from "axios";
  
  const GridExample = () => {
    const gridRef = useRef();
    const [editIndex, setEditIndex] = useState(0);
    const [updatedData, setUpdatedData] = useState({
      athlete: "",
      year: "",
    });
    const [editStatus, setEditStatus] = useState(false);
    const columnDefsMedalsIncluded = [
      // {
      //   field: "Action",
      //   checkboxSelection: true,
      //   resizable: true,
      //   filter: false,
      // },
      {
        field: "athlete",
        // checkboxSelection: true,
        resizable: true,
        // width: 150,
  
        editable: true,
      },
      { field: "year", resizable: true, editable: true },
    ];
    const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
    const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
    const [rowData, setRowData] = useState();
    const [columnDefs, setColumnDefs] = useState(columnDefsMedalsIncluded);
    const defaultColDef = useMemo(() => {
      return {
        sortable: true,
        resizable: true,
        // initialWidth: 200,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        filter: true,
      };
    }, []);
    const onFirstDataRendered = useCallback((params) => {
      gridRef.current.api.sizeColumnsToFit();
    }, []);
    //   useEffect(() => {
    //     axios.post("http://127.0.0.1:5000/updateData", JSON.stringify(updatedData));
    //   });
    const onRowSelected = useCallback((event) => {
      console.log(event.node.rowIndex);
  
      setEditIndex(event.node.rowIndex);
      gridRef.current.api.setFocusedCell(event.node.rowIndex, "athlete");
      gridRef.current.api.startEditingCell({
        rowIndex: event.node.rowIndex,
        colKey: "athlete",
      });
    }, []);
    const onRowValueChanged = useCallback((event) => {
      var data = event.data;
  
      setUpdatedData((prev) => {
        return { ...prev, athlete: data.athlete, year: data.year };
      });
    }, []);
    const onBtStopEditing = useCallback(() => {
      gridRef.current.api.stopEditing();
    }, []);
  
    const onGridReady = useCallback((params) => {
      axios.get("http://127.0.0.1:8001/data").then((response) => {
        setRowData(response.data);
      });
  
      return;
    }, []);
  
    return (
      <div style={containerStyle}>
        <div className="test-container">
          <div style={{ marginBottom: "5px" }}>
            <button
              style={{ fontSize: "12px" }}
              onClick={() => {
                setEditStatus(true);
              }}
            >
              Start Editing
            </button>
            <button style={{ fontSize: "12px" }} onClick={onBtStopEditing}>
              save
            </button>
          </div>
  
          <div style={gridStyle} className="ag-theme-alpine">
            <AgGridReact
              ref={gridRef}
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              editType={"fullRow"}
              onGridReady={() => {
                onGridReady();
              }}
              onRowSelected={onRowSelected}
              onFirstDataRendered={onFirstDataRendered}
              onRowValueChanged={onRowValueChanged}
            ></AgGridReact>
          </div>
        </div>
      </div>
    );
  };
  
  export default GridExample;