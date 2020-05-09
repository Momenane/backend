# Backend API

## API template

all available API:

```js
{
  '/user',
  '/group',
  '/member',
  '/plan',
  '/donate'
} + {
  post: '/add',
  get: '/list',
  get: '/id/:id',
  patch: '/id/:id',
  delete: '/id/:id'
}
```

## API list

```js
/user/add => post
/user/list => get
/user/id/:id => get
/user/id/:id => patch
/user/id/:id => delete

/group/add => post
/group/list => get
/group/id/:id => get
/group/id/:id => patch
/group/id/:id => delete

/member/add => post
/member/list => get
/member/id/:id => get
/member/id/:id => patch
/member/id/:id => delete

/plan/add => post
/plan/list => get
/plan/id/:id => get
/plan/id/:id => patch
/plan/id/:id => delete

/donate/add => post
/donate/list => get
/donate/id/:id => get
/donate/id/:id => patch
/donate/id/:id => delete
```
