## Getting Started

### Setting Up Environment

This repo uses `yarn` as the package manager. To get `yarn` run:

```bash
npm install -g yarn
```

Install dependencies by running

```bash
yarn
```

To start the development server:

```bash
yarn dev
```

This will load the development environment variables in `.env.development` and `.env.local`,
which contain staging Firebase credentials.

Make sure to also configure your environment to use these configs
to keep the code clean since React is not opinionated on formatting:

- Eslint
- Prettier

### Environment Variables

The project includes a template `.env` file called `.env.development`. To
properly load these variables into NextJs, create a local `.env` file called
`.env.local` and copy these variables into the file. Then, prefix each
variable with `NEXT_PUBLIC` so that it follows the format: `NEXT_PUBLIC_<variable name>`.

### Git Hooks

The project is configured to run a pre-commit hook on all staged files.
This script runs every time the `git commit` command is run. This script
will run `eslint` and `prettier` to format code and look for code-style deviations.

## Data Fetching

When working with data fetching, some API endpoints require an authenticated user to pass in
their tokens as part of the request. We will use `react-query`, which is a data fetching API that
manages local caches and complex data fetching use-cases. As `react-query` is a framework-agnostic
API, we also `axios`, which is a promise-based HTTP client. Built into the axios client is a
way to inject the authentication tokens and refresh them when needed. Therefore, it is not
required to the API token manually.

All endpoint requests can be found in `common/api/index.ts`. Each endpoint is provides a link to the
API documentation for reference.

- [React Query](https://react-query.tanstack.com/overview)
- [Axios](https://axios-http.com/docs/intro)

### useQueryResolver

The `useQueryResolver` hook is a utility function that helps resolve types before passing them
into the useQuery hook or useMutation hook for `react-query`. This helps with some features of `react-query`
to resolve any potential TypeScript errors.

```ts
const { request } = useQueryResolver<TResponse>(() => apiCall());
```

`TResponse` is the type generic that can help resolve the return type of the API call.
The `request` variable can then be passed into the `queryFn` from `react-query`.

## Creating a new page

There are a some important functions to include when rendering a new page in order to
maintain application state.

When rendering with a `SideMenu`, always export the page using the `withDefaultLayout` HOC.

```ts
export default withDefaultLayout(Page);
```

Replace `Page` with the Page component.

To ensure and maintain application state such as authorization
and authentication, export the `getServerSideProps` variable by NextJs using
the provided HOC.

```ts
export const getServerSideProps = withServerSideProps();
```

This will ensure that the user is authenticated and has a valid token before rendering
the page. Otherwise they will be redirected to the login page to authenticate.

The `withServerSideProps` function accepts an optional callback to prefetch data and pass
it into the page props.

```ts
export const getServerSideProps = withServerSideProps((context, token) => {});
```

A page can also be guarded by requiring a specific minimum permission. This can be useful
to hide certain pages to unauthorized users with lower privilege. Use the `withProtectedRoute`
HOC to specify a minimum privilege level. Make sure to use wrap this HOC with the
`withDefaultLayout` if using the `SideMenu`.

Render with SideMenu:

```ts
export default withDefaultLayout(withProtectedRoute(Page, AuthPermission));
```

Render without SideMenu:

```ts
export default withProtectedRoute(Page, AuthPermission);
```

## UI Components

When adding a component prefer using the existing components (the ones in `base` or in the `components`)
folder over importing directly from MaterialUI. These components follow default styles and provide common
implementations of the component. If you end up overriding too much of the default properties, then you can consider
importing from the MaterialUI or similar.

### Table

When implementing a table, it would almost always be a `PaginatedTable`.
Rendering a table will always occur on the client-side (ie. not server-side rendered) since
the creation is dynamic and will change once rendered on the client-side.

The creation of a table is always memoized and that means only the data it shows can
change but none of its columns or actions will re-render when changed.

To simplify the creation of a table use the `useColumnBuilder` hook, which provides
a builder to add new columns to the table. The order that a column is created
is the order it will appear.

```ts
const { columns, names } = useColumnBuilder((builder) =>
  builder.addColumn("Col1", {
    id: "column1",
    filterType: "input",
    type: "text",
    accessor: "col1",
  })
);
```

The two hooks: `columns` and `names` should be passed into the `PaginatedTable` component.
The `filterType` field will determine what the element will be shown under the filter action.
While the `type` field will determine what is available to be queried in the global filter input.

There are currently two ways to create a table. The first way is to use the `PaginatedTable` component
that provides a simple preset to render a full-featured table. The second way is to use the `Table` API to
incrementally compose a table by combining individual pieces of the table.

Render a full-featured table:

```tsx
import { PaginatedTable } from "components/Table";

return (
  <PaginatedTable
    limit={limit}
    names={names}
    columns={columns}
    onRefresh={onRefresh}
    onDelete={onDelete}
    data={data}
  />
);
```

Render a table through composition:

```tsx
import { Table } from "components/Table";

return (
  <Table
    limit={limit}
    names={names}
    onRefresh={onRefresh}
    columns={columns}
    onDelete={onDelete}
    data={data}
  >
    <Table.GlobalActions />
    <Table.Container>
      <Table.Actions>
        <Table.ActionsLeft>
          <Table.Filter />
          <Table.Sort />
        </Table.ActionsLeft>
        <Table.ActionsCenter>
          <Table.Pagination />
        </Table.ActionsCenter>
        <Table.ActionsRight>
          <Table.Refresh />
          <Table.Delete />
        </Table.ActionsRight>
      </Table.Actions>
      <Table.Header />
      <Table.Body />
    </Table.Container>
  </Table>
);
```

1. `Table`
2. `Table.Container`
3. `Table.Actions` -- required if rendering actions
4. `Table.ActionsLeft`, `Table.ActionsCenter`, and `Table.ActionsLeft` are required for positioning the actions
5. `Table.Filter`, `Table.Sort`, `Table.Pagination`, `Table.Refresh`, and `Table.Delete` are optional and if left out, with its respective containers in place, it will maintain the correct positioning.
6. `Table.Header` and `Table.Body` will render the necessary content

The second method is recommended to render a custom table with some features left out, but keeping the same styling.

### Modal

To render a modal, wrap the component (usually the page or form) with a `ModalProvider` and list
the modals below it (in general, the modals can be placed anywhere but it's easier to keep track of it here).

```tsx
<ModalProvider>
  <Modal1 />
  <Modal2 />
  {/* Rest of Page or Form */}
</ModalProvider>
```

Create a modal by using the `useModal` hook and provide it with a name.
Then attach the `open` and `handleHide` hooks to the modal.

```ts
const { open, handleHide } = useModal("modalName");
```

To toggle the modal, export the `showModal` function and provide the name of the modal.

```ts
const { showModal } = useModalContext();

// -------------------
// in an event handler (ie. click, hover, etc.)
showModal("modalName");
// -------------------

// rest of code
```

### Form Handling

Most `base` form components implements 3 basic types. A base form component, a labelled component,
and a controlled component. In most cases the controlled component should always be used.

To use a controlled component first, wrap the form with the `FormProvider` and attach it with the appropriate methods.
Then list all the controlled form components, providing a name and required fields.

```tsx
import { FormProvider, useForm } from "react-hook-form";
import { ControlledInput } from "components/base";

const methods = useForm();

return (
  <FormProvider {...methods}>
    <ControlledInput name="inputName" placeholder="Input Placeholder" />
    {/* rest of form */}
  </FormProvider>
);
```

A controlled component can also accept a component that can be used to render
the form. Use the `as` prop to provide the component with a new component that will
replace the default component. This new component will inherit all the controlled features
but will be used when rendering to the page.

```tsx
import { ControlledInput } from "components/base";

<ControlledInput
  name="inputName"
  placeholder="Input Placeholder"
  as={StyledInput}
/>;
```

## Resources

We will depend on a few libraries to speed up development. You can find some
links to each documentation below:

1. [NextJS](https://nextjs.org/docs/getting-started)
2. [Material Ui](https://mui.com/material-ui/getting-started/installation/)
3. [React Query](https://react-query.tanstack.com/overview)
4. [React Table](https://react-table-v7.tanstack.com/docs/overview)
5. [React Hook Form](https://react-hook-form.com/get-started)
6. [Firebase](https://firebase.google.com/docs)
