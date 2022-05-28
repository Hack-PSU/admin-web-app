## Getting Started

### Setting Up Environment

This repo uses `yarn` as the package manager. To get `yarn` run:

```bash
npm install -g yarn
```

Install dependencies by running

```bash
yarn && yarn prepare
```

To start the development server:

```bash
yarn dev
```

This will load the development environment variables in `.env.development`, which
contain staging Firebase credentials.

Make sure to also configure your environment to use these configs
to keep the code clean since React is not opinionated on formatting:

- Eslint
- Prettier

## Resources

We will depend on a few libraries to speed up development. You can find some
links to each documentation below:

1. [NextJS](https://nextjs.org/docs/getting-started)
2. [Material Ui](https://mui.com/material-ui/getting-started/installation/)
3. [React Query](https://react-query.tanstack.com/overview)
4. [React Hook Form](https://react-hook-form.com/get-started)
5. [Firebase](https://firebase.google.com/docs)
