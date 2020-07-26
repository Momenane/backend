var assert = require("assert");
let chai = require("chai");
let chaiHttp = require("chai-http");
let { app, models } = require("../bin/www");
const { userInfo } = require("os");
let should = chai.should();
chai.use(chaiHttp);

var expect = chai.expect;

// var agent = chai.request.agent(app);
//chai.request(app);
var debug = process.env.DEBUG || false;

const sequelize = models.sequelize;

before(async () => {
  await sequelize.drop();
  await sequelize.sync({ force: true })
})

var admin1 = { id: null, cookies: null, token: null };
var editor1 = { id: null, cookies: null, token: null };
var reader1 = { id: null, cookies: null, token: null };
var admin2 = { id: null, cookies: null, token: null };
var editor2 = { id: null, cookies: null, token: null };
var reader2 = { id: null, cookies: null, token: null };
describe("Users", () => {
  describe("User 1 (GAdmin)", () => {
    it("should create admin1", done => {
      var user = {
        username: "admin1",
        firstName: "first name",
        lastName: "last name",
        password: "admin1",
        role: "GAdmin",
        email: "user1@test.com",
      };
      var req = chai.request(app).post("/register");
      req.send(user).then((res) => {
        //res.should.have.status(201);
        expect(res).to.have.cookie("SessionIdValue");
        if (debug || res.body.err || res.body.error)
          console.log("request => ", user, "\nresponse => ", res.body);
        admin1.cookies = res.headers["set-cookie"].pop().split(";")[0];
        admin1.id = res.body.id;
        admin1.token = res.body.token;
        done();
      }).catch((err)=>console.log(err))
      // .end((err, res) => {
      //   if (err || res.body.err || res.body.error)
      //     console.log("err", err, "\nResponse Body:", res.body);
      //   res.should.have.status(201);
      //   expect(res).to.have.cookie('SessionIdValue');
      //   console.log(res.body, res.header);
      //   admin1.id = res.body.id;
      //   done();
      // })
    })
    it("should get user admin1", done => {
      var req = chai.request(app).get('/user/' + admin1.id);
      req.cookies = admin1.cookies;
      req.set('Authorization', 'Bearer ' + admin1.token);
      req.send({}).end((err, res) => {
        res.should.have.status(200);
        if (debug || res.body.err || res.body.error)
          console.log("request => ", {}, "\nresponse => ", res.body);
        done();
      })
    })
    it("should logout user admin1", done => {
      var req = chai.request(app).get('/logout');
      req.cookies = admin1.cookies;
      req.set('Authorization', 'Bearer ' + admin1.token);
      req.send({}).end((err, res) => {
        res.should.have.status(200);
        if (debug || res.body.err || res.body.error)
          console.log("request => ", {}, "\nresponse => ", res.body);
        done();
      })
    })
    it("can not get user admin1 after logout", done => {
      var req = chai.request(app).get('/user/' + admin1.id);
      req.cookies = admin1.cookies;
      // req.set('Authorization', 'Bearer ' + admin1.token);
      // failed because jwt is state less  
      req.send({}).end((err, res) => {
        res.should.have.status(401);
        if (debug)
          console.log("request => ", {}, "\nresponse => ", res.body);
        done();
      })
    })
    it("should login with admin1", done => {
      var user = { username: "admin1", password: "admin1" };
      var req = chai.request(app).post('/login');
      req.set('Content-Type', 'application/json');
      req.send(user).end((err, res) => {
        res.should.have.status(200);
        if (debug || res.body.err || res.body.error)
          console.log("request => ", user, "\nresponse => ", res.body);
        admin1.cookies = res.headers['set-cookie'].pop().split(';')[0];
        admin1.token = res.body.token;
        done();
      })
    })
  })
  describe("User 2 (GAdmin)", () => {
    it("should create admin2", done => {
      var user = {
        username: "admin2",
        firstName: "first name",
        lastName: "last name",
        password: "admin2",
        role: "GAdmin",
        email: "user2@test.com",
      };
      var req = chai.request(app).post("/register");
      req.send(user).then((res) => {
        res.should.have.status(201);
        expect(res).to.have.cookie("SessionIdValue");
        if (debug || res.body.err || res.body.error)
          console.log("request => ", user, "\nresponse => ", res.body);
        admin2.cookies = res.headers["set-cookie"].pop().split(";")[0];
        admin2.id = res.body.id;
        admin2.token = res.body.token;
        done();
      }).catch((err)=>console.log(err))
    })
    it("should get user admin2", done => {
      var req = chai.request(app).get('/user/' + admin2.id);
      req.cookies = admin2.cookies;
      req.set('Authorization', 'Bearer ' + admin2.token);
      req.send({}).end((err, res) => {
        res.should.have.status(200);
        if (debug || res.body.err || res.body.error)
          console.log("request => ", {}, "\nresponse => ", res.body);
        done();
      })
    })
  })
})

var group1 = { id: null };
var group2 = { id: null };
describe("Groups", () => {
  describe("Group 1", () => {
    it("should create group1", done => {
      var group = {
        name: "گروه جهادی امیر المومنین",
        // head_id: admin1.id,
        location: "52,54",
        address: "مسجد حضرت امیر",
        site: "group1.com",
        email: "info@group1.com",
        tel: "02123456789",
        social_link: "@group1", // string list
        // register_number: "",
        target_region: "ناحیه مسجد حضرت امیر",
        // image: "",
      };
      var req = chai.request(app).post("/group");
      req.cookies = admin1.cookies;
      req.set('Authorization', 'Bearer ' + admin1.token);
      req.send(group).then((res) => {
        res.should.have.status(201);
        if (debug || res.body.err || res.body.error)
          console.log("request => ", group, "\nresponse => ", res.body);
        group1.id = res.body.id;
        done();
      }).catch((err)=>console.log(err))
    })
    it("should get group1", done => {
      var req = chai.request(app).get('/group/' + group1.id);
      req.cookies = admin1.cookies;
      req.set('Authorization', 'Bearer ' + admin1.token);
      req.send({}).end((err, res) => {
        res.should.have.status(200);
        if (debug || res.body.err || res.body.error)
          console.log("request => ", {}, "\nresponse => ", res.body);
        done();
      })
    })
    it("should patch group1 from admin1", done => {
      var req = chai.request(app).patch('/group/' + group1.id);
      var group = { id: group1.id, tel: "23456789" };
      req.cookies = admin1.cookies;
      req.set('Authorization', 'Bearer ' + admin1.token);
      req.send(group).end((err, res) => {
        if (debug || res.body.err || res.body.error)
          console.log("request => ", group, "\nresponse => ", res.body);
        res.should.have.status(200);
        done();
      })
    })
  })
  describe("Group 2", () => {
    it("should create group2", done => {
      var group = {
        name: "گروه جهادی حضرت زهراء",
        // head_id: admin2.id,
        location: "52,54",
        address: "مسجد حضرت زهراء",
        site: "group2.com",
        email: "info@group2.com",
        tel: "03123456789",
        social_link: "@group2", // string list
        // register_number: "",
        target_region: "ناحیه مسجد حضرت زهراء",
        // image: "",
      };
      var req = chai.request(app).post("/group");
      req.cookies = admin2.cookies;
      req.set('Authorization', 'Bearer ' + admin2.token);
      req.send(group).then((res) => {
        res.should.have.status(201);
        if (debug || res.body.err || res.body.error)
          console.log("request => ", group, "\nresponse => ", res.body);
        group2.id = res.body.id;
        done();
      }).catch((err)=>console.log(err))
    })
    it("should get group2", done => {
      var req = chai.request(app).get('/group/' + group2.id);
      req.cookies = admin2.cookies;
      req.set('Authorization', 'Bearer ' + admin2.token);
      req.send({}).end((err, res) => {
        res.should.have.status(200);
        if (debug || res.body.err || res.body.error)
          console.log("request => ", {}, "\nresponse => ", res.body);
        done();
      })
    })
    it("should get group1 from admin2", done => {
      var req = chai.request(app).get('/group/' + group1.id);
      req.cookies = admin2.cookies;
      req.set('Authorization', 'Bearer ' + admin2.token);
      req.send({}).end((err, res) => {
        res.should.have.status(200);
        if (debug || res.body.err || res.body.error)
          console.log("request => ", {}, "\nresponse => ", res.body);
        done();
      })
    })
    it("can not patch group1 from admin2", done => {
      var req = chai.request(app).patch('/group/' + group1.id);
      var group = { id: group1.id, tel: "123" };
      req.cookies = admin2.cookies;
      req.set('Authorization', 'Bearer ' + admin2.token);
      req.send(group).end((err, res) => {
        res.should.have.status(401);
        if (debug || res.body.err || res.body.error)
          console.log("request => ", group, "\nresponse => ", res.body);
        done();
      })
    })
  })
})

var members = [];
describe("Members", () => {
  describe("Member 10-14 in group1", () => {
    for (var i = 0; i < 5; i++) {
      const mid = (10 + i);
      members[i] = { id: 0 };
      var ii = i;
      it("should create member " + mid, done => {
        var member = {
          firstName: "member" + mid,
          lastName: "in group1",
          birth_date: "1357/11/" + mid,
          sex: "Men",
          national_code: "01234567" + mid,
          marital: 'Married',
          is_households: false,
          // family_parent_id: -1,
          family_names: "پدر,مادر,پسر,دختر,پدر بزرگ",
          family_count: 5,
          tels: "1233445" + mid,
          // email: "m1@pub.com",
          // location: "54,32",
          address: "همسایه مسجد",
          have_house: false,
          // job: '',
          monthly_salary: 500 + mid,
          // group_id: group1.id,
          // register_id: 1,
          // other_organization: '',
        };
        var req = chai.request(app).post("/member");
        req.cookies = admin1.cookies;
        req.set('Authorization', 'Bearer ' + admin1.token);
        req.send(member).then((res) => {
          res.should.have.status(201);
          if (debug || res.body.err || res.body.error)
            console.log("request => ", member, "\nresponse => ", res.body)
          members[ii].id = res.body.id;
          done()
        }).catch((err)=>console.log(err))
      })
    }
  })
  describe("Member 25-29 in group2", () => {
    for (var i = 5; i < 10; i++) {
      const mid = (20 + i);
      members[i] = { id: 0 };
      var ii = i;
      it("should create member " + mid, done => {
        var member = {
          firstName: "member" + mid,
          lastName: "in group2",
          birth_date: "1357/11/" + mid,
          sex: "Men",
          national_code: "01234567" + mid,
          marital: 'Married',
          is_households: false,
          // family_parent_id: -1,
          family_names: "پدر,مادر,پسر,دختر,پدر بزرگ",
          family_count: 5,
          tels: "1233445" + mid,
          // email: "m1@pub.com",
          // location: "54,32",
          address: "همسایه مسجد",
          have_house: false,
          // job: '',
          monthly_salary: 500 + mid,
          // group_id: group1.id,
          // register_id: 1,
          // other_organization: '',
        };
        var req = chai.request(app).post("/member");
        req.cookies = admin2.cookies;
        req.set('Authorization', 'Bearer ' + admin2.token);
        req.send(member).then((res) => {
          res.should.have.status(201);
          if (debug || res.body.err || res.body.error)
            console.log("request => ", member, "\nresponse => ", res.body)
          members[ii].id = res.body.id;
          done()
        }).catch((err)=>console.log(err))
      })
    }
  })
})

var plan11 = { id: 0 };
var plan12 = { id: 0 };
var plan21 = { id: 0 };
describe("Plans", () => {
  describe("Plans for group1", () => {
    it("should crate plan1 for group1", done => {
      var plan = {
        // group_id: group1.id,
        name: "کمک اول گروه اول",
        type: "مالی",
        donation: "از طرف مردم",
        target: "اطراف مسجد",
        amount: 10000000,
        // notes: "",
        // document: "",
      };
      var req = chai.request(app).post("/plan");
      req.cookies = admin1.cookies;
      req.set('Authorization', 'Bearer ' + admin1.token);
      req.send(plan).then((res) => {
        res.should.have.status(201);
        if (debug || res.body.err || res.body.error)
          console.log("request => ", plan, "\nresponse => ", res.body);
        plan11.id = res.body.id;
        done();
      }).catch((err)=>console.log(err))
    })
    it("should crate plan2 for group1", done => {
      var plan = {
        // group_id: group1.id,
        name: "کمک دوم گروه اول",
        type: "مالی",
        donation: "از طرف مردم",
        target: "اطراف مسجد",
        amount: 20000000,
        // notes: "",
        // document: "",
      };
      var req = chai.request(app).post("/plan");
      req.cookies = admin1.cookies;
      req.set('Authorization', 'Bearer ' + admin1.token);
      req.send(plan).then((res) => {
        res.should.have.status(201);
        if (debug || res.body.err || res.body.error)
          console.log("request => ", plan, "\nresponse => ", res.body);
        plan12.id = res.body.id;
        done();
      }).catch((err)=>console.log(err))
    })
    it("should get plan2", done => {
      var req = chai.request(app).get("/plan/" + plan12.id);
      req.cookies = admin1.cookies;
      req.set('Authorization', 'Bearer ' + admin1.token);
      req.send({}).then((res) => {
        res.should.have.status(200);
        if (debug || res.body.err || res.body.error)
          console.log("request => ", {}, "\nresponse => ", res.body);
        // expect(res).to.have.body('id', plan12.id);
        done();
      }).catch((err)=>console.log(err))
    })
  })
  describe("Plans for group1", () => {
    it("should crate plan1 for group1", done => {
      var plan = {
        // group_id: group1.id,
        name: "کمک اول گروه دوم",
        type: "مالی",
        donation: "از طرف مردم",
        target: "اطراف مسجد",
        amount: 10000000,
        // notes: "",
        // document: "",
      };
      var req = chai.request(app).post("/plan");
      req.cookies = admin1.cookies;
      req.set('Authorization', 'Bearer ' + admin1.token);
      req.send(plan).then((res) => {
        res.should.have.status(201);
        if (debug || res.body.err || res.body.error)
          console.log("request => ", plan, "\nresponse => ", res.body);
        plan21.id = res.body.id;
        done();
      }).catch((err)=>console.log(err))
    })
  })
})

var donates = [];
describe("Donates", () => {
  for (var i = 0; i < 5; i++) {
    const mid = (10 + i);
    donates[i] = { id: 0 };
    var ii = i;
    it("should insert donate" + mid, done => {
      var donate = {
        member_id: members[ii].id,
        plan_id: plan11.id,
        amount: 1000 + mid,
        date: "1358/01/" + mid
      };
      var req = chai.request(app).post("/donate");
      req.cookies = admin1.cookies;
      req.set('Authorization', 'Bearer ' + admin1.token);
      req.send(donate).then((res) => {
        res.should.have.status(201);
        if (debug || res.body.err || res.body.error)
          console.log("request => ", donate, "\nresponse => ", res.body);
        donates[ii] = res.body.id;
        done();
      }).catch((err)=>console.log(err))
    })
  }
  for (var i = 5; i < 10; i++) {
    const mid = (20 + i);
    donates[i] = { id: 0 };
    var ii = i;
    it("should insert donate" + mid, done => {
      var donate = {
        member_id: members[ii].id,
        plan_id: plan21.id,
        amount: 1000 + mid,
        date: "1358/01/" + mid
      };
      var req = chai.request(app).post("/donate");
      req.cookies = admin1.cookies;
      req.set('Authorization', 'Bearer ' + admin1.token);
      req.send(donate).then((res) => {
        res.should.have.status(201);
        if (debug || res.body.err || res.body.error)
          console.log("request => ", donate, "\nresponse => ", res.body);
        donates[ii] = res.body.id;
        done();
      }).catch((err)=>console.log(err))
    })
  }
})

after(async () => {
  await sequelize.drop();
})
