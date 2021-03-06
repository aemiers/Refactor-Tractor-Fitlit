import Calculation from './Calculation';

class Activity extends Calculation {
  constructor(dataSet) {
    super(dataSet)
  }

  getMilesFromStepsByDate(id, date, userRepo) {
    const userStepsByDate = this.dataSet.find(data => id === data.userID && date === data.date);
    if (userStepsByDate) {
      return parseFloat(((userStepsByDate.numSteps * userRepo.strideLength) / 5280).toFixed(1));
    } else {
      return "0";
    }
  }

  calculateActiveAverageForWeek(id, date, userRepo) {
    return parseFloat((userRepo.getWeekFromDate(date, id, this.dataSet).reduce((acc, elem) => {
      return acc += elem.minutesActive;
    }, 0) / 7).toFixed(1));
  }

  getAllUserAverageForDay(date, userRepo, relevantData) {
    const selectedDayData = userRepo.chooseDayDataForAllUsers(this.dataSet, date);
    return parseFloat((selectedDayData.reduce((acc, elem) => acc += elem[relevantData], 0) / selectedDayData.length).toFixed(1));
  }

  getFriendsActivity(user, userRepo) {
    const data = this.dataSet;
    const userDatalist = user.friends.map(function (friend) {
      return userRepo.getDataFromUserID(friend, data)
    });
    return userDatalist.reduce(function (arraySoFar, listItem) {
      return arraySoFar.concat(listItem);
    }, []);
  }

  getFriendsAverageStepsForWeek(user, date, userRepo) {
    const friendsActivity = this.getFriendsActivity(user, userRepo);
    const timeline = userRepo.chooseWeekDataForAllUsers(friendsActivity, date);
    return userRepo.combineRankedUserIDsAndAveragedData('numSteps', timeline)
  }

  getWinnerId(user, date, userRepo) {
    const rankedList = this.getFriendsAverageStepsForWeek(user, date, userRepo);
    const keysList = rankedList.map(listItem => Object.keys(listItem));
    if (keysList[0]) {
      return parseInt(keysList[0].join(''));
    }
  }
}

export default Activity;