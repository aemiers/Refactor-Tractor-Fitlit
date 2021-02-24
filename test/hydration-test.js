import { expect } from 'chai';
import Hydration from '../src/Hydration';
import UserRepo from '../src/User-repo';
import User from '../src/User';

describe('Hydration', () => {
  let hydrationData, hydration, user1, user2, users, userRepo;

  beforeEach(() => {
    hydrationData = [{
      "userID": 1,
      "date": "2019/06/15",
      "numOunces": 37
    },
    {
      "userID": 1,
      "date": "2018/06/16",
      "numOunces": 39
    },
    {
      "userID": 1,
      "date": "2016/08/22",
      "numOunces": 30
    },
    {
      "userID": 2,
      "date": "2019/06/15",
      "numOunces": 38
    },
    {
      "userID": 2,
      "date": "2018/10/23",
      "numOunces": 34
    },
    {
      "userID": 2,
      "date": "2018/10/24",
      "numOunces": 40
    },
    {
      "userID": 2,
      "date": "2018/10/25",
      "numOunces": 40
    },
    {
      "userID": 2,
      "date": "2018/10/26",
      "numOunces": 40
    },
    ]

    user1 = new User({
      id: 1,
      name: "The Rock",
      address: "1236 Awesome Street, Denver CO 80301-1697",
      email: "therock@hotmail.com",
      strideLength: 10,
      dailyStepGoal: 60000,
      friends: [2, 3, 4]
    });

    user2 = new User({
      id: 2,
      name: "Rainbow Dash",
      address: "1237 Equestria Street, Denver CO 80301-1697",
      email: "rainbowD1@hotmail.com",
      strideLength: 3.8,
      dailyStepGoal: 7000,
      friends: [1, 2, 3]
    });
    users = [user1, user2];
    userRepo = new UserRepo(users);
    hydration = new Hydration(hydrationData);
  });

  it('should be a function', () => {
    expect(Hydration).to.be.a('function');
    expect(hydration).to.be.an.instanceof(Hydration);
  });

  it('should take in a list of data', () => {
    expect(hydration.hydrationData[0].userID).to.equal(1);
    expect(hydration.hydrationData[2].numOunces).to.equal(30);
    expect(hydration.hydrationData[4].date).to.equal("2018/10/23");
  });

  it('should find the average water intake per day for a user', () => {
    expect(hydration.calculateAverageOunces(1)).to.equal(35);
  });

  it('should find the water intake for a user on a specified date', () => {
    expect(hydration.calculateDailyOunces(1, "2019/06/15")).to.equal(37);
    expect(hydration.calculateDailyOunces(2, "2018/10/24")).to.equal(40);
  });

  it('should find water intake by day for first week', () => {
    expect(hydration.calculateFirstWeekOunces(userRepo, 1)).to.eql(['2019/06/15: 37', '2018/06/16: 39', '2016/08/22: 30']);
    //this function needs the date
  });

  it('should find water intake by day for that days week', () => {
    expect(hydration.calculateRandomWeekOunces('2018/10/24', 2, userRepo)).to.eql(['2018/10/24: 40', '2018/10/23: 34'])
  });
});
