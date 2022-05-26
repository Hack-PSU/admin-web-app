/**
 * All Table components to be used in the pages should be exported from this file
 *
 * eg. export { default as <ComponentName> } from './<ComponentName.tsx>'
 * or
 * eg. export { ComponentName } from './ComponentName.tsx'
 *
 * Each main piece of the table should be a separate file
 * eg. Table, TableRow, TableHeader, etc.
 *
 * To better abstract the use of Table, Table should only accept an array of objects representing the data
 *
 */
export { default as Table } from "./Table";