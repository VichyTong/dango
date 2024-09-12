export function parseCSVData(csvData) {
    if (typeof csvData !== "string") {
        csvData = csvData.toString();
    }

    return csvData
        .split("\n")
        .map((row) => row.split(",").map((cell) => cell.replace(/['"]+/g, "")))
        .filter((row) => row.length > 1 || (row.length === 1 && row[0] !== ""));
}

export function getHeaders(csvData) {
    const allRows = parseCSVData(csvData);
    const firstRow = allRows[0];
    return firstRow.filter((header) => header !== "");
}

export function getTotalRows(csvData) {
    const allRows = parseCSVData(csvData);
    return allRows.length;
}

export function jsonToCsv(jsonData) {
    if (!Array.isArray(jsonData)) {
        throw new TypeError("Provided data is not an array");
    }
    if (jsonData.length === 0) {
        return "";
    }

    const headers = Object.keys(jsonData[0]).join(",");
    const rows = jsonData.map(row =>
        Object.values(row).map(value => `"${value}"`).join(",")
    ).join("\n");

    return `${headers}\n${rows}`;
}
