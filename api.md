# Backend API

## API template

all available API:

```js
{
  "/user", "/group", "/member", "/plan", "/donate";
}+{
  post: "/add",
  get: "/list",
  get: "/id/:id",
  patch: "/id/:id",
  delete: "/id/:id",
};
```

## Register/Login/Logout

```js
{
  register:{
    path: "/user/add"
    post:{
      // see user API list
    }
  },
  login:{
    path: "/login",
    post:{
      username:""
      password:""
    }
  },
  logout:{
    path: "/logout",
    get:{
    }
  }
}
```

## API list

```js
user = {
  username: { type: STRING, unique: true, allowNull: false },
  firstName: { type: STRING, allowNull: false },
  lastName: { type: STRING, allowNull: false },
  password: { type: STRING, allowNull: false },
  role: { type: {'GAdmin','GEditor','GReporter'}, allowNull: false },
  email: { type: STRING, unique: true, allowNull: false, validate: { isEmail: true } },
  tel: { type: STRING, validate: { is: /^[0-9\+,-]+$/ } },
  address: STRING,
};
/user/add => post
/user/list?offset=X&limit=Y => get
/user/id/:id => get
/user/id/:id => patch
/user/id/:id => delete

group = {
  name: { type: STRING, allowNull: false },
  head_id: INTEGER,
  location: STRING,
  address: { type: STRING, allowNull: false },
  site: { type: STRING, validate: { isUrl: true } },
  email: { type: STRING, validate: { isEmail: true } },
  tel: { type: STRING, allowNull: false, validate: { is: /^[0-9\+,-]+$/ } },
  social_link: STRING, // string list
  register_number: STRING,
  target_region: STRING,
  image: STRING,
};
/group/add => post // set head_id from session data and set user.group_id after insert
/group/list?offset=X&limit=Y => get
/group/id/:id => get
/group/id/:id => patch
/group/id/:id => delete

member = {
  firstName: { type: STRING, allowNull: false },
  lastName: { type: STRING, allowNull: false },
  birth_date: STRING,
  sex: { type: SexEnum, allowNull: false, defaultValue: 'None' },
  national_code: { type: STRING, unique: true, allowNull: false, is: /^[0-9]+$/ },
  marital: { type: MaritalStatus, allowNull: false, defaultValue: 'None' },
  is_households: { type: BOOLEAN, allowNull: false },
  family_parent_id: { type: INTEGER, allowNull: false, defaultValue: -1 },
  family_names: STRING,
  family_count: INTEGER,
  tels: { type: STRING, is: /^[0-9\+-,]+$/ }, // comma separated
  email: { type: STRING, validate: { isEmail: true } },
  location: STRING,
  address: { type: TEXT, allowNull: false },
  have_house: { type: BOOLEAN, allowNull: false },
  job: STRING,
  monthly_salary: BIGINT, // in Rial or local
  group_id: { type: INTEGER, allowNull: false },
  register_id: { type: INTEGER, allowNull: false },
  other_organization: STRING,
}
/member/add => post // set register_id and group_id from user data in session
/member/list?offset=X&limit=Y => get
/member/id/:id => get
/member/id/:id => patch
/member/id/:id => delete

plan = {
  // group_id: { type: INTEGER, allowNull: false }, // extract from user profile
  name: { type: STRING, allowNull: false },
  type: { type: STRING, allowNull: false },
  donation: { type: STRING, allowNull: false },
  target: { type: STRING, allowNull: false }, // region
  amount: { type: INTEGER, allowNull: false },
  notes: TEXT,
  document: TEXT,
};
/plan/add => post // set group_id from session.user.group_id
/plan/list?offset=X&limit=Y => get
/plan/id/:id => get
/plan/id/:id => patch
/plan/id/:id => delete

donate = {
  member_id: { type: INTEGER, allowNull: false },
  plan_id: { type: INTEGER, allowNull: false },
  amount: { type: INTEGER, allowNull: false },
  date: { type: DATE, allowNull: false }
};
/donate/add => post // set group_id from session.user.group_id
/donate/list?offset=X&limit=Y => get
/donate/id/:id => get
/donate/id/:id => patch
/donate/id/:id => delete
```
